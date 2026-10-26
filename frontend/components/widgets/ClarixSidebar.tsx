"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  FileCheck2,
  FlaskConical,
  Activity,
  FileText,
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
      label: "Triage & Antrean Klaim",
      href: "/claims/triage",
      icon: Activity,
      badge: pendingClaimsCount > 0 ? pendingClaimsCount : undefined,
      match: (path: string) => path === "/claims/triage" || path === "/" || path.includes("/dossier"),
    },
    {
      label: "Audit Trail & Arsip",
      href: "/claims/audit-trail",
      icon: FileCheck2,
      match: (path: string) => path.startsWith("/claims/audit-trail"),
    },
    {
      label: "Uji Kasus Benchmark",
      href: "/benchmark",
      icon: FlaskConical,
      match: (path: string) => path.startsWith("/benchmark"),
    },
    {
      label: "Clarix AI Studio",
      href: "/intelligence",
      icon: Sparkles,
      customIconSrc: "/images/clarix-ai-icon.png",
      match: (path: string) => path.startsWith("/intelligence"),
    },
  ];

  return (
    <aside
      className={cn(
        "w-64 flex-shrink-0 h-screen bg-white border-r border-slate-200 flex flex-col justify-between select-none text-[13px] text-slate-700",
        className
      )}
    >
      {/* Top Branding & Navigation */}
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="px-4 py-3.5 flex items-center justify-between border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/images/telisik-icon.png"
              alt="TELISIK Logo"
              className="w-8 h-8 flex-shrink-0 object-contain"
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm tracking-tight truncate">
                  TELISIK
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-1.5 py-0.2 rounded-[4px] border border-emerald-200">
                  BPJS
                </span>
              </div>
              <span className="text-[10.5px] text-slate-500 truncate">
                Powered by Clarix AI
              </span>
            </div>
          </div>
        </div>

        {/* Verifier Profile Strip */}
        <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-[4px] bg-blue-100 text-blue-800 border border-blue-200 flex items-center justify-center text-xs font-semibold flex-shrink-0">
              S
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-900 truncate">
                dr. Siti Aminah
              </span>
              <span className="text-[10.5px] text-slate-500 truncate">
                Verifikator Utama BPJS
              </span>
            </div>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-4 pt-3.5 pb-1.5">
          <span className="text-[10.5px] font-medium text-slate-400">
            Menu Operasional
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = item.match ? item.match(pathname) : pathname === item.href;
            const Icon = item.icon;
            const isTriage = item.href === "/claims/triage";
            const isInDossier = Boolean(pathname?.includes("/dossier"));
            const currentClaimId = isInDossier ? pathname.split("/")[2] : null;

            return (
              <React.Fragment key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-[4px] transition-colors text-xs group",
                    isActive
                      ? "bg-blue-50/80 text-blue-800 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {item.customIconSrc ? (
                      <img
                        src={item.customIconSrc}
                        alt={item.label}
                        className="w-4 h-4 flex-shrink-0 object-contain"
                      />
                    ) : (
                      <Icon
                        className={cn(
                          "w-4 h-4 flex-shrink-0",
                          isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                        )}
                      />
                    )}
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10.5px] font-semibold px-1.5 py-0.5 rounded-[4px] tabular-nums">
                      {item.badge}
                    </span>
                  )}
                </Link>

                {isTriage && isInDossier && currentClaimId && (
                  <div className="ml-5 pl-2.5 border-l-2 border-blue-400 my-1 py-0.5">
                    <div className="text-[11px] font-semibold text-blue-700 flex items-center gap-1.5 truncate">
                      <FileText className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span className="truncate tabular-nums">Ruang Telaah: {currentClaimId}</span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Bottom Summary Card */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[4px] text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-600 text-[11px]">
            <span>Koreksi Tarif Terdeteksi</span>
            <span className="font-semibold text-emerald-700 tabular-nums">
              +Rp 142,5 Jt
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-[2px] h-1.5 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-[2px] w-[75%]" />
          </div>
          <div className="flex justify-between items-center text-[10.5px] text-slate-500 pt-0.5">
            <span className="tabular-nums">24 Klaim Diperiksa</span>
            <span className="font-medium text-slate-600">Bulan Ini</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
