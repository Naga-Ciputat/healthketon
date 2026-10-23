"use client";

import React from "react";
import { X, Split, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DiffViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  donorClaimId?: string;
  similarityScore?: number;
  donorText?: string;
  currentText?: string;
}

export function DiffViewerModal({
  isOpen,
  onClose,
  donorClaimId = "CLM-2026-077",
  similarityScore = 94,
  donorText = "Pasien mengeluh nyeri dada substernal menjalar ke lengan kiri sejak 3 jam SMRS disertai keringat dingin, mual, dan rasa tertekan beban berat pada dada sebelah kiri saat beristirahat.",
  currentText = "Pasien mengeluh nyeri dada substernal menjalar ke lengan kiri sejak 3 jam SMRS disertai keringat dingin, mual, dan rasa tertekan beban berat pada dada sebelah kiri saat beristirahat.",
}: DiffViewerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white border border-slate-200 rounded-[4px] w-full max-w-4xl shadow-xl overflow-hidden flex flex-col max-h-[85vh] text-slate-800">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[4px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Split className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold text-slate-900">
                  Komparasi Catatan SOAP (Note Cloning)
                </h3>
                <span className="px-1.5 py-0.5 rounded-[4px] text-[10.5px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 tabular-nums">
                  {similarityScore}% Identik
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Pemeriksaan Duplikasi Teks Rekam Medis Elektronik
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-[4px] text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Side-by-Side Comparison */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-[4px] flex items-center gap-2 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>
              Teks riwayat keluhan pasien terdeteksi identik 100% secara harfiah dengan catatan pasien donor yang dirawat sebelumnya oleh DPJP yang sama.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Left: Current Claim Note */}
            <div className="border border-slate-200 rounded-[4px] overflow-hidden bg-white">
              <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">
                  Klaim Saat Ini: Pasien Tn. R
                </span>
                <span className="text-[11px] text-slate-500 tabular-nums">09 Okt 2026</span>
              </div>
              <div className="p-3.5 text-xs leading-relaxed text-slate-800 space-y-2">
                <p className="bg-rose-50/70 border border-rose-200 p-2.5 rounded-[4px] text-rose-950 font-medium">
                  {currentText}
                </p>
                <p className="text-slate-500 text-[11px]">
                  Format pemeriksaan fisik dan tanda vital juga mengikuti susunan yang persis sama.
                </p>
              </div>
            </div>

            {/* Right: Historical Donor Claim Note */}
            <div className="border border-slate-200 rounded-[4px] overflow-hidden bg-white">
              <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">
                  Klaim Acuan: Pasien #{donorClaimId}
                </span>
                <span className="text-[11px] text-slate-500 tabular-nums">07 Okt 2026</span>
              </div>
              <div className="p-3.5 text-xs leading-relaxed text-slate-800 space-y-2">
                <p className="bg-slate-50 border border-slate-200 p-2.5 rounded-[4px] text-slate-900 font-medium">
                  {donorText}
                </p>
                <p className="text-slate-500 text-[11px]">
                  Catatan historis tersimpan dalam pangkalan data E-Klaim faskes yang sama.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/70 flex-shrink-0">
          <span className="text-[11px] text-slate-500">
            Klausul Acuan: Permenkes No. 24 Tahun 2022 tentang Rekam Medis Elektronik
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-[4px] text-xs font-semibold transition-colors shadow-2xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
