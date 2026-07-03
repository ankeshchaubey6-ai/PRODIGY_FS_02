import { prisma } from "@/lib/prisma";
import { EmployeeStatus } from "@prisma/client";
import { CHART_COLORS, MONTH_NAMES } from "@/lib/constants";
import { getDemoDashboardData } from "@/lib/demo-data";
import type {
  DashboardData,
  DashboardStats,
  GrowthDataPoint,
  DepartmentDataPoint,
  ActivityItem,
  ActivityType,
} from "@/types/dashboard";

// ── Helper: get first/last day of a month ─────────────────
function getMonthRange(date: Date): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
  return { start, end };
}

function createEmptyDashboardData(): DashboardData {
  return getDemoDashboardData();
}

// ── Dashboard stats ───────────────────────────────────────
export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const { start: thisMonthStart, end: thisMonthEnd } = getMonthRange(now);

  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const { start: lastMonthStart, end: lastMonthEnd } = getMonthRange(lastMonth);

  const [
    totalEmployees,
    activeEmployees,
    totalDepartments,
    newThisMonth,
    totalLastMonth,
    activeLastMonth,
    newLastMonth,
    departmentsLastMonth,
  ] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.count({ where: { status: EmployeeStatus.ACTIVE } }),
    prisma.department.count(),
    prisma.employee.count({
      where: { createdAt: { gte: thisMonthStart, lte: thisMonthEnd } },
    }),
    prisma.employee.count({
      where: { createdAt: { lt: thisMonthStart } },
    }),
    prisma.employee.count({
      where: {
        status: EmployeeStatus.ACTIVE,
        createdAt: { lte: lastMonthEnd },
      },
    }),
    prisma.employee.count({
      where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
    }),
    prisma.department.count({
      where: { createdAt: { lte: lastMonthEnd } },
    }),
  ]);

  // Calculate % change vs last month
  const calcChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return {
    totalEmployees,
    activeEmployees,
    totalDepartments,
    newThisMonth,
    totalEmployeesChange: calcChange(totalEmployees, totalLastMonth),
    activeEmployeesChange: calcChange(activeEmployees, activeLastMonth),
    departmentsChange: calcChange(totalDepartments, departmentsLastMonth),
    newThisMonthChange: calcChange(newThisMonth, newLastMonth),
  };
}

// ── Employee growth chart data (last 6 months) ────────────
export async function getGrowthData(): Promise<GrowthDataPoint[]> {
  const now = new Date();
  const result: GrowthDataPoint[] = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const { start, end } = getMonthRange(date);

    const [totalUpToMonth, newHires] = await Promise.all([
      prisma.employee.count({
        where: { createdAt: { lte: end } },
      }),
      prisma.employee.count({
        where: { createdAt: { gte: start, lte: end } },
      }),
    ]);

    result.push({
      month: `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`,
      employees: totalUpToMonth,
      newHires,
    });
  }

  return result;
}

// ── Department distribution chart data ───────────────────
export async function getDepartmentData(): Promise<DepartmentDataPoint[]> {
  const departments = await prisma.department.findMany({
    include: {
      _count: { select: { employees: true } },
    },
    orderBy: { employees: { _count: "desc" } },
  });

  return departments
    .filter((d) => d._count.employees > 0)
    .map((dept, index) => ({
      name: dept.name,
      value: dept._count.employees,
      color: dept.color ?? CHART_COLORS[index % CHART_COLORS.length],
    }));
}

// ── Recent activity feed ──────────────────────────────────
export async function getRecentActivity(): Promise<ActivityItem[]> {
  const recentEmployees = await prisma.employee.findMany({
    orderBy: { updatedAt: "desc" },
    take: 8,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      designation: true,
      status: true,
      profileImage: true,
      createdAt: true,
      updatedAt: true,
      department: { select: { name: true } },
    },
  });

  return recentEmployees.map((emp) => {
    const isNew =
      emp.createdAt.getTime() === emp.updatedAt.getTime() ||
      Math.abs(emp.createdAt.getTime() - emp.updatedAt.getTime()) < 5000;

    let type: ActivityType = "EMPLOYEE_UPDATED";
    let title = `${emp.firstName} ${emp.lastName} was updated`;
    let description = `${emp.designation} · ${emp.department.name}`;

    if (isNew) {
      type = "EMPLOYEE_CREATED";
      title = `${emp.firstName} ${emp.lastName} joined`;
      description = `New ${emp.designation} in ${emp.department.name}`;
    } else if (emp.status === EmployeeStatus.TERMINATED) {
      type = "EMPLOYEE_TERMINATED";
      title = `${emp.firstName} ${emp.lastName} was terminated`;
      description = `Former ${emp.designation} · ${emp.department.name}`;
    } else if (emp.status === "ON_LEAVE") {
      type = "EMPLOYEE_ON_LEAVE";
      title = `${emp.firstName} ${emp.lastName} is on leave`;
      description = `${emp.designation} · ${emp.department.name}`;
    }

    return {
      id: emp.id,
      type,
      title,
      description,
      timestamp: emp.updatedAt.toISOString(),
      avatarUrl: emp.profileImage ?? undefined,
      initials: `${emp.firstName[0]}${emp.lastName[0]}`.toUpperCase(),
    };
  });
}

// ── Full dashboard data (single call) ────────────────────
export async function getDashboardData(): Promise<DashboardData> {
  try {
    const [stats, growthData, departmentData, recentActivity] = await Promise.all([
      getDashboardStats(),
      getGrowthData(),
      getDepartmentData(),
      getRecentActivity(),
    ]);

    if (
      stats.totalEmployees === 0 &&
      stats.totalDepartments === 0 &&
      growthData.length === 0 &&
      departmentData.length === 0 &&
      recentActivity.length === 0
    ) {
      return createEmptyDashboardData();
    }

    return { stats, growthData, departmentData, recentActivity };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[DASHBOARD_FALLBACK] Using demo dashboard data", error);
      return createEmptyDashboardData();
    }

    throw error;
  }
}