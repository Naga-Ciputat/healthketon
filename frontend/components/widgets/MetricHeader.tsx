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
  const [videoOpacity, setVideoOpacity] = React.useState(1);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const t = v.currentTime;
    const d = v.duration;
    const fadeDuration = 0.6; // smooth 0.6s fade at start & end of loop
    if (t < fadeDuration) {
      setVideoOpacity(Math.max(0, Math.min(1, t / fadeDuration)));
    } else if (t > d - fadeDuration) {
      setVideoOpacity(Math.max(0, Math.min(1, (d - t) / fadeDuration)));
    } else {
      setVideoOpacity(1);
    }
  };

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-3", className)}>
      {/* Left Column: 2 Cards Stacked Vertically (Col 4, Compact ~130px total height) */}
      <div className="flex flex-col gap-2.5 lg:col-span-4 justify-between h-[132px]">
        {/* Card 1: Antrean Telaah Klaim (Top Left, Compact) */}
        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-md px-3.5 py-2.5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-center flex-1">
          {/* Decorative corner image: claims.png */}
          <div className="absolute -top-3 -right-3 w-20 h-20 pointer-events-none select-none">
            <img
              src="/images/decoratives/claims.png"
              alt="Antrean Telaah Klaim"
              className="w-full h-full object-contain transform rotate-[14deg] opacity-75"
            />
          </div>

          <div className="relative z-10 flex items-center justify-between mb-0.5">
            <span className="text-[11.5px] font-semibold text-slate-500">
              Antrean Telaah Klaim
            </span>
          </div>
          <div className="relative z-10 flex items-baseline gap-1.5">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight tabular-nums">
              {totalPendingCount}
            </h3>
            <span className="text-xs text-slate-500 font-medium">Berkas Masuk</span>
          </div>
        </div>

        {/* Card 2: Potensi Koreksi Tagihan (Bottom Left, Compact) */}
        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-md px-3.5 py-2.5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-center flex-1">
          {/* Decorative corner image: audit.png */}
          <div className="absolute -top-3 -right-3 w-20 h-20 pointer-events-none select-none">
            <img
              src="/images/decoratives/audit.png"
              alt="Potensi Koreksi Tagihan"
              className="w-full h-full object-contain transform rotate-[14deg] opacity-75"
            />
          </div>

          <div className="relative z-10 flex items-center justify-between mb-0.5">
            <span className="text-[11.5px] font-semibold text-slate-500">
              Potensi Koreksi Tagihan
            </span>
          </div>
          <div className="relative z-10 flex items-baseline gap-1.5">
            <h3 className="text-xl font-bold text-emerald-700 tracking-tight tabular-nums">
              {formattedRupiah}
            </h3>
          </div>
        </div>
      </div>

      {/* Right Column: Hero Video (Col 8, Frameless, Exact height 132px, Soft edge fading) */}
      <div className="relative overflow-hidden flex items-center justify-center h-[132px] lg:col-span-8 pointer-events-none select-none">
        {/* Soft Edge Mask on all sides */}
        <div
          className="relative w-full h-full flex items-center justify-center overflow-hidden"
          style={{
            maskImage:
              "radial-gradient(ellipse 90% 82% at 50% 50%, black 45%, transparent 96%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 82% at 50% 50%, black 45%, transparent 96%)",
          }}
        >
          <video
            ref={videoRef}
            src="/videos/hero.webm"
            autoPlay
            loop
            muted
            playsInline
            onTimeUpdate={handleTimeUpdate}
            className="h-full w-auto max-w-full object-contain pointer-events-none select-none transition-opacity duration-150"
            style={{
              opacity: videoOpacity,
            }}
          />
        </div>

        {/* Subtle ambient light gradient */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white/40 via-transparent to-white/40" />
      </div>
    </div>
  );
}
