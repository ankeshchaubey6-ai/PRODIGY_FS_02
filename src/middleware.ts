import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { isAuthEnabled } from "@/lib/auth-mode";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook(.*)",
]);

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/employees(.*)",
  "/departments(.*)",
  "/hr(.*)",
  "/people(.*)",
  "/analytics(.*)",
  "/documents(.*)",
  "/calendar(.*)",
  "/settings(.*)",
  "/api/employees(.*)",
  "/api/departments(.*)",
  "/api/dashboard(.*)",
  "/api/upload(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isAuthEnabled()) {
    return NextResponse.next();
  }

  const { userId } = await auth();
  const pathname = req.nextUrl.pathname;

  if (userId && isPublicRoute(req)) {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  if (!userId && isProtectedRoute(req)) {
    return auth().redirectToSignIn({ returnBackUrl: req.url });
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
