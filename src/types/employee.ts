import type { Employee, Department, EmployeeStatus, EmploymentType, Gender } from "@prisma/client";

// ── Base employee with department relation ────────────────
export type EmployeeWithDepartment = Employee & {
  department: Department;
  manager: Pick<Employee, "id" | "firstName" | "lastName" | "designation" | "profileImage"> | null;
};

// ── Employee list item (lighter payload for tables) ───────
export type EmployeeListItem = Pick<
  Employee,
  | "id"
  | "employeeId"
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "profileImage"
  | "designation"
  | "joiningDate"
  | "salary"
  | "employmentType"
  | "status"
  | "createdAt"
> & {
  department: Pick<Department, "id" | "name" | "color">;
  manager: Pick<Employee, "id" | "firstName" | "lastName"> | null;
};

// ── Full employee detail (includes subordinates) ─────────
export type EmployeeDetail = EmployeeWithDepartment & {
  subordinates: Pick<Employee, "id" | "firstName" | "lastName" | "designation" | "profileImage">[];
};

// ── Emergency contact shape stored in JSON field ─────────
export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

// ── Form input types ──────────────────────────────────────
export interface CreateEmployeeInput {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: Gender;
  profileImage?: string;
  departmentId: string;
  designation: string;
  joiningDate: string;
  salary: number;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  managerId?: string;
  address?: string;
  emergencyContact?: EmergencyContact;
  notes?: string;
}

export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;

// ── Filter & query params ─────────────────────────────────
export interface EmployeeFilters {
  search?: string;
  departmentId?: string;
  status?: EmployeeStatus;
  employmentType?: EmploymentType;
  gender?: Gender;
  page?: number;
  limit?: number;
  sortBy?: keyof Employee;
  sortOrder?: "asc" | "desc";
}

// ── Paginated response ────────────────────────────────────
export interface PaginatedEmployees {
  employees: EmployeeListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Statistics ────────────────────────────────────────────
export interface EmployeeStats {
  total: number;
  active: number;
  inactive: number;
  onLeave: number;
  terminated: number;
  newThisMonth: number;
  byDepartment: { departmentId: string; departmentName: string; count: number }[];
  byEmploymentType: { type: EmploymentType; count: number }[];
  growthByMonth: { month: string; count: number }[];
}

// Re-export Prisma enums for convenience
export { EmployeeStatus, EmploymentType, Gender } from "@prisma/client";
