"use client";

import { useMemo } from "react";
import { Briefcase, Users, Sparkles, BadgeCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ModuleStatCard } from "@/components/dashboard/ModuleStatCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDepartments } from "@/hooks/useDepartments";
import { useEmployees } from "@/hooks/useEmployees";

export default function PeoplePage() {
  const { employees, isLoading: employeesLoading, error: employeesError } = useEmployees({ limit: 100 });
  const { departments, isLoading: departmentsLoading, error: departmentsError } = useDepartments();

  const peopleHighlights = useMemo(() => {
    const activeCount = employees.filter((employee) => employee.status === "ACTIVE").length;
    const coverage = employees.length ? Math.round((activeCount / employees.length) * 100) : 0;
    const newThisMonth = employees.filter((employee) => {
      const createdDate = new Date(employee.createdAt);
      const now = new Date();
      return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
    }).length;

    return [
      {
        title: "Team coverage",
        value: `${coverage}%`,
        description: "Currently active employees across the org",
        icon: Users,
        accentClassName: "bg-primary/10 text-primary",
      },
      {
        title: "Departments",
        value: `${departments.length}`,
        description: "Business units currently staffed",
        icon: Briefcase,
        accentClassName: "bg-amber-500/10 text-amber-600",
      },
      {
        title: "Ready to onboard",
        value: `${newThisMonth}`,
        description: "New joins recorded this month",
        icon: BadgeCheck,
        accentClassName: "bg-emerald-500/10 text-emerald-600",
      },
      {
        title: "Growth focus",
        value: `${Math.max(1, Math.round(departments.length / 2))}`,
        description: "Teams with the largest organizational impact",
        icon: Sparkles,
        accentClassName: "bg-violet-500/10 text-violet-600",
      },
    ];
  }, [departments.length, employees]);

  const error = employeesError || departmentsError;

  if (error) {
    return <ErrorState title="People workspace unavailable" description={error} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="People"
        description="Coordinate staffing and team coverage from a dedicated operational view."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {peopleHighlights.map((item) => (
          <ModuleStatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Department coverage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {departmentsLoading ? (
              <div className="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground">Loading team coverage…</div>
            ) : (
              departments.map((department) => (
                <div key={department.id} className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-foreground">{department.name}</p>
                    <p className="text-xs text-muted-foreground">{department._count.employees} people</p>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">{department._count.employees > 2 ? "Stable" : "Needs attention"}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Latest team updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {employeesLoading ? (
              <div className="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground">Loading team updates…</div>
            ) : (
              employees.slice(0, 4).map((employee) => (
                <div key={employee.id} className="rounded-lg border border-border/70 bg-background/70 px-3 py-2.5">
                  <p className="text-sm font-medium text-foreground">{employee.firstName} {employee.lastName}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{employee.department.name} • {employee.designation}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
