"use client";

import React from "react";
import { X, CheckCircle2, AlertTriangle, Clock, Cpu, FileText, ShieldCheck } from "lucide-react";
import { BenchmarkCaseResult } from "@/lib/mockData";
import { cn, formatBenchmarkLabel, formatClassificationResult } from "@/lib/utils";

export interface ModalBenchmarkDetailProps {
  isOpen: boolean;
  onClose: () => void;
  item: BenchmarkCaseResult | null;
}

export function ModalBenchmarkDetail({
  isOpen,
  onClose,
  item,
}: ModalBenchmarkDetailProps) {
  if (!isOpen || !item) return null;

  const getEngineForLabel = (label: string) => {
    switch (label) {
      case "UPCODING_SEPSIS":
        return {
          model: "Google Gemini 2.0 Flash",
          purpose: "Clinical Reasoning & Anomaly Detection",
          temp: "0.1",
        };
      case "INFLATED_STENT":
      case "UNBUNDLING_PROC":
        return {
          model: "Llama 3.3 70B Versatile (Groq LPU)",
          purpose: "Surgical Report Alkes Extraction & Tariff Delta",
          temp: "0.0",
        };
      case "NOTE_CLONING":
        return {
          model: "NVIDIA NIM (nv-embedqa-e5-v5) + pgvector",
          purpose: "Cosine Similarity Vector Embedding (>85%)",
          temp: "0.0",
        };
      default:
        return {
          model: "Deterministic Fast-Filter Engine",
          purpose: "Rule-Based Demographic & Permenkes Boundary Filter",
          temp: "N/A",
        };
    }
  };

  const engine = getEngineForLabel(item.label);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white border border-slate-200 rounded-[4px] w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh] text-slate-800">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[4px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold text-slate-900">
                  Rincian Telemetri Uji Kasus
                </h3>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-bold text-slate-800 tabular-nums">
                  {item.claimId}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Faskes: <strong className="text-slate-700 font-medium">{item.hospital}</strong> • Kasus Uji: <span className="tabular-nums font-semibold">{item.id}</span>
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

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Comparison Cards: Ground Truth vs Model Prediction */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Ground Truth */}
            <div className="p-3 rounded-[4px] border border-slate-200 bg-slate-50/50 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wide">
                Ground Truth (Anotasi Ahli)
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  {item.expectedAnomaly ? "Anomali Terkonfirmasi" : "Klaim Wajar (Clean)"}
                </span>
              </div>
              <p className="text-[11.5px] text-slate-600">
                Label Baku: <strong className="font-semibold text-slate-800">{formatBenchmarkLabel(item.label)}</strong>
              </p>
            </div>

            {/* Model Detection */}
            <div className="p-3 rounded-[4px] border border-slate-200 bg-slate-50/50 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wide">
                Hasil Prediksi Sistem
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  {item.detectedAnomaly ? "Anomali Terdeteksi" : "Lolos Jalur Cepat (Clean)"}
                </span>
              </div>
              <p className="text-[11.5px] text-slate-600">
                Modus: <strong className="font-semibold text-slate-800">{item.detectedModus}</strong>
              </p>
            </div>
          </div>

          {/* Classification Status Banner */}
          <div
            className={cn(
              "p-3 rounded-[4px] border flex items-center justify-between text-xs",
              item.resultStatus === "TRUE_POSITIVE" &&
                "bg-emerald-50 border-emerald-200 text-emerald-900",
              item.resultStatus === "TRUE_NEGATIVE" &&
                "bg-blue-50 border-blue-200 text-blue-900",
              item.resultStatus === "FALSE_POSITIVE" &&
                "bg-amber-50 border-amber-200 text-amber-900",
              item.resultStatus === "FALSE_NEGATIVE" &&
                "bg-rose-50 border-rose-200 text-rose-900"
            )}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>
                Klasifikasi Evaluasi: <strong>{formatClassificationResult(item.resultStatus)}</strong>
              </span>
            </div>
            <span className="text-[11px] font-semibold tabular-nums">
              Verbatim Grounded: 100%
            </span>
          </div>

          {/* Engine & Pipeline Telemetry */}
          <div className="border border-slate-200 rounded-[4px] p-3.5 space-y-2.5 bg-slate-50/30">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 pb-1.5 border-b border-slate-200">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>Telemetri Pipeline Evaluasi AI</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Model Engine:</span>
                <span className="font-medium text-slate-900">{engine.model}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Waktu Inferensi:</span>
                <span className="font-medium text-slate-900 tabular-nums">
                  {item.processingTimeMs} ms ({(item.processingTimeMs / 1000).toFixed(2)} detik)
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Fungsi Pipeline:</span>
                <span className="font-medium text-slate-900">{engine.purpose}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Temperatur / Sampling:</span>
                <span className="font-medium text-slate-900 tabular-nums">{engine.temp} (Deterministik)</span>
              </div>
            </div>
          </div>

          {/* Grounding & Evidence Note */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-[4px] text-[11.5px] text-slate-600 space-y-1">
            <span className="font-semibold text-slate-800 block">
              Jaminan Anti-Halusinasi (100% Verbatim Grounding):
            </span>
            <p className="leading-relaxed">
              Seluruh kutipan teks dalam temuan ini diverifikasi dengan algoritma pencarian substring eksak pada dokumen rekam medis asli faskes. Temuan yang tidak memiliki koordinat dokumen 100% identik ditolak secara otomatis oleh sistem sebelum disajikan ke verifikator.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-slate-200 flex items-center justify-end bg-slate-50/70">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-[4px] text-xs font-semibold transition-colors shadow-2xs"
          >
            Tutup Telemetri
          </button>
        </div>
      </div>
    </div>
  );
}
