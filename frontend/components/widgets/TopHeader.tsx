"use client";

import React from "react";
import { HelpCircle, Sparkles, Star, MoreHorizontal, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TopHeaderProps {
  title?: React.ReactNode;
  subtitle?: string;
  showHelp?: boolean;
  showAskAttio?: boolean;
  showShare?: boolean;
  rightActions?: React.ReactNode;
  className?: string;
}

export function TopHeader({
  title = "Home",
  subtitle,
  showHelp = true,
  showAskAttio = false,
  showShare = false,
  rightActions,
  className,
}: TopHeaderProps) {
  return (
    <header
      className={cn(
        "h-12 border-b border-gray-200 px-6 flex items-center justify-between bg-white select-none flex-shrink-0",
        className
      )}
    >
      {/* Left Title / Breadcrumb area */}
      <div className="flex items-center gap-2 min-w-0">
        {typeof title === "string" ? (
          <h1 className="text-sm font-semibold text-gray-900 truncate flex items-center gap-1.5">
            {title}
          </h1>
        ) : (
          title
        )}
        {subtitle && (
          <span className="text-xs text-gray-400 font-normal truncate">
            {subtitle}
          </span>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {rightActions}

        {showShare && (
          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors shadow-2xs"
          >
            <div className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">
              M
            </div>
            <span>Share</span>
          </button>
        )}

        {showHelp && (
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-gray-400" />
            <span>Help</span>
          </button>
        )}

        {showAskAttio && (
          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-gray-500" />
            <span>Ask Attio</span>
          </button>
        )}
      </div>
    </header>
  );
}
