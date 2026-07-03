"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { DepartmentDataPoint } from "@/types/dashboard";

interface DepartmentChartProps {
  data: DepartmentDataPoint[];
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: DepartmentDataPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-sm">
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: item.payload.color }}
        />
        <span className="font-medium text-foreground">{item.name}</span>
      </div>
      <p className="text-muted-foreground pl-4">
        {item.value} employee{item.value !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

function CustomLegend({
  payload,
}: {
  payload?: { value: string; color: string }[];
}) {
  if (!payload?.length) return null;

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-2 min-w-0">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-muted-foreground truncate">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function DepartmentChart({ data }: DepartmentChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">
          Department Distribution
        </CardTitle>
        <CardDescription className="text-xs">
          Employees across {data.length} departments
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="relative">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center mt-[-36px]">
              <p className="text-2xl font-bold text-foreground">{total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DepartmentChartSkeleton() {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <div className="skeleton h-5 w-44 rounded-md" />
        <div className="skeleton h-3 w-36 rounded-md mt-1" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="skeleton w-[180px] h-[180px] rounded-full" />
          <div className="grid grid-cols-2 gap-2 w-full">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-3 rounded-md" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}