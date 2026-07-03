"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, LayoutGrid, List } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { DepartmentCard } from "@/components/departments/DepartmentCard";
import { DepartmentTable } from "@/components/departments/DepartmentTable";
import { DepartmentForm } from "@/components/departments/DepartmentForm";
import { SearchInput } from "@/components/shared/SearchInput";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { DepartmentWithCount } from "@/types/department";
import { Skeleton } from "@/components/ui/skeleton";

function DepartmentCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="h-1.5 w-full bg-muted" />
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <div className="pt-4 border-t border-border flex items-center justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [viewMode, setViewMode] = useLocalStorage<"grid" | "table">(
    "dept-view-mode",
    "grid"
  );

  const debouncedSearch = useDebounce(searchInput, 350);

  const fetchDepartments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const qs = debouncedSearch
        ? `?search=${encodeURIComponent(debouncedSearch)}&limit=100`
        : "?limit=100";
      const res = await fetch(`/api/departments${qs}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch departments");
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setDepartments(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  if (error) {
    return (
      <ErrorState
        title="Failed to load departments"
        description={error}
        onRetry={fetchDepartments}
      />
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Departments"
        description={
          isLoading
            ? "Loading..."
            : `${departments.length} department${departments.length !== 1 ? "s" : ""}`
        }
      >
        <Button
          size="sm"
          className="gap-2"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="w-4 h-4" />
          New Department
        </Button>
      </PageHeader>

      {/* ── Toolbar ──────────────────────────────── */}
      <div className="flex items-center gap-3">
        <SearchInput
          value={searchInput}
          onChange={setSearchInput}
          placeholder="Search departments..."
          className="sm:max-w-xs"
        />

        {/* View toggle */}
        <div className="flex items-center gap-1 border border-border rounded-lg p-1 ml-auto">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant={viewMode === "table" ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => setViewMode("table")}
            aria-label="Table view"
          >
            <List className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Content ──────────────────────────────── */}
      {isLoading ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <DepartmentCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden bg-card shadow-card">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center px-4 h-[60px] border-b border-border last:border-0 gap-4"
              >
                <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-48 hidden md:block" />
                <Skeleton className="h-3 w-8 ml-auto" />
              </div>
            ))}
          </div>
        )
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {departments.map((dept) => (
            <DepartmentCard
              key={dept.id}
              department={dept}
              onRefetch={fetchDepartments}
            />
          ))}
          {departments.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm font-medium text-foreground mb-1">
                No departments found
              </p>
              <p className="text-xs text-muted-foreground">
                {debouncedSearch
                  ? "Try a different search term."
                  : "Create your first department to get started."}
              </p>
            </div>
          )}
        </div>
      ) : (
        <DepartmentTable
          departments={departments}
          onRefetch={fetchDepartments}
        />
      )}

      {/* Create modal */}
      <DepartmentForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        onSuccess={fetchDepartments}
      />
    </div>
  );
}