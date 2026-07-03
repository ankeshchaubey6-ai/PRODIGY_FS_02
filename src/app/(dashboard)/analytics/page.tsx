"use client";

import { useMemo } from "react";
import { Activity, TrendingUp, PieChart, Clock3 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ModuleStatCard } from "@/components/dashboard/ModuleStatCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useDepartments } from "@/hooks/useDepartments";
import { useEmployees } from "@/hooks/useEmployees";

export default function AnalyticsPage() {
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError, refetch } = useDashboardStats();
  const { employees, isLoading: employeesLoading, error: employeesError } = useEmployees({ limit: 100 });
  const { departments, isLoading: departmentsLoading, error: departmentsError } = useDepartments();

  const analyticsStats = useMemo(() => {
    const activeCount = employees.filter((employee) => employee.status === "ACTIVE").length;
    const activeRate = employees.length ? Math.round((activeCount / employees.length) * 100) : 0;
    const averageTeamSize = departments.length ? Math.round(employees.length / departments.length) : 0;

    return [
      {
        title: "Headcount growth",
        value: `${dashboardData?.stats.totalEmployeesChange ?? 12}%`,
        description: "Year-over-year movement in workforce size",
        icon: TrendingUp,
        accentClassName: "bg-emerald-500/10 text-emerald-600",
      },
      {
        title: "Active rate",
        value: `${activeRate}%`,
        description: "Employees currently active in the system",
        icon: Activity,
        accentClassName: "bg-violet-500/10 text-violet-600",
      },
      {
        title: "Department mix",
        value: `${departments.length} teams`,
        description: "Current organizational structure",
        icon: PieChart,
        accentClassName: "bg-sky-500/10 text-sky-600",
      },
      {
        title: "Avg. team size",
        value: `${averageTeamSize}`,
        description: "Average headcount per department",
        icon: Clock3,
        accentClassName: "bg-amber-500/10 text-amber-600",
      },
    ];
  }, [dashboardData, departments.length, employees]);

  const error = dashboardError || employeesError || departmentsError;

  if (error) {
    return <ErrorState title="Analytics unavailable" description={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Monitor workforce trends and departmental balance from live EMS data."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {analyticsStats.map((item) => (
          <ModuleStatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Department workload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardLoading || employeesLoading || departmentsLoading ? (
              <div className="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground">Loading analytics…</div>
            ) : (
              departments.map((department) => {
                const count = department._count.employees;
                return (
                  <div key={department.id} className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 px-3 py-2.5">
                    <div>
                      <p className="text-sm font-medium text-foreground">{department.name}</p>
                      <p className="text-xs text-muted-foreground">{count} employees</p>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">{count > 2 ? "Healthy" : "Watch"}</p>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Recent signals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(dashboardData?.recentActivity ?? []).slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-lg border border-border/70 bg-background/70 p-3">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
