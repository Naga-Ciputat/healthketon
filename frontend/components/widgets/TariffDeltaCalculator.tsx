"use client";

import React from "react";
import {
  Calculator,
  ArrowRight,
  BookOpen,
  TrendingUp,
  FileSpreadsheet,
  Scissors,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { ClaimItem } from "@/lib/mockData";

export interface TariffItemBreakdown {
  label: string;
  category: "UPCODING" | "INFLATED_ALKES" | "UNBUNDLING";
  originalAmount: number;
  adjustedAmount: number;
  deltaRupiah: number;
  note: string;
}

export interface TariffDeltaCalculatorProps {
  claim?: ClaimItem;
  claimedCode?: string;
  claimedDescription?: string;
  claimedTariff?: number;
  recommendedCode?: string;
  recommendedDescription?: string;
  recommendedTariff?: number;
  breakdowns?: TariffItemBreakdown[];
  regulationRef?: string;
  className?: string;
}

export function TariffDeltaCalculator({
  claim,
  claimedCode = "I-4-10-III",
  claimedDescription = "Infark Miokard Akut dengan Komplikasi Berat (Severity Level III)",
  claimedTariff = 45000000,
  recommendedCode = "I-4-10-I",
  recommendedDescription = "Infark Miokard Akut Tanpa Komplikasi Berat (Severity Level I)",
  recommendedTariff = 20100000,
  breakdowns = [
    {
      label: "Severity Downcode (A41.9 Sepsis tidak memenuhi kriteria klinis/lab)",
      category: "UPCODING",
      originalAmount: 35000000,
      adjustedAmount: 20100000,
      deltaRupiah: 14900000,
      note: "Permenkes 3/2023 Bab VII Pedoman Tarif INA-CBG",
    },
    {
      label: "Alkes Stent DES (Kuitansi 2 unit vs Laporan Operasi pasang 1 unit)",
      category: "INFLATED_ALKES",
      originalAmount: 10000000,
      adjustedAmount: 0,
      deltaRupiah: 10000000,
      note: "Lampiran Berita Acara Rekonsiliasi Tindakan Bedah",
    },
  ],
  regulationRef = "Permenkes RI No. 3 Tahun 2023 tentang Standar Tarif Pelayanan Kesehatan dalam Program JKN",
  className,
}: TariffDeltaCalculatorProps) {
  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const totalDelta = claimedTariff - recommendedTariff;

  const renderCategoryIcon = (cat: TariffItemBreakdown["category"]) => {
    switch (cat) {
      case "UPCODING":
        return <TrendingUp className="w-3 h-3 text-rose-600" />;
      case "INFLATED_ALKES":
        return <FileSpreadsheet className="w-3 h-3 text-amber-600" />;
      case "UNBUNDLING":
        return <Scissors className="w-3 h-3 text-blue-600" />;
    }
  };

  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-md p-4 text-slate-800 transition-all shadow-2xs",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
            <Calculator className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs font-semibold text-slate-900 tracking-tight">
            Kalkulator Rekonsiliasi Tarif Klaim
          </h4>
        </div>
        <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-amber-600" />
          Diusulkan Penyesuaian
        </span>
      </div>

      {/* Code Transition Comparison */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50/70 border border-slate-200/70 rounded p-3">
        {/* Billed (RS) */}
        <div>
          <span className="text-[11px] font-medium text-slate-500 block mb-1">
            Ditagihkan Rumah Sakit
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-sm text-slate-900">
              {claimedCode}
            </span>
            <span className="text-xs font-semibold text-rose-700 tabular-nums">
              {formatRupiah(claimedTariff)}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">
            {claimedDescription}
          </p>
        </div>

        {/* Recommended (BPJS Verified) */}
        <div className="md:border-l md:border-slate-200 md:pl-3">
          <span className="text-[11px] font-medium text-slate-500 block mb-1">
            Standar Rujukan Verifikasi
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-sm text-slate-900">
              {recommendedCode}
            </span>
            <span className="text-xs font-semibold text-emerald-700 tabular-nums">
              {formatRupiah(recommendedTariff)}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">
            {recommendedDescription}
          </p>
        </div>
      </div>

      {/* Net Delta Summary (BPJS Green) */}
      <div className="mt-3 bg-emerald-50/70 border border-emerald-200 rounded p-3 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-emerald-900 font-semibold block">
            Potensi Koreksi Biaya (Penghematan Dana Amanah JKN)
          </span>
          <p className="text-[11px] text-emerald-700 mt-0.5">
            Kalkulasi deterministik berlandaskan kriteria klinis objektif
          </p>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-emerald-800 tracking-tight tabular-nums">
            -{formatRupiah(totalDelta)}
          </span>
        </div>
      </div>

      {/* Itemized Discrepancy Breakdown */}
      <div className="mt-3">
        <span className="text-[11px] font-semibold text-slate-700 block mb-1.5">
          Rincian Komponen Selisih:
        </span>
        <div className="space-y-1.5">
          {breakdowns.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 p-2 bg-white border border-slate-200/80 rounded text-[11px]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-medium text-slate-900">
                    {item.label}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded text-[10.5px]">
                    {renderCategoryIcon(item.category)}
                    <span>{item.category}</span>
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-500 mt-0.5">
                  Rujukan: {item.note}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="font-semibold text-slate-800 tabular-nums">
                  -{formatRupiah(item.deltaRupiah)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Legal Reference */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
        <BookOpen className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span className="truncate">Dasar Acuan: {regulationRef}</span>
      </div>
    </div>
  );
}
