"use client";

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortButtonProps {
  label: string;
  field: string;
  currentSortBy?: string;
  currentSortOrder?: "asc" | "desc";
  onSort: (field: string) => void;
  className?: string;
}

export function SortButton({
  label,
  field,
  currentSortBy,
  currentSortOrder,
  onSort,
  className,
}: SortButtonProps) {
  const isActive = currentSortBy === field;

  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium transition-colors",
        "text-muted-foreground hover:text-foreground",
        isActive && "text-foreground",
        className
      )}
      aria-label={`Sort by ${label}`}
    >
      {label}
      {isActive ? (
        currentSortOrder === "asc" ? (
          <ArrowUp className="w-3.5 h-3.5" />
        ) : (
          <ArrowDown className="w-3.5 h-3.5" />
        )
      ) : (
        <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
      )}
    </button>
  );
}