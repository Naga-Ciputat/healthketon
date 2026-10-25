"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TopHeader } from "@/components/widgets/TopHeader";
import {
  Play,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import {
  BENCHMARK_COHORTS,
} from "@/lib/benchmarkCohorts";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const HospitalLandmarkMap = dynamic(
  () =>
    import("@/components/widgets/HospitalLandmarkMap").then(
      (mod) => mod.HospitalLandmarkMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] lg:h-[580px] bg-slate-50 border border-slate-200 rounded-[4px] flex items-center justify-center text-xs text-slate-500 animate-pulse">
        Memuat peta interaktif faskes Jabodetabek...
      </div>
    ),
  }
);

export default function BenchmarkLauncherPage() {
  const router = useRouter();

  // Selected Landmark Hospital State (Direct Selection via Interactive Map)
  const [selectedCohortId, setSelectedCohortId] = useState<string>("RS_SEJAHTERA");

  // Business Value Threshold Settings (Configurable by user)
  const [minRecall, setMinRecall] = useState<number>(85);
  const [maxFpr, setMaxFpr] = useState<number>(15);

  // Collapsible Threshold Settings (Default: hidden/collapsed per user request)
  const [isThresholdsOpen, setIsThresholdsOpen] = useState<boolean>(false);

  const selectedPreset =
    BENCHMARK_COHORTS.find((c) => c.id === selectedCohortId) || BENCHMARK_COHORTS[0];

  const activeCohort = selectedPreset;

  const handleLaunch = () => {
    router.push(
      `/benchmark/evaluation-suite?cohort=${selectedPreset.id}&minRecall=${minRecall}&maxFpr=${maxFpr}`
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Layer 1: Top Header */}
      <TopHeader
        title="Scientific Benchmark Suite"
        subtitle="Gerbang Konfigurasi & Uji Validasi Model"
      />

      {/* Main Content Area (Direct Map Access without superfluous header layers) */}
      <div className="flex-1 overflow-y-auto p-5 pb-24 max-w-7xl w-full mx-auto space-y-4">
        {/* Direct Interactive Hospital Landmark Map */}
        <HospitalLandmarkMap
          selectedCohortId={selectedCohortId}
          onSelectCohort={(cohortId) => setSelectedCohortId(cohortId)}
        />


        {/* Section 2: Ambang Batas Evaluasi (Collapsible Dropdown - Default Collapsed) */}
        <div className="bg-white border border-slate-200 rounded-[4px] shadow-2xs overflow-hidden">
          <button
            type="button"
            onClick={() => setIsThresholdsOpen((prev) => !prev)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer select-none"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-tight">
                  Pengaturan Ambang Batas Kelulusan Evaluasi (KPI Standar BPJS)
                </h3>
                <span className="text-[10.5px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-[3px] border border-slate-200">
                  Opsional
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Sesuaikan batas minimum sensitivitas (Recall) dan toleransi positif palsu (FPR) bila diperlukan
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Ringkasan status parameter saat posisi tertutup */}
              <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-[3px] border border-slate-200 tabular-nums">
                <span>Recall ≥ <strong className="text-slate-900">{minRecall}%</strong></span>
                <span className="text-slate-300">·</span>
                <span>FPR ≤ <strong className="text-slate-900">{maxFpr}%</strong></span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-[3px] shadow-2xs">
                <span className="text-[11px]">{isThresholdsOpen ? "Tutup" : "Atur Nilai"}</span>
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 text-slate-500 transition-transform duration-200",
                    isThresholdsOpen && "rotate-180"
                  )}
                />
              </div>
            </div>
          </button>

          {isThresholdsOpen && (
            <div className="p-4 pt-2 border-t border-slate-100 bg-white space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Slider 1: Target Sensitivitas */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-[4px] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900 block">
                        Target Sensitivitas (Recall Minimum)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Batas minimum anomali yang wajib terdeteksi
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 tabular-nums bg-white border border-slate-200 px-2 py-0.5 rounded-[3px]">
                      ≥ {minRecall}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="95"
                    step="1"
                    value={minRecall}
                    onChange={(e) => setMinRecall(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 tabular-nums">
                    <span>70% (Toleran)</span>
                    <span>85% (Standar BPJS)</span>
                    <span>95% (Ketat)</span>
                  </div>
                </div>

                {/* Slider 2: Toleransi False Positive */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-[4px] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900 block">
                        Batas Maksimum Positif Palsu (FPR)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Toleransi kesalahan menandai klaim wajar faskes
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 tabular-nums bg-white border border-slate-200 px-2 py-0.5 rounded-[3px]">
                      ≤ {maxFpr}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    step="1"
                    value={maxFpr}
                    onChange={(e) => setMaxFpr(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 tabular-nums">
                    <span>5% (Protektif RS)</span>
                    <span>15% (Standar BPJS)</span>
                    <span>25% (Sensitif)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Anchored Bottom Action Bar (Clean White Surface, Fixed at Bottom) */}
      <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-xs border-t border-slate-200 px-6 py-3 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-slate-900">
              Konfigurasi Uji Terpilih:
            </span>
            <span className="text-xs text-blue-700 font-bold">
              {activeCohort.title}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-600 font-medium tabular-nums">
              {activeCohort.caseCount} Kasus
            </span>
          </div>
          <p className="text-[11px] text-slate-500 tabular-nums">
            Target Evaluasi: Sensitivitas ≥ {minRecall}% · Maks. Positif Palsu ≤ {maxFpr}%
          </p>
        </div>

        <button
          type="button"
          onClick={handleLaunch}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-[4px] transition-colors shadow-2xs flex-shrink-0 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Mulai Eksekusi Benchmark ({activeCohort.caseCount} Kasus)</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
