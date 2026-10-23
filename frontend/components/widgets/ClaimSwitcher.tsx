"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClaimItem } from "@/lib/mockData";

export interface ClaimSwitcherProps {
  claims: ClaimItem[];
  activeClaim: ClaimItem;
  onSelectClaim: (claimId: string) => void;
  className?: string;
}

export function ClaimSwitcher({
  claims,
  activeClaim,
  onSelectClaim,
  className,
}: ClaimSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={cn("relative inline-block text-left", className)}>
      {/* Custom Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center justify-between gap-2 px-2.5 py-1 bg-white border rounded-[4px] text-xs transition-colors shadow-2xs cursor-pointer select-none",
          isOpen
            ? "border-blue-500 ring-1 ring-blue-500/20 text-slate-900"
            : "border-slate-200 hover:border-slate-300 text-slate-700"
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-slate-400 text-[11px] font-medium">Beralih Klaim:</span>
          <span className="font-semibold text-slate-900 tabular-nums">{activeClaim.id}</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-600 truncate max-w-[130px] text-[11px]">
            {activeClaim.hospitalName}
          </span>
          <span
            className={cn(
              "px-1.5 py-0.2 text-[9.5px] font-semibold rounded-[4px] border uppercase",
              activeClaim.riskLevel === "TINGGI"
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : activeClaim.riskLevel === "SEDANG"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            )}
          >
            {activeClaim.riskLevel}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-slate-400 transition-transform duration-150 flex-shrink-0",
            isOpen && "rotate-180 text-blue-600"
          )}
        />
      </button>

      {/* Custom Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-84 bg-white border border-slate-200 rounded-[4px] shadow-lg z-50 overflow-hidden divide-y divide-slate-100">
          {/* Header */}
          <div className="px-3 py-1.5 bg-slate-50/80 flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>Daftar Antrean Klaim ({claims.length} Berkas)</span>
          </div>

          {/* Claim Items List */}
          <div className="max-h-64 overflow-y-auto py-1">
            {claims.map((claim) => {
              const isSelected = claim.id === activeClaim.id;

              return (
                <button
                  key={claim.id}
                  type="button"
                  onClick={() => {
                    onSelectClaim(claim.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left flex items-start justify-between gap-2 text-xs transition-colors cursor-pointer group",
                    isSelected
                      ? "bg-blue-50/80 text-blue-900 font-semibold"
                      : "hover:bg-slate-50 text-slate-700"
                  )}
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="tabular-nums font-semibold text-slate-900">
                        {claim.id}
                      </span>
                      <span
                        className={cn(
                          "px-1.5 py-0.2 text-[9.5px] font-semibold rounded-[4px] border uppercase",
                          claim.riskLevel === "TINGGI"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : claim.riskLevel === "SEDANG"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        )}
                      >
                        {claim.riskLevel}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {claim.hospitalName} ·{" "}
                      <span className="tabular-nums font-mono text-slate-600">
                        {claim.inacbgCode}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
