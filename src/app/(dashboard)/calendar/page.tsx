"use client";

import { useMemo } from "react";
import { CalendarDays, Sparkles, Briefcase, Clock3 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ModuleStatCard } from "@/components/dashboard/ModuleStatCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDepartments } from "@/hooks/useDepartments";
import { useEmployees } from "@/hooks/useEmployees";

export default function CalendarPage() {
  const { employees, isLoading: employeesLoading, error: employeesError } = useEmployees({ limit: 100 });
  const { departments, isLoading: departmentsLoading, error: departmentsError } = useDepartments();

  const calendarStats = useMemo(() => {
    const leaveCount = employees.filter((employee) => employee.status === "ON_LEAVE").length;
    const newThisMonth = employees.filter((employee) => {
      const createdDate = new Date(employee.createdAt);
      const now = new Date();
      return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
    }).length;

    return [
      {
        title: "Upcoming actions",
        value: `${leaveCount + newThisMonth}`,
        description: "Leave and onboarding items to review",
        icon: CalendarDays,
        accentClassName: "bg-primary/10 text-primary",
      },
      {
        title: "Managers in focus",
        value: `${employees.filter((employee) => Boolean(employee.manager)).length}`,
        description: "Employees with an assigned manager",
        icon: Briefcase,
        accentClassName: "bg-amber-500/10 text-amber-600",
      },
      {
        title: "Department reviews",
        value: `${departments.length}`,
        description: "Teams with weekly follow-up tasks",
        icon: Clock3,
        accentClassName: "bg-emerald-500/10 text-emerald-600",
      },
      {
        title: "Planning ahead",
        value: `${Math.max(1, Math.round(departments.length / 2))}`,
        description: "Milestones flagged for the next cycle",
        icon: Sparkles,
        accentClassName: "bg-violet-500/10 text-violet-600",
      },
    ];
  }, [departments.length, employees]);

  const error = employeesError || departmentsError;

  if (error) {
    return <ErrorState title="Calendar unavailable" description={error} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Coordinate HR follow-ups, leave coverage, and key milestones from live employee data."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {calendarStats.map((item) => (
          <ModuleStatCard key={item.title} {...item} />
        ))}
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">This week’s focus</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {employeesLoading || departmentsLoading ? (
            <div className="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground">Loading calendar tasks…</div>
          ) : (
            [
              {
                title: "Leave coverage",
                when: `${employees.filter((employee) => employee.status === "ON_LEAVE").length} people away`,
                note: "Review handoff and backup coverage",
              },
              {
                title: "New join follow-up",
                when: `${employees.filter((employee) => {
                  const createdDate = new Date(employee.createdAt);
                  const now = new Date();
                  return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
                }).length} new records this month`,
                note: "Confirm onboarding and onboarding tasks",
              },
              {
                title: "Department review",
                when: `${departments.length} teams scheduled`,
                note: "Check headcount and capacity updates",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.note}</p>
                </div>
                <p className="text-xs font-medium text-muted-foreground">{item.when}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
