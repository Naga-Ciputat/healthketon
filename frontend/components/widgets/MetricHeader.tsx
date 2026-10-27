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
  const totalInefficiencyRupiah = claims ? claims.reduce((acc, c) => acc + c.deltaTariff, 0) : propTotalInefficiency ?? 142500000;
  const formattedRupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(totalInefficiencyRupiah);

  const videoRef = React.useRef<HTMLVideoElement>(null);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3", className)}>
      {/* Card 1: Antrean Telaah Klaim (Horizontal, Full Height h-[160px], Col 4) */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-md p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between h-[160px] lg:col-span-4">
        {/* Decorative corner image: claims.png */}
        <div className="absolute -top-3 -right-3 w-24 h-24 pointer-events-none select-none">
          <img
            src="/images/decoratives/claims.png"
            alt="Antrean Telaah Klaim"
            className="w-full h-full object-contain transform rotate-[14deg] opacity-75"
          />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-slate-600">
            Antrean Telaah Klaim
          </span>
        </div>
        <div className="relative z-10 flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
            {totalPendingCount}
          </h3>
          <span className="text-xs text-slate-500 font-medium">Berkas Masuk</span>
        </div>
      </div>

      {/* Card 2: Potensi Koreksi Tagihan (Horizontal, Full Height h-[160px], Col 4) */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-md p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between h-[160px] lg:col-span-4">
        {/* Decorative corner image: audit.png */}
        <div className="absolute -top-3 -right-3 w-24 h-24 pointer-events-none select-none">
          <img
            src="/images/decoratives/audit.png"
            alt="Potensi Koreksi Tagihan"
            className="w-full h-full object-contain transform rotate-[14deg] opacity-75"
          />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-slate-600">
            Potensi Koreksi Tagihan
          </span>
        </div>
        <div className="relative z-10 flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-emerald-700 tracking-tight tabular-nums">
            {formattedRupiah}
          </h3>
        </div>
      </div>

      {/* Right Column: Hero Video (Horizontal, Full Height h-[160px], Col 4, Aligned Right) */}
      <div className="relative overflow-hidden flex items-center justify-end h-[160px] md:col-span-2 lg:col-span-4 pointer-events-none select-none">
        {/* Right-aligned video container tightly sized to video height with visible feathered sides */}
        <div className="relative h-full flex items-center justify-end">
          <video
            ref={videoRef}
            src="/videos/hero.webm"
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-auto max-w-full object-contain pointer-events-none select-none"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
              maskComposite: "intersect",
              WebkitMaskComposite: "source-in",
            }}
          />
        </div>
      </div>
    </div>
  );
}
