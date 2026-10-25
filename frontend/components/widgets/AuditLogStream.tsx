"use client";

import React, { useState } from "react";
import {
  FileCheck,
  Search,
  Clock,
  UserCheck,
  Mail,
  CheckCircle2,
  Sliders,
  AlertTriangle,
  FileText,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
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
  letterContent?: string;
}

export interface AuditLogStreamProps {
  entries?: AuditLogItem[];
  title?: string;
  highlightClaimId?: string | null;
  className?: string;
}

import { ModalOfficialLetter } from "@/components/widgets/ModalOfficialLetter";

export function AuditLogStream({
  entries = [],
  title = "Jejak Audit & Riwayat Putusan Klaim",
  highlightClaimId,
  className,
}: AuditLogStreamProps) {
  const [filterAction, setFilterAction] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItemForLetter, setSelectedItemForLetter] = useState<AuditLogItem | null>(null);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  // Status differentiation using functional icons in clean 4px rectangular containers
  const getActionBadge = (action: AuditLogItem["action"]) => {
    switch (action) {
      case "DISETUJUI":
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-[4px] text-[11px] font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
            <span>Disetujui (Valid)</span>
          </span>
        );
      case "PENDING_KLARIFIKASI_RS":
        return (
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-[4px] text-[11px] font-medium">
            <Mail className="w-3 h-3 text-slate-600 flex-shrink-0" />
            <span>Klarifikasi RS</span>
          </span>
        );
      case "DOWNCODE_DIUSULKAN":
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-[4px] text-[11px] font-medium">
            <Sliders className="w-3 h-3 text-blue-600 flex-shrink-0" />
            <span>Penyesuaian Tarif</span>
          </span>
        );
      case "ESKALASI_PK_JKN":
        return (
          <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-[4px] text-[11px] font-medium">
            <AlertTriangle className="w-3 h-3 text-rose-600 flex-shrink-0" />
            <span>Eskalasi Khusus</span>
          </span>
        );
    }
  };

  const filtered = entries.filter((e) => {
    const matchesAction = filterAction === "ALL" || e.action === filterAction;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      e.claimId.toLowerCase().includes(q) ||
      e.hospitalName.toLowerCase().includes(q) ||
      e.verifierName.toLowerCase().includes(q) ||
      (e.officialLetterNumber && e.officialLetterNumber.toLowerCase().includes(q)) ||
      e.notes.toLowerCase().includes(q);
    return matchesAction && matchesSearch;
  });

  const handleOpenLetter = (item: AuditLogItem) => {
    setSelectedItemForLetter(item);
  };

  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-[4px] p-4 text-slate-800 shadow-2xs space-y-3",
        className
      )}
    >
      {/* Title & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[4px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <FileCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900 tracking-tight">
              {title}
            </h4>
            <p className="text-[11px] text-slate-500">
              Catatan riwayat verifikasi dan surat resmi ke rumah sakit
            </p>
          </div>
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex items-center gap-1 flex-wrap">
          {[
            { id: "ALL", label: "Semua Riwayat" },
            { id: "PENDING_KLARIFIKASI_RS", label: "Klarifikasi RS" },
            { id: "DOWNCODE_DIUSULKAN", label: "Penyesuaian Tarif" },
            { id: "DISETUJUI", label: "Disetujui" },
          ].map((status) => (
            <button
              key={status.id}
              type="button"
              onClick={() => setFilterAction(status.id)}
              className={cn(
                "px-2.5 py-1 text-[11px] font-medium rounded-[4px] border transition-colors",
                filterAction === status.id
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              )}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari berkas berdasarkan ID klaim, RS, atau verifikator..."
          className="w-full pl-8 pr-3 py-1.5 bg-slate-50/70 border border-slate-200 rounded-[4px] text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all"
        />
      </div>

      {/* Synchronization Notification for newly archived claim */}
      {highlightClaimId && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[4px] text-xs text-emerald-950 flex items-center justify-between animate-in fade-in slide-in-from-top-3 duration-500 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold block truncate">
                Putusan Klaim #{highlightClaimId} Berhasil Tersinkronisasi
              </span>
              <span className="text-[11px] text-emerald-800">
                Data telah dialihkan dari Triage dan tercatat resmi secara permanen (append-only) ke repositori Audit Trail.
              </span>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-[4px] border border-emerald-300 flex-shrink-0 ml-2">
            Status Tercatat
          </span>
        </div>
      )}

      {/* Stream List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50/50 border border-dashed border-slate-200 rounded-[4px]">
            Tidak ada catatan riwayat yang sesuai kriteria pencarian.
          </div>
        ) : (
          filtered.map((item) => {
            const isNewlyAdded = Boolean(
              highlightClaimId && item.claimId.toLowerCase() === highlightClaimId.toLowerCase()
            );

            return (
              <div
                key={item.id}
                className={cn(
                  "p-3 bg-white border rounded-[4px] text-xs transition-all space-y-2 shadow-2xs",
                  isNewlyAdded
                    ? "border-blue-400 bg-blue-50/20 ring-2 ring-blue-500/25 shadow-md animate-in fade-in slide-in-from-top-6 duration-700 ease-out"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                {/* Emerging Entry Header Badge */}
                {isNewlyAdded && (
                  <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-blue-200/70 text-blue-900 bg-blue-50/80 -mx-3 -mt-3 p-2.5 rounded-t-[3px]">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                      </span>
                      <span className="font-semibold text-xs text-blue-950 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: "4s" }} />
                        <span>Baru Diarsipkan dari Ruang Telaah (Triage Klaim)</span>
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-[4px] border border-blue-200 uppercase tracking-wide">
                      Entry Terkini
                    </span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {item.claimId}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-700 font-medium truncate">
                      {item.hospitalName}
                    </span>
                    {getActionBadge(item.action)}
                  </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 flex-shrink-0 tabular-nums">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{item.timestamp}</span>
                </div>
              </div>

              {/* Verifier & Savings Info */}
              <div className="flex items-center justify-between gap-2 flex-wrap text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>
                    Verifikator: <strong className="text-slate-800 font-medium">{item.verifierName}</strong>
                    {item.verifierRole && ` (${item.verifierRole})`}
                  </span>
                </div>

                {item.savedDeltaRupiah > 0 && (
                  <div className="text-emerald-700 font-semibold tabular-nums">
                    Efisiensi Terkoreksi: {formatRupiah(item.savedDeltaRupiah)}
                  </div>
                )}
              </div>

              {/* Notes */}
              <p className="text-[11.5px] text-slate-700 bg-slate-50 p-2.5 rounded-[4px] border border-slate-200/70 leading-relaxed">
                {item.notes}
              </p>

              {/* Official Letter Link Button */}
              <div className="flex items-center justify-between pt-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span className="tabular-nums">
                    {item.officialLetterNumber || `BA-${item.claimId}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenLetter(item)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border border-slate-200 hover:bg-slate-50 text-blue-700 font-medium rounded-[4px] transition-colors shadow-2xs"
                >
                  <span>Lihat Surat Resmi</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>

      {/* Official Letter Preview Modal */}
      <ModalOfficialLetter
        isOpen={!!selectedItemForLetter}
        onClose={() => setSelectedItemForLetter(null)}
        letterData={
          selectedItemForLetter
            ? {
                letterType: selectedItemForLetter.action,
                letterNumber:
                  selectedItemForLetter.officialLetterNumber ||
                  `BA-BPJS/2026/${selectedItemForLetter.claimId}`,
                claimId: selectedItemForLetter.claimId,
                hospitalName: selectedItemForLetter.hospitalName,
                verifierName: selectedItemForLetter.verifierName,
                verifierRole: selectedItemForLetter.verifierRole,
                timestamp: selectedItemForLetter.timestamp,
                finalTariff: selectedItemForLetter.finalTariff,
                savedDeltaRupiah: selectedItemForLetter.savedDeltaRupiah,
                notes: selectedItemForLetter.notes,
                rawContent: selectedItemForLetter.letterContent,
              }
            : null
        }
      />
    </div>
  );
}
