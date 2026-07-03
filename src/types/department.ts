import type { Department, Employee } from "@prisma/client";

// ── Department with employee count ───────────────────────
export type DepartmentWithCount = Department & {
  _count: { employees: number };
};

// ── Department with employees list ───────────────────────
export type DepartmentWithEmployees = Department & {
  employees: Pick<
    Employee,
    "id" | "firstName" | "lastName" | "designation" | "profileImage" | "status"
  >[];
  _count: { employees: number };
};

// ── Form input ────────────────────────────────────────────
export interface CreateDepartmentInput {
  name: string;
  description?: string;
  color?: string;
}

export type UpdateDepartmentInput = Partial<CreateDepartmentInput>;

// ── Paginated response ────────────────────────────────────
export interface PaginatedDepartments {
  departments: DepartmentWithCount[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
