import { z } from "zod";
import { Gender, EmployeeStatus, EmploymentType } from "@prisma/client";

// ── Reusable field schemas ────────────────────────────────

const phoneSchema = z
  .string()
  .regex(/^[+]?[\d\s\-()]{7,20}$/, "Enter a valid phone number")
  .optional()
  .or(z.literal(""));

const urlSchema = z
  .string()
  .url("Enter a valid URL")
  .optional()
  .or(z.literal(""));

// ── Emergency contact ─────────────────────────────────────

export const emergencyContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[+]?[\d\s\-()]{7,20}$/, "Enter a valid phone number"),
  relation: z.string().min(2, "Relation must be at least 2 characters"),
});

// ── Create employee ───────────────────────────────────────

export const createEmployeeSchema = z.object({
  employeeId: z
    .string()
    .min(1, "Employee ID is required")
    .regex(/^EMP-\d{4}$/, "Employee ID must be in format EMP-XXXX"),

  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be under 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "First name can only contain letters"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be under 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name can only contain letters"),

  email: z
    .string()
    .email("Enter a valid email address")
    .toLowerCase(),

  phone: phoneSchema,

  dob: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      const minAge = new Date();
      minAge.setFullYear(minAge.getFullYear() - 18);
      return date <= minAge;
    }, "Employee must be at least 18 years old"),

  gender: z.nativeEnum(Gender).optional(),

  profileImage: urlSchema,

  departmentId: z.string().min(1, "Department is required"),

  designation: z
    .string()
    .min(2, "Designation must be at least 2 characters")
    .max(100, "Designation must be under 100 characters"),

  joiningDate: z.string().min(1, "Joining date is required"),

  salary: z
    .number({ invalid_type_error: "Salary must be a number" })
    .min(0, "Salary cannot be negative")
    .max(100000000, "Salary seems too high"),

  employmentType: z.nativeEnum(EmploymentType),

  status: z.nativeEnum(EmployeeStatus).default(EmployeeStatus.ACTIVE),

  managerId: z.string().optional().or(z.literal("")),

  address: z
    .string()
    .max(500, "Address must be under 500 characters")
    .optional()
    .or(z.literal("")),

  emergencyContact: emergencyContactSchema.optional(),

  notes: z
    .string()
    .max(1000, "Notes must be under 1000 characters")
    .optional()
    .or(z.literal("")),
});

export type CreateEmployeeSchema = z.infer<typeof createEmployeeSchema>;

// ── Update employee (all fields optional) ────────────────

export const updateEmployeeSchema = createEmployeeSchema.partial().extend({
  // These fields remain required even on update if provided
  email: z.string().email("Enter a valid email address").toLowerCase().optional(),
  departmentId: z.string().min(1, "Department is required").optional(),
  designation: z.string().min(2, "Designation must be at least 2 characters").optional(),
  joiningDate: z.string().optional(),
  salary: z.number().min(0).optional(),
  employmentType: z.nativeEnum(EmploymentType).optional(),
  status: z.nativeEnum(EmployeeStatus).optional(),
});

export type UpdateEmployeeSchema = z.infer<typeof updateEmployeeSchema>;

// ── Department schemas ────────────────────────────────────

export const createDepartmentSchema = z.object({
  name: z
    .string()
    .min(2, "Department name must be at least 2 characters")
    .max(100, "Department name must be under 100 characters"),

  description: z
    .string()
    .max(500, "Description must be under 500 characters")
    .optional()
    .or(z.literal("")),

  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex code (e.g. #6366f1)")
    .optional()
    .or(z.literal("")),
});

export type CreateDepartmentSchema = z.infer<typeof createDepartmentSchema>;

export const updateDepartmentSchema = createDepartmentSchema.partial();

export type UpdateDepartmentSchema = z.infer<typeof updateDepartmentSchema>;

// ── Filter/query params ───────────────────────────────────

export const employeeFiltersSchema = z.object({
  search: z.string().optional(),
  departmentId: z.string().optional(),
  status: z.nativeEnum(EmployeeStatus).optional(),
  employmentType: z.nativeEnum(EmploymentType).optional(),
  gender: z.nativeEnum(Gender).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type EmployeeFiltersSchema = z.infer<typeof employeeFiltersSchema>;

export const departmentFiltersSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type DepartmentFiltersSchema = z.infer<typeof departmentFiltersSchema>;