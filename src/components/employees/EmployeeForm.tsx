"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  createEmployeeSchema,
  type CreateEmployeeSchema,
} from "@/lib/validations";
import { createEmployee, updateEmployee, getNextEmployeeId } from "@/features/employees/actions";
import { EMPLOYMENT_TYPE_OPTIONS, GENDER_OPTIONS, STATUS_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { EmployeeDetail } from "@/types/employee";
import type { DepartmentWithCount } from "@/types/department";

interface EmployeeFormProps {
  employee?: EmployeeDetail;
  departments: DepartmentWithCount[];
  managers: {
    id: string;
    firstName: string;
    lastName: string;
    designation: string;
  }[];
  mode: "create" | "edit";
}

function FormField({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function EmployeeForm({
  employee,
  departments,
  managers,
  mode,
}: EmployeeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateEmployeeSchema>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues:
      mode === "edit" && employee
        ? {
            employeeId: employee.employeeId,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            phone: employee.phone ?? "",
            dob: employee.dob
              ? new Date(employee.dob).toISOString().split("T")[0]
              : "",
            gender: employee.gender ?? undefined,
            profileImage: employee.profileImage ?? "",
            departmentId: employee.departmentId,
            designation: employee.designation,
            joiningDate: new Date(employee.joiningDate)
              .toISOString()
              .split("T")[0],
            salary: Number(employee.salary),
            employmentType: employee.employmentType,
            status: employee.status,
            managerId: employee.managerId ?? "",
            address: employee.address ?? "",
            emergencyContact: (employee.emergencyContact as {
              name: string;
              phone: string;
              relation: string;
            }) ?? undefined,
            notes: employee.notes ?? "",
          }
        : {
            status: "ACTIVE",
            employmentType: "FULL_TIME",
          },
  });

  // Auto-fill employee ID on create mode
  useEffect(() => {
    if (mode === "create") {
      getNextEmployeeId().then((id) => setValue("employeeId", id));
    }
  }, [mode, setValue]);

  async function onSubmit(data: CreateEmployeeSchema) {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        const result = await createEmployee(data);
        if (!result.success) {
          toast.error(result.error ?? "Failed to create employee");
          return;
        }
        toast.success("Employee added successfully.");
        router.push("/employees");
      } else if (employee) {
        const result = await updateEmployee(employee.id, data);
        if (!result.success) {
          toast.error(result.error ?? "Failed to update employee");
          return;
        }
        toast.success("Employee updated successfully.");
        router.push(`/employees/${employee.id}`);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* ── Personal Information ─────────────────── */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Personal Information
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Basic details about the employee.
          </p>
        </div>
        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField
            label="Employee ID"
            error={errors.employeeId?.message}
            required
          >
            <Input
              {...register("employeeId")}
              placeholder="EMP-0001"
              className="font-mono"
            />
          </FormField>

          <FormField label="Profile Image URL" error={errors.profileImage?.message}>
            <Input
              {...register("profileImage")}
              placeholder="https://example.com/avatar.jpg"
              type="url"
            />
          </FormField>

          <FormField
            label="First Name"
            error={errors.firstName?.message}
            required
          >
            <Input {...register("firstName")} placeholder="Arjun" />
          </FormField>

          <FormField
            label="Last Name"
            error={errors.lastName?.message}
            required
          >
            <Input {...register("lastName")} placeholder="Sharma" />
          </FormField>

          <FormField
            label="Email Address"
            error={errors.email?.message}
            required
          >
            <Input
              {...register("email")}
              type="email"
              placeholder="arjun.sharma@company.com"
            />
          </FormField>

          <FormField label="Phone Number" error={errors.phone?.message}>
            <Input
              {...register("phone")}
              type="tel"
              placeholder="+91 98765 43210"
            />
          </FormField>

          <FormField label="Date of Birth" error={errors.dob?.message}>
            <Input {...register("dob")} type="date" />
          </FormField>

          <FormField label="Gender" error={errors.gender?.message}>
            <Select
              value={watch("gender")}
              onValueChange={(v) =>
                setValue("gender", v as CreateEmployeeSchema["gender"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {GENDER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <FormField label="Address" error={errors.address?.message}>
          <Textarea
            {...register("address")}
            placeholder="42, MG Road, Bengaluru, Karnataka 560001"
            rows={2}
            className="resize-none"
          />
        </FormField>
      </section>

      {/* ── Job Information ──────────────────────── */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Job Information
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Role, department, and employment details.
          </p>
        </div>
        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField
            label="Department"
            error={errors.departmentId?.message}
            required
          >
            <Select
              value={watch("departmentId")}
              onValueChange={(v) => setValue("departmentId", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Designation"
            error={errors.designation?.message}
            required
          >
            <Input
              {...register("designation")}
              placeholder="Senior Software Engineer"
            />
          </FormField>

          <FormField
            label="Employment Type"
            error={errors.employmentType?.message}
            required
          >
            <Select
              value={watch("employmentType")}
              onValueChange={(v) =>
                setValue(
                  "employmentType",
                  v as CreateEmployeeSchema["employmentType"]
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Status" error={errors.status?.message} required>
            <Select
              value={watch("status")}
              onValueChange={(v) =>
                setValue("status", v as CreateEmployeeSchema["status"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Joining Date"
            error={errors.joiningDate?.message}
            required
          >
            <Input {...register("joiningDate")} type="date" />
          </FormField>

          <FormField label="Annual Salary (₹)" error={errors.salary?.message} required>
            <Input
              type="number"
              placeholder="1200000"
              min={0}
              onChange={(e) =>
                setValue("salary", parseFloat(e.target.value) || 0)
              }
              defaultValue={
                mode === "edit" && employee
                  ? Number(employee.salary)
                  : undefined
              }
            />
          </FormField>

          <FormField label="Reporting Manager" error={errors.managerId?.message}>
            <Select
              value={watch("managerId") ?? ""}
              onValueChange={(v) => setValue("managerId", v === "none" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No manager</SelectItem>
                {managers
                  .filter((m) => m.id !== employee?.id)
                  .map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.firstName} {m.lastName} — {m.designation}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </section>

      {/* ── Emergency Contact ────────────────────── */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Emergency Contact
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Contact person in case of emergency.
          </p>
        </div>
        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <FormField
            label="Contact Name"
            error={errors.emergencyContact?.name?.message}
          >
            <Input
              {...register("emergencyContact.name")}
              placeholder="Priya Sharma"
            />
          </FormField>

          <FormField
            label="Contact Phone"
            error={errors.emergencyContact?.phone?.message}
          >
            <Input
              {...register("emergencyContact.phone")}
              placeholder="+91 98765 11111"
            />
          </FormField>

          <FormField
            label="Relation"
            error={errors.emergencyContact?.relation?.message}
          >
            <Input
              {...register("emergencyContact.relation")}
              placeholder="Spouse"
            />
          </FormField>
        </div>
      </section>

      {/* ── Notes ───────────────────────────────── */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Notes</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Any additional notes about this employee.
          </p>
        </div>
        <Separator />

        <FormField label="Internal Notes" error={errors.notes?.message}>
          <Textarea
            {...register("notes")}
            placeholder="Any relevant notes about this employee..."
            rows={3}
            className="resize-none"
          />
        </FormField>
      </section>

      {/* ── Form Actions ─────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pb-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {mode === "create" ? "Adding..." : "Saving..."}
            </>
          ) : mode === "create" ? (
            "Add Employee"
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}