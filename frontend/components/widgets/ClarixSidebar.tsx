"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  FileCheck2,
  FlaskConical,
  Layers,
  ChevronRight,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ClarixSidebarProps {
  className?: string;
  pendingClaimsCount?: number;
}

export function ClarixSidebar({
  className,
  pendingClaimsCount = 2,
}: ClarixSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Triage & Queue",
      href: "/claims/triage",
      icon: LayoutDashboard,
      badge: pendingClaimsCount > 0 ? pendingClaimsCount : undefined,
    },
    {
      label: "Audit Trail & Arsip",
      href: "/claims/audit-trail",
      icon: FileCheck2,
    },
    {
      label: "Scientific Benchmark",
      href: "/benchmark/evaluation-suite",
      icon: FlaskConical,
      badgeText: "Jury Track",
    },
    {
      label: "Storybook Catalog",
      href: "/storybook",
      icon: Layers,
      badgeText: "Widgets",
    },
  ];

  return (
    <aside
      className={cn(
        "w-64 flex-shrink-0 h-screen bg-white border-r border-slate-200 flex flex-col justify-between select-none text-[13px] text-slate-700",
        className
      )}
    >
      {/* Top Branding & Workspace */}
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="px-4 py-4 flex items-center justify-between border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm flex-shrink-0">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm tracking-tight truncate">
                  Clarix AI
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.2 rounded border border-emerald-200">
                  BPJS
                </span>
              </div>
              <span className="text-[11px] text-slate-500 truncate">
                Clinical Evidence Co-Pilot
              </span>
            </div>
          </div>
        </div>

        {/* Verifier Profile Header */}
        <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center text-xs font-bold flex-shrink-0">
              M
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-900 truncate">
                dr. Maya Indriati
              </span>
              <span className="text-[10px] text-slate-500 truncate">
                Verifikator Medis KCU
              </span>
            </div>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-4 pt-4 pb-1.5">
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Menu Operasional
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="px-2 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/claims/triage" && pathname.startsWith("/claims")) ||
              pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg transition-colors font-medium text-xs group",
                  isActive
                    ? "bg-blue-50/80 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={cn(
                      "w-4 h-4 flex-shrink-0",
                      isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="bg-rose-500 text-white text-[10px] font-semibold px-1.5 py-0.2 rounded-full min-w-[18px] text-center leading-4">
                    {item.badge}
                  </span>
                )}

                {item.badgeText && (
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-medium px-1.5 py-0.2 rounded border border-emerald-200/60">
                    {item.badgeText}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Security & Efficiency Summary */}
      <div className="p-3 border-t border-slate-200 bg-white space-y-2">
        {/* UU PDP Compliance Pill */}
        <div className="flex items-center justify-between px-2.5 py-1.5 bg-emerald-50/60 border border-emerald-200/70 rounded-md text-[11px] text-emerald-800">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold truncate">UU PDP 27/2022</span>
          </div>
          <span className="text-[10px] text-emerald-700">Protected</span>
        </div>

        {/* Efficiency Metric Banner */}
        <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[10px]">
            <span>Efisiensi Terdeteksi</span>
            <span className="font-semibold text-emerald-600 font-mono">+Rp142.5M</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full w-[78%]" />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5">
            <span>24 Klaim Diperiksa</span>
            <span className="font-medium text-slate-600">Bulan Ini</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
