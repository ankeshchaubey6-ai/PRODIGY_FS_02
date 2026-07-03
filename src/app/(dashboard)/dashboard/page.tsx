"use client";

import { useDashboardStats } from "@/hooks/useDashboardStats";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { StatsGridSkeleton } from "@/components/dashboard/StatsCardSkeleton";
import { EmployeeGrowthChart, EmployeeGrowthChartSkeleton } from "@/components/dashboard/EmployeeGrowthChart";
import { DepartmentChart, DepartmentChartSkeleton } from "@/components/dashboard/DepartmentChart";
import { RecentActivity, RecentActivitySkeleton } from "@/components/dashboard/RecentActivity";
import { ErrorState } from "@/components/shared/ErrorState";

const statsConfig = [
  {
    key: "totalEmployees" as const,
    title: "Total Employees",
    changeKey: "totalEmployeesChange" as const,
    changeLabel: "vs last month",
    icon: "Users" as const,
    color: "indigo" as const,
  },
  {
    key: "activeEmployees" as const,
    title: "Active Employees",
    changeKey: "activeEmployeesChange" as const,
    changeLabel: "vs last month",
    icon: "UserCheck" as const,
    color: "emerald" as const,
  },
  {
    key: "totalDepartments" as const,
    title: "Departments",
    changeKey: "departmentsChange" as const,
    changeLabel: "vs last month",
    icon: "Building2" as const,
    color: "blue" as const,
  },
  {
    key: "newThisMonth" as const,
    title: "New This Month",
    changeKey: "newThisMonthChange" as const,
    changeLabel: "vs last month",
    icon: "UserPlus" as const,
    color: "violet" as const,
  },
];

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboardStats();

  if (error) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        description={error}
        onRetry={refetch}
        className="min-h-[400px]"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Page heading ────────────────────────────── */}
      <div>
        <h1 className="text-xl font-semibold text-foreground tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Overview of your workforce at a glance.
        </p>
      </div>

      {/* ── Stats grid ──────────────────────────────── */}
      {isLoading || !data ? (
        <StatsGridSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statsConfig.map((stat) => (
            <StatsCard
              key={stat.key}
              title={stat.title}
              value={data.stats[stat.key]}
              change={data.stats[stat.changeKey]}
              changeLabel={stat.changeLabel}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>
      )}

      {/* ── Charts row ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Growth chart — 2/3 width */}
        <div className="lg:col-span-2">
          {isLoading || !data ? (
            <EmployeeGrowthChartSkeleton />
          ) : (
            <EmployeeGrowthChart data={data.growthData} />
          )}
        </div>

        {/* Department chart — 1/3 width */}
        <div className="lg:col-span-1">
          {isLoading || !data ? (
            <DepartmentChartSkeleton />
          ) : (
            <DepartmentChart data={data.departmentData} />
          )}
        </div>
      </div>

      {/* ── Bottom row ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity — full width on mobile, 1/3 on desktop */}
        <div className="lg:col-span-1">
          {isLoading || !data ? (
            <RecentActivitySkeleton />
          ) : (
            <RecentActivity items={data.recentActivity} />
          )}
        </div>

        {/* Quick summary card */}
        <div className="lg:col-span-2">
          {isLoading || !data ? (
            <div className="skeleton h-full min-h-[300px] rounded-xl" />
          ) : (
            <QuickSummaryCard stats={data.stats} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Quick summary card ────────────────────────────────────
function QuickSummaryCard({
  stats,
}: {
  stats: {
    totalEmployees: number;
    activeEmployees: number;
    totalDepartments: number;
    newThisMonth: number;
  };
}) {
  const activeRate =
    stats.totalEmployees > 0
      ? Math.round((stats.activeEmployees / stats.totalEmployees) * 100)
      : 0;

  const summaryItems = [
    {
      label: "Active Rate",
      value: `${activeRate}%`,
      description: `${stats.activeEmployees} of ${stats.totalEmployees} employees active`,
      color: "bg-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      text: "text-emerald-700 dark:text-emerald-400",
    },
    {
      label: "Avg. Team Size",
      value:
        stats.totalDepartments > 0
          ? Math.round(stats.totalEmployees / stats.totalDepartments)
          : 0,
      description: `Across ${stats.totalDepartments} departments`,
      color: "bg-blue-500",
      bg: "bg-blue-50 dark:bg-blue-500/10",
      text: "text-blue-700 dark:text-blue-400",
    },
    {
      label: "Hired This Month",
      value: stats.newThisMonth,
      description: "New employees onboarded",
      color: "bg-violet-500",
      bg: "bg-violet-50 dark:bg-violet-500/10",
      text: "text-violet-700 dark:text-violet-400",
    },
  ];

  return (
    <div className="panel p-6 h-full">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-foreground">
          Quick Summary
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Key workforce metrics at a glance
        </p>
      </div>

      <div className="space-y-4">
        {summaryItems.map((item) => (
          <div key={item.label} className={`rounded-lg p-4 ${item.bg}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {item.label}
              </span>
              <span className={`text-xl font-bold ${item.text}`}>
                {item.value}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
            {item.label === "Active Rate" && (
              <div className="mt-2 h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-700`}
                  style={{ width: `${activeRate}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}