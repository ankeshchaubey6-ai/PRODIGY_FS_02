import { prisma } from "@/lib/prisma";
import { getDemoDepartments } from "@/lib/demo-data";
import type {
  DepartmentWithCount,
  DepartmentWithEmployees,
  PaginatedDepartments,
} from "@/types/department";

function createEmptyDepartmentsPage(page: number, limit: number): PaginatedDepartments {
  return {
    departments: [] as DepartmentWithCount[],
    total: 0,
    page,
    limit,
    totalPages: 0,
  };
}

// ── Get paginated department list ─────────────────────────
export async function getDepartments(params: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedDepartments> {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 10));
  const skip = (page - 1) * limit;

  const where = params.search
    ? {
        OR: [
          { name: { contains: params.search, mode: "insensitive" as const } },
          {
            description: {
              contains: params.search,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  try {
    const [departments, total] = await Promise.all([
      prisma.department.findMany({
        where,
        include: { _count: { select: { employees: true } } },
        orderBy: { name: "asc" },
        skip,
        take: limit,
      }),
      prisma.department.count({ where }),
    ]);

    if (total === 0) {
      const demoDepartments = getDemoDepartments();
      return {
        departments: demoDepartments.slice((page - 1) * limit, page * limit),
        total: demoDepartments.length,
        page,
        limit,
        totalPages: Math.ceil(demoDepartments.length / limit),
      };
    }

    return {
      departments: departments as DepartmentWithCount[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[DEPARTMENTS_FALLBACK] Using demo departments page", error);
      return {
        departments: getDemoDepartments().slice((page - 1) * limit, page * limit),
        total: 7,
        page,
        limit,
        totalPages: Math.ceil(7 / limit),
      };
    }

    throw error;
  }
}

// ── Get all departments (no pagination) ───────────────────
export async function getAllDepartments(): Promise<DepartmentWithCount[]> {
  const departments = await prisma.department.findMany({
    include: { _count: { select: { employees: true } } },
    orderBy: { name: "asc" },
  });
  return departments as DepartmentWithCount[];
}

// ── Get single department with employees ──────────────────
export async function getDepartmentById(
  id: string
): Promise<DepartmentWithEmployees | null> {
  const department = await prisma.department.findUnique({
    where: { id },
    include: {
      employees: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          designation: true,
          profileImage: true,
          status: true,
        },
        orderBy: { firstName: "asc" },
      },
      _count: { select: { employees: true } },
    },
  });

  return department as DepartmentWithEmployees | null;
}