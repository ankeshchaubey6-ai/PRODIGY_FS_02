"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
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

interface DepartmentCardProps {
  department: DepartmentWithCount;
  onRefetch: () => void;
}

export function DepartmentCard({
  department,
  onRefetch,
}: DepartmentCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const employeeCount = department._count.employees;

  return (
    <>
      <div className="bg-card border border-border rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-200 overflow-hidden group">
        {/* Colour bar */}
        <div
          className="h-1.5 w-full"
          style={{ backgroundColor: department.color ?? "#6366f1" }}
        />

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            {/* Icon + name */}
            <div className="flex items-start gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  backgroundColor: `${department.color ?? "#6366f1"}20`,
                }}
              >
                <span
                  className="text-lg font-bold"
                  style={{ color: department.color ?? "#6366f1" }}
                >
                  {department.name.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {department.name}
                </h3>
                {department.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate-2 leading-relaxed">
                    {department.description}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Department actions"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem asChild>
                  <Link href={`/departments/${department.id}`}>
                    <Eye className="w-3.5 h-3.5 mr-2" />
                    View details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="w-3.5 h-3.5 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Employee count */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs">
                {employeeCount}{" "}
                {employeeCount === 1 ? "employee" : "employees"}
              </span>
            </div>

            <Link
              href={`/departments/${department.id}`}
              className={cn(
                "ml-auto text-xs font-medium transition-colors",
                "text-primary hover:text-primary/80"
              )}
            >
              View all →
            </Link>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <DepartmentForm
        open={editOpen}
        onOpenChange={setEditOpen}
        department={department}
        mode="edit"
        onSuccess={onRefetch}
      />

      {/* Delete modal */}
      <DeleteDepartmentDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        departmentId={department.id}
        departmentName={department.name}
        employeeCount={employeeCount}
        onSuccess={onRefetch}
      />
    </>
  );
}