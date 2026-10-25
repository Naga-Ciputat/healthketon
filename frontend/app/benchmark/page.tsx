"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TopHeader } from "@/components/widgets/TopHeader";
import {
  FlaskConical,
  Play,
  ShieldCheck,
  Building2,
  Check,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  Layers,
  Filter,
  MapPin,
} from "lucide-react";
import {
  BENCHMARK_COHORTS,
  BenchmarkCohort,
  createCustomCohort,
  ALL_BENCHMARK_CASES,
} from "@/lib/benchmarkCohorts";
import { HospitalLandmarkMap } from "@/components/widgets/HospitalLandmarkMap";
import { cn } from "@/lib/utils";

export default function BenchmarkLauncherPage() {
  const router = useRouter();

  // Mode: "MAP" vs "CUSTOM"
  const [configMode, setConfigMode] = useState<"MAP" | "CUSTOM">("MAP");

  // Selected Landmark Hospital State
  const [selectedCohortId, setSelectedCohortId] = useState<string>("RS_SEJAHTERA");

  // Custom Mode State
  const [customHospital, setCustomHospital] = useState<string>("ALL");
  const [selectedModus, setSelectedModus] = useState<string[]>([
    "INFLATED_STENT",
    "UPCODING_SEPSIS",
    "NOTE_CLONING",
    "UNBUNDLING_PROC",
  ]);

  // Business Value Threshold Settings (Configurable by user)
  const [minRecall, setMinRecall] = useState<number>(85);
  const [maxFpr, setMaxFpr] = useState<number>(15);

  // Collapsible Threshold Settings (Default: hidden/collapsed per user request)
  const [isThresholdsOpen, setIsThresholdsOpen] = useState<boolean>(false);

  const selectedPreset =
    BENCHMARK_COHORTS.find((c) => c.id === selectedCohortId) || BENCHMARK_COHORTS[0];

  // Dynamically calculate matching cases for custom mode
  const customCohort = useMemo(() => {
    return createCustomCohort(customHospital, selectedModus, minRecall, maxFpr);
  }, [customHospital, selectedModus, minRecall, maxFpr]);

  const activeCohort = configMode === "MAP" ? selectedPreset : customCohort;

  const handleToggleModus = (modusKey: string) => {
    if (selectedModus.includes(modusKey)) {
      if (selectedModus.length > 1) {
        setSelectedModus(selectedModus.filter((m) => m !== modusKey));
      }
    } else {
      setSelectedModus([...selectedModus, modusKey]);
    }
  };

  const handleLaunch = () => {
    if (configMode === "MAP") {
      router.push(
        `/benchmark/evaluation-suite?cohort=${selectedPreset.id}&minRecall=${minRecall}&maxFpr=${maxFpr}`
      );
    } else {
      const modusQuery = encodeURIComponent(selectedModus.join(","));
      router.push(
        `/benchmark/evaluation-suite?cohort=CUSTOM&hospital=${encodeURIComponent(
          customHospital
        )}&modus=${modusQuery}&minRecall=${minRecall}&maxFpr=${maxFpr}`
      );
    }
  };

  const modusOptions = [
    { id: "INFLATED_STENT", label: "Alkes Implan & Stent (Permenkes 3/2023)" },
    { id: "UPCODING_SEPSIS", label: "Severity Upcoding & Diagnosa Komplikasi" },
    { id: "NOTE_CLONING", label: "Duplikasi Catatan Rekam Medis (Note Cloning)" },
    { id: "UNBUNDLING_PROC", label: "Unbundling Tindakan Bedah & Prosedur" },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Top Header */}
      <TopHeader
        title="Scientific Benchmark Suite"
        subtitle="Gerbang Konfigurasi & Uji Validasi Model"
      />

      {/* Main Content Area (Scrollable with bottom padding for anchored bar) */}
      <div className="flex-1 overflow-y-auto p-5 pb-24 max-w-7xl w-full mx-auto space-y-4">
        {/* Context Brief Card */}
        <div className="bg-white border border-slate-200 rounded-[4px] p-4 text-xs shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[4px] bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 text-sm">
                Validasi Kinerja Model terhadap Standar Baku Ahli (Ground Truth)
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Pengujian batch otomatis untuk mengukur sensitivitas deteksi anomali dan mengendalikan laju positif palsu (FPR) sebelum sistem diterapkan pada antrean klaim operasional.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Pemilihan Faskes Landmark (Peta Interaktif vs Custom) */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-tight">
                Metode Pemilihan Fasilitas Kesehatan
              </h3>
              <p className="text-[11px] text-slate-500">
                Pilih landmark rumah sakit wilayah Jabodetabek pada peta interaktif atau atur parameter custom
              </p>
            </div>

            {/* Segmented Mode Control */}
            <div className="inline-flex p-0.5 bg-slate-100 border border-slate-200 rounded-[4px] text-xs">
              <button
                type="button"
                onClick={() => setConfigMode("MAP")}
                className={cn(
                  "px-3 py-1 font-medium rounded-[3px] transition-colors flex items-center gap-1.5 cursor-pointer",
                  configMode === "MAP"
                    ? "bg-white text-slate-900 shadow-2xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Peta Landmark RS</span>
              </button>
              <button
                type="button"
                onClick={() => setConfigMode("CUSTOM")}
                className={cn(
                  "px-3 py-1 font-medium rounded-[3px] transition-colors flex items-center gap-1.5 cursor-pointer",
                  configMode === "CUSTOM"
                    ? "bg-white text-slate-900 shadow-2xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Custom</span>
              </button>
            </div>
          </div>

          {/* MODE 1: MODERN HOSPITAL LANDMARK MAP */}
          {configMode === "MAP" && (
            <HospitalLandmarkMap
              selectedCohortId={selectedCohortId}
              onSelectCohort={(cohortId) => setSelectedCohortId(cohortId)}
            />
          )}

          {/* MODE 2: CUSTOM CONFIGURATION */}
          {configMode === "CUSTOM" && (
            <div className="bg-white border border-slate-200 rounded-[4px] p-4 text-xs shadow-2xs space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Pilih Faskes */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-800 block text-xs">
                    Target Fasilitas Kesehatan
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Pilih kluster faskes tertentu atau uji seluruh faskes mitra secara serentak
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {[
                      { id: "ALL", label: "Multi-Center (Semua Faskes)" },
                      { id: "RS Sejahtera Medika", label: "RS Sejahtera Medika" },
                      { id: "RS Mitra Sehat", label: "RS Mitra Sehat" },
                      { id: "RS Sentosa Kasih", label: "RS Sentosa Kasih" },
                    ].map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setCustomHospital(h.id)}
                        className={cn(
                          "px-2.5 py-2 text-left rounded-[4px] border text-xs font-medium transition-colors",
                          customHospital === h.id
                            ? "bg-blue-50/70 border-blue-600 text-blue-900 font-semibold"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Pilih Modus Anomali */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-800 block text-xs">
                    Ragam Modus Anomali yang Diuji
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Centang tipe penyimpangan penagihan yang ingin dievaluasi terhadap berkas kontrol
                  </p>
                  <div className="space-y-1.5 pt-1">
                    {modusOptions.map((opt) => {
                      const isChecked = selectedModus.includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleToggleModus(opt.id)}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-[4px] border cursor-pointer text-xs transition-colors",
                            isChecked
                              ? "bg-slate-50 border-slate-300 text-slate-900 font-medium"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          <div
                            className={cn(
                              "w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors flex-shrink-0",
                              isChecked
                                ? "bg-slate-900 border-slate-900 text-white"
                                : "border-slate-300 bg-white"
                            )}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{opt.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Summary of Custom Matching Cases */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Hasil filter custom:</span>
                <span className="tabular-nums font-semibold text-slate-900">
                  {customCohort.caseCount} Kasus ({customCohort.anomalyCount} Anomali · {customCohort.cleanCount} Kontrol Wajar)
                </span>
              </div>
            </div>
          )}
        </div>

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
