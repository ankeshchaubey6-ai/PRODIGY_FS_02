"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2, Eye, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DepartmentForm } from "./DepartmentForm";
import { DeleteDepartmentDialog } from "./DeleteDepartmentDialog";
import type { DepartmentWithCount } from "@/types/department";

interface DepartmentTableProps {
  departments: DepartmentWithCount[];
  onRefetch: () => void;
}

export function DepartmentTable({
  departments,
  onRefetch,
}: DepartmentTableProps) {
  const [editDept, setEditDept] = useState<DepartmentWithCount | null>(null);
  const [deleteDept, setDeleteDept] = useState<DepartmentWithCount | null>(
    null
  );

  if (departments.length === 0) {
    return (
      <div className="border border-border rounded-xl bg-card shadow-card">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Users className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">
            No departments yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Create your first department to start organising your team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border border-border rounded-xl overflow-hidden bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    Department
                  </span>
                </th>
                <th className="text-left px-4 py-3 hidden md:table-cell">
                  <span className="text-xs font-medium text-muted-foreground">
                    Description
                  </span>
                </th>
                <th className="text-left px-4 py-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    Employees
                  </span>
                </th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">
                  <span className="text-xs font-medium text-muted-foreground">
                    Created
                  </span>
                </th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>

            <tbody>
              {departments.map((dept) => (
                <tr
                  key={dept.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group"
                >
                  {/* Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: `${dept.color ?? "#6366f1"}20`,
                        }}
                      >
                        <span
                          className="text-sm font-bold"
                          style={{ color: dept.color ?? "#6366f1" }}
                        >
                          {dept.name.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {dept.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: dept.color ?? "#6366f1",
                            }}
                          />
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {dept.color ?? "#6366f1"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-sm text-muted-foreground truncate max-w-[240px]">
                      {dept.description ?? "—"}
                    </p>
                  </td>

                  {/* Employee count */}
                  <td className="px-4 py-3">
                    <Link
                      href={`/departments/${dept.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      {dept._count.employees}
                    </Link>
                  </td>

                  {/* Created */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(dept.createdAt)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Department actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem asChild>
                          <Link href={`/departments/${dept.id}`}>
                            <Eye className="w-3.5 h-3.5 mr-2" />
                            View details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setEditDept(dept)}
                          className="cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive cursor-pointer"
                          onClick={() => setDeleteDept(dept)}
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

      {/* Edit modal */}
      {editDept && (
        <DepartmentForm
          open={!!editDept}
          onOpenChange={(open) => !open && setEditDept(null)}
          department={editDept}
          mode="edit"
          onSuccess={() => {
            setEditDept(null);
            onRefetch();
          }}
        />
      )}

      {/* Delete modal */}
      {deleteDept && (
        <DeleteDepartmentDialog
          open={!!deleteDept}
          onOpenChange={(open) => !open && setDeleteDept(null)}
          departmentId={deleteDept.id}
          departmentName={deleteDept.name}
          employeeCount={deleteDept._count.employees}
          onSuccess={() => {
            setDeleteDept(null);
            onRefetch();
          }}
        />
      )}
    </>
  );
}