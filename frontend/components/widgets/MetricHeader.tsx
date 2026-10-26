"use client";

import React from "react";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

import { ClaimItem } from "@/lib/mockData";

export interface MetricHeaderProps {
  claims?: ClaimItem[];
  totalPendingCount?: number;
  highRiskCount?: number;
  totalInefficiencyRupiah?: number;
  fastTrackedCount?: number;
  fastTrackedPercent?: number;
  className?: string;
}

export function MetricHeader({
  claims,
  totalPendingCount: propTotalPending,
  highRiskCount: propHighRisk,
  totalInefficiencyRupiah: propTotalInefficiency,
  fastTrackedCount: propFastTracked,
  fastTrackedPercent: propFastTrackedPercent,
  className,
}: MetricHeaderProps) {
  const totalPendingCount = claims ? claims.length : propTotalPending ?? 24;
  const highRiskCount = claims ? claims.filter((c) => c.riskLevel === "TINGGI").length : propHighRisk ?? 4;
  const totalInefficiencyRupiah = claims ? claims.reduce((acc, c) => acc + c.deltaTariff, 0) : propTotalInefficiency ?? 142500000;
  const formattedRupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(totalInefficiencyRupiah);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-3.5", className)}>
      {/* Card 1: Antrean Telaah Klaim */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-md p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between min-h-[122px]">
        {/* Decorative corner image: claims.png */}
        <div className="absolute -top-6 -right-6 w-36 h-36 sm:w-44 sm:h-44 pointer-events-none select-none">
          <img
            src="/images/decoratives/claims.png"
            alt="Antrean Telaah Klaim"
            className="w-full h-full object-contain transform rotate-[14deg] opacity-75"
          />
        </div>

        <div className="relative z-10 flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-600">
            Antrean Telaah Klaim
          </span>
        </div>
        <div className="relative z-10">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
              {totalPendingCount}
            </h3>
            <span className="text-xs text-slate-500 font-medium">Berkas Masuk</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-rose-600" />
              {highRiskCount} Kasus Perlu Prioritas
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Potensi Koreksi Tagihan */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-md p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between min-h-[122px]">
        {/* Decorative corner image: audit.png */}
        <div className="absolute -top-6 -right-6 w-36 h-36 sm:w-44 sm:h-44 pointer-events-none select-none">
          <img
            src="/images/decoratives/audit.png"
            alt="Potensi Koreksi Tagihan"
            className="w-full h-full object-contain transform rotate-[14deg] opacity-75"
          />
        </div>

        <div className="relative z-10 flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-600">
            Potensi Koreksi Tagihan
          </span>
        </div>
        <div className="relative z-10">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-emerald-700 tracking-tight tabular-nums">
              {formattedRupiah}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="text-[11.5px]">Dari ketidaksesuaian alkes &amp; upcoding</span>
          </div>
        </div>
      </div>
    </div>
  );
}
