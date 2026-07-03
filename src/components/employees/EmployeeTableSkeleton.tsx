import { Skeleton } from "@/components/ui/skeleton";

export function EmployeeTableSkeleton() {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-card">
      {/* Header */}
      <div className="flex items-center px-4 h-11 border-b border-border bg-muted/40 gap-4">
        {[140, 100, 80, 100, 80, 60].map((w, i) => (
          <Skeleton key={i} className={`h-3.5 w-[${w}px]`} />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center px-4 h-[68px] border-b border-border last:border-0 gap-4"
        >
          {/* Avatar + name */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
            <div className="space-y-1.5 min-w-0">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          {/* Department */}
          <Skeleton className="h-3 w-24 hidden md:block" />
          {/* Status */}
          <Skeleton className="h-5 w-16 rounded-full hidden sm:block" />
          {/* Employment type */}
          <Skeleton className="h-3 w-16 hidden lg:block" />
          {/* Joining date */}
          <Skeleton className="h-3 w-20 hidden xl:block" />
          {/* Actions */}
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
      ))}
    </div>
  );
}