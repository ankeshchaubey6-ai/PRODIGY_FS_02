import { formatDate, formatRelativeTime } from "@/lib/utils";
import { UserPlus, Pencil, Calendar } from "lucide-react";
import type { EmployeeDetail } from "@/types/employee";

interface EmployeeTimelineProps {
  employee: EmployeeDetail;
}

export function EmployeeTimeline({ employee }: EmployeeTimelineProps) {
  const events = [
    {
      id: "joined",
      icon: UserPlus,
      color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
      title: "Joined the company",
      description: `Started as ${employee.designation} in ${employee.department.name}`,
      date: employee.joiningDate,
      isRelative: false,
    },
    {
      id: "created",
      icon: Calendar,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
      title: "Record created",
      description: "Employee profile added to the system",
      date: employee.createdAt,
      isRelative: true,
    },
    {
      id: "updated",
      icon: Pencil,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
      title: "Last updated",
      description: "Employee profile was last modified",
      date: employee.updatedAt,
      isRelative: true,
    },
  ].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const Icon = event.icon;
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="flex gap-4">
            {/* Icon + line */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${event.color}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              {!isLast && (
                <div className="w-px flex-1 bg-border mt-2 mb-0 min-h-[24px]" />
              )}
            </div>

            {/* Content */}
            <div className={`flex-1 pb-4 ${isLast ? "" : ""}`}>
              <p className="text-sm font-medium text-foreground leading-snug">
                {event.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {event.description}
              </p>
              <p className="text-[11px] text-muted-foreground/60 mt-1">
                {event.isRelative
                  ? formatRelativeTime(event.date)
                  : formatDate(event.date)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}