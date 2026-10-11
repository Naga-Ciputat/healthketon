"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TaskSummaryWidgetProps {
  taskCount?: number;
  onViewAll?: () => void;
  onNewTask?: () => void;
  className?: string;
}

export function TaskSummaryWidget({
  taskCount = 0,
  onViewAll,
  onNewTask,
  className,
}: TaskSummaryWidgetProps) {
  return (
    <div className={cn("w-full max-w-3xl mx-auto flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="text-xs font-semibold text-gray-900 tracking-wide">
          Tasks {taskCount}
        </h3>

        {onViewAll ? (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            View all
          </button>
        ) : (
          <Link
            href="/tasks"
            className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            View all
          </Link>
        )}
      </div>

      {/* Empty State Body */}
      <div className="py-10 flex flex-col items-center justify-center text-center">
        <h4 className="text-sm font-semibold text-gray-900 mb-1">
          Stay on top of work
        </h4>
        <p className="text-xs text-gray-500 max-w-sm mb-5">
          Create tasks for yourself or your team to track next steps
        </p>

        <button
          type="button"
          onClick={onNewTask}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-md text-xs font-medium shadow-2xs hover:border-gray-300 transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-gray-500" />
          <span>New task</span>
        </button>
      </div>
    </div>
  );
}
