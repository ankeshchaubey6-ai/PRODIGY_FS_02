"use client";

import { useState, useEffect, useCallback } from "react";
import type { DepartmentWithCount } from "@/types/department";

interface UseDepartmentsReturn {
  departments: DepartmentWithCount[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDepartments(): UseDepartmentsReturn {
  const [departments, setDepartments] = useState<DepartmentWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/departments?limit=100", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch departments");
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setDepartments(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return { departments, isLoading, error, refetch: fetchDepartments };
}