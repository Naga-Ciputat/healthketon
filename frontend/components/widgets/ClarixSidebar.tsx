"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  FileCheck2,
  FlaskConical,
  Activity,
  FileText,
  Sparkles,
  ChevronsUpDown,
  Check,
  UserCheck,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/userContext";

export interface ClarixSidebarProps {
  className?: string;
  pendingClaimsCount?: number;
  disputeClaimsCount?: number;
}

export function ClarixSidebar({
  className,
  pendingClaimsCount = 2,
  disputeClaimsCount = 3,
}: ClarixSidebarProps) {
  const pathname = usePathname();
  const { currentUser, switchUser, availableUsers } = useUser();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    {
      label: "Triage & Antrean Klaim",
      href: "/claims/triage",
      icon: Activity,
      badge: pendingClaimsCount > 0 ? pendingClaimsCount : undefined,
      match: (path: string) => path === "/claims/triage" || path === "/" || path.includes("/dossier"),
    },
    {
      label: "Mediasi & Sengketa Klaim",
      href: "/claims/disputes",
      icon: Scale,
      badge: disputeClaimsCount > 0 ? disputeClaimsCount : undefined,
      match: (path: string) => path.startsWith("/claims/disputes"),
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
      href: "/clarix-ai",
      icon: Sparkles,
      customIconSrc: "/images/clarix-ai-icon.png",
      match: (path: string) => path.startsWith("/clarix-ai"),
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

        {/* Verifier Profile Strip with Account Switcher */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setShowUserDropdown((prev) => !prev)}
            className="w-full px-4 py-2.5 border-b border-slate-100 bg-slate-50/60 hover:bg-slate-100/70 transition-colors flex items-center justify-between text-left cursor-pointer group"
            title="Klik untuk beralih akun verifikator"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={cn(
                  "w-6 h-6 rounded-[4px] flex items-center justify-center text-xs font-semibold flex-shrink-0 border",
                  currentUser.avatarBg,
                  currentUser.avatarText,
                  currentUser.avatarBorder
                )}
              >
                {currentUser.initial}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-900 truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10.5px] text-slate-500 truncate">
                  {currentUser.role}
                </span>
              </div>
            </div>
            <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 flex-shrink-0 ml-1" />
          </button>

          {/* Account Switcher Dropdown */}
          {showUserDropdown && (
            <div className="absolute top-full left-2 right-2 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 p-1.5 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Ganti Akun Verifikator
              </div>
              {availableUsers.map((u) => {
                const isSelected = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      switchUser(u.id);
                      setShowUserDropdown(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left text-xs transition-colors cursor-pointer",
                      isSelected
                        ? "bg-blue-50 text-blue-900 font-semibold"
                        : "hover:bg-slate-50 text-slate-700"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={cn(
                          "w-5 h-5 rounded-[3px] flex items-center justify-center text-[10px] font-bold flex-shrink-0 border",
                          u.avatarBg,
                          u.avatarText,
                          u.avatarBorder
                        )}
                      >
                        {u.initial}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="truncate">{u.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal truncate">
                          {u.role}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
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
                    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                      {item.customIconSrc ? (
                        <img
                          src={item.customIconSrc}
                          alt={item.label}
                          className="w-6 h-6 max-w-none flex-shrink-0 object-contain drop-shadow-2xs"
                        />
                      ) : (
                        <Icon
                          className={cn(
                            "w-4 h-4 flex-shrink-0",
                            isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                          )}
                        />
                      )}
                    </div>
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
