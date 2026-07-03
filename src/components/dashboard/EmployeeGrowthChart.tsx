"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { GrowthDataPoint } from "@/types/dashboard";

interface EmployeeGrowthChartProps {
  data: GrowthDataPoint[];
}

// Custom tooltip
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-medium text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground capitalize">
            {entry.name === "employees" ? "Total" : "New Hires"}:
          </span>
          <span className="font-medium text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function EmployeeGrowthChart({ data }: EmployeeGrowthChartProps) {
  // Shorten month labels for smaller screens
  const formattedData = data.map((d) => ({
    ...d,
    month: d.month.split(" ")[0], // "Jan 2024" → "Jan"
  }));

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">
          Workforce Growth
        </CardTitle>
        <CardDescription className="text-xs">
          Total headcount and new hires over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart
            data={formattedData}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="employeesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="newHiresGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                fontSize: "11px",
                paddingTop: "12px",
                color: "hsl(var(--muted-foreground))",
              }}
              formatter={(value) =>
                value === "employees" ? "Total Employees" : "New Hires"
              }
            />
            <Area
              type="monotone"
              dataKey="employees"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#employeesGradient)"
              dot={{ fill: "#6366f1", strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="newHires"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#newHiresGradient)"
              dot={{ fill: "#10b981", strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function EmployeeGrowthChartSkeleton() {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <div className="skeleton h-5 w-36 rounded-md" />
        <div className="skeleton h-3 w-56 rounded-md mt-1" />
      </CardHeader>
      <CardContent>
        <div className="skeleton h-[240px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}