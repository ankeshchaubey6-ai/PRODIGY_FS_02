import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * Gets the current authenticated user's Clerk ID.
 * Throws if not authenticated.
 */
export async function requireAuth(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: No active session");
  }
  return userId;
}

/**
 * Gets the full Clerk user object for the current session.
 * Returns null if not authenticated.
 */
export async function getAuthUser() {
  const user = await currentUser();
  return user;
}

/**
 * Gets the current user's employee record from the database
 * matched by their Clerk user ID.
 * Returns null if no linked employee record exists.
 */
export async function getCurrentEmployee() {
  const { userId } = await auth();
  if (!userId) return null;

  const employee = await prisma.employee.findUnique({
    where: { clerkUserId: userId },
    include: { department: true },
  });

  return employee;
}

/**
 * Checks whether the current user has admin access.
 * In this app, admin status is stored in Clerk's
 * publicMetadata as { role: "ADMIN" }.
 */
export async function isAdmin(): Promise<boolean> {
  const user = await currentUser();
  if (!user) return false;
  return (user.publicMetadata as { role?: string })?.role === "ADMIN";
}

/**
 * Checks whether the current user has HR access.
 */
export async function isHR(): Promise<boolean> {
  const user = await currentUser();
  if (!user) return false;
  const role = (user.publicMetadata as { role?: string })?.role;
  return role === "HR" || role === "ADMIN";
}

/**
 * Returns the role of the current user from Clerk metadata.
 * Defaults to "EMPLOYEE" if no role is set.
 */
export async function getUserRole(): Promise<"ADMIN" | "HR" | "EMPLOYEE"> {
  const user = await currentUser();
  if (!user) return "EMPLOYEE";
  const role = (user.publicMetadata as { role?: string })?.role;
  if (role === "ADMIN") return "ADMIN";
  if (role === "HR") return "HR";
  return "EMPLOYEE";
}

/**
 * Builds a display name from a Clerk user object.
 */
export function getDisplayName(user: {
  firstName?: string | null;
  lastName?: string | null;
  emailAddresses?: { emailAddress: string }[];
}): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.firstName) return user.firstName;
  if (user.emailAddresses?.[0]?.emailAddress) {
    return user.emailAddresses[0].emailAddress.split("@")[0];
  }
  return "User";
}