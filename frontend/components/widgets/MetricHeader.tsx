"use client";

import React from "react";
import { AlertCircle, TrendingDown, CheckCircle2, ShieldCheck, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MetricHeaderProps {
  totalPendingCount?: number;
  highRiskCount?: number;
  totalInefficiencyRupiah?: number;
  fastTrackedCount?: number;
  fastTrackedPercent?: number;
  className?: string;
}

export function MetricHeader({
  totalPendingCount = 24,
  highRiskCount = 4,
  totalInefficiencyRupiah = 142500000,
  fastTrackedCount = 12,
  fastTrackedPercent = 50,
  className,
}: MetricHeaderProps) {
  const formattedRupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(totalInefficiencyRupiah);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-3.5", className)}>
      {/* Card 1: Antrean Verifikasi (BPJS Blue) */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-600">
            Antrean Telaah Klaim
          </span>
          <div className="w-7 h-7 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div>
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

      {/* Card 2: Potensi Koreksi Tarif (BPJS Green) */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-600">
            Potensi Koreksi Tagihan
          </span>
          <div className="w-7 h-7 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div>
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

      {/* Card 3: Klaim Bersih / Fast-Track (BPJS Green/Slate) */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-600">
            Klaim Siap Proses (Sesuai Aturan)
          </span>
          <div className="w-7 h-7 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
              {fastTrackedCount}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Klaim ({fastTrackedPercent}%)
            </span>
          </div>
          <p className="mt-2 text-[11.5px] text-slate-500">
            Lolos verifikasi otomatis tanpa anomali
          </p>
        </div>
      </div>
    </div>
  );
}
