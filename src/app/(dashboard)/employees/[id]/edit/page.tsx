import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getEmployeeById, getEmployeesForSelect } from "@/features/employees/queries";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface EditEmployeePageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: EditEmployeePageProps): Promise<Metadata> {
  const employee = await getEmployeeById(params.id);
  if (!employee) return { title: "Employee Not Found" };
  return {
    title: `Edit — ${employee.firstName} ${employee.lastName}`,
  };
}

export default async function EditEmployeePage({
  params,
}: EditEmployeePageProps) {
  const [employee, departments, managers] = await Promise.all([
    getEmployeeById(params.id),
    prisma.department.findMany({
      include: { _count: { select: { employees: true } } },
      orderBy: { name: "asc" },
    }),
    getEmployeesForSelect(),
  ]);

  if (!employee) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Edit Employee"
        description={`Updating profile for ${employee.firstName} ${employee.lastName}`}
        className="mb-6"
      >
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link href={`/employees/${employee.id}`}>
            <ChevronLeft className="w-4 h-4" />
            Back to Profile
          </Link>
        </Button>
      </PageHeader>

      <EmployeeForm
        employee={employee}
        departments={departments}
        managers={managers}
        mode="edit"
      />
    </div>
  );
}