import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDashboardData } from "@/features/dashboard/queries";
import { apiSuccess, apiError, HTTP_STATUS } from "@/types/api";
import { isAuthEnabled } from "@/lib/auth-mode";

export async function GET() {
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

    const data = await getDashboardData();
    return NextResponse.json(apiSuccess(data), { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error("[DASHBOARD_GET]", error);
    return NextResponse.json(
      apiError("Failed to fetch dashboard data"),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
