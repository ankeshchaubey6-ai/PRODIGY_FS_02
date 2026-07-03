"use client";

import { useState, useEffect, useCallback } from "react";
import type { DashboardData } from "@/types/dashboard";

interface UseDashboardStatsReturn {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboardStats(): UseDashboardStatsReturn {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/dashboard", {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setData(json.data);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setError("Dashboard request timed out. Check your database connection.");
      } else {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
