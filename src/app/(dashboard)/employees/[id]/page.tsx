import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEmployeeById } from "@/features/employees/queries";
import { EmployeeProfile } from "@/components/employees/EmployeeProfile";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil, ChevronLeft } from "lucide-react";

interface EmployeePageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: EmployeePageProps): Promise<Metadata> {
  const employee = await getEmployeeById(params.id);
  if (!employee) return { title: "Employee Not Found" };
  return {
    title: `${employee.firstName} ${employee.lastName}`,
  };
}

export default async function EmployeePage({ params }: EmployeePageProps) {
  const employee = await getEmployeeById(params.id);

  if (!employee) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${employee.firstName} ${employee.lastName}`}
        description={`${employee.designation} · ${employee.department.name}`}
      >
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link href="/employees">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
        </Button>
        <Button asChild size="sm" className="gap-1.5">
          <Link href={`/employees/${employee.id}/edit`}>
            <Pencil className="w-4 h-4" />
            Edit
          </Link>
        </Button>
      </PageHeader>

      <EmployeeProfile employee={employee} />
    </div>
  );
}