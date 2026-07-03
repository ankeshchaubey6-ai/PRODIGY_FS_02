import { EmployeeStatus, EmploymentType, Gender } from "@prisma/client";

// ── App metadata ──────────────────────────────────────────
export const APP_NAME = "EMS";
export const APP_FULL_NAME = "Employee Management System";
export const APP_VERSION = "1.0.0";

// ── Pagination defaults ───────────────────────────────────
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// ── Employee status display config ────────────────────────
export const EMPLOYEE_STATUS_CONFIG: Record<
  EmployeeStatus,
  { label: string; className: string; dotColor: string }
> = {
  ACTIVE: {
    label: "Active",
    className: "status-active",
    dotColor: "bg-success",
  },
  INACTIVE: {
    label: "Inactive",
    className: "status-inactive",
    dotColor: "bg-muted-foreground",
  },
  ON_LEAVE: {
    label: "On Leave",
    className: "status-on-leave",
    dotColor: "bg-warning",
  },
  TERMINATED: {
    label: "Terminated",
    className: "status-terminated",
    dotColor: "bg-destructive",
  },
};

// ── Employment type display config ────────────────────────
export const EMPLOYMENT_TYPE_CONFIG: Record<
  EmploymentType,
  { label: string; shortLabel: string }
> = {
  FULL_TIME: { label: "Full Time", shortLabel: "FT" },
  PART_TIME: { label: "Part Time", shortLabel: "PT" },
  CONTRACT: { label: "Contract", shortLabel: "CT" },
  INTERN: { label: "Intern", shortLabel: "IN" },
};

// ── Gender display config ────────────────────────────────
export const GENDER_CONFIG: Record<Gender, { label: string }> = {
  MALE: { label: "Male" },
  FEMALE: { label: "Female" },
  OTHER: { label: "Other" },
};

// ── Select options ────────────────────────────────────────
export const STATUS_OPTIONS = Object.entries(EMPLOYEE_STATUS_CONFIG).map(
  ([value, config]) => ({ value, label: config.label })
);

export const EMPLOYMENT_TYPE_OPTIONS = Object.entries(EMPLOYMENT_TYPE_CONFIG).map(
  ([value, config]) => ({ value, label: config.label })
);

export const GENDER_OPTIONS = Object.entries(GENDER_CONFIG).map(
  ([value, config]) => ({ value, label: config.label })
);

// ── Navigation items ──────────────────────────────────────
export const NAV_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Employees",
    href: "/employees",
    icon: "Users",
  },
  {
    title: "Departments",
    href: "/departments",
    icon: "Building2",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "Settings",
  },
] as const;

// ── Date formats ──────────────────────────────────────────
export const DATE_FORMAT = "dd MMM yyyy";
export const DATE_TIME_FORMAT = "dd MMM yyyy, HH:mm";
export const MONTH_YEAR_FORMAT = "MMM yyyy";

// ── File upload limits ────────────────────────────────────
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// ── API routes ────────────────────────────────────────────
export const API_ROUTES = {
  employees: "/api/employees",
  departments: "/api/departments",
  dashboard: "/api/dashboard",
  upload: "/api/upload",
} as const;

// ── Month names for charts ────────────────────────────────
export const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// ── Color palette for department charts ──────────────────
export const CHART_COLORS = [
  "#6366f1", // indigo
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#f43f5e", // rose
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#f97316", // orange
];
