"use client";

import Link from "next/link";
import { Plus, Download } from "lucide-react";
import { useEmployees } from "@/hooks/useEmployees";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { EmployeeTableSkeleton } from "@/components/employees/EmployeeTableSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS, EMPLOYMENT_TYPE_OPTIONS, PAGE_SIZE_OPTIONS } from "@/lib/constants";
import { buildQueryString } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useDepartments } from "@/hooks/useDepartments";
import { useDebounce } from "@/hooks/useDebounce";
import type { EmployeeFilters } from "@/types/employee";

export default function EmployeesPage() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 350);

  const {
    employees,
    pagination,
    isLoading,
    error,
    refetch,
    setFilters,
    filters,
  } = useEmployees();

  const { departments } = useDepartments();

  // Apply debounced search
  useEffect(() => {
    setFilters({ search: debouncedSearch || undefined, page: 1 });
  }, [debouncedSearch, setFilters]);

  function handleSortChange(sortBy: NonNullable<EmployeeFilters["sortBy"]>) {
    setFilters({
      sortBy,
      sortOrder:
        filters.sortBy === sortBy && filters.sortOrder === "desc"
          ? "asc"
          : "desc",
    });
  }

  function handleExport() {
    const qs = buildQueryString({
      search: filters.search,
      departmentId: filters.departmentId,
      status: filters.status,
      employmentType: filters.employmentType,
    });
    window.open(`/api/employees/export${qs}`, "_blank");
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load employees"
        description={error}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Employees"
        description={
          pagination
            ? `${pagination.total} employee${pagination.total !== 1 ? "s" : ""} total`
            : "Manage your team"
        }
      >
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
        <Button asChild size="sm" className="gap-2">
          <Link href="/employees/new">
            <Plus className="w-4 h-4" />
            Add Employee
          </Link>
        </Button>
      </PageHeader>

      {/* ── Filters ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by name, email, ID..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="sm:max-w-xs h-9"
        />

        <div className="flex gap-2 flex-wrap">
          <Select
            value={filters.departmentId ?? "all"}
            onValueChange={(v) =>
              setFilters({ departmentId: v === "all" ? undefined : v, page: 1 })
            }
          >
            <SelectTrigger className="h-9 w-[160px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.status ?? "all"}
            onValueChange={(v) =>
              setFilters({ status: v === "all" ? undefined : (v as typeof filters.status), page: 1 })
            }
          >
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.employmentType ?? "all"}
            onValueChange={(v) =>
              setFilters({ employmentType: v === "all" ? undefined : (v as typeof filters.employmentType), page: 1 })
            }
          >
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Table ───────────────────────────────── */}
      {isLoading ? (
        <EmployeeTableSkeleton />
      ) : (
        <EmployeeTable
          employees={employees}
          filters={filters}
          onSortChange={handleSortChange}
          onRefetch={refetch}
        />
      )}

      {/* ── Pagination ──────────────────────────── */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {(pagination.page - 1) * pagination.limit + 1}–
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {pagination.total}
            </span>
          </p>

          <div className="flex items-center gap-2">
            <Select
              value={String(filters.limit ?? 10)}
              onValueChange={(v) =>
                setFilters({ limit: Number(v), page: 1 })
              }
            >
              <SelectTrigger className="h-8 w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3"
                disabled={!pagination.hasPrevPage}
                onClick={() => setFilters({ page: pagination.page - 1 })}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3"
                disabled={!pagination.hasNextPage}
                onClick={() => setFilters({ page: pagination.page + 1 })}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
