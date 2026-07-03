"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteDepartment } from "@/features/departments/actions";

interface DeleteDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentId: string;
  departmentName: string;
  employeeCount: number;
  onSuccess?: () => void;
}

export function DeleteDepartmentDialog({
  open,
  onOpenChange,
  departmentId,
  departmentName,
  employeeCount,
  onSuccess,
}: DeleteDepartmentDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const hasEmployees = employeeCount > 0;

  async function handleDelete() {
    if (hasEmployees) return;
    setIsDeleting(true);
    try {
      const result = await deleteDepartment(departmentId);
      if (!result.success) {
        toast.error(result.error ?? "Failed to delete department");
        return;
      }
      toast.success(`${departmentName} has been removed.`);
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <DialogTitle className="text-base">Remove Department</DialogTitle>
          </div>
          <DialogDescription className="text-sm leading-relaxed">
            {hasEmployees ? (
              <>
                <span className="font-semibold text-foreground">
                  {departmentName}
                </span>{" "}
                cannot be deleted because it has{" "}
                <span className="font-semibold text-foreground">
                  {employeeCount} employee
                  {employeeCount !== 1 ? "s" : ""}
                </span>
                . Reassign or remove all employees from this department before
                deleting it.
              </>
            ) : (
              <>
                Are you sure you want to remove{" "}
                <span className="font-semibold text-foreground">
                  {departmentName}
                </span>
                ? This action cannot be undone.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2 mt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="flex-1 sm:flex-none"
          >
            {hasEmployees ? "Close" : "Cancel"}
          </Button>
          {!hasEmployees && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 sm:flex-none gap-2"
            >
              {isDeleting ? (
                <>
                  <span className="w-4 h-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Remove Department
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}