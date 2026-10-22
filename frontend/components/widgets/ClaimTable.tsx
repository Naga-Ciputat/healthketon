"use client";

import React from "react";
import {
  ChevronRight,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  Mail,
  Sliders,
  Copy,
  TrendingUp,
  FileSpreadsheet,
  Scissors,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ClaimItem } from "@/lib/mockData";

export interface ClaimTableProps {
  claims: ClaimItem[];
  onSelectClaim?: (claimId: string) => void;
  className?: string;
}

export function ClaimTable({ claims, onSelectClaim, className }: ClaimTableProps) {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Status differentiation primarily using icons + subtle BPJS blue/green
  const getStatusBadge = (status: ClaimItem["status"]) => {
    switch (status) {
      case "PERLU_TINJAUAN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            Perlu Telaah
          </span>
        );
      case "PENDING_KLARIFIKASI_RS":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
            <Mail className="w-3 h-3 text-slate-600" />
            Klarifikasi Faskes
          </span>
        );
      case "DOWNCODE_DIUSULKAN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
            <Sliders className="w-3 h-3 text-blue-600" />
            Penyesuaian Tarif
          </span>
        );
      case "DISETUJUI":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Selesai (Valid)
          </span>
        );
      case "ESKALASI_PK_JKN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Eskalasi Khusus
          </span>
        );
    }
  };

  // Risk badges: warning/urgent uses red/amber, low uses subtle slate/emerald
  const getRiskBadge = (risk: ClaimItem["riskLevel"]) => {
    switch (risk) {
      case "TINGGI":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Tinggi
          </span>
        );
      case "SEDANG":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Sedang
          </span>
        );
      case "RENDAH":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Rendah
          </span>
        );
    }
  };

  // Modus tags: differentiated by ICON in clean neutral container, no rainbow colors
  const renderModusTag = (modus: string) => {
    let icon = <AlertCircle className="w-3 h-3 text-slate-500" />;

    if (modus === "Upcoding") {
      icon = <TrendingUp className="w-3 h-3 text-rose-600" />;
    } else if (modus === "Inflated Alkes") {
      icon = <FileSpreadsheet className="w-3 h-3 text-amber-600" />;
    } else if (modus === "Note Cloning") {
      icon = <Copy className="w-3 h-3 text-slate-600" />;
    } else if (modus === "Unbundling") {
      icon = <Scissors className="w-3 h-3 text-blue-600" />;
    }

    return (
      <span
        key={modus}
        className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-700 border border-slate-200 rounded text-[11px] font-medium"
      >
        {icon}
        <span>{modus}</span>
      </span>
    );
  };

  return (
    <div
      className={cn(
        "w-full bg-white border border-slate-200 rounded-md overflow-hidden shadow-2xs",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-600">
              <th className="py-2.5 px-3.5">ID Berkas &amp; Faskes</th>
              <th className="py-2.5 px-3.5">Diagnosis Primer &amp; INA-CBG</th>
              <th className="py-2.5 px-3.5 text-right">Tagihan RS</th>
              <th className="py-2.5 px-3.5">Status</th>
              <th className="py-2.5 px-3.5">Tingkat Risiko</th>
              <th className="py-2.5 px-3.5">Indikasi Temuan</th>
              <th className="py-2.5 px-3.5 text-right">Potensi Selisih</th>
              <th className="py-2.5 px-3.5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {claims.map((claim) => (
              <tr
                key={claim.id}
                className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                onClick={() => onSelectClaim?.(claim.id)}
              >
                {/* ID Klaim & Rumah Sakit */}
                <td className="py-2.5 px-3.5">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {claim.id}
                    </span>
                    <span className="text-slate-600 truncate max-w-[170px] text-[11.5px]">
                      {claim.hospitalName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {claim.patientAge} th • {claim.patientGender === "L" ? "Laki-laki" : "Perempuan"}
                    </span>
                  </div>
                </td>

                {/* Diagnosa Utama & INA-CBG */}
                <td className="py-2.5 px-3.5">
                  <div className="flex flex-col max-w-[220px]">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 font-semibold rounded text-[10.5px]">
                        {claim.primaryDiagnosis.code}
                      </span>
                      <span className="font-medium text-slate-800 truncate" title={claim.primaryDiagnosis.name}>
                        {claim.primaryDiagnosis.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      INA-CBG: {claim.inacbgCode}
                    </span>
                  </div>
                </td>

                {/* Total Tagihan */}
                <td className="py-2.5 px-3.5 text-right font-medium text-slate-900 tabular-nums">
                  {formatRupiah(claim.claimedTariff)}
                </td>

                {/* Status Klaim */}
                <td className="py-2.5 px-3.5">
                  {getStatusBadge(claim.status)}
                </td>

                {/* Tingkat Risiko */}
                <td className="py-2.5 px-3.5">
                  {getRiskBadge(claim.riskLevel)}
                </td>

                {/* Modus Terindikasi */}
                <td className="py-2.5 px-3.5">
                  <div className="flex flex-wrap gap-1 max-w-[180px]">
                    {claim.modusTags.length > 0 ? (
                      claim.modusTags.map((tag) => renderModusTag(tag))
                    ) : (
                      <span className="text-slate-400 text-[11px]">Tidak ada temuan</span>
                    )}
                  </div>
                </td>

                {/* Potensi Selisih Biaya */}
                <td className="py-2.5 px-3.5 text-right">
                  {claim.deltaTariff > 0 ? (
                    <span className="font-semibold text-rose-700 tabular-nums">
                      -{formatRupiah(claim.deltaTariff)}
                    </span>
                  ) : (
                    <span className="text-slate-400 tabular-nums">Rp 0</span>
                  )}
                </td>

                {/* Tombol Aksi */}
                <td className="py-2.5 px-3.5 text-center">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 rounded text-[11px] font-medium transition-colors"
                  >
                    <span>Buka</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
