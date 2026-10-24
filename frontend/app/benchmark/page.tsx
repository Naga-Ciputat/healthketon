"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TopHeader } from "@/components/widgets/TopHeader";
import {
  FlaskConical,
  Play,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Building2,
  Check,
  ChevronRight,
} from "lucide-react";
import { BENCHMARK_COHORTS, BenchmarkCohort } from "@/lib/benchmarkCohorts";
import { cn } from "@/lib/utils";

export default function BenchmarkLauncherPage() {
  const router = useRouter();
  const [selectedCohortId, setSelectedCohortId] = useState<string>("RS_SEJAHTERA");

  const selectedCohort =
    BENCHMARK_COHORTS.find((c) => c.id === selectedCohortId) || BENCHMARK_COHORTS[0];

  const handleLaunch = () => {
    router.push(`/benchmark/evaluation-suite?cohort=${selectedCohort.id}`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Top Header */}
      <TopHeader
        title="Scientific Benchmark Suite"
        subtitle="Gerbang Uji Validasi & Evaluasi Kinerja Model AI"
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 max-w-7xl w-full mx-auto space-y-4">
        {/* Context Brief Card */}
        <div className="bg-white border border-slate-200 rounded-[4px] p-4 text-xs shadow-2xs space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[4px] bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 text-sm">
                Evaluasi Kinerja Model terhadap Kunci Jawaban Mediko-Legal (Ground Truth)
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Pengujian batch terstandar untuk membuktikan sensitivitas deteksi anomali, mengukur laju positif palsu (FPR), dan menjamin sitasi 100% bebas halusinasi sebelum model digunakan pada verifikasi klaim harian.
              </p>
            </div>
          </div>
        </div>

        {/* Section: Pilih Paket Kasus Uji */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-tight">
                Langkah 1: Pilih Paket Kohort Kasus Uji
              </h3>
              <p className="text-[11px] text-slate-500">
                Pilih kluster fasilitas kesehatan atau paket pengujian komprehensif yang ingin dievaluasi
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-[4px] border border-slate-200 tabular-nums">
              {BENCHMARK_COHORTS.length} Paket Tersedia
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {BENCHMARK_COHORTS.map((cohort) => {
              const isSelected = cohort.id === selectedCohortId;
              return (
                <div
                  key={cohort.id}
                  onClick={() => setSelectedCohortId(cohort.id)}
                  className={cn(
                    "cursor-pointer rounded-[4px] p-4 text-xs transition-all relative select-none flex flex-col justify-between",
                    isSelected
                      ? "bg-white border-2 border-blue-600 shadow-xs"
                      : "bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs"
                  )}
                >
                  <div className="space-y-2">
                    {/* Header Item */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors flex-shrink-0",
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-slate-300 bg-white"
                          )}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <h4 className="font-semibold text-slate-900 text-[13px]">
                          {cohort.title}
                        </h4>
                      </div>
                      <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10.5px] px-2 py-0.5 rounded-[4px] font-medium flex-shrink-0">
                        {cohort.badge}
                      </span>
                    </div>

                    {/* Specialization & Hospital */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="font-medium text-slate-800">{cohort.hospitalName}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500 truncate">{cohort.specialization}</span>
                    </div>

                    {/* Description */}
                    <p className="text-[11.5px] text-slate-600 leading-relaxed">
                      {cohort.description}
                    </p>

                    {/* Focus Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {cohort.focusModus.map((f, i) => (
                        <span
                          key={i}
                          className="bg-slate-50 border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded-[3px] text-[10px] font-medium"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Meta */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-500">
                    <div className="flex items-center gap-2 tabular-nums">
                      <strong className="text-slate-900">{cohort.caseCount} Kasus</strong>
                      <span className="text-slate-300">·</span>
                      <span className="text-emerald-700 font-medium">
                        {cohort.anomalyCount} Anomali
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-600">{cohort.cleanCount} Bersih</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 tabular-nums">
                      <Clock className="w-3 h-3" />
                      <span>{cohort.estimatedDuration}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: Pre-Flight Parameters */}
        <div className="bg-white border border-slate-200 rounded-[4px] p-4 text-xs shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-tight">
              Langkah 2: Verifikasi Parameter Uji & Standar Kelulusan BPJS
            </h3>
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pipeline & Korpus Terkalibrasi</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[4px] space-y-1">
              <span className="text-[10.5px] text-slate-500 block">Mesin AI Terintegrasi</span>
              <p className="font-semibold text-slate-800 text-[11.5px]">Tri-Engine Specialization</p>
              <span className="text-[10px] text-slate-500 block">Gemini 2.0 + Groq LPU + NVIDIA</span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[4px] space-y-1">
              <span className="text-[10.5px] text-slate-500 block">Ambang Batas Sensitivitas</span>
              <p className="font-bold text-slate-900 text-sm tabular-nums">Target ≥ 85%</p>
              <span className="text-[10px] text-slate-500 block">Meminimalkan anomali lolos</span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[4px] space-y-1">
              <span className="text-[10.5px] text-slate-500 block">Batas Maks. Positif Palsu (FPR)</span>
              <p className="font-bold text-slate-900 text-sm tabular-nums">Target ≤ 15%</p>
              <span className="text-[10px] text-slate-500 block">Menghindari salah tuduh faskes wajar</span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[4px] space-y-1">
              <span className="text-[10.5px] text-slate-500 block">Kepatuhan Sitasi Verbatim</span>
              <p className="font-bold text-emerald-700 text-sm tabular-nums">Wajib 100%</p>
              <span className="text-[10px] text-slate-500 block">Nol halusinasi kutipan teks</span>
            </div>
          </div>
        </div>

        {/* Action Confirmation Banner */}
        <div className="bg-slate-900 text-white rounded-[4px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs tracking-tight text-white">
                Siap Menjalankan Pengujian:
              </span>
              <span className="text-xs text-blue-300 font-bold">
                {selectedCohort.title}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 tabular-nums">
              {selectedCohort.caseCount} kasus berlabel akan dievaluasi secara batch terhadap model verifikasi · Estimasi: {selectedCohort.estimatedDuration}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLaunch}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-[4px] transition-colors shadow-2xs flex-shrink-0 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Mulai Eksekusi Benchmark ({selectedCohort.caseCount} Kasus)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
