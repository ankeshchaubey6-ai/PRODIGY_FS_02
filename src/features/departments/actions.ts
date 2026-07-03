"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { isAuthEnabled } from "@/lib/auth-mode";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "@/lib/validations";
import type {
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "@/types/department";

// ── Create department ─────────────────────────────────────
export async function createDepartment(input: CreateDepartmentInput) {
  if (isAuthEnabled()) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };
  }

  const parsed = createDepartmentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  // Check name uniqueness
  const existing = await prisma.department.findFirst({
    where: { name: { equals: data.name } },
    select: { id: true },
  });

  if (existing) {
    return {
      success: false,
      error: "A department with this name already exists.",
    };
  }

  try {
    const department = await prisma.department.create({
      data: {
        name: data.name,
        description: data.description || null,
        color: data.color || "#6366f1",
      },
    });

    revalidatePath("/departments");
    revalidatePath("/dashboard");

    return { success: true, data: department };
  } catch (error) {
    console.error("[CREATE_DEPARTMENT]", error);
    return {
      success: false,
      error: "Failed to create department. Please try again.",
    };
  }
}

// ── Update department ─────────────────────────────────────
export async function updateDepartment(
  id: string,
  input: UpdateDepartmentInput
) {
  if (isAuthEnabled()) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };
  }

  const existing = await prisma.department.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) return { success: false, error: "Department not found." };

  const parsed = updateDepartmentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  // Check name uniqueness if changing
  if (data.name) {
    const nameTaken = await prisma.department.findFirst({
      where: {
        name: { equals: data.name },
        NOT: { id },
      },
      select: { id: true },
    });
    if (nameTaken) {
      return {
        success: false,
        error: "A department with this name already exists.",
      };
    }
  }

  try {
    const department = await prisma.department.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description || null,
        }),
        ...(data.color !== undefined && {
          color: data.color || "#6366f1",
        }),
      },
    });

    revalidatePath("/departments");
    revalidatePath(`/departments/${id}`);
    revalidatePath("/dashboard");

    return { success: true, data: department };
  } catch (error) {
    console.error("[UPDATE_DEPARTMENT]", error);
    return {
      success: false,
      error: "Failed to update department. Please try again.",
    };
  }
}

// ── Delete department ─────────────────────────────────────
export async function deleteDepartment(id: string) {
  if (isAuthEnabled()) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };
  }

  const existing = await prisma.department.findUnique({
    where: { id },
    include: { _count: { select: { employees: true } } },
  });

  if (!existing) return { success: false, error: "Department not found." };

  // Block deletion if department has employees
  if (existing._count.employees > 0) {
    return {
      success: false,
      error: `Cannot delete "${existing.name}" — it has ${existing._count.employees} employee${existing._count.employees !== 1 ? "s" : ""}. Reassign them first.`,
    };
  }

  try {
    await prisma.department.delete({ where: { id } });

    revalidatePath("/departments");
    revalidatePath("/dashboard");

    return { success: true, data: { id } };
  } catch (error) {
    console.error("[DELETE_DEPARTMENT]", error);
    return {
      success: false,
      error: "Failed to delete department. Please try again.",
    };
  }
}