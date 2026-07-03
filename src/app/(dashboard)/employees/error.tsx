"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function EmployeesError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Employees error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7 text-destructive" />
      </div>
      <h2 className="text-lg font-semibold text-foreground mb-2">
        Failed to load employees
      </h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        Something went wrong while loading the employee list.
      </p>
      <Button onClick={reset} className="gap-2">
        <RefreshCw className="w-4 h-4" />
        Try again
      </Button>
    </div>
  );
}