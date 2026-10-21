"use client";

import React from "react";
import { AlertCircle, TrendingDown, CheckCircle2, ShieldCheck } from "lucide-react";
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
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      {/* Card 1: Total Klaim Menunggu */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Antrean Verifikasi
          </span>
          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
              {totalPendingCount}
            </h3>
            <span className="text-xs text-slate-500">Klaim</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-rose-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>{highRiskCount} kasus anomali prioritas tinggi</span>
          </div>
        </div>
      </div>

      {/* Card 2: Potensi Inefisiensi Terdeteksi */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Potensi Kebocoran Terdeteksi
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-emerald-700 tracking-tight font-mono">
              {formattedRupiah}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Terlindungi dari upcoding & inflated bills</span>
          </div>
        </div>
      </div>

      {/* Card 3: Klaim Lolos Cepat (Fast-Tracked) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Fast-Tracked (Klaim Bersih)
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
              {fastTrackedCount}
            </h3>
            <span className="text-xs text-slate-500">
              Kasus ({fastTrackedPercent}%)
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Verifikasi instan tanpa anomali (&lt;50ms)
          </p>
        </div>
      </div>
    </div>
  );
}
