import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDepartments } from "@/features/departments/queries";
import { createDepartment } from "@/features/departments/actions";
import { departmentFiltersSchema } from "@/lib/validations";
import { apiError, HTTP_STATUS } from "@/types/api";
import { isAuthEnabled } from "@/lib/auth-mode";

// ── GET /api/departments ──────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    if (isAuthEnabled()) {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json(
          apiError("Unauthorized"),
          { status: HTTP_STATUS.UNAUTHORIZED }
        );
      }
    }

    const { searchParams } = new URL(req.url);

    const parsed = departmentFiltersSchema.safeParse({
      search: searchParams.get("search") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        apiError("Invalid query parameters"),
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const result = await getDepartments(parsed.data);

    return NextResponse.json(
      {
        success: true,
        data: result.departments,
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
    console.error("[DEPARTMENTS_GET]", error);
    return NextResponse.json(
      apiError("Failed to fetch departments"),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// ── POST /api/departments ─────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    if (isAuthEnabled()) {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json(
          apiError("Unauthorized"),
          { status: HTTP_STATUS.UNAUTHORIZED }
        );
      }
    }

    const body = await req.json();
    const result = await createDepartment(body);

    if (!result.success) {
      return NextResponse.json(
        apiError(
          result.error ?? "Failed to create department",
          result.details as Record<string, string[]>
        ),
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    return NextResponse.json(
      { success: true, data: result.data },
      { status: HTTP_STATUS.CREATED }
    );
  } catch (error) {
    console.error("[DEPARTMENTS_POST]", error);
    return NextResponse.json(
      apiError("Failed to create department"),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}