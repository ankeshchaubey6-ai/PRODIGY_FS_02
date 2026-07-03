import { prisma } from "@/lib/prisma";

/**
 * Generates the next available employee ID in format EMP-XXXX.
 * Finds the highest existing numeric suffix and increments by 1.
 */
export async function generateEmployeeId(): Promise<string> {
  const last = await prisma.employee.findFirst({
    orderBy: { employeeId: "desc" },
    select: { employeeId: true },
  });

  if (!last) return "EMP-0001";

  const match = last.employeeId.match(/^EMP-(\d{4})$/);
  if (!match) return "EMP-0001";

  const next = parseInt(match[1], 10) + 1;
  return `EMP-${String(next).padStart(4, "0")}`;
}

/**
 * Checks whether a given email is already taken by another employee.
 * Pass excludeId to allow updates on the same employee.
 */
export async function isEmailTaken(
  email: string,
  excludeId?: string
): Promise<boolean> {
  const existing = await prisma.employee.findFirst({
    where: {
      email: email.toLowerCase(),
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
    select: { id: true },
  });
  return !!existing;
}

/**
 * Checks whether an employee ID is already taken.
 * Pass excludeId to allow updates on the same employee.
 */
export async function isEmployeeIdTaken(
  employeeId: string,
  excludeId?: string
): Promise<boolean> {
  const existing = await prisma.employee.findFirst({
    where: {
      employeeId,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
    select: { id: true },
  });
  return !!existing;
}

/**
 * Converts raw filter query params into a Prisma-compatible where clause.
 */
export function buildEmployeeWhereClause(filters: {
  search?: string;
  departmentId?: string;
  status?: string;
  employmentType?: string;
  gender?: string;
}) {
  const where: Record<string, unknown> = {};

  if (filters.search) {
    const term = filters.search.trim();
    where.OR = [
      { firstName: { contains: term, mode: "insensitive" } },
      { lastName: { contains: term, mode: "insensitive" } },
      { email: { contains: term, mode: "insensitive" } },
      { employeeId: { contains: term, mode: "insensitive" } },
      { designation: { contains: term, mode: "insensitive" } },
      { phone: { contains: term, mode: "insensitive" } },
    ];
  }

  if (filters.departmentId) {
    where.departmentId = filters.departmentId;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.employmentType) {
    where.employmentType = filters.employmentType;
  }

  if (filters.gender) {
    where.gender = filters.gender;
  }

  return where;
}

/**
 * Builds the Prisma orderBy clause from sortBy and sortOrder params.
 * Falls back to createdAt desc if sortBy field is invalid.
 */
export function buildEmployeeOrderBy(
  sortBy?: string,
  sortOrder: "asc" | "desc" = "desc"
) {
  const allowedSortFields = [
    "firstName",
    "lastName",
    "email",
    "employeeId",
    "designation",
    "joiningDate",
    "salary",
    "createdAt",
    "updatedAt",
    "status",
  ];

  if (!sortBy || !allowedSortFields.includes(sortBy)) {
    return [{ createdAt: sortOrder }];
  }

  return [{ [sortBy]: sortOrder }];
}