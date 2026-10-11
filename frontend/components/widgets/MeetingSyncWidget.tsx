"use client";

import React from "react";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MeetingSyncWidgetProps {
  dateLabel?: string;
  onSyncGoogle?: () => void;
  onSyncMicrosoft?: () => void;
  className?: string;
}

export function MeetingSyncWidget({
  dateLabel = "Today, Oct 11",
  onSyncGoogle,
  onSyncMicrosoft,
  className,
}: MeetingSyncWidgetProps) {
  return (
    <div className={cn("w-full max-w-3xl mx-auto flex flex-col", className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="text-xs font-semibold text-gray-900 tracking-wide">
          Meetings
        </h3>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{dateLabel}</span>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            type="button"
            className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Empty State Body */}
      <div className="py-10 flex flex-col items-center justify-center text-center">
        <h4 className="text-sm font-semibold text-gray-900 mb-1">
          Turn meetings into opportunities
        </h4>
        <p className="text-xs text-gray-500 max-w-sm mb-5">
          Sync your calendar to get instant meeting context
        </p>

        {/* Sync Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Google Sync Button */}
          <button
            type="button"
            onClick={onSyncGoogle}
            className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-md text-xs font-medium shadow-2xs hover:border-gray-300 transition-all"
          >
            {/* Google G SVG */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sync Google Account</span>
          </button>

          {/* Microsoft Sync Button */}
          <button
            type="button"
            onClick={onSyncMicrosoft}
            className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-md text-xs font-medium shadow-2xs hover:border-gray-300 transition-all"
          >
            {/* Microsoft 4-square SVG */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
            <span>Sync Microsoft Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
