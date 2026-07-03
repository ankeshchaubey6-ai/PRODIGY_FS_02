import { formatRelativeTime, getInitials } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ActivityItem, ActivityType } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface RecentActivityProps {
  items: ActivityItem[];
}

const activityConfig: Record<
  ActivityType,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  EMPLOYEE_CREATED: { label: "Joined", variant: "default" },
  EMPLOYEE_UPDATED: { label: "Updated", variant: "secondary" },
  EMPLOYEE_TERMINATED: { label: "Terminated", variant: "destructive" },
  EMPLOYEE_ON_LEAVE: { label: "On Leave", variant: "outline" },
  DEPARTMENT_CREATED: { label: "New Dept", variant: "default" },
};

function ActivityRow({ item }: { item: ActivityItem }) {
  const config = activityConfig[item.type];

  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <Avatar className="w-8 h-8 flex-shrink-0 mt-0.5">
        <AvatarImage src={item.avatarUrl} alt={item.initials} />
        <AvatarFallback className="text-xs font-medium bg-muted text-muted-foreground">
          {item.initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-foreground leading-snug truncate">
            {item.title}
          </p>
          <Badge
            variant={config.variant}
            className={cn(
              "text-[10px] px-1.5 py-0 h-4 flex-shrink-0 font-medium",
              item.type === "EMPLOYEE_ON_LEAVE" &&
                "border-warning/40 text-warning bg-warning/10"
            )}
          >
            {config.label}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {item.description}
        </p>
        <p className="text-[10px] text-muted-foreground/60 mt-1">
          {formatRelativeTime(item.timestamp)}
        </p>
      </div>
    </div>
  );
}

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">
          Recent Activity
        </CardTitle>
        <CardDescription className="text-xs">
          Latest updates across your workforce
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No recent activity
          </p>
        ) : (
          <div className="divide-y divide-border">
            {items.map((item) => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function RecentActivitySkeleton() {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <div className="skeleton h-5 w-32 rounded-md" />
        <div className="skeleton h-3 w-52 rounded-md mt-1" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3.5 w-3/4 rounded-md" />
                <div className="skeleton h-3 w-1/2 rounded-md" />
                <div className="skeleton h-2.5 w-16 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
