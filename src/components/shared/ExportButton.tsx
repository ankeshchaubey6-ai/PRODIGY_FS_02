"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { buildQueryString } from "@/lib/utils";

interface ExportButtonProps {
  filters?: {
    search?: string;
    departmentId?: string;
    status?: string;
    employmentType?: string;
  };
  filename?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function ExportButton({
  filters = {},
  filename,
  variant = "outline",
  size = "sm",
  className,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport() {
    setIsExporting(true);
    try {
      const qs = buildQueryString({
        search: filters.search,
        departmentId: filters.departmentId,
        status: filters.status,
        employmentType: filters.employmentType,
      });

      const res = await fetch(`/api/employees/export${qs}`);

      if (!res.ok) {
        toast.error("Failed to export employees. Please try again.");
        return;
      }

      // Get filename from header or use default
      const disposition = res.headers.get("Content-Disposition");
      const headerFilename = disposition
        ?.match(/filename="(.+)"/)?.[1];
      const downloadName =
        filename ?? headerFilename ?? "employees-export.csv";

      // Trigger browser download
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success("Export downloaded successfully.");
    } catch {
      toast.error("Failed to export employees. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={isExporting}
      className={className}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </>
      )}
    </Button>
  );
}