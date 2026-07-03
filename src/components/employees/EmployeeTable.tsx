"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Mail,
  Phone,
} from "lucide-react";
import { formatDate, formatCurrency, cn } from "@/lib/utils";
import { EMPLOYMENT_TYPE_CONFIG } from "@/lib/constants";
import { EmployeeAvatar } from "./EmployeeAvatar";
import { EmployeeStatusBadge } from "./EmployeeStatusBadge";
import { DeleteEmployeeDialog } from "./DeleteEmployeeDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { EmployeeListItem, EmployeeFilters } from "@/types/employee";

interface EmployeeTableProps {
  employees: EmployeeListItem[];
  filters: EmployeeFilters;
  onSortChange: (sortBy: NonNullable<EmployeeFilters["sortBy"]>) => void;
  onRefetch: () => void;
}

interface SortHeaderProps {
  label: string;
  field: NonNullable<EmployeeFilters["sortBy"]>;
  currentSortBy?: string;
  currentSortOrder?: "asc" | "desc";
  onSort: (field: NonNullable<EmployeeFilters["sortBy"]>) => void;
  className?: string;
}

function SortHeader({
  label,
  field,
  currentSortBy,
  currentSortOrder,
  onSort,
  className,
}: SortHeaderProps) {
  const isActive = currentSortBy === field;

  return (
    <button
      onClick={() => onSort(field)}
      className={cn(
        "flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group",
        isActive && "text-foreground",
        className
      )}
    >
      {label}
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
        {isActive ? (
          currentSortOrder === "asc" ? (
            <ArrowUp className="w-3 h-3" />
          ) : (
            <ArrowDown className="w-3 h-3" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3" />
        )}
      </span>
      {isActive && (
        <span className="opacity-100">
          {currentSortOrder === "asc" ? (
            <ArrowUp className="w-3 h-3" />
          ) : (
            <ArrowDown className="w-3 h-3" />
          )}
        </span>
      )}
    </button>
  );
}

export function EmployeeTable({
  employees,
  filters,
  onSortChange,
  onRefetch,
}: EmployeeTableProps) {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string;
    name: string;
  }>({ open: false, id: "", name: "" });

  function handleSort(field: NonNullable<EmployeeFilters["sortBy"]>) {
    if (filters.sortBy === field) {
      onSortChange(field);
    } else {
      onSortChange(field);
    }
  }

  function openDeleteDialog(employee: EmployeeListItem) {
    setDeleteDialog({
      open: true,
      id: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
    });
  }

  if (employees.length === 0) {
    return (
      <div className="border border-border rounded-xl bg-card shadow-card">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Mail className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">
            No employees found
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Try adjusting your search or filters, or add your first employee.
          </p>
          <Button asChild size="sm">
            <Link href="/employees/new">Add Employee</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border border-border rounded-xl overflow-hidden bg-card shadow-card">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 w-[280px]">
                  <SortHeader
                    label="Employee"
                    field="firstName"
                    currentSortBy={filters.sortBy as string}
                    currentSortOrder={filters.sortOrder}
                    onSort={handleSort}
                  />
                </th>
                <th className="text-left px-4 py-3 hidden md:table-cell">
                  <span className="text-xs font-medium text-muted-foreground">
                    Department
                  </span>
                </th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">
                  <span className="text-xs font-medium text-muted-foreground">
                    Status
                  </span>
                </th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">
                  <span className="text-xs font-medium text-muted-foreground">
                    Type
                  </span>
                </th>
                <th className="text-left px-4 py-3 hidden xl:table-cell">
                  <SortHeader
                    label="Joined"
                    field="joiningDate"
                    currentSortBy={filters.sortBy as string}
                    currentSortOrder={filters.sortOrder}
                    onSort={handleSort}
                  />
                </th>
                <th className="text-left px-4 py-3 hidden xl:table-cell">
                  <SortHeader
                    label="Salary"
                    field="salary"
                    currentSortBy={filters.sortBy as string}
                    currentSortOrder={filters.sortOrder}
                    onSort={handleSort}
                  />
                </th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {employees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group cursor-pointer"
                  onClick={() => router.push(`/employees/${employee.id}`)}
                >
                  {/* Employee info */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <EmployeeAvatar
                        firstName={employee.firstName}
                        lastName={employee.lastName}
                        profileImage={employee.profileImage}
                        size="sm"
                        className="flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {employee.designation}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 truncate md:hidden">
                          {employee.department.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            employee.department.color ?? "#6366f1",
                        }}
                      />
                      <span className="text-sm text-foreground truncate max-w-[140px]">
                        {employee.department.name}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <EmployeeStatusBadge status={employee.status} />
                  </td>

                  {/* Employment type */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {EMPLOYMENT_TYPE_CONFIG[employee.employmentType].label}
                    </span>
                  </td>

                  {/* Joining date */}
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(employee.joiningDate)}
                    </span>
                  </td>

                  {/* Salary */}
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <span className="text-xs font-medium text-foreground">
                      {formatCurrency(Number(employee.salary))}
                    </span>
                  </td>

                  {/* Actions */}
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Employee actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/employees/${employee.id}`}
                            className="cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 mr-2" />
                            View profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/employees/${employee.id}/edit`}
                            className="cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive cursor-pointer"
                          onClick={() => openDeleteDialog(employee)}
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete dialog */}
      <DeleteEmployeeDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog((prev) => ({ ...prev, open }))
        }
        employeeId={deleteDialog.id}
        employeeName={deleteDialog.name}
        onSuccess={onRefetch}
      />
    </>
  );
}
