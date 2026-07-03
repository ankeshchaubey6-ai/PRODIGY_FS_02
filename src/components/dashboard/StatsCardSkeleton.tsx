import { Card, CardContent } from "@/components/ui/card";

export function StatsCardSkeleton() {
  return (
    <Card className="shadow-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="skeleton h-4 w-28 rounded-md" />
            <div className="skeleton h-8 w-16 rounded-md" />
            <div className="skeleton h-3 w-36 rounded-md" />
          </div>
          <div className="skeleton w-12 h-12 rounded-xl flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  );
}