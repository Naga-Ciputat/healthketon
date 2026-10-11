"use client";

import React from "react";
import {
  ArrowUpDown,
  Filter,
  SlidersHorizontal,
  Plus,
  LayoutList,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterToolbarProps {
  sortLabel?: string;
  sortBy?: string;
  hasFilterButton?: boolean;
  showViewMode?: boolean;
  viewMode?: "list" | "grid";
  onViewModeChange?: (mode: "list" | "grid") => void;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  className?: string;
}

export function FilterToolbar({
  sortLabel = "Sorted by",
  sortBy = "Creation date",
  hasFilterButton = false,
  showViewMode = true,
  viewMode = "grid",
  onViewModeChange,
  primaryActionLabel = "+ New note",
  onPrimaryAction,
  className,
}: FilterToolbarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-2 border-b border-gray-100 bg-white text-xs",
        className
      )}
    >
      {/* Left controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex items-center gap-1.5 px-2 py-1 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors font-medium border border-transparent hover:border-gray-200"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
          <span>
            {sortLabel} <strong className="font-semibold text-gray-900">{sortBy}</strong>
          </span>
        </button>

        {hasFilterButton && (
          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors font-medium border border-transparent hover:border-gray-200"
          >
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span>Filter</span>
          </button>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {showViewMode && onViewModeChange && (
          <div className="flex items-center border border-gray-200 rounded-md p-0.5 bg-gray-50/50">
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={cn(
                "p-1 rounded transition-colors",
                viewMode === "list"
                  ? "bg-white text-gray-900 shadow-2xs"
                  : "text-gray-400 hover:text-gray-700"
              )}
              title="List view"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "p-1 rounded transition-colors",
                viewMode === "grid"
                  ? "bg-white text-gray-900 shadow-2xs"
                  : "text-gray-400 hover:text-gray-700"
              )}
              title="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <button
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors font-medium border border-transparent hover:border-gray-200"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
          <span>View settings</span>
        </button>

        {primaryActionLabel && (
          <button
            type="button"
            onClick={onPrimaryAction}
            className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium shadow-2xs transition-all active:scale-[0.98]"
          >
            <span>{primaryActionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
