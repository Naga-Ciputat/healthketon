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
    <div className={cn("grid grid-cols-1 md:grid-cols-12 gap-3.5", className)}>
      {/* Card 1: Antrean Telaah Klaim (Left, Col 3) */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-md p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between min-h-[114px] md:col-span-3">
        {/* Decorative corner image: claims.png */}
        <div className="absolute -top-5 -right-5 w-32 h-32 pointer-events-none select-none">
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
        </div>
      </div>

      {/* Card 2: Potensi Koreksi Tagihan (Left, Col 4) */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-md p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between min-h-[114px] md:col-span-4">
        {/* Decorative corner image: audit.png */}
        <div className="absolute -top-5 -right-5 w-32 h-32 pointer-events-none select-none">
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
        </div>
      </div>

      {/* Card 3: Hero Video Banner (Right, Col 5) */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-md shadow-2xs hover:border-slate-300 transition-all flex items-center justify-center min-h-[114px] md:col-span-5">
        {/* Soft Crop Mask Container (60% width x 70% height with radial gradient fading) */}
        <div
          className="relative w-full h-full flex items-center justify-center overflow-hidden"
          style={{
            maskImage:
              "radial-gradient(ellipse 85% 80% at 50% 48%, black 45%, transparent 95%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 85% 80% at 50% 48%, black 45%, transparent 95%)",
          }}
        >
          <video
            src="/videos/hero.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover pointer-events-none select-none"
            style={{
              objectPosition: "center 35%",
              transform: "scale(1.7)",
            }}
          />
        </div>

        {/* Soft edge ambient light gradient */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white/60 via-transparent to-white/60" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/40 via-transparent to-white/30" />
      </div>
    </div>
  );
}
