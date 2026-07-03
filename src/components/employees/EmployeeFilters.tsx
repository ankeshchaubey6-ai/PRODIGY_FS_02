"use client";

import { useState } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  STATUS_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  GENDER_OPTIONS,
} from "@/lib/constants";
import type { DepartmentWithCount } from "@/types/department";
import type { EmployeeFilters as Filters } from "@/types/employee";

interface EmployeeFiltersProps {
  filters: Filters;
  departments: DepartmentWithCount[];
  onFiltersChange: (filters: Partial<Filters>) => void;
  onClearFilters: () => void;
}

export function EmployeeFilters({
  filters,
  departments,
  onFiltersChange,
  onClearFilters,
}: EmployeeFiltersProps) {
  const [open, setOpen] = useState(false);

  // Count how many filters are active
  const activeCount = [
    filters.departmentId,
    filters.status,
    filters.employmentType,
    filters.gender,
  ].filter(Boolean).length;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeCount > 0 && (
            <Badge
              variant="default"
              className="h-4 w-4 p-0 text-[10px] flex items-center justify-center rounded-full"
            >
              {activeCount}
            </Badge>
          )}
          <ChevronDown className="w-3 h-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[260px] p-3"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex items-center justify-between mb-3">
          <DropdownMenuLabel className="p-0 text-sm font-semibold">
            Filter Employees
          </DropdownMenuLabel>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                onClearFilters();
                setOpen(false);
              }}
            >
              <X className="w-3 h-3 mr-1" />
              Clear all
            </Button>
          )}
        </div>

        <DropdownMenuSeparator className="mb-3" />

        <div className="space-y-3">
          {/* Department */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Department
            </label>
            <Select
              value={filters.departmentId ?? "all"}
              onValueChange={(v) =>
                onFiltersChange({
                  departmentId: v === "all" ? undefined : v,
                  page: 1,
                })
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: d.color ?? "#6366f1" }}
                      />
                      {d.name}
                      <span className="text-muted-foreground ml-auto">
                        {d._count.employees}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Status
            </label>
            <Select
              value={filters.status ?? "all"}
              onValueChange={(v) =>
                onFiltersChange({
                  status: v === "all" ? undefined : (v as Filters["status"]),
                  page: 1,
                })
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Employment type */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Employment Type
            </label>
            <Select
              value={filters.employmentType ?? "all"}
              onValueChange={(v) =>
                onFiltersChange({
                  employmentType:
                    v === "all"
                      ? undefined
                      : (v as Filters["employmentType"]),
                  page: 1,
                })
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Gender
            </label>
            <Select
              value={filters.gender ?? "all"}
              onValueChange={(v) =>
                onFiltersChange({
                  gender:
                    v === "all" ? undefined : (v as Filters["gender"]),
                  page: 1,
                })
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All genders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All genders</SelectItem>
                {GENDER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Apply button */}
        <div className="mt-4 pt-3 border-t border-border">
          <Button
            size="sm"
            className="w-full h-8"
            onClick={() => setOpen(false)}
          >
            Apply Filters
            {activeCount > 0 && (
              <span className="ml-2 opacity-70">({activeCount} active)</span>
            )}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}