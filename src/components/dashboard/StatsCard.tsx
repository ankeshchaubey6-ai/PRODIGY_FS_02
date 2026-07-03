import { cn } from "@/lib/utils";
import {
  Users,
  UserCheck,
  Building2,
  UserPlus,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number | string;
  change: number;
  changeLabel: string;
  icon: "Users" | "UserCheck" | "Building2" | "UserPlus";
  color: "indigo" | "emerald" | "blue" | "violet";
}

const iconMap = {
  Users,
  UserCheck,
  Building2,
  UserPlus,
};

const colorMap = {
  indigo: {
    icon: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
    value: "text-foreground",
  },
  emerald: {
    icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    value: "text-foreground",
  },
  blue: {
    icon: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    value: "text-foreground",
  },
  violet: {
    icon: "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400",
    value: "text-foreground",
  },
};

export function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  color,
}: StatsCardProps) {
  const Icon = iconMap[icon];
  const colors = colorMap[color];

  const isPositive = change > 0;
  const isNeutral = change === 0;
  const isNegative = change < 0;

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">
              {title}
            </p>
            <p className={cn("text-3xl font-bold tracking-tight", colors.value)}>
              {typeof value === "number" ? value.toLocaleString("en-IN") : value}
            </p>
            {/* Change indicator */}
            <div className="flex items-center gap-1.5">
              {isPositive && (
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">+{change}%</span>
                </div>
              )}
              {isNegative && (
                <div className="flex items-center gap-1 text-destructive">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{change}%</span>
                </div>
              )}
              {isNeutral && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Minus className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">0%</span>
                </div>
              )}
              <span className="text-xs text-muted-foreground truncate">
                {changeLabel}
              </span>
            </div>
          </div>

          {/* Icon */}
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
              colors.icon
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}