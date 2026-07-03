import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getEmployees } from "@/features/employees/queries";
import { createEmployee } from "@/features/employees/actions";
import { employeeFiltersSchema } from "@/lib/validations";
import { apiError, HTTP_STATUS } from "@/types/api";

// ── GET /api/employees ────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        apiError("Unauthorized"),
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const { searchParams } = new URL(req.url);

    const parsed = employeeFiltersSchema.safeParse({
      search: searchParams.get("search") ?? undefined,
      departmentId: searchParams.get("departmentId") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      employmentType: searchParams.get("employmentType") ?? undefined,
      gender: searchParams.get("gender") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      sortBy: searchParams.get("sortBy") ?? undefined,
      sortOrder: searchParams.get("sortOrder") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        apiError("Invalid query parameters", parsed.error.flatten().fieldErrors),
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const result = await getEmployees(parsed.data);

    return NextResponse.json(
      {
        success: true,
        data: result.employees,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
          hasNextPage: result.page < result.totalPages,
          hasPrevPage: result.page > 1,
        },
      },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error("[EMPLOYEES_GET]", error);
    return NextResponse.json(
      apiError("Failed to fetch employees"),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// ── POST /api/employees ───────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        apiError("Unauthorized"),
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const body = await req.json();
    const result = await createEmployee(body);

    if (!result.success) {
      return NextResponse.json(
        apiError(result.error ?? "Failed to create employee", result.details as Record<string, string[]>),
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    return NextResponse.json(
      { success: true, data: result.data },
      { status: HTTP_STATUS.CREATED }
    );
  } catch (error) {
    console.error("[EMPLOYEES_POST]", error);
    return NextResponse.json(
      apiError("Failed to create employee"),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}