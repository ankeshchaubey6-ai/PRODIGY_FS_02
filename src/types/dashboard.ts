export type ActivityType =
  | "EMPLOYEE_CREATED"
  | "EMPLOYEE_UPDATED"
  | "EMPLOYEE_TERMINATED"
  | "EMPLOYEE_ON_LEAVE"
  | "DEPARTMENT_CREATED";

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  totalDepartments: number;
  newThisMonth: number;
  totalEmployeesChange: number;
  activeEmployeesChange: number;
  departmentsChange: number;
  newThisMonthChange: number;
}

export interface GrowthDataPoint {
  month: string;
  employees: number;
  newHires: number;
}

export interface DepartmentDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  avatarUrl?: string;
  initials: string;
}

export interface DashboardData {
  stats: DashboardStats;
  growthData: GrowthDataPoint[];
  departmentData: DepartmentDataPoint[];
  recentActivity: ActivityItem[];
}
