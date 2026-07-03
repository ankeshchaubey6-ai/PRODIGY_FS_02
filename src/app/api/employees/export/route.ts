import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getEmployeesForExport } from "@/features/employees/queries";
import { formatDate } from "@/lib/utils";
import { HTTP_STATUS } from "@/types/api";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const { searchParams } = new URL(req.url);

    const employees = await getEmployeesForExport({
      search: searchParams.get("search") ?? undefined,
      departmentId: searchParams.get("departmentId") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      employmentType: searchParams.get("employmentType") ?? undefined,
    });

    // Build CSV content
    const headers = [
      "Employee ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Gender",
      "Date of Birth",
      "Department",
      "Designation",
      "Employment Type",
      "Status",
      "Joining Date",
      "Salary (INR)",
      "Manager",
      "Address",
      "Notes",
      "Created At",
    ];

    const escape = (val: string | null | undefined): string => {
      if (val === null || val === undefined) return "";
      const str = String(val);
      // Wrap in quotes if contains comma, quote, or newline
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = employees.map((emp) => [
      escape(emp.employeeId),
      escape(emp.firstName),
      escape(emp.lastName),
      escape(emp.email),
      escape(emp.phone),
      escape(emp.gender),
      escape(emp.dob ? formatDate(emp.dob) : ""),
      escape(emp.department.name),
      escape(emp.designation),
      escape(emp.employmentType.replace("_", " ")),
      escape(emp.status.replace("_", " ")),
      escape(formatDate(emp.joiningDate)),
      escape(emp.salary.toString()),
      escape(
        emp.manager
          ? `${emp.manager.firstName} ${emp.manager.lastName}`
          : ""
      ),
      escape(emp.address),
      escape(emp.notes),
      escape(formatDate(emp.createdAt)),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const filename = `employees-export-${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[EMPLOYEES_EXPORT]", error);
    return new NextResponse("Failed to export employees", {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    });
  }
}