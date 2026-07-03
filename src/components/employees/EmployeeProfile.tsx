import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  User,
  IndianRupee,
  Pencil,
  AlertCircle,
} from "lucide-react";
import { formatDate, formatCurrency, cn } from "@/lib/utils";
import { EMPLOYMENT_TYPE_CONFIG } from "@/lib/constants";
import { EmployeeAvatar } from "./EmployeeAvatar";
import { EmployeeStatusBadge } from "./EmployeeStatusBadge";
import { EmployeeTimeline } from "./EmployeeTimeline";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EmployeeDetail } from "@/types/employee";
import type { EmergencyContact } from "@/types/employee";

interface EmployeeProfileProps {
  employee: EmployeeDetail;
}

function InfoRow({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
  className?: string;
}) {
  if (!value) return null;
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground mt-0.5 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

export function EmployeeProfile({ employee }: EmployeeProfileProps) {
  const emergencyContact = employee.emergencyContact as EmergencyContact | null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ── Left column ─────────────────────────── */}
      <div className="lg:col-span-1 space-y-4">
        {/* Profile card */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <EmployeeAvatar
                firstName={employee.firstName}
                lastName={employee.lastName}
                profileImage={employee.profileImage}
                size="xl"
                className="mb-4"
              />
              <h2 className="text-lg font-semibold text-foreground">
                {employee.firstName} {employee.lastName}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {employee.designation}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                {employee.employeeId}
              </p>
              <div className="mt-3">
                <EmployeeStatusBadge status={employee.status} />
              </div>

              <Separator className="my-4" />

              {/* Department badge */}
              <div className="flex items-center gap-2 text-sm">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: employee.department.color ?? "#6366f1",
                  }}
                />
                <span className="text-muted-foreground">
                  {employee.department.name}
                </span>
              </div>

              <Button asChild className="w-full mt-4" variant="outline" size="sm">
                <Link href={`/employees/${employee.id}/edit`}>
                  <Pencil className="w-3.5 h-3.5 mr-2" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Timeline card */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Timeline</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <EmployeeTimeline employee={employee} />
          </CardContent>
        </Card>

        {/* Emergency contact */}
        {emergencyContact && (
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <InfoRow
                icon={User}
                label="Name"
                value={emergencyContact.name}
              />
              <InfoRow
                icon={Phone}
                label="Phone"
                value={emergencyContact.phone}
              />
              <InfoRow
                icon={Briefcase}
                label="Relation"
                value={emergencyContact.relation}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── Right column ─────────────────────────── */}
      <div className="lg:col-span-2 space-y-4">
        {/* Contact information */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={Mail} label="Email" value={employee.email} />
              <InfoRow icon={Phone} label="Phone" value={employee.phone} />
              <InfoRow
                icon={MapPin}
                label="Address"
                value={employee.address}
                className="sm:col-span-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Employment details */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Employment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow
                icon={Building2}
                label="Department"
                value={employee.department.name}
              />
              <InfoRow
                icon={Briefcase}
                label="Designation"
                value={employee.designation}
              />
              <InfoRow
                icon={Calendar}
                label="Joining Date"
                value={formatDate(employee.joiningDate)}
              />
              <InfoRow
                icon={Briefcase}
                label="Employment Type"
                value={EMPLOYMENT_TYPE_CONFIG[employee.employmentType].label}
              />
              <InfoRow
                icon={IndianRupee}
                label="Annual Salary"
                value={formatCurrency(Number(employee.salary))}
              />
              {employee.manager && (
                <InfoRow
                  icon={User}
                  label="Reporting Manager"
                  value={`${employee.manager.firstName} ${employee.manager.lastName}`}
                />
              )}
              {employee.dob && (
                <InfoRow
                  icon={Calendar}
                  label="Date of Birth"
                  value={formatDate(employee.dob)}
                />
              )}
              {employee.gender && (
                <InfoRow
                  icon={User}
                  label="Gender"
                  value={
                    employee.gender.charAt(0) +
                    employee.gender.slice(1).toLowerCase()
                  }
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subordinates */}
        {employee.subordinates.length > 0 && (
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                Direct Reports ({employee.subordinates.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {employee.subordinates.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/employees/${sub.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <EmployeeAvatar
                      firstName={sub.firstName}
                      lastName={sub.lastName}
                      profileImage={sub.profileImage}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {sub.firstName} {sub.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {sub.designation}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {employee.notes && (
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Notes</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {employee.notes}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}