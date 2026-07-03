import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getEmployeeStats } from "@/features/employees/queries";
import { apiSuccess, apiError, HTTP_STATUS } from "@/types/api";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        apiError("Unauthorized"),
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const stats = await getEmployeeStats();
    return NextResponse.json(apiSuccess(stats), { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error("[EMPLOYEE_STATS_GET]", error);
    return NextResponse.json(
      apiError("Failed to fetch employee statistics"),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}