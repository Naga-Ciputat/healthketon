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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ClaimItem } from "@/lib/mockData";

export interface ClaimTableProps {
  claims: ClaimItem[];
  onSelectClaim?: (claimId: string) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSortChange?: (field: string) => void;
  onResetFilters?: () => void;
  className?: string;
}

export function ClaimTable({
  claims,
  onSelectClaim,
  sortBy,
  sortOrder = "desc",
  onSortChange,
  onResetFilters,
  className,
}: ClaimTableProps) {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-0 group-hover/col:opacity-100 transition-opacity" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3 h-3 text-blue-600" />
    ) : (
      <ArrowDown className="w-3 h-3 text-blue-600" />
    );
  };

  // Status badges: clean text in rectangular 4px container + functional icon (strictly no circular dot ●)
  const getStatusBadge = (status: ClaimItem["status"]) => {
    switch (status) {
      case "PERLU_TINJAUAN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600 flex-shrink-0" />
            <span>Perlu Telaah</span>
          </span>
        );
      case "PENDING_KLARIFIKASI_RS":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
            <Mail className="w-3 h-3 text-slate-600 flex-shrink-0" />
            <span>Klarifikasi RS</span>
          </span>
        );
      case "DOWNCODE_DIUSULKAN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
            <Sliders className="w-3 h-3 text-blue-600 flex-shrink-0" />
            <span>Penyesuaian Tarif</span>
          </span>
        );
      case "DISETUJUI":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
            <span>Disetujui (Valid)</span>
          </span>
        );
      case "ESKALASI_PK_JKN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600 flex-shrink-0" />
            <span>Eskalasi Khusus</span>
          </span>
        );
    }
  };

  // Risk badges: rectangular 4px container + functional icon (strictly no circular dot ●)
  const getRiskBadge = (risk: ClaimItem["riskLevel"]) => {
    switch (risk) {
      case "TINGGI":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600 flex-shrink-0" />
            <span>Tinggi</span>
          </span>
        );
      case "SEDANG":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-600 flex-shrink-0" />
            <span>Sedang</span>
          </span>
        );
      case "RENDAH":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
            <span>Rendah</span>
          </span>
        );
    }
  };

  // Modus tags: differentiated by icon in neutral 4px box (no rainbow saturation)
  const renderModusTag = (modus: string) => {
    let icon = <AlertCircle className="w-3 h-3 text-slate-500 flex-shrink-0" />;

    if (modus === "Upcoding") {
      icon = <TrendingUp className="w-3 h-3 text-rose-600 flex-shrink-0" />;
    } else if (modus === "Inflated Alkes") {
      icon = <FileSpreadsheet className="w-3 h-3 text-amber-600 flex-shrink-0" />;
    } else if (modus === "Note Cloning") {
      icon = <Copy className="w-3 h-3 text-slate-600 flex-shrink-0" />;
    } else if (modus === "Unbundling") {
      icon = <Scissors className="w-3 h-3 text-blue-600 flex-shrink-0" />;
    }

    return (
      <span
        key={modus}
        className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-[4px] text-[10.5px] font-medium"
      >
        {icon}
        <span>{modus}</span>
      </span>
    );
  };

  return (
    <div
      className={cn(
        "w-full bg-white border border-slate-200 rounded-[4px] overflow-hidden shadow-2xs",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-600 select-none">
              {/* ID & Faskes */}
              <th
                onClick={() => onSortChange?.("id")}
                className="py-2.5 px-3.5 group/col cursor-pointer hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>ID Berkas &amp; Faskes</span>
                  {getSortIcon("id")}
                </div>
              </th>

              {/* Diagnosis Primer */}
              <th className="py-2.5 px-3.5">
                <span>Diagnosis Primer &amp; INA-CBG</span>
              </th>

              {/* Tagihan RS */}
              <th
                onClick={() => onSortChange?.("tariff")}
                className="py-2.5 px-3.5 text-right group/col cursor-pointer hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Tagihan RS</span>
                  {getSortIcon("tariff")}
                </div>
              </th>

              {/* Status */}
              <th
                onClick={() => onSortChange?.("status")}
                className="py-2.5 px-3.5 group/col cursor-pointer hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  {getSortIcon("status")}
                </div>
              </th>

              {/* Tingkat Risiko */}
              <th
                onClick={() => onSortChange?.("risk")}
                className="py-2.5 px-3.5 group/col cursor-pointer hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Tingkat Risiko</span>
                  {getSortIcon("risk")}
                </div>
              </th>

              {/* Indikasi Anomali */}
              <th className="py-2.5 px-3.5">
                <span>Indikasi Anomali</span>
              </th>

              {/* Potensi Selisih */}
              <th
                onClick={() => onSortChange?.("delta")}
                className="py-2.5 px-3.5 text-right group/col cursor-pointer hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Potensi Selisih</span>
                  {getSortIcon("delta")}
                </div>
              </th>

              {/* Aksi */}
              <th className="py-2.5 px-3.5 text-center">
                <span>Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {claims.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 px-4 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2">
                    <div className="w-10 h-10 rounded-[4px] bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                      <Inbox className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                      Tidak Ada Berkas Klaim Ditemukan
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Tidak ada klaim yang cocok dengan kriteria pencarian atau filter yang diterapkan saat ini.
                    </p>
                    {onResetFilters && (
                      <button
                        type="button"
                        onClick={onResetFilters}
                        className="mt-2 px-3 py-1 bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-200 text-xs font-medium rounded-[4px] transition-colors shadow-2xs"
                      >
                        Bersihkan Semua Filter
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              claims.map((claim) => (
                <tr
                  key={claim.id}
                  className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                  onClick={() => onSelectClaim?.(claim.id)}
                >
                  {/* ID Klaim & Rumah Sakit */}
                  <td className="py-2.5 px-3.5">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors tabular-nums">
                        {claim.id}
                      </span>
                      <span className="text-slate-600 truncate max-w-[170px] text-[11.5px]">
                        {claim.hospitalName}
                      </span>
                      <span className="text-[11px] text-slate-400 tabular-nums">
                        {claim.patientAge} th • {claim.patientGender === "L" ? "Laki-laki" : "Perempuan"}
                      </span>
                    </div>
                  </td>

                  {/* Diagnosa Utama & INA-CBG */}
                  <td className="py-2.5 px-3.5">
                    <div className="flex flex-col max-w-[220px]">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-[4px] text-[10.5px] tabular-nums">
                          {claim.primaryDiagnosis.code}
                        </span>
                        <span className="font-medium text-slate-800 truncate" title={claim.primaryDiagnosis.name}>
                          {claim.primaryDiagnosis.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-0.5 tabular-nums">
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectClaim?.(claim.id);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 rounded-[4px] text-[11px] font-medium transition-colors"
                    >
                      <span>Buka</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
