"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface NoteCardProps {
  id?: string;
  companyName?: string;
  companyLogo?: React.ReactNode;
  title?: string;
  contentSnippet?: string;
  authorName?: string;
  authorAvatarText?: string;
  authorAvatarColor?: string;
  dateLabel?: string;
  onClick?: () => void;
  className?: string;
}

export function NoteCard({
  companyName = "Microsoft",
  companyLogo,
  title = "Untitled note",
  contentSnippet = "This note has no content.",
  authorName = "Muhammad Raihan Maulana",
  authorAvatarText = "M",
  authorAvatarColor = "bg-orange-500",
  dateLabel = "Today",
  onClick,
  className,
}: NoteCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "w-full max-w-md bg-white border border-gray-200/90 rounded-xl p-4 shadow-2xs hover:shadow-xs hover:border-gray-300 transition-all cursor-pointer flex flex-col justify-between h-[160px]",
        className
      )}
    >
      {/* Top Company Badge */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-gray-800 font-semibold mb-2">
          {companyLogo || (
            <svg className="w-3.5 h-3.5" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
          )}
          <span>{companyName}</span>
        </div>

        {/* Note Title & Snippet */}
        <h4 className="text-sm font-semibold text-gray-900 truncate tracking-tight">
          {title}
        </h4>
        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
          {contentSnippet}
        </p>
      </div>

      {/* Footer Author & Date */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={cn(
              "w-4 h-4 rounded-full text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0",
              authorAvatarColor
            )}
          >
            {authorAvatarText}
          </div>
          <span className="text-gray-700 font-medium truncate">
            {authorName}
          </span>
        </div>

        <span className="text-gray-400 flex-shrink-0 text-[11px] ml-2">
          {dateLabel}
        </span>
      </div>
    </div>
  );
}
