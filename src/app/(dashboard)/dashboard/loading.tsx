import { StatsGridSkeleton } from "@/components/dashboard/StatsCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Heading skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Stats grid */}
      <StatsGridSkeleton />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Skeleton className="lg:col-span-2 h-[320px] rounded-xl" />
        <Skeleton className="h-[320px] rounded-xl" />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Skeleton className="h-[360px] rounded-xl" />
        <Skeleton className="lg:col-span-2 h-[360px] rounded-xl" />
      </div>
    </div>
  );
}