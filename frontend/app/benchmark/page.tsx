"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TopHeader } from "@/components/widgets/TopHeader";
import {
  Play,
  ChevronRight,
  SlidersHorizontal,
  Check,
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

  // Active Threshold Preset ("STANDARD" | "STRICT" | "TOLERANT" | "CUSTOM")
  const [activeThresholdPreset, setActiveThresholdPreset] = useState<
    "STANDARD" | "STRICT" | "TOLERANT" | "CUSTOM"
  >("STANDARD");

  // Inline Thresholds Editor in Floating Bottom Bar
  const [isEditingThresholds, setIsEditingThresholds] = useState<boolean>(false);

  const selectedPreset =
    BENCHMARK_COHORTS.find((c) => c.id === selectedCohortId) || BENCHMARK_COHORTS[0];

  const activeCohort = selectedPreset;

  const applyPreset = (preset: "STANDARD" | "STRICT" | "TOLERANT") => {
    setActiveThresholdPreset(preset);
    if (preset === "STANDARD") {
      setMinRecall(85);
      setMaxFpr(15);
    } else if (preset === "STRICT") {
      setMinRecall(95);
      setMaxFpr(5);
    } else if (preset === "TOLERANT") {
      setMinRecall(70);
      setMaxFpr(25);
    }
  };

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

      {/* Main Content Area: Direct Full View Map (Zero extraneous cards below) */}
      <div className="flex-1 overflow-y-auto p-5 pb-24 max-w-7xl w-full mx-auto">
        <HospitalLandmarkMap
          selectedCohortId={selectedCohortId}
          onSelectCohort={(cohortId) => setSelectedCohortId(cohortId)}
        />
      </div>

      {/* Floating Anchored Bottom Action Bar */}
      <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-xs border-t border-slate-200 px-6 sm:pr-48 py-3 shadow-md">
        {!isEditingThresholds ? (
          // Mode 1: Standard Review & Execute
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[11px] text-slate-500 tabular-nums">
                  Target Evaluasi: Sensitivitas ≥ <strong className="text-slate-800">{minRecall}%</strong> · Maks. Positif Palsu ≤ <strong className="text-slate-800">{maxFpr}%</strong>
                </p>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-[2px] bg-slate-100 text-slate-600 border border-slate-200">
                  {activeThresholdPreset === "STANDARD"
                    ? "Standar BPJS"
                    : activeThresholdPreset === "STRICT"
                    ? "Ketat"
                    : activeThresholdPreset === "TOLERANT"
                    ? "Toleran"
                    : "Kustom"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingThresholds(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-0.5 rounded-[3px] border border-blue-200 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Ubah KPI</span>
                </button>
              </div>
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
        ) : (
          // Mode 2: Inline KPI Thresholds Editor (Quick Presets & Fine-tuning Sliders)
          <div className="space-y-3 py-1">
            <div className="flex items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-bold text-xs text-slate-900">
                  Ubah Ambang Batas KPI Evaluasi:
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  Pilih profil cepat atau geser slider nilai target
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingThresholds(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-[4px] shadow-2xs transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Simpan & Selesai</span>
              </button>
            </div>

            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
              {/* Quick Hard Options */}
              <div className="flex items-center gap-1.5 flex-wrap flex-shrink-0">
                <span className="text-[11px] font-semibold text-slate-600">Profil Cepat:</span>
                <button
                  type="button"
                  onClick={() => applyPreset("TOLERANT")}
                  className={cn(
                    "px-2.5 py-1 text-xs rounded-[3px] border font-medium transition-colors cursor-pointer",
                    activeThresholdPreset === "TOLERANT"
                      ? "bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-2xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  Toleran <span className="text-[10px] opacity-75">(70% · 25%)</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("STANDARD")}
                  className={cn(
                    "px-2.5 py-1 text-xs rounded-[3px] border font-medium transition-colors cursor-pointer",
                    activeThresholdPreset === "STANDARD"
                      ? "bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-2xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  Standar BPJS <span className="text-[10px] opacity-75">(85% · 15%)</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("STRICT")}
                  className={cn(
                    "px-2.5 py-1 text-xs rounded-[3px] border font-medium transition-colors cursor-pointer",
                    activeThresholdPreset === "STRICT"
                      ? "bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-2xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  Ketat <span className="text-[10px] opacity-75">(95% · 5%)</span>
                </button>
              </div>

              {/* Fine-Tuning Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                {/* Slider 1: Sensitivitas (Recall) */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-[4px]">
                  <span className="text-[11px] text-slate-600 whitespace-nowrap min-w-[130px]">
                    Recall Minimum: <strong className="text-slate-900 tabular-nums">≥ {minRecall}%</strong>
                  </span>
                  <input
                    type="range"
                    min="70"
                    max="95"
                    step="5"
                    value={minRecall}
                    onChange={(e) => {
                      setMinRecall(Number(e.target.value));
                      setActiveThresholdPreset("CUSTOM");
                    }}
                    className="w-full accent-blue-600 cursor-pointer h-1.5"
                  />
                </div>

                {/* Slider 2: FPR */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-[4px]">
                  <span className="text-[11px] text-slate-600 whitespace-nowrap min-w-[130px]">
                    FPR Maksimum: <strong className="text-slate-900 tabular-nums">≤ {maxFpr}%</strong>
                  </span>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    step="5"
                    value={maxFpr}
                    onChange={(e) => {
                      setMaxFpr(Number(e.target.value));
                      setActiveThresholdPreset("CUSTOM");
                    }}
                    className="w-full accent-blue-600 cursor-pointer h-1.5"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
