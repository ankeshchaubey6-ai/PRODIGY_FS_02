import { prisma } from "@/lib/prisma";
import { buildEmployeeWhereClause, buildEmployeeOrderBy } from "./utils";
import { getDemoEmployees } from "@/lib/demo-data";
import type { EmployeeListItem, EmployeeDetail, PaginatedEmployees } from "@/types/employee";

function createEmptyEmployeesPage(page: number, limit: number): PaginatedEmployees {
  return {
    employees: [] as EmployeeListItem[],
    total: 0,
    page,
    limit,
    totalPages: 0,
  };
}

// ── Shared select for list items ──────────────────────────
const employeeListSelect = {
  id: true,
  employeeId: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  profileImage: true,
  designation: true,
  joiningDate: true,
  salary: true,
  employmentType: true,
  status: true,
  createdAt: true,
  department: {
    select: { id: true, name: true, color: true },
  },
  manager: {
    select: { id: true, firstName: true, lastName: true },
  },
};

// ── Get paginated employee list ───────────────────────────
export async function getEmployees(params: {
  search?: string;
  departmentId?: string;
  status?: string;
  employmentType?: string;
  gender?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<PaginatedEmployees> {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 10));
  const skip = (page - 1) * limit;

  const where = buildEmployeeWhereClause(params);
  const orderBy = buildEmployeeOrderBy(params.sortBy, params.sortOrder);

  try {
    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: employeeListSelect,
      }),
      prisma.employee.count({ where }),
    ]);

    if (total === 0) {
      return {
        employees: getDemoEmployees(page, limit),
        total: 8,
        page,
        limit,
        totalPages: Math.ceil(8 / limit),
      };
    }

    return {
      employees: employees as unknown as EmployeeListItem[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[EMPLOYEES_FALLBACK] Using demo employees page", error);
      return {
        employees: getDemoEmployees(page, limit),
        total: 8,
        page,
        limit,
        totalPages: Math.ceil(8 / limit),
      };
    }

    throw error;
  }
}

// ── Get single employee by ID ─────────────────────────────
export async function getEmployeeById(id: string): Promise<EmployeeDetail | null> {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            designation: true,
            profileImage: true,
          },
        },
        subordinates: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            designation: true,
            profileImage: true,
          },
        },
      },
    });

    return employee as unknown as EmployeeDetail | null;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[EMPLOYEE_DETAIL_FALLBACK] Returning null for employee", id, error);
      return null;
    }

    throw error;
  }
}

// ── Get employee by Clerk user ID ─────────────────────────
export async function getEmployeeByClerkId(clerkUserId: string) {
  try {
    return await prisma.employee.findUnique({
      where: { clerkUserId },
      include: { department: true },
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[EMPLOYEE_CLERK_FALLBACK] Returning null for clerk user", clerkUserId, error);
      return null;
    }

    throw error;
  }
}

// ── Get all employees for select/dropdown ─────────────────
export async function getEmployeesForSelect() {
  try {
    return await prisma.employee.findMany({
      where: { status: "ACTIVE" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        designation: true,
        profileImage: true,
        department: { select: { name: true } },
      },
      orderBy: { firstName: "asc" },
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[EMPLOYEES_SELECT_FALLBACK] Using empty manager list", error);
      return [];
    }

    throw error;
  }
}

// ── Get employee stats ────────────────────────────────────
export async function getEmployeeStats() {
  try {
    const [total, active, inactive, onLeave, terminated, newThisMonth] =
      await Promise.all([
        prisma.employee.count(),
        prisma.employee.count({ where: { status: "ACTIVE" } }),
        prisma.employee.count({ where: { status: "INACTIVE" } }),
        prisma.employee.count({ where: { status: "ON_LEAVE" } }),
        prisma.employee.count({ where: { status: "TERMINATED" } }),
        prisma.employee.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        }),
      ]);

    const byDepartment = await prisma.department.findMany({
      include: { _count: { select: { employees: true } } },
      orderBy: { employees: { _count: "desc" } },
    });

    const byEmploymentType = await prisma.employee.groupBy({
      by: ["employmentType"],
      _count: { id: true },
    });

    return {
      total,
      active,
      inactive,
      onLeave,
      terminated,
      newThisMonth,
      byDepartment: byDepartment.map((d) => ({
        departmentId: d.id,
        departmentName: d.name,
        count: d._count.employees,
      })),
      byEmploymentType: byEmploymentType.map((e) => ({
        type: e.employmentType,
        count: e._count.id,
      })),
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[EMPLOYEE_STATS_FALLBACK] Returning empty stats", error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        onLeave: 0,
        terminated: 0,
        newThisMonth: 0,
        byDepartment: [],
        byEmploymentType: [],
      };
    }

    throw error;
  }
}

// ── Get employees for CSV export ──────────────────────────
export async function getEmployeesForExport(params: {
  search?: string;
  departmentId?: string;
  status?: string;
  employmentType?: string;
}) {
  const where = buildEmployeeWhereClause(params);

  try {
    return await prisma.employee.findMany({
      where,
      include: {
        department: { select: { name: true } },
        manager: { select: { firstName: true, lastName: true } },
      },
      orderBy: { employeeId: "asc" },
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[EMPLOYEE_EXPORT_FALLBACK] Returning empty export list", error);
      return [];
    }

    throw error;
  }
}