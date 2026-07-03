"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createEmployeeSchema, updateEmployeeSchema } from "@/lib/validations";
import { isEmailTaken, isEmployeeIdTaken, generateEmployeeId } from "./utils";
import type { CreateEmployeeInput, UpdateEmployeeInput } from "@/types/employee";
import { isAuthEnabled } from "@/lib/auth-mode";

// ── Create employee ───────────────────────────────────────
export async function createEmployee(input: CreateEmployeeInput) {
  if (isAuthEnabled()) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };
  }

  // Validate input
  const parsed = createEmployeeSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  // Check uniqueness
  const [emailTaken, empIdTaken] = await Promise.all([
    isEmailTaken(data.email),
    isEmployeeIdTaken(data.employeeId),
  ]);

  if (emailTaken) {
    return { success: false, error: "An employee with this email already exists." };
  }
  if (empIdTaken) {
    return { success: false, error: "An employee with this ID already exists." };
  }

  try {
    const employee = await prisma.employee.create({
      data: {
        employeeId: data.employeeId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.toLowerCase(),
        phone: data.phone || null,
        dob: data.dob ? new Date(data.dob) : null,
        gender: data.gender ?? null,
        profileImage: data.profileImage || null,
        departmentId: data.departmentId,
        designation: data.designation,
        joiningDate: new Date(data.joiningDate),
        salary: data.salary,
        employmentType: data.employmentType,
        status: data.status,
        managerId: data.managerId || null,
        address: data.address || null,
        emergencyContact: data.emergencyContact ?? undefined,
        notes: data.notes || null,
      },
    });

    revalidatePath("/employees");
    revalidatePath("/dashboard");

    return { success: true, data: employee };
  } catch (error) {
    console.error("[CREATE_EMPLOYEE]", error);
    return { success: false, error: "Failed to create employee. Please try again." };
  }
}

// ── Update employee ───────────────────────────────────────
export async function updateEmployee(id: string, input: UpdateEmployeeInput) {
  if (isAuthEnabled()) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };
  }

  // Check employee exists
  const existing = await prisma.employee.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) return { success: false, error: "Employee not found." };

  // Validate input
  const parsed = updateEmployeeSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  // Check uniqueness for email/employeeId if being changed
  if (data.email) {
    const emailTaken = await isEmailTaken(data.email, id);
    if (emailTaken) {
      return { success: false, error: "An employee with this email already exists." };
    }
  }

  if (data.employeeId) {
    const empIdTaken = await isEmployeeIdTaken(data.employeeId, id);
    if (empIdTaken) {
      return { success: false, error: "An employee with this ID already exists." };
    }
  }

  try {
    const employee = await prisma.employee.update({
      where: { id },
      data: {
        ...(data.employeeId && { employeeId: data.employeeId }),
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.email && { email: data.email.toLowerCase() }),
        ...(data.phone !== undefined && { phone: data.phone || null }),
        ...(data.dob !== undefined && { dob: data.dob ? new Date(data.dob) : null }),
        ...(data.gender !== undefined && { gender: data.gender ?? null }),
        ...(data.profileImage !== undefined && { profileImage: data.profileImage || null }),
        ...(data.departmentId && { departmentId: data.departmentId }),
        ...(data.designation && { designation: data.designation }),
        ...(data.joiningDate && { joiningDate: new Date(data.joiningDate) }),
        ...(data.salary !== undefined && { salary: data.salary }),
        ...(data.employmentType && { employmentType: data.employmentType }),
        ...(data.status && { status: data.status }),
        ...(data.managerId !== undefined && { managerId: data.managerId || null }),
        ...(data.address !== undefined && { address: data.address || null }),
        ...(data.emergencyContact !== undefined && {
          emergencyContact: data.emergencyContact ?? undefined,
        }),
        ...(data.notes !== undefined && { notes: data.notes || null }),
      },
    });

    revalidatePath("/employees");
    revalidatePath(`/employees/${id}`);
    revalidatePath("/dashboard");

    return { success: true, data: employee };
  } catch (error) {
    console.error("[UPDATE_EMPLOYEE]", error);
    return { success: false, error: "Failed to update employee. Please try again." };
  }
}

// ── Delete employee ───────────────────────────────────────
export async function deleteEmployee(id: string) {
  if (isAuthEnabled()) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };
  }

  const existing = await prisma.employee.findUnique({
    where: { id },
    select: { id: true, firstName: true, lastName: true },
  });
  if (!existing) return { success: false, error: "Employee not found." };

  try {
    // Remove this employee as manager from subordinates first
    await prisma.employee.updateMany({
      where: { managerId: id },
      data: { managerId: null },
    });

    await prisma.employee.delete({ where: { id } });

    revalidatePath("/employees");
    revalidatePath("/dashboard");

    return { success: true, data: { id } };
  } catch (error) {
    console.error("[DELETE_EMPLOYEE]", error);
    return { success: false, error: "Failed to delete employee. Please try again." };
  }
}

// ── Generate next employee ID ─────────────────────────────
export async function getNextEmployeeId(): Promise<string> {
  return generateEmployeeId();
}