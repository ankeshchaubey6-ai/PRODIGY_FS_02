"use client";

import { useMemo } from "react";
import {
  CalendarClock,
  FileText,
  BarChart3,
  Clock3,
  Briefcase,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ModuleStatCard } from "@/components/dashboard/ModuleStatCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useDepartments } from "@/hooks/useDepartments";
import { useEmployees } from "@/hooks/useEmployees";

export default function HRPage() {
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError, refetch } = useDashboardStats();
  const { employees, isLoading: employeesLoading, error: employeesError } = useEmployees({ limit: 100 });
  const { departments, isLoading: departmentsLoading, error: departmentsError } = useDepartments();

  const stats = useMemo(() => {
    const activeCount = employees.filter((employee) => employee.status === "ACTIVE").length;
    const leaveCount = employees.filter((employee) => employee.status === "ON_LEAVE").length;
    const newThisMonth = employees.filter((employee) => {
      const createdDate = new Date(employee.createdAt);
      const now = new Date();
      return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
    }).length;

    return [
      {
        title: "Active workforce",
        value: `${dashboardData?.stats.activeEmployees ?? activeCount}`,
        description: "Employees currently active in the org",
        icon: CalendarClock,
        accentClassName: "bg-amber-500/10 text-amber-600",
      },
      {
        title: "On leave",
        value: `${leaveCount}`,
        description: "People currently away from work",
        icon: Clock3,
        accentClassName: "bg-rose-500/10 text-rose-600",
      },
      {
        title: "Departments",
        value: `${dashboardData?.stats.totalDepartments ?? departments.length}`,
        description: "Business units with active headcount",
        icon: FileText,
        accentClassName: "bg-emerald-500/10 text-emerald-600",
      },
      {
        title: "New this month",
        value: `${dashboardData?.stats.newThisMonth ?? newThisMonth}`,
        description: "Latest onboarding and hiring activity",
        icon: BarChart3,
        accentClassName: "bg-sky-500/10 text-sky-600",
      },
    ];
  }, [dashboardData, departments.length, employees]);

  const attendanceEntries = useMemo(() => {
    return employees.slice(0, 5).map((employee) => ({
      name: `${employee.firstName} ${employee.lastName}`,
      department: employee.department.name,
      status: employee.status === "ON_LEAVE" ? "Leave" : employee.status === "ACTIVE" ? "On time" : "Review",
      detail: employee.designation,
    }));
  }, [employees]);

  const error = dashboardError || employeesError || departmentsError;

  if (error) {
    return <ErrorState title="HR Hub unavailable" description={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="HR Hub"
        description="Track headcount, leave, and team activity from one operational view."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <ModuleStatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Attendance review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardLoading || employeesLoading || departmentsLoading ? (
              <div className="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
                Loading HR operations…
              </div>
            ) : (
              attendanceEntries.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-foreground">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">{entry.department} • {entry.detail}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={entry.status === "Leave" ? "secondary" : entry.status === "Review" ? "outline" : "default"}>
                      {entry.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Leave queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {employees.filter((employee) => employee.status === "ON_LEAVE").length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
                No active leave requests right now.
              </div>
            ) : (
              employees.filter((employee) => employee.status === "ON_LEAVE").map((employee) => (
                <div key={employee.id} className="rounded-lg border border-border/70 bg-background/70 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{employee.firstName} {employee.lastName}</p>
                      <p className="text-xs text-muted-foreground">{employee.department.name} • {employee.designation}</p>
                    </div>
                    <Badge variant="outline">Leave</Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Document readiness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {departments.slice(0, 4).map((department) => (
              <div key={department.id} className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-foreground">{department.name}</p>
                  <p className="text-xs text-muted-foreground">{department._count.employees} team members</p>
                </div>
                <Badge variant="secondary">Ready</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Reporting activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(dashboardData?.recentActivity ?? []).slice(0, 3).map((item) => (
              <div key={item.id} className="rounded-lg border border-border/70 bg-background/70 p-3">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <Briefcase className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">HR operations are now driven by live workforce data</p>
            <p className="text-xs text-muted-foreground">This module reflects actual employee, department, and activity records from the EMS.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
