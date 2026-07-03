"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import dynamic from "next/dynamic";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isAuthEnabled } from "@/lib/auth-mode";

const AuthUserButton = dynamic(
  () => import("@/components/layout/clerk/AuthUserButton"),
  { ssr: false }
);

// Map pathnames to readable titles
function getPageTitle(pathname: string): { title: string; description: string } {
  if (pathname === "/dashboard") {
    return { title: "Dashboard", description: "Overview of your workforce" };
  }
  if (pathname === "/employees/new") {
    return { title: "Add Employee", description: "Create a new employee record" };
  }
  if (pathname.match(/^\/employees\/[^/]+\/edit$/)) {
    return { title: "Edit Employee", description: "Update employee information" };
  }
  if (pathname.match(/^\/employees\/[^/]+$/)) {
    return { title: "Employee Profile", description: "View employee details" };
  }
  if (pathname === "/employees") {
    return { title: "Employees", description: "Manage your team" };
  }
  if (pathname.match(/^\/departments\/[^/]+$/)) {
    return { title: "Department", description: "View department details" };
  }
  if (pathname === "/departments") {
    return { title: "Departments", description: "Manage organisational units" };
  }
  if (pathname === "/settings") {
    return { title: "Settings", description: "Manage your preferences" };
  }
  return { title: "EMS", description: "Employee Management System" };
}

export function Header() {
  const pathname = usePathname();
  const { title, description } = getPageTitle(pathname);
  const authEnabled = isAuthEnabled();

  return (
    <TooltipProvider delayDuration={0}>
      <header className="h-[60px] border-b border-border surface-subtle backdrop-blur-sm flex items-center px-4 lg:px-6 gap-4 flex-shrink-0 sticky top-0 z-10 rounded-none">
        {/* Mobile nav trigger */}
        <MobileNav />

        {/* Page title */}
        <div className="flex-1 min-w-0 hidden sm:block">
          <h1 className="text-sm font-semibold text-foreground truncate">
            {title}
          </h1>
          <p className="text-xs text-muted-foreground truncate hidden md:block">
            {description}
          </p>
        </div>

        {/* Mobile title (simplified) */}
        <div className="flex-1 min-w-0 sm:hidden">
          <h1 className="text-sm font-semibold text-foreground truncate">
            {title}
          </h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Search button — visual only, can wire to command palette later */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Search</TooltipContent>
          </Tooltip>

          {/* Notifications — placeholder */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground relative"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {/* Unread dot */}
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Divider */}
          <div className="w-px h-5 bg-border mx-1" />

          {/* Clerk user button */}
          {authEnabled ? (
            <AuthUserButton />
          ) : (
            <div className="flex h-8 items-center rounded-full border border-border bg-muted px-3 text-xs font-medium text-muted-foreground">
              Dev Mode
            </div>
          )}
        </div>
      </header>
    </TooltipProvider>
  );
}
