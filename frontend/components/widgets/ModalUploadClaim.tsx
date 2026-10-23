"use client";

import React, { useState } from "react";
import {
  X,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  FileCheck,
  Shield,
  Layers,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ClaimItem, INITIAL_CLAIMS } from "@/lib/mockData";

export interface ModalUploadClaimProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessUpload?: (newClaim: ClaimItem) => void;
}

export function ModalUploadClaim({
  isOpen,
  onClose,
  onSuccessUpload,
}: ModalUploadClaimProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [stepMessage, setStepMessage] = useState<string>("");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [uploadedClaim, setUploadedClaim] = useState<ClaimItem | null>(null);

  if (!isOpen) return null;

  const resetState = () => {
    setIsProcessing(false);
    setCurrentStep(0);
    setStepMessage("");
    setErrorDetails(null);
    setUploadedClaim(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSimulateUpload = (presetType: "HEART_SURGERY" | "KIDNEY_CLONE" | "PII_VIOLATION") => {
    resetState();
    setIsProcessing(true);
    setCurrentStep(1);
    setStepMessage("1. Memeriksa kelengkapan struktur skema berkas INA-CBG...");

    setTimeout(() => {
      if (presetType === "PII_VIOLATION") {
        setIsProcessing(false);
        setCurrentStep(0);
        setErrorDetails(
          "Validasi Gagal: Dokumen terdeteksi memuat nomor NIK 16-digit valid (3201021405780001) dan nama pasien tanpa sanitasi data. Berkas ditolak untuk melindungi privasi data rekam medis."
        );
        return;
      }

      setCurrentStep(2);
      setStepMessage("2. Memverifikasi sanitasi identitas data pasien...");

      setTimeout(() => {
        setCurrentStep(3);
        setStepMessage("3. Menghitung profil risiko anomali awal dan estimasi tarif...");

        setTimeout(() => {
          setIsProcessing(false);

          let newClaim: ClaimItem;
          if (presetType === "HEART_SURGERY") {
            newClaim = {
              ...INITIAL_CLAIMS[0],
              id: `CLM-2026-${Math.floor(100 + Math.random() * 900)}`,
              admissionDate: "2026-10-18",
              dischargeDate: "2026-10-22",
            };
          } else {
            newClaim = {
              ...INITIAL_CLAIMS[1],
              id: `CLM-2026-${Math.floor(100 + Math.random() * 900)}`,
              admissionDate: "2026-10-17",
              dischargeDate: "2026-10-21",
            };
          }

          setUploadedClaim(newClaim);
          onSuccessUpload?.(newClaim);
        }, 600);
      }, 600);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white border border-slate-200 rounded-[4px] w-full max-w-lg shadow-xl overflow-hidden text-slate-800">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[4px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-900">
                Unggah Berkas Klaim Digital
              </h3>
              <p className="text-[11px] text-slate-500">
                Intake &amp; Validasi Format Rekam Medis Elektronik
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-[4px] text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Dropzone Area */}
          <div className="border border-dashed border-slate-300 rounded-[4px] p-6 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-[4px] bg-white border border-slate-200 flex items-center justify-center text-slate-600 mb-2 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-semibold text-slate-800">
              Pilih atau tarik berkas paket klaim (.json / .zip)
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
              Menerima berkas resume medis, laporan operasi, lab, dan billing rincian RS
            </p>
          </div>

          {/* Test Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-600">
              Uji Cepat Berkas Sampel:
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleSimulateUpload("HEART_SURGERY")}
                className="flex items-center justify-between p-2.5 rounded-[4px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs text-left transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">Sampel Bedah Jantung Laparoskopi</div>
                    <div className="text-[11px] text-slate-500">Berkas lengkap &amp; tersanitasi (Potensi Upcoding)</div>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-[4px]">
                  Uji Valid
                </span>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleSimulateUpload("PII_VIOLATION")}
                className="flex items-center justify-between p-2.5 rounded-[4px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs text-left transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">Sampel Pelanggaran Privasi Pasien</div>
                    <div className="text-[11px] text-slate-500">Memuat NIK &amp; identitas riil tanpa anonimisasi</div>
                  </div>
                </div>
                <span className="text-[11px] text-rose-700 font-medium px-2 py-0.5 bg-rose-50 border border-rose-200 rounded-[4px]">
                  Uji Penolakan
                </span>
              </button>
            </div>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-[4px] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 flex-shrink-0" />
                <span>Memproses Berkas Klaim...</span>
              </div>
              <p className="text-[11px] text-blue-700 pl-5.5">
                {stepMessage}
              </p>
            </div>
          )}

          {/* Error Alert */}
          {errorDetails && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-[4px] space-y-1">
              <div className="flex items-center gap-1.5 text-rose-800 font-semibold text-xs">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                <span>Pemeriksaan Gagal</span>
              </div>
              <p className="text-[11px] text-rose-700 leading-relaxed">
                {errorDetails}
              </p>
            </div>
          )}

          {/* Success Alert */}
          {uploadedClaim && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[4px] space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Berkas Berhasil Divalidasi</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                Klaim <strong className="font-semibold tabular-nums">{uploadedClaim.id}</strong> ({uploadedClaim.hospitalName}) telah lolos validasi format dan ditambahkan ke antrean verifikasi.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2 bg-slate-50/70">
          <button
            type="button"
            onClick={handleClose}
            className="px-3 py-1.5 border border-slate-200 rounded-[4px] text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {uploadedClaim ? "Selesai" : "Tutup"}
          </button>
        </div>
      </div>
    </div>
  );
}
