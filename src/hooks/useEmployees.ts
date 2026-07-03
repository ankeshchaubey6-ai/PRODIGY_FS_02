"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { buildQueryString } from "@/lib/utils";
import type { EmployeeListItem, EmployeeFilters } from "@/types/employee";
import type { PaginationMeta } from "@/types/api";

interface UseEmployeesReturn {
  employees: EmployeeListItem[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  setFilters: (filters: Partial<EmployeeFilters>) => void;
  filters: EmployeeFilters;
}

const defaultFilters: EmployeeFilters = {
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};

export function useEmployees(
  initialFilters?: Partial<EmployeeFilters>
): UseEmployeesReturn {
  const [filters, setFiltersState] = useState<EmployeeFilters>({
    ...defaultFilters,
    ...initialFilters,
  });
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Abort controller ref to cancel in-flight requests
  const abortRef = useRef<AbortController | null>(null);

  const fetchEmployees = useCallback(async (currentFilters: EmployeeFilters) => {
    // Cancel previous request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const qs = buildQueryString({
        search: currentFilters.search,
        departmentId: currentFilters.departmentId,
        status: currentFilters.status,
        employmentType: currentFilters.employmentType,
        gender: currentFilters.gender,
        page: currentFilters.page,
        limit: currentFilters.limit,
        sortBy: currentFilters.sortBy,
        sortOrder: currentFilters.sortOrder,
      });

      const res = await fetch(`/api/employees${qs}`, {
        signal: abortRef.current.signal,
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch employees");

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      setEmployees(json.data);
      setPagination(json.pagination);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees(filters);
  }, [filters, fetchEmployees]);

  const setFilters = useCallback((newFilters: Partial<EmployeeFilters>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when filters change (except page itself)
      page: newFilters.page ?? 1,
    }));
  }, []);

  const refetch = useCallback(() => {
    fetchEmployees(filters);
  }, [filters, fetchEmployees]);

  return {
    employees,
    pagination,
    isLoading,
    error,
    refetch,
    setFilters,
    filters,
  };
}