import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getDepartmentById } from "@/features/departments/queries";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmployeeAvatar } from "@/components/employees/EmployeeAvatar";
import { EmployeeStatusBadge } from "@/components/employees/EmployeeStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Users, Calendar, Palette } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { EmployeeStatus } from "@/types/employee";

interface DepartmentPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: DepartmentPageProps): Promise<Metadata> {
  const dept = await getDepartmentById(params.id);
  if (!dept) return { title: "Department Not Found" };
  return { title: dept.name };
}

export default async function DepartmentPage({
  params,
}: DepartmentPageProps) {
  const department = await getDepartmentById(params.id);

  if (!department) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={department.name}
        description={
          department.description ?? "No description provided."
        }
      >
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link href="/departments">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: department info ──────────────── */}
        <div className="space-y-4">
          {/* Overview card */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              {/* Colour swatch + name */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${department.color ?? "#6366f1"}20`,
                  }}
                >
                  <span
                    className="text-2xl font-bold"
                    style={{ color: department.color ?? "#6366f1" }}
                  >
                    {department.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {department.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {department._count.employees} member
                    {department._count.employees !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Meta rows */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Headcount
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {department._count.employees} employee
                      {department._count.employees !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Colour</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: department.color ?? "#6366f1",
                        }}
                      />
                      <p className="text-sm font-mono font-medium text-foreground">
                        {department.color ?? "#6366f1"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(department.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right: employee list ───────────────── */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                Team Members ({department._count.employees})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {department.employees.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    No employees yet
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Add employees to this department to see them here.
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/employees/new">Add Employee</Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {department.employees.map((emp) => (
                    <Link
                      key={emp.id}
                      href={`/employees/${emp.id}`}
                      className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-80 transition-opacity"
                    >
                      <EmployeeAvatar
                        firstName={emp.firstName}
                        lastName={emp.lastName}
                        profileImage={emp.profileImage}
                        size="sm"
                        className="flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {emp.designation}
                        </p>
                      </div>
                      <EmployeeStatusBadge
                        status={emp.status as EmployeeStatus}
                        showDot={false}
                        className="flex-shrink-0 hidden sm:inline-flex"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}