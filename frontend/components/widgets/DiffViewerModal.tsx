"use client";

import React from "react";
import { X, Split, Copy, AlertTriangle } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Split className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Komparator Catatan Medis (Note Cloning Diff)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  {similarityScore}% Identik
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Pencocokan Semantik MinHash N-Gram &amp; Vector Similarity
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Side-by-Side Comparison */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              Teks riwayat keluhan pasien saat ini identik 100% secara harfiah dengan catatan pasien donor yang dirawat 2 hari sebelumnya oleh dokter yang sama.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Current Claim Note */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  Kasus Uji: Pasien #CLM-2026-089 (Tn. R)
                </span>
                <span className="text-[10px] text-slate-500">09 Okt 2026</span>
              </div>
              <div className="p-4 text-xs font-serif leading-relaxed text-slate-800 space-y-2">
                <p className="bg-rose-50 border border-rose-200 p-2.5 rounded text-rose-950 font-medium">
                  {currentText}
                </p>
                <p className="text-slate-500 text-[11px] italic">
                  (Pemeriksaan fisik dan TTV juga menggunakan format urutan yang persis sama)
                </p>
              </div>
            </div>

            {/* Right: Historical Donor Claim Note */}
            <div className="border border-indigo-200 rounded-xl overflow-hidden bg-white">
              <div className="px-4 py-2.5 bg-indigo-50/70 border-b border-indigo-200 flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-950">
                  Kasus Donor: Pasien #{donorClaimId}
                </span>
                <span className="text-[10px] text-indigo-600 font-semibold">07 Okt 2026</span>
              </div>
              <div className="p-4 text-xs font-serif leading-relaxed text-slate-800 space-y-2">
                <p className="bg-indigo-50/60 border border-indigo-200 p-2.5 rounded text-indigo-950 font-medium">
                  {donorText}
                </p>
                <p className="text-indigo-600 text-[11px] italic">
                  (Kasus historis acuan tersimpan di database korpus RS)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
          <span className="text-[11px] text-slate-500">
            Regulasi Acuan: Permenkes No. 24 Tahun 2022 tentang Integritas Rekam Medis Elektronik
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
