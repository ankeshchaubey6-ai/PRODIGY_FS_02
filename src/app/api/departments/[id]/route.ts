import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDepartmentById } from "@/features/departments/queries";
import {
  updateDepartment,
  deleteDepartment,
} from "@/features/departments/actions";
import { apiError, apiSuccess, HTTP_STATUS } from "@/types/api";

interface RouteParams {
  params: { id: string };
}

// ── GET /api/departments/[id] ─────────────────────────────
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        apiError("Unauthorized"),
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const department = await getDepartmentById(params.id);

    if (!department) {
      return NextResponse.json(
        apiError("Department not found"),
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return NextResponse.json(
      apiSuccess(department),
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error("[DEPARTMENT_GET]", error);
    return NextResponse.json(
      apiError("Failed to fetch department"),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// ── PATCH /api/departments/[id] ───────────────────────────
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        apiError("Unauthorized"),
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const body = await req.json();
    const result = await updateDepartment(params.id, body);

    if (!result.success) {
      return NextResponse.json(
        apiError(
          result.error ?? "Failed to update department",
          result.details as Record<string, string[]>
        ),
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    return NextResponse.json(
      apiSuccess(result.data),
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error("[DEPARTMENT_PATCH]", error);
    return NextResponse.json(
      apiError("Failed to update department"),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// ── DELETE /api/departments/[id] ──────────────────────────
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        apiError("Unauthorized"),
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const result = await deleteDepartment(params.id);

    if (!result.success) {
      return NextResponse.json(
        apiError(result.error ?? "Failed to delete department"),
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    return NextResponse.json(
      apiSuccess({ id: params.id }),
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error("[DEPARTMENT_DELETE]", error);
    return NextResponse.json(
      apiError("Failed to delete department"),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}