"use client";

import React, { useState, useEffect } from "react";
import {
  Bot,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  X,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Database,
  FileCheck2,
  Sparkles,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ClaimItem } from "@/lib/mockData";

export interface LiveAgentStep {
  id: string;
  agentName: string;
  model: string;
  roleDescription: string;
  status: "idle" | "running" | "completed";
  resultVerdict: "CLEAN" | "FLAGGED" | "PASSED";
  latencyMs: number;
  toolCalls?: {
    name: string;
    params: Record<string, any>;
    result: string;
  }[];
  findingsSummary: string;
  details: string;
}

interface LiveAgentAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim: ClaimItem;
}

export function LiveAgentAuditModal({
  isOpen,
  onClose,
  claim,
}: LiveAgentAuditModalProps) {
  const initialSteps: LiveAgentStep[] = [
    {
      id: "step-1",
      agentName: "Privacy Guard (De-Identification)",
      model: "Local Deterministic Regex & NER Tokenizer",
      roleDescription: "Anonimisasi data identitas pasien (NIK, RM, Nama, Alamat) sebelum inferensi model.",
      status: "idle",
      resultVerdict: "PASSED",
      latencyMs: 120,
      toolCalls: [
        {
          name: "tool_mask_pii_entities",
          params: { rawName: "Tn. R", rawRM: "00-48-29", faskesId: "RS-SEJ-01" },
          result: "Masked to TOKEN_PATIENT_4829. Leak score: 0.00%.",
        },
      ],
      findingsSummary: "Data pasien berhasil dide-identifikasi sesuai standar UU PDP & regulasi privasi faskes.",
      details: "Seluruh entitas NIK, tanggal lahir persis, dan nomor rekam medis disubstitusi dengan token hash deterministik.",
    },
    {
      id: "step-2",
      agentName: "Deterministic INA-CBG Rule Engine",
      model: "Python INA-CBG v5.2 Rule Validator",
      roleDescription: "Pengecekan batasan koding administratif, kontraindikasi usia/gender, dan unbundling paket.",
      status: "idle",
      resultVerdict: "FLAGGED",
      latencyMs: 185,
      toolCalls: [
        {
          name: "tool_lookup_grouping_rules",
          params: { primary: claim.primaryDiagnosis.code, procedure: "88.57" },
          result: "Klausul unbundling aktif: Angiografi 88.57 dilarang ditagihkan terpisah dari PTCA 00.66.",
        },
      ],
      findingsSummary: "Ditemukan penagihan terpisah (unbundling) angiografi koroner Rp 4.500.000.",
      details: "Sesuai Permenkes No. 3 Tahun 2023 Lampiran II, arteriografi koroner diagnostik telah tercakup dalam tarif kateterisasi terapeutik.",
    },
    {
      id: "step-3",
      agentName: "Gemini 1.5 Pro Clinical Cross-Examiner",
      model: "Gemini 1.5 Pro Clinical Specialist",
      roleDescription: "Evaluasi kesesuaian klinis diagnosis sekunder (Sepsis A41.9) terhadap hasil lab objektif.",
      status: "idle",
      resultVerdict: "FLAGGED",
      latencyMs: 840,
      toolCalls: [
        {
          name: "tool_verify_lab_criteria",
          params: {
            icd10: "A41.9",
            biomarkers: { troponin: "14.8 ng/mL", procalcitonin: "0.1 ng/mL", leukosit: "7.800 /uL" },
          },
          result: "Prokalsitonin 0.1 ng/mL normal (<0.5 ng/mL). Leukosit normal. Kriteria klinis Sepsis-3 tidak terpenuhi.",
        },
      ],
      findingsSummary: "Diagnosis Sepsis Berat (A41.9) dianulir karena bertentangan dengan biomarker laboratorium.",
      details: "Tingkat keparahan INA-CBG turun dari Severity 3 (I-4-10-III) ke Severity 1 (I-4-10-I), menghasilkan rekomendasi koreksi tarif Rp 20.500.000.",
    },
    {
      id: "step-4",
      agentName: "Groq Llama-3 Alkes Ledger Calculator",
      model: "Llama 3 70B via Groq LPU (Sub-second)",
      roleDescription: "Rekonsiliasi kuantitas implan alkes antara laporan operasi bedah dan faktur billing farmasi.",
      status: "idle",
      resultVerdict: "FLAGGED",
      latencyMs: 310,
      toolCalls: [
        {
          name: "tool_calc_tariff_delta",
          params: {
            item: "Drug Eluting Stent (DES)",
            surgicalReportQty: 1,
            billingInvoiceQty: 2,
            unitCost: 10000000,
          },
          result: "Selisih 1 unit stent dibatalkan dan diretur. Selisih finansial: Rp 10.000.000.",
        },
      ],
      findingsSummary: "Laporan bedah mencatat 1 stent batal dipasang, namun 2 stent ditagihkan pada billing.",
      details: "Dokter operator mencatat stent kedua pada arteri LCx dibatalkan karena tortuosity ekstrem dan dikembalikan ke depo.",
    },
    {
      id: "step-5",
      agentName: "MinHash Note-Cloning Detector",
      model: "MinHash LSH + 5-gram Jaccard Similarity",
      roleDescription: "Pendeteksian plagiasi teks klinis antar klaim historis pada DPJP yang sama.",
      status: "idle",
      resultVerdict: "FLAGGED",
      latencyMs: 240,
      toolCalls: [
        {
          name: "tool_vector_similarity_search",
          params: { queryField: "resumeMedis.anamnesis", threshold: 0.85 },
          result: "Kemiripan 94% terhadap klaim donor CLM-2026-077 (Pasien Tn. M, 07 Okt 2026).",
        },
      ],
      findingsSummary: "Ditemukan duplikasi narasi klinis verbatim 94% dari berkas pasien donor sebelumnya.",
      details: "Teks keluhan utama dan pemeriksaan fisik awal identik kata-per-kata, mengindikasikan copy-paste rekam medis tanpa verifikasi individual.",
    },
    {
      id: "step-6",
      agentName: "Verbatim Grounding & Evidence Guard",
      model: "Exact Substring Match & PDF Coordinate Engine",
      roleDescription: "Validasi keaslian kutipan kutipan teks 100% verbatim terhadap dokumen PDF resmi.",
      status: "idle",
      resultVerdict: "PASSED",
      latencyMs: 95,
      toolCalls: [
        {
          name: "tool_verify_verbatim_bounds",
          params: { totalFindings: 4, documentCount: 4 },
          result: "Semua 4 sitasi memiliki kecocokan karakter 100% pada arsip PDF faskes terstempel.",
        },
      ],
      findingsSummary: "Seluruh bukti sitasi tervalidasi 100% verbatim pada berkas rekam medis faskes.",
      details: "Mencegah halusinasi AI pada penyusunan lembar sengketa dan surat klarifikasi resmi ke faskes.",
    },
  ];

  const [steps, setSteps] = useState<LiveAgentStep[]>(initialSteps);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [expandedStepId, setExpandedStepId] = useState<string | null>("step-3");

  useEffect(() => {
    if (isOpen) {
      setSteps(initialSteps);
      setActiveStepIndex(-1);
      setIsRunning(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRunSimulation = async () => {
    setIsRunning(true);
    setSteps(initialSteps.map((s) => ({ ...s, status: "idle" })));

    for (let i = 0; i < initialSteps.length; i++) {
      setActiveStepIndex(i);
      setSteps((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: "running" } : s))
      );

      // Simulate execution time
      await new Promise((resolve) => setTimeout(resolve, initialSteps[i].latencyMs + 250));

      setSteps((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: "completed" } : s))
      );
    }

    setActiveStepIndex(-1);
    setIsRunning(false);
  };

  const handleReset = () => {
    setSteps(initialSteps);
    setActiveStepIndex(-1);
    setIsRunning(false);
  };

  const totalRuntimeMs = steps.reduce((acc, s) => acc + s.latencyMs, 0);
  const completedCount = steps.filter((s) => s.status === "completed").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
      <div className="w-full max-w-4xl bg-white rounded-[4px] border border-slate-200 shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-[4px] bg-blue-100 text-blue-700">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  Simulasi Audit Multi-Agent Real-Time
                </h3>
                <span className="text-[11px] font-mono px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-[2px]">
                  {claim.id}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Pipeline 6-Agent: Privacy Guard &rarr; Rule Engine &rarr; Gemini Clinical &rarr; Groq Alkes &rarr; MinHash &rarr; Verbatim Guard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isRunning && completedCount === 0 && (
              <button
                type="button"
                onClick={handleRunSimulation}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-[4px] shadow-2xs transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Mulai Simulasi Audit</span>
              </button>
            )}

            {!isRunning && completedCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-[4px] shadow-2xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Simulasi</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-[4px] text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Strip */}
        <div className="px-5 py-2 border-b border-slate-200 bg-white flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <span>
              Progres Pipeline:{" "}
              <strong className="text-slate-900 tabular-nums">
                {completedCount} / {steps.length} Agent
              </strong>
            </span>
            <span className="text-slate-300">|</span>
            <span>
              Total Waktu Latensi:{" "}
              <strong className="text-slate-900 tabular-nums">{totalRuntimeMs} ms</strong>
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            Faskes: <span className="font-medium text-slate-800">{claim.hospitalName}</span>
          </div>
        </div>

        {/* Stepper Content List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50/50">
          {steps.map((step, index) => {
            const isExpanded = expandedStepId === step.id;
            const isCurrentlyRunning = step.status === "running";
            const isDone = step.status === "completed";

            return (
              <div
                key={step.id}
                className={cn(
                  "rounded-[4px] border transition-all bg-white overflow-hidden shadow-2xs",
                  isCurrentlyRunning
                    ? "border-blue-400 ring-1 ring-blue-300"
                    : isDone && step.resultVerdict === "FLAGGED"
                    ? "border-slate-300"
                    : "border-slate-200"
                )}
              >
                {/* Step Row Header */}
                <div
                  onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setExpandedStepId(isExpanded ? null : step.id);
                  }}
                  className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Status Badge Indicator */}
                    <div className="flex-shrink-0">
                      {isCurrentlyRunning ? (
                        <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                      ) : isDone ? (
                        step.resultVerdict === "FLAGGED" ? (
                          <div className="w-6 h-6 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center">
                            <AlertCircle className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center text-xs font-mono font-semibold">
                          {index + 1}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          {step.agentName}
                        </span>
                        <span className="text-[10.5px] font-mono px-1.5 py-0.2 rounded-[2px] bg-slate-100 text-slate-600 border border-slate-200">
                          {step.model}
                        </span>
                        {isDone && (
                          <span
                            className={cn(
                              "text-[10px] font-semibold px-1.5 py-0.2 rounded-[2px]",
                              step.resultVerdict === "FLAGGED"
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            )}
                          >
                            {step.resultVerdict}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {step.roleDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                      {step.latencyMs}ms
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details Pane */}
                {isExpanded && (
                  <div className="px-4 py-3 bg-slate-50/60 border-t border-slate-100 space-y-2.5 text-xs">
                    {/* Findings Banner */}
                    <div className="p-2.5 rounded-[4px] bg-white border border-slate-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[11.5px]">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>Ringkasan Hasil Evaluasi:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-[11px]">
                        {step.findingsSummary}
                      </p>
                      <p className="text-slate-500 text-[10.5px] leading-relaxed">
                        {step.details}
                      </p>
                    </div>

                    {/* Tool Calls Code Block */}
                    {step.toolCalls && step.toolCalls.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-slate-600">
                          <Terminal className="w-3 h-3 text-slate-500" />
                          <span>Tool Call & Param Interception:</span>
                        </div>
                        {step.toolCalls.map((tc, tcIdx) => (
                          <div
                            key={tcIdx}
                            className="bg-slate-900 text-slate-100 rounded-[4px] p-2.5 font-mono text-[10.5px] space-y-1"
                          >
                            <div className="text-emerald-400 font-semibold">
                              &gt; {tc.name}(
                              <span className="text-amber-300">
                                {JSON.stringify(tc.params)}
                              </span>
                              )
                            </div>
                            <div className="text-slate-300 text-[10px] pl-3 border-l border-slate-700">
                              Output: {tc.result}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer Summary */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Kaidah Grounding:{" "}
              <strong className="text-slate-800">100% Berbasis Dokumen Asli Faskes</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500">
              Rekomendasi Tindakan:{" "}
              <strong className="text-slate-900">{claim.recommendedAction.label}</strong>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-[4px] shadow-2xs transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
