"use client";

import React from "react";
import {
  History,
  Clock,
  ExternalLink,
  Scale,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ClaimItem } from "@/lib/mockData";

export interface ReadmissionFindingCardProps {
  claim: ClaimItem;
  onOpenDetail: () => void;
  className?: string;
}

export function ReadmissionFindingCard({
  claim,
  onOpenDetail,
  className,
}: ReadmissionFindingCardProps) {
  const intervalDays = claim.readmissionIntervalDays || 15;
  const encounters = claim.priorEncounters || [];
  const prior = encounters.find((e) => e.encounterType === "PRIOR_ADMISSION");
  const current = encounters.find((e) => e.encounterType === "CURRENT_ADMISSION");

  const priorTariff = prior?.claimedTariff || 18500000;
  const currentTariff = current?.claimedTariff || claim.claimedTariff || 45000000;
  const totalTariff = priorTariff + currentTariff;

  return (
    <div
      className={cn(
        "bg-white border border-amber-200 hover:border-amber-300 rounded-[4px] p-4 shadow-2xs transition-colors space-y-3",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-semibold border bg-amber-50 text-amber-800 border-amber-200">
              <History className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
              <span>Readmisi &le; 30 Hari</span>
            </span>

            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[10.5px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600 flex-shrink-0" />
              <span>Jeda {intervalDays} Hari</span>
            </span>

            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[10.5px] font-medium bg-slate-50 text-slate-700 border border-slate-200">
              <span>DPJP: {claim.dpjpName}</span>
            </span>

            <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-[4px] border border-amber-200 tabular-nums">
              Akumulasi: Rp {totalTariff.toLocaleString("id-ID")}
            </span>
          </div>

          <h4 className="text-xs font-bold text-slate-900 leading-snug">
            Indikasi Fragmentasi Episode Rawat Inap (Readmisi {intervalDays} Hari)
          </h4>
        </div>
      </div>

      {/* Narrative Explanation */}
      <p className="text-xs text-slate-600 leading-relaxed">
        Pasien kembali dirawat inap dalam kurun waktu <strong>{intervalDays} hari</strong> pasca rawat inap sebelumnya ({prior?.primaryDiagnosis?.code || "I20.0"} &mdash; {prior?.primaryDiagnosis?.name || "Unstable Angina Pectoris"}) pada faskes dan DPJP yang sama. Terindikasi potensi pemecahan episode rawat inap terencana (<em>unbundled hospital admission</em>) penundaan tindakan kateterisasi elektif.
      </p>

      {/* Compact Two-Episode Quick Comparison Strip */}
      <div className="bg-slate-50/80 border border-slate-200 rounded-[4px] p-2.5 text-xs space-y-2">
        <div className="text-[11px] font-semibold text-slate-700 flex items-center justify-between">
          <span>Perbandingan Dua Rawat Inap Beruntun</span>
          <span className="text-amber-800 font-semibold tabular-nums">
            Jeda {intervalDays} Hari Pasca Pulang
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-white p-2 rounded-[4px] border border-slate-200 shadow-2xs space-y-0.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Rawat Inap 1 (Historis)</span>
              <span>{prior?.admissionDate || "21 Sep"} &ndash; {prior?.dischargeDate || "24 Sep 2026"}</span>
            </div>
            <div className="font-medium text-slate-800 truncate">
              {prior?.primaryDiagnosis?.code || "I20.0"} &mdash; {prior?.primaryDiagnosis?.name || "UAP"}
            </div>
            <div className="text-[10.5px] font-semibold text-slate-700 tabular-nums">
              {prior?.inacbgCode || "I-4-11-I"} (Rp {priorTariff.toLocaleString("id-ID")})
            </div>
          </div>

          <div className="bg-white p-2 rounded-[4px] border border-blue-200 shadow-2xs space-y-0.5">
            <div className="flex items-center justify-between text-[10px] text-blue-600 font-medium">
              <span>Rawat Inap 2 (Klaim Berjalan)</span>
              <span>{current?.admissionDate || "09 Okt"} &ndash; {current?.dischargeDate || "11 Okt 2026"}</span>
            </div>
            <div className="font-medium text-slate-900 truncate">
              {claim.primaryDiagnosis?.code || "I21.0"} &mdash; {claim.primaryDiagnosis?.name || "STEMI"}
            </div>
            <div className="text-[10.5px] font-semibold text-slate-900 tabular-nums">
              {claim.inacbgCode} (Rp {currentTariff.toLocaleString("id-ID")})
            </div>
          </div>
        </div>
      </div>

      {/* Button to Open Pop-up Detail */}
      <button
        type="button"
        onClick={onOpenDetail}
        className="w-full py-2 px-3 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-[4px] flex items-center justify-between transition-colors shadow-2xs group"
      >
        <span className="flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
          <span>Buka Evaluasi & Kronologi Readmisi</span>
        </span>
        <ExternalLink className="w-3.5 h-3.5 text-amber-700 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
      </button>

      {/* Regulation Reference */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
        <Scale className="w-3 h-3 text-slate-400 flex-shrink-0" />
        <span className="truncate">Permenkes No. 3 Tahun 2023 Lampiran II (Klausul Kesinambungan Perawatan)</span>
      </div>
    </div>
  );
}
