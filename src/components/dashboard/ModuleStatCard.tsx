import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ModuleStatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  accentClassName: string;
}

export function ModuleStatCard({
  title,
  value,
  description,
  icon: Icon,
  accentClassName,
}: ModuleStatCardProps) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={`rounded-xl p-2.5 ${accentClassName}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
