"use client";

import { cn } from "@/lib/utils";
import { SortButton } from "./SortButton";

// ── Column definition ─────────────────────────────────────
export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  render: (row: T) => React.ReactNode;
  hideBelow?: "sm" | "md" | "lg" | "xl";
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSortChange?: (field: string) => void;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
  stickyHeader?: boolean;
}

const hideMap: Record<string, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
};

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  sortBy,
  sortOrder,
  onSortChange,
  onRowClick,
  emptyState,
  className,
  stickyHeader,
}: DataTableProps<T>) {
  return (
    <div className={cn("table-container", className)}>
      <div className="overflow-x-auto">
        <table className="table-interactive">
          {/* ── Header ─────────────────────────────── */}
          <thead>
            <tr
              className={cn(
                "border-b border-border bg-muted/40",
                stickyHeader && "sticky top-0 z-10"
              )}
            >
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "text-left px-4 py-3",
                    col.hideBelow && hideMap[col.hideBelow],
                    col.headerClassName
                  )}
                >
                  {col.sortable && onSortChange ? (
                    <SortButton
                      label={col.label}
                      field={col.key}
                      currentSortBy={sortBy}
                      currentSortOrder={sortOrder}
                      onSort={onSortChange}
                    />
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground">
                      {col.label}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* ── Body ───────────────────────────────── */}
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  {emptyState ?? (
                    <div className="text-center py-12 text-sm text-muted-foreground">
                      No data found.
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-b border-border last:border-0 transition-colors",
                    onRowClick &&
                      "hover:bg-muted/30 cursor-pointer"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3",
                        col.hideBelow && hideMap[col.hideBelow],
                        col.className
                      )}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}