"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  BriefcaseBusiness,
  BarChart3,
  FileText,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Employees",
    href: "/employees",
    icon: Users,
  },
  {
    title: "Departments",
    href: "/departments",
    icon: Building2,
  },
  {
    title: "HR Hub",
    href: "/hr",
    icon: BriefcaseBusiness,
  },
  {
    title: "People",
    href: "/people",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileText,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: CalendarDays,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Persist collapse state
  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored !== null) setCollapsed(JSON.parse(stored));
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(next));
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-border panel sidebar-transition relative z-20",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {/* ── Logo ───────────────────────────────────── */}
        <div
          className={cn(
            "flex items-center border-b border-border h-[60px] flex-shrink-0 px-4",
            collapsed ? "justify-center" : "gap-3"
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-sm">E</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-foreground leading-tight truncate">
                EMS
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight truncate">
                Employee Management
              </p>
            </div>
          )}
        </div>

        {/* ── Navigation ─────────────────────────────── */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            const linkContent = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "nav-item group relative",
                  collapsed
                    ? "w-10 h-10 justify-center mx-auto px-0"
                    : "gap-3 px-3 py-2.5",
                  isActive ? "active" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon
                  className={cn(
                    "flex-shrink-0 transition-colors",
                    collapsed ? "w-5 h-5" : "w-4 h-4",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">
                    {item.title}
                  </span>
                )}
                {/* Active indicator dot for collapsed state */}
                {collapsed && isActive && (
                  <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-l-full" />
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return linkContent;
          })}
        </nav>

        {/* ── Section label (only when expanded) ─────── */}
        {!collapsed && (
          <div className="px-4 pb-2">
            <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest">
              v1.0.0
            </p>
          </div>
        )}

        {/* ── Collapse toggle ─────────────────────────── */}
        <div className="border-t border-border p-2">
          <button
            onClick={toggleCollapsed}
            className={cn(
              "flex items-center justify-center rounded-lg w-full h-9 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-2 px-2 w-full">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs font-medium">Collapse</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
}