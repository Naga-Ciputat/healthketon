"use client";

import React, { useState } from "react";
import { FileCheck, Search, Clock, ArrowRight, UserCheck, Mail, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuditLogItem {
  id: string;
  claimId: string;
  hospitalName: string;
  verifierName: string;
  verifierRole?: string;
  timestamp: string;
  action: "DISETUJUI" | "PENDING_KLARIFIKASI_RS" | "DOWNCODE_DIUSULKAN" | "ESKALASI_PK_JKN";
  finalTariff: number;
  savedDeltaRupiah: number;
  officialLetterNumber?: string;
  notes: string;
}

export interface AuditLogStreamProps {
  entries?: AuditLogItem[];
  title?: string;
  className?: string;
}

const DEFAULT_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "AUD-2026-004",
    claimId: "CLM-2026-089",
    hospitalName: "RS Sejahtera Medika",
    verifierName: "dr. Maya Wulandari",
    verifierRole: "Verifikator Utama BPJS Cabang Tangerang",
    timestamp: "12 Okt 2026, 11:20 WIB",
    action: "PENDING_KLARIFIKASI_RS",
    finalTariff: 20100000,
    savedDeltaRupiah: 24900000,
    officialLetterNumber: "BA-BPJS/2026/KLM-089/KLARIFIKASI",
    notes: "Klarifikasi resmi diterbitkan ke Komite Medik RS Sejahtera Medika terkait selisih 1 unit Stent DES dan kriteria diagnosis Sepsis.",
  },
  {
    id: "AUD-2026-003",
    claimId: "CLM-2026-012",
    hospitalName: "RS Mitra Sehat",
    verifierName: "dr. Maya Wulandari",
    verifierRole: "Verifikator Utama BPJS Cabang Tangerang",
    timestamp: "12 Okt 2026, 09:45 WIB",
    action: "DOWNCODE_DIUSULKAN",
    finalTariff: 8200000,
    savedDeltaRupiah: 7800000,
    officialLetterNumber: "BA-BPJS/2026/KLM-012/ADJUST",
    notes: "Penyesuaian kode dari G-4-14-II ke G-4-14-I disetujui DPJP RS. Selisih tarif dikoreksi dalam Berita Acara Rekonsiliasi.",
  },
  {
    id: "AUD-2026-002",
    claimId: "CLM-2026-077",
    hospitalName: "RSUD Kota Madya",
    verifierName: "Sistem Fast-Track AI",
    verifierRole: "Penyaringan Otomatis Regulasi Deterministik",
    timestamp: "12 Okt 2026, 08:15 WIB",
    action: "DISETUJUI",
    finalTariff: 6400000,
    savedDeltaRupiah: 0,
    notes: "Klaim bersih tervalidasi 100% tanpa anomali klinis maupun administratif. Diteruskan langsung ke status Siap Bayar (In-Monica).",
  },
  {
    id: "AUD-2026-001",
    claimId: "CLM-2026-034",
    hospitalName: "RS Sentosa Kasih",
    verifierName: "dr. Hendrawan Sp.PK",
    verifierRole: "Dewan Pertimbangan Klinis (DPK)",
    timestamp: "11 Okt 2026, 16:30 WIB",
    action: "ESKALASI_PK_JKN",
    finalTariff: 18500000,
    savedDeltaRupiah: 12400000,
    officialLetterNumber: "ESK-PKJKN/2026/10-091",
    notes: "Eskalasi ke tim Pencegahan Kecurangan JKN atas dugaan duplikasi catatan rekam medis (Note Cloning) berulang >3 kasus.",
  },
];

export function AuditLogStream({
  entries = DEFAULT_AUDIT_LOGS,
  title = "Jejak Audit & Rekam Putusan Verifikator",
  className,
}: AuditLogStreamProps) {
  const [filterAction, setFilterAction] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const getActionBadge = (action: AuditLogItem["action"]) => {
    switch (action) {
      case "DISETUJUI":
        return (
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium">
            Siap Bayar (Disetujui)
          </span>
        );
      case "PENDING_KLARIFIKASI_RS":
        return (
          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-medium">
            Klarifikasi Faskes
          </span>
        );
      case "DOWNCODE_DIUSULKAN":
        return (
          <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-medium">
            Penyesuaian Tarif
          </span>
        );
      case "ESKALASI_PK_JKN":
        return (
          <span className="bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-medium">
            Eskalasi Kecurangan
          </span>
        );
    }
  };

  const filtered = entries.filter((e) => {
    const matchesAction = filterAction === "ALL" || e.action === filterAction;
    const matchesSearch =
      e.claimId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.verifierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.officialLetterNumber &&
        e.officialLetterNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesAction && matchesSearch;
  });

  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-md p-4 text-slate-800 transition-all shadow-2xs",
        className
      )}
    >
      {/* Title & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <FileCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900 tracking-tight">
              {title}
            </h4>
            <p className="text-[11px] text-slate-500">
              Log permanen append-only kepatuhan tata kelola BPJS Kesehatan
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {["ALL", "PENDING_KLARIFIKASI_RS", "DOWNCODE_DIUSULKAN", "DISETUJUI"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterAction(status)}
              className={cn(
                "px-2 py-0.5 text-[11px] font-medium rounded border transition-colors",
                filterAction === status
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              )}
            >
              {status === "ALL"
                ? "Semua Log"
                : status === "PENDING_KLARIFIKASI_RS"
                ? "Klarifikasi"
                : status === "DOWNCODE_DIUSULKAN"
                ? "Koreksi"
                : "Disetujui"}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-3 relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter log berdasarkan ID klaim, RS, atau verifikator..."
          className="w-full pl-8 pr-3 py-1.5 bg-slate-50/70 border border-slate-200 rounded text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
        />
      </div>

      {/* Stream List */}
      <div className="mt-3 space-y-2.5">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50/50 border border-dashed border-slate-200 rounded">
            Tidak ada rekaman log audit yang sesuai kriteria pencarian.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-white border border-slate-200/90 rounded text-xs hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-slate-900">
                    {item.claimId}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-700 font-medium truncate">
                    {item.hospitalName}
                  </span>
                  {getActionBadge(item.action)}
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 flex-shrink-0">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{item.timestamp}</span>
                </div>
              </div>

              {/* Verifier & Official Letter */}
              <div className="mt-2 flex items-center justify-between gap-2 flex-wrap text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Verifikator: <strong className="text-slate-800">{item.verifierName}</strong>
                    {item.verifierRole && ` (${item.verifierRole})`}
                  </span>
                </div>

                {item.savedDeltaRupiah > 0 && (
                  <div className="font-mono text-emerald-700 font-semibold">
                    Koreksi: {formatRupiah(item.savedDeltaRupiah)}
                  </div>
                )}
              </div>

              {/* Notes & Letter Ref */}
              <p className="mt-2 text-[11.5px] text-slate-700 bg-slate-50/80 p-2 rounded border border-slate-100">
                {item.notes}
              </p>

              {item.officialLetterNumber && (
                <div className="mt-2 flex items-center gap-1.5 text-[10.5px] text-blue-700 font-mono">
                  <Mail className="w-3 h-3 text-blue-500" />
                  <span>Nomor Surat Resmi: {item.officialLetterNumber}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
