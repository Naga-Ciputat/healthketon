"use client";

import React from "react";
import { Calculator, ArrowRight, ShieldAlert, BookOpen, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TariffItemBreakdown {
  label: string;
  category: "UPCODING" | "INFLATED_ALKES" | "UNBUNDLING";
  originalAmount: number;
  adjustedAmount: number;
  deltaRupiah: number;
  note: string;
}

export interface TariffDeltaCalculatorProps {
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
  claimedCode = "I-4-10-III",
  claimedDescription = "Infark Miokard Akut dengan Komplikasi Berat (Severity Level III)",
  claimedTariff = 45000000,
  recommendedCode = "I-4-10-I",
  recommendedDescription = "Infark Miokard Akut Tanpa Komplikasi Berat (Severity Level I)",
  recommendedTariff = 20100000,
  breakdowns = [
    {
      label: "Severity Downcode (A41.9 Sepsis tidak memenuhi kriteria qSOFA/Lab)",
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
          <div className="w-6 h-6 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <Calculator className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs font-semibold text-slate-900 tracking-tight">
            Rekonsiliasi Tarif & Kalkulasi Koreksi
          </h4>
        </div>
        <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-medium">
          Diusulkan Penyesuaian
        </span>
      </div>

      {/* Code Transition Strip */}
      <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50/70 border border-slate-200/70 rounded p-3">
        {/* Billed (RS) */}
        <div>
          <span className="text-[11px] font-medium text-slate-500 block mb-1">
            Kode & Tarif Ditagihkan (Faskes)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-bold text-sm text-slate-900">
              {claimedCode}
            </span>
            <span className="text-xs font-semibold text-rose-700">
              {formatRupiah(claimedTariff)}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">
            {claimedDescription}
          </p>
        </div>

        {/* Recommended (Verified) */}
        <div className="md:border-l md:border-slate-200 md:pl-3">
          <span className="text-[11px] font-medium text-slate-500 block mb-1">
            Kode & Tarif Standar Wajar (Verifikasi)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-bold text-sm text-slate-900">
              {recommendedCode}
            </span>
            <span className="text-xs font-semibold text-emerald-700">
              {formatRupiah(recommendedTariff)}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">
            {recommendedDescription}
          </p>
        </div>
      </div>

      {/* Net Delta Summary */}
      <div className="mt-3 bg-emerald-50/60 border border-emerald-200/80 rounded p-3 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-emerald-900 font-medium block">
            Potensi Koreksi Biaya Sah (Penghematan Dana Amanah JKN)
          </span>
          <p className="text-[11px] text-emerald-700 mt-0.5">
            Dihitung matematis deterministik berdasarkan selisih klaim riil
          </p>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold font-mono text-emerald-800 tracking-tight">
            -{formatRupiah(totalDelta)}
          </span>
        </div>
      </div>

      {/* Itemized Discrepancy Breakdown */}
      <div className="mt-3">
        <span className="text-[11px] font-semibold text-slate-700 block mb-1.5">
          Rincian Komponen Selisih Biaya:
        </span>
        <div className="space-y-1.5">
          {breakdowns.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 p-2 bg-white border border-slate-200/70 rounded text-[11px]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-medium text-slate-900">
                    {item.label}
                  </span>
                  <span className="bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.2 rounded text-[10px]">
                    {item.category}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Rujukan: {item.note}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="font-mono font-semibold text-slate-800">
                  -{formatRupiah(item.deltaRupiah)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Legal Context */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[10.5px] text-slate-500">
        <BookOpen className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span className="truncate">Dasar Hukum: {regulationRef}</span>
      </div>
    </div>
  );
}
