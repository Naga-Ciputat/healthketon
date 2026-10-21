"use client";

import React, { useState } from "react";
import {
  X,
  UploadCloud,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalUploadClaimProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessUpload?: (newClaimSummary: string) => void;
}

export function ModalUploadClaim({
  isOpen,
  onClose,
  onSuccessUpload,
}: ModalUploadClaimProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepText, setStepText] = useState("");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [successDetails, setSuccessDetails] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulateSyntheticUpload = () => {
    setIsProcessing(true);
    setErrorDetails(null);
    setSuccessDetails(null);
    setStepText("Memvalidasi skema payload JSON klaim...");

    setTimeout(() => {
      setStepText("Memeriksa kepatuhan regulasi UU PDP No. 27/2022...");
      setTimeout(() => {
        setIsProcessing(false);
        setStepText("");
        setSuccessDetails(
          "Pemeriksaan lolos 100%! Seluruh data pasien telah ter-anonimisasi secara sintetis. Berkas berhasil dimasukkan ke antrean analisis prioritas (F2)."
        );
        onSuccessUpload?.("Paket Klaim Sintetis #CLM-2026-104");
      }, 900);
    }, 700);
  };

  const handleSimulateRealDataViolation = () => {
    setIsProcessing(true);
    setErrorDetails(null);
    setSuccessDetails(null);
    setStepText("Memeriksa kepatuhan regulasi UU PDP No. 27/2022...");

    setTimeout(() => {
      setIsProcessing(false);
      setStepText("");
      setErrorDetails(
        "PELANGGARAN UU PDP No. 27/2022 TERDETEKSI: Ditemukan nomor NIK 16-digit valid (3201021405780001) dan nama warga asli pada berkas rujukan. Sesuai protokol Privacy Guard, berkas seketika dibatalkan secara atomik dan residu dihapus dari memori."
      );
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden text-slate-800">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Unggah Paket Klaim Sintetis (F1 Intake)
              </h3>
              <p className="text-[11px] text-slate-500">
                Dilindungi oleh Privacy Guard & UU PDP No. 27/2022 Gatekeeper
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Dropzone Area */}
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50/40 hover:bg-slate-50/80 transition-colors">
            <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-2">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-semibold text-slate-800">
              Tarik & Letakkan Berkas Klaim (.json / .zip)
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
              Menerima berkas resume medis, laporan operasi, lab, dan billing penagihan
            </p>
          </div>

          {/* Test Preset Buttons */}
          <div className="space-y-2">
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Uji Coba Gatekeeper Cepat:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulateSyntheticUpload}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 text-xs font-medium text-left transition-all disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div>
                  <div className="font-bold text-[11px]">Uji Paket Sintetis</div>
                  <div className="text-[10px] text-emerald-600">Lolos Privacy Guard</div>
                </div>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulateRealDataViolation}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-800 text-xs font-medium text-left transition-all disabled:opacity-50"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <div>
                  <div className="font-bold text-[11px]">Uji Data Riil (Blokir)</div>
                  <div className="text-[10px] text-rose-600">Simulasi Tolak NIK</div>
                </div>
              </button>
            </div>
          </div>

          {/* Loading Progress State */}
          {isProcessing && (
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center gap-2.5 text-xs text-blue-900 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600 flex-shrink-0" />
              <span>{stepText}</span>
            </div>
          )}

          {/* Error / UU PDP Violation Alert */}
          {errorDetails && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-lg space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>Peringatan Kepatuhan Regulasi</span>
              </div>
              <p className="text-[11px] text-rose-700 leading-relaxed">
                {errorDetails}
              </p>
            </div>
          )}

          {/* Success Alert */}
          {successDetails && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-lg space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Klaim Tervalidasi</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                {successDetails}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
