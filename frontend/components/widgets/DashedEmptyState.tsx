"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface DashedEmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function DashedEmptyState({
  title = "Favorites",
  description = "Notes that you favorite will appear here",
  icon,
  action,
  className,
}: DashedEmptyStateProps) {
  return (
    <div
      className={cn(
        "w-full border border-dashed border-gray-200/90 rounded-xl py-12 px-6 flex flex-col items-center justify-center text-center bg-transparent transition-colors hover:border-gray-300",
        className
      )}
    >
      {icon && <div className="mb-2 text-gray-400">{icon}</div>}
      <h4 className="text-xs font-semibold text-gray-700">{title}</h4>
      <p className="text-xs text-gray-400 mt-1 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
