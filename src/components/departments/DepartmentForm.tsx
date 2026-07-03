"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  createDepartmentSchema,
  type CreateDepartmentSchema,
} from "@/lib/validations";
import {
  createDepartment,
  updateDepartment,
} from "@/features/departments/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CHART_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { DepartmentWithCount } from "@/types/department";

interface DepartmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: DepartmentWithCount;
  onSuccess?: () => void;
  mode: "create" | "edit";
}

export function DepartmentForm({
  open,
  onOpenChange,
  department,
  onSuccess,
  mode,
}: DepartmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateDepartmentSchema>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues:
      mode === "edit" && department
        ? {
            name: department.name,
            description: department.description ?? "",
            color: department.color ?? "#6366f1",
          }
        : {
            color: "#6366f1",
          },
  });

  const selectedColor = watch("color");

  async function onSubmit(data: CreateDepartmentSchema) {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        const result = await createDepartment(data);
        if (!result.success) {
          toast.error(result.error ?? "Failed to create department");
          return;
        }
        toast.success(`${data.name} department created.`);
      } else if (department) {
        const result = await updateDepartment(department.id, data);
        if (!result.success) {
          toast.error(result.error ?? "Failed to update department");
          return;
        }
        toast.success(`${data.name} updated.`);
      }

      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose(open: boolean) {
    if (!isSubmitting) {
      onOpenChange(open);
      if (!open) reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-base">
            {mode === "create" ? "Create Department" : "Edit Department"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {mode === "create"
              ? "Add a new department to your organisation."
              : "Update the department details."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Department Name
              <span className="text-destructive ml-0.5">*</span>
            </Label>
            <Input
              {...register("name")}
              placeholder="e.g. Engineering"
              autoFocus
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Description</Label>
            <Textarea
              {...register("description")}
              placeholder="Brief description of this department..."
              rows={3}
              className="resize-none"
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Color picker */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Colour</Label>
            <div className="flex flex-wrap gap-2">
              {CHART_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue("color", color)}
                  className={cn(
                    "w-7 h-7 rounded-full border-2 transition-all",
                    selectedColor === color
                      ? "border-foreground scale-110 shadow-sm"
                      : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: color }}
                  aria-label={`Select colour ${color}`}
                />
              ))}
            </div>

            {/* Custom hex input */}
            <div className="flex items-center gap-2 mt-2">
              <div
                className="w-7 h-7 rounded-full border border-border flex-shrink-0"
                style={{ backgroundColor: selectedColor || "#6366f1" }}
              />
              <Input
                {...register("color")}
                placeholder="#6366f1"
                className="font-mono h-8 text-xs"
                maxLength={7}
              />
            </div>
            {errors.color && (
              <p className="text-xs text-destructive">
                {errors.color.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {mode === "create" ? "Creating..." : "Saving..."}
                </>
              ) : mode === "create" ? (
                "Create Department"
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}