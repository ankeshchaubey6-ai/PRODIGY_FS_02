import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { getEmployeesForSelect } from "@/features/employees/queries";

async function getDepartmentOptions() {
  try {
    return await prisma.department.findMany({
      include: { _count: { select: { employees: true } } },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[EMPLOYEE_NEW_PAGE] Falling back to empty department list", error);
      return [];
    }

    throw error;
  }
}

export const metadata: Metadata = {
  title: "Add Employee",
};

export default async function NewEmployeePage() {
  const [departments, managers] = await Promise.all([
    getDepartmentOptions(),
    getEmployeesForSelect(),
  ]);

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Add Employee"
        description="Fill in the details to create a new employee record."
        className="mb-6"
      />
      <EmployeeForm
        departments={departments}
        managers={managers}
        mode="create"
      />
    </div>
  );
}