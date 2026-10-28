"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TopHeaderProps {
  title?: React.ReactNode;
  subtitle?: string;
  badge?: React.ReactNode;
  showHelp?: boolean;
  showShare?: boolean;
  showAskAttio?: boolean;
  showBranchTag?: boolean;
  rightActions?: React.ReactNode;
  className?: string;
}

export function TopHeader({
  title = "Dashboard",
  subtitle,
  badge,
  showHelp = true,
  showBranchTag = true,
  rightActions,
  className,
}: TopHeaderProps) {
  const pathname = usePathname();
  const isPanduanActive = pathname?.startsWith("/panduan");

  return (
    <header
      className={cn(
        "h-12 border-b border-slate-200 px-6 flex items-center justify-between bg-white select-none flex-shrink-0",
        className
      )}
    >
      {/* Left Title / Breadcrumb area */}
      <div className="flex items-center gap-2.5 min-w-0">
        {typeof title === "string" ? (
          <h1 className="text-sm font-semibold text-slate-900 truncate">
            {title}
          </h1>
        ) : (
          title
        )}

        {badge}

        {subtitle && (
          <>
            <span className="text-slate-300">/</span>
            <span className="text-xs text-slate-500 font-normal truncate">
              {subtitle}
            </span>
          </>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {rightActions}

        {showHelp && (
          <Link
            href="/panduan"
            className={cn(
              "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-[4px] border transition-colors",
              isPanduanActive
                ? "bg-blue-50 text-blue-700 border-blue-300 font-semibold"
                : "text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50 font-medium"
            )}
            title="Buka Halaman Panduan Operasional TELISIK"
          >
            <HelpCircle
              className={cn(
                "w-3.5 h-3.5",
                isPanduanActive ? "text-blue-600" : "text-slate-400"
              )}
            />
            <span>Panduan</span>
          </Link>
        )}

        {showBranchTag && (
          <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-500 border border-slate-200 rounded-[4px] bg-slate-50">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium text-slate-700">KCU JKN</span>
          </div>
        )}
      </div>
    </header>
  );
}
