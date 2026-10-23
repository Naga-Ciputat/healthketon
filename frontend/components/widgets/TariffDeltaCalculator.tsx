"use client";

import React from "react";
import {
  Calculator,
  BookOpen,
  TrendingUp,
  FileSpreadsheet,
  Scissors,
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
  claimedCode: propClaimedCode,
  claimedDescription: propClaimedDesc,
  claimedTariff: propClaimedTariff,
  recommendedCode: propRecCode,
  recommendedDescription: propRecDesc,
  recommendedTariff: propRecTariff,
  breakdowns: propBreakdowns,
  regulationRef = "Permenkes RI No. 3 Tahun 2023 tentang Standar Tarif Pelayanan Kesehatan dalam Program JKN",
  className,
}: TariffDeltaCalculatorProps) {
  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const claimedCode = claim?.inacbgCode || propClaimedCode || "I-4-10-III";
  const claimedDescription = claim?.inacbgDescription || propClaimedDesc || "Infark Miokard Akut dengan Komplikasi Berat (Severity Level III)";
  const claimedTariff = claim?.claimedTariff ?? propClaimedTariff ?? 45000000;
  const recommendedCode = claim ? "I-4-10-I" : (propRecCode || "I-4-10-I");
  const recommendedDescription = claim ? "Infark Miokard Akut Tanpa Komplikasi Berat (Severity Level I)" : (propRecDesc || "Infark Miokard Akut Tanpa Komplikasi Berat (Severity Level I)");
  const recommendedTariff = claim?.fairTariff ?? propRecTariff ?? 20100000;
  const totalDelta = claim?.deltaTariff ?? (claimedTariff - recommendedTariff);

  const breakdowns: TariffItemBreakdown[] = claim
    ? claim.findings
        .filter((f) => f.deltaRupiah && f.deltaRupiah > 0)
        .map((f) => ({
          label: f.title,
          category: f.type === "INFLATED_ALKES" ? "INFLATED_ALKES" : "UPCODING",
          originalAmount: f.deltaRupiah || 0,
          adjustedAmount: 0,
          deltaRupiah: f.deltaRupiah || 0,
          note: f.regulationReference || "Permenkes RI No. 3/2023",
        }))
    : propBreakdowns || [
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
      ];

  const renderCategoryIcon = (cat: TariffItemBreakdown["category"]) => {
    switch (cat) {
      case "UPCODING":
        return <TrendingUp className="w-3 h-3 text-rose-600 flex-shrink-0" />;
      case "INFLATED_ALKES":
        return <FileSpreadsheet className="w-3 h-3 text-amber-600 flex-shrink-0" />;
      case "UNBUNDLING":
        return <Scissors className="w-3 h-3 text-blue-600 flex-shrink-0" />;
    }
  };

  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-[4px] p-4 text-slate-800 shadow-2xs space-y-3",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[4px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <Calculator className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs font-semibold text-slate-900 tracking-tight">
            Kalkulator Rekonsiliasi Tarif Klaim
          </h4>
        </div>
        <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-[4px] text-[11px] font-medium flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-amber-600 flex-shrink-0" />
          <span>Diusulkan Penyesuaian</span>
        </span>
      </div>

      {/* Code Transition Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50/70 border border-slate-200 rounded-[4px] p-3">
        {/* Billed (RS) */}
        <div>
          <span className="text-[11px] font-medium text-slate-500 block mb-1">
            Ditagihkan Rumah Sakit
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-sm text-slate-900 tabular-nums">
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
            <span className="font-bold text-sm text-slate-900 tabular-nums">
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
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-[4px] p-3 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-emerald-950 font-semibold block">
            Potensi Koreksi Biaya (Efisiensi Beban JKN)
          </span>
          <p className="text-[11px] text-emerald-700 mt-0.5">
            Kalkulasi deterministik berlandaskan bukti resume medis objektif
          </p>
        </div>
        <div className="text-right">
          <span className="text-base font-bold text-emerald-800 tracking-tight tabular-nums">
            -{formatRupiah(totalDelta)}
          </span>
        </div>
      </div>

      {/* Itemized Discrepancy Breakdown */}
      {breakdowns.length > 0 && (
        <div>
          <span className="text-[11px] font-semibold text-slate-700 block mb-1.5">
            Rincian Komponen Selisih:
          </span>
          <div className="space-y-1.5">
            {breakdowns.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 p-2 bg-white border border-slate-200 rounded-[4px] text-[11px]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-medium text-slate-900">
                      {item.label}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded-[4px] text-[10.5px]">
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
      )}

      {/* Footer Legal Reference */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
        <BookOpen className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span className="truncate">Dasar Acuan: {regulationRef}</span>
      </div>
    </div>
  );
}
