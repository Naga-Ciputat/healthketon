"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, AlertTriangle, ShieldCheck, FileText } from "lucide-react";
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

  const getStatusBadge = (status: ClaimItem["status"]) => {
    switch (status) {
      case "PERLU_TINJAUAN":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Perlu Tinjauan
          </span>
        );
      case "PENDING_KLARIFIKASI_RS":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Pending Klarifikasi RS
          </span>
        );
      case "DOWNCODE_DIUSULKAN":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            Downcode Diusulkan
          </span>
        );
      case "DISETUJUI":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Disetujui (Valid)
          </span>
        );
      case "ESKALASI_PK_JKN":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Eskalasi PK-JKN
          </span>
        );
    }
  };

  const getRiskBadge = (risk: ClaimItem["riskLevel"]) => {
    switch (risk) {
      case "TINGGI":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            Tinggi
          </span>
        );
      case "SEDANG":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Sedang
          </span>
        );
      case "RENDAH":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Rendah
          </span>
        );
    }
  };

  const getModusBadge = (modus: string) => {
    switch (modus) {
      case "Upcoding":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Inflated Alkes":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Note Cloning":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div
      className={cn(
        "w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Klaim & Faskes</th>
              <th className="py-3 px-4">Diagnosa Primer & INA-CBG</th>
              <th className="py-3 px-4 text-right">Tagihan RS</th>
              <th className="py-3 px-4">Status Verifikasi</th>
              <th className="py-3 px-4">Tingkat Risiko</th>
              <th className="py-3 px-4">Modus Terindikasi</th>
              <th className="py-3 px-4 text-right">Potensi Selisih</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {claims.map((claim) => (
              <tr
                key={claim.id}
                className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                onClick={() => onSelectClaim?.(claim.id)}
              >
                {/* ID Klaim & Rumah Sakit */}
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors font-mono">
                      {claim.id}
                    </span>
                    <span className="font-medium text-slate-600 truncate max-w-[160px]">
                      {claim.hospitalName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {claim.patientAge} th • {claim.patientGender === "L" ? "Laki-laki" : "Perempuan"}
                    </span>
                  </div>
                </td>

                {/* Diagnosa Utama & INA-CBG */}
                <td className="py-3 px-4">
                  <div className="flex flex-col max-w-[220px]">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 font-mono font-semibold rounded text-[10px]">
                        {claim.primaryDiagnosis.code}
                      </span>
                      <span className="font-medium text-slate-800 truncate" title={claim.primaryDiagnosis.name}>
                        {claim.primaryDiagnosis.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono mt-0.5">
                      INA-CBG: {claim.inacbgCode}
                    </span>
                  </div>
                </td>

                {/* Total Tagihan */}
                <td className="py-3 px-4 text-right font-mono font-medium text-slate-900">
                  {formatRupiah(claim.claimedTariff)}
                </td>

                {/* Status Klaim */}
                <td className="py-3 px-4">
                  {getStatusBadge(claim.status)}
                </td>

                {/* Tingkat Risiko */}
                <td className="py-3 px-4">
                  {getRiskBadge(claim.riskLevel)}
                </td>

                {/* Modus Terindikasi */}
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1 max-w-[180px]">
                    {claim.modusTags.length > 0 ? (
                      claim.modusTags.map((tag) => (
                        <span
                          key={tag}
                          className={cn(
                            "px-1.5 py-0.2 rounded text-[10px] font-medium border",
                            getModusBadge(tag)
                          )}
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-[11px]">—</span>
                    )}
                  </div>
                </td>

                {/* Estimasi Selisih */}
                <td className="py-3 px-4 text-right">
                  {claim.deltaTariff > 0 ? (
                    <span className="font-mono font-bold text-rose-600 bg-rose-50/70 px-1.5 py-0.5 rounded border border-rose-200/60">
                      -{formatRupiah(claim.deltaTariff)}
                    </span>
                  ) : (
                    <span className="font-mono text-emerald-600 font-medium">
                      Rp 0 (Sesuai)
                    </span>
                  )}
                </td>

                {/* Aksi Button */}
                <td className="py-3 px-4 text-center">
                  <Link
                    href={`/claims/${claim.id}/dossier`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-600 hover:text-white transition-all shadow-2xs group-hover:border-blue-600"
                  >
                    <span>Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
