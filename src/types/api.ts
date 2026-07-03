// ── Generic API success response ─────────────────────────
export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

// ── Generic API error response ────────────────────────────
export interface ApiError {
  success: false;
  error: string;
  details?: Record<string, string[]>;  // Zod field errors
  code?: string;
}

// ── Union type for all API responses ─────────────────────
export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ── Pagination metadata ───────────────────────────────────
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ── Paginated API response ────────────────────────────────
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationMeta;
}

// ── Helper to build success response ─────────────────────
export function apiSuccess<T>(data: T, message?: string): ApiSuccess<T> {
  return { success: true, data, message };
}

// ── Helper to build error response ───────────────────────
export function apiError(
  error: string,
  details?: Record<string, string[]>,
  code?: string
): ApiError {
  return { success: false, error, details, code };
}

// ── HTTP status codes used in API ────────────────────────
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;