import { cn } from "@/lib/utils";
import { EMPLOYEE_STATUS_CONFIG } from "@/lib/constants";
import type { EmployeeStatus } from "@/types/employee";

interface EmployeeStatusBadgeProps {
  status: EmployeeStatus;
  showDot?: boolean;
  className?: string;
}

export function EmployeeStatusBadge({
  status,
  showDot = true,
  className,
}: EmployeeStatusBadgeProps) {
  const config = EMPLOYEE_STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.className,
        className
      )}
    >
      {showDot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", config.dotColor)}
        />
      )}
      {config.label}
    </span>
  );
}