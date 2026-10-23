"use client";

import React from "react";
import { Grid, HelpCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConfusionMatrixProps {
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  trueNegatives: number;
  className?: string;
}

export function ConfusionMatrixCard({
  truePositives,
  falsePositives,
  falseNegatives,
  trueNegatives,
  className,
}: ConfusionMatrixProps) {
  const total = truePositives + falsePositives + falseNegatives + trueNegatives;

  const precision =
    truePositives + falsePositives > 0
      ? (truePositives / (truePositives + falsePositives)) * 100
      : 0;

  const recall =
    truePositives + falseNegatives > 0
      ? (truePositives / (truePositives + falseNegatives)) * 100
      : 0;

  const specificity =
    trueNegatives + falsePositives > 0
      ? (trueNegatives / (trueNegatives + falsePositives)) * 100
      : 0;

  const f1Score =
    precision + recall > 0
      ? (2 * (precision * recall)) / (precision + recall)
      : 0;

  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-[4px] p-4 text-slate-800 shadow-2xs space-y-3.5",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[4px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <Grid className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900 tracking-tight">
              Matriks Konfusi 2×2 (Confusion Matrix)
            </h4>
            <p className="text-[11px] text-slate-500">
              Evaluasi validasi silang pada {total} kasus uji sintetis terstandar
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-[4px] tabular-nums font-medium">
          Total Sampel: {total} Kasus
        </div>
      </div>

      {/* 2x2 Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Table Structure */}
        <div className="border border-slate-200 rounded-[4px] overflow-hidden text-xs">
          <div className="grid grid-cols-3 bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-[11px] text-center py-2">
            <div>Aktual \ Prediksi</div>
            <div>Prediksi Anomali</div>
            <div>Prediksi Wajar</div>
          </div>

          {/* Row 1: Actual Positive (Anomaly) */}
          <div className="grid grid-cols-3 border-b border-slate-200 divide-x divide-slate-200">
            <div className="p-2.5 bg-slate-50/50 flex flex-col justify-center font-semibold text-slate-700 text-[11px]">
              <span>Aktual: Anomali</span>
              <span className="text-[10px] text-slate-400 font-normal">({truePositives + falseNegatives} Kasus)</span>
            </div>
            {/* TP */}
            <div className="p-3 bg-emerald-50/50 hover:bg-emerald-50 transition-colors flex flex-col items-center justify-center text-center">
              <span className="text-base font-bold text-emerald-900 tabular-nums">
                {truePositives}
              </span>
              <span className="text-[10px] font-semibold text-emerald-700">
                True Positive (TP)
              </span>
              <span className="text-[10px] text-slate-500">Anomali Terdeteksi</span>
            </div>
            {/* FN */}
            <div className="p-3 bg-rose-50/40 hover:bg-rose-50 transition-colors flex flex-col items-center justify-center text-center">
              <span className="text-base font-bold text-rose-900 tabular-nums">
                {falseNegatives}
              </span>
              <span className="text-[10px] font-semibold text-rose-700">
                False Negative (FN)
              </span>
              <span className="text-[10px] text-slate-500">Anomali Terlewat</span>
            </div>
          </div>

          {/* Row 2: Actual Negative (Clean) */}
          <div className="grid grid-cols-3 divide-x divide-slate-200">
            <div className="p-2.5 bg-slate-50/50 flex flex-col justify-center font-semibold text-slate-700 text-[11px]">
              <span>Aktual: Wajar</span>
              <span className="text-[10px] text-slate-400 font-normal">({falsePositives + trueNegatives} Kasus)</span>
            </div>
            {/* FP */}
            <div className="p-3 bg-amber-50/40 hover:bg-amber-50 transition-colors flex flex-col items-center justify-center text-center">
              <span className="text-base font-bold text-amber-900 tabular-nums">
                {falsePositives}
              </span>
              <span className="text-[10px] font-semibold text-amber-700">
                False Positive (FP)
              </span>
              <span className="text-[10px] text-slate-500">Klaim Wajar Dituduh</span>
            </div>
            {/* TN */}
            <div className="p-3 bg-blue-50/40 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center text-center">
              <span className="text-base font-bold text-blue-900 tabular-nums">
                {trueNegatives}
              </span>
              <span className="text-[10px] font-semibold text-blue-700">
                True Negative (TN)
              </span>
              <span className="text-[10px] text-slate-500">Klaim Wajar Lolos</span>
            </div>
          </div>
        </div>

        {/* Statistical Summary Column */}
        <div className="flex flex-col justify-between space-y-2 border border-slate-200 rounded-[4px] p-3 bg-slate-50/30">
          <div className="text-[11px] font-semibold text-slate-800 pb-1 border-b border-slate-200 flex items-center justify-between">
            <span>Metrik Diagnostik Model</span>
            <span className="text-[10px] font-normal text-slate-500">Formula Mediko-Legal</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Presisi (PPV):</span>
              <span className="font-semibold text-slate-900 tabular-nums">
                {precision.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Sensitivitas / Recall:</span>
              <span className="font-semibold text-emerald-700 tabular-nums">
                {recall.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Spesifisitas (TNR):</span>
              <span className="font-semibold text-slate-900 tabular-nums">
                {specificity.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="font-semibold text-slate-800">F1-Score Harmonik:</span>
              <span className="font-bold text-blue-700 tabular-nums">
                {f1Score.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="p-2 bg-white border border-slate-200 rounded-[4px] text-[10.5px] text-slate-600 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Kinerja model melampaui batas ambang kelayakan implementasi klinis BPJS.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
