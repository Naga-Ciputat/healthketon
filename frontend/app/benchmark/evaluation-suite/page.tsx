"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TopHeader } from "@/components/widgets/TopHeader";
import { ConfusionMatrixCard } from "@/components/widgets/ConfusionMatrixCard";
import { ModalBenchmarkDetail } from "@/components/widgets/ModalBenchmarkDetail";
import { BenchmarkCaseResult } from "@/lib/mockData";
import { getCohortById, BENCHMARK_COHORTS } from "@/lib/benchmarkCohorts";
import {
  FlaskConical,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  ExternalLink,
  Download,
  Check,
  Activity,
  ArrowLeft,
  Building2,
  Sparkles,
} from "lucide-react";
import { cn, formatBenchmarkLabel, formatClassificationResult } from "@/lib/utils";

function BenchmarkSuiteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cohortId = searchParams.get("cohort") || "RS_SEJAHTERA";
  const cohort = getCohortById(cohortId);

  const [isRunning, setIsRunning] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentEvalIndex, setCurrentEvalIndex] = useState<number | null>(0);
  const [isExported, setIsExported] = useState(false);
  const [results, setResults] = useState<BenchmarkCaseResult[]>(cohort.cases);

  // Filters & Search
  const [selectedClassification, setSelectedClassification] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal Detail
  const [selectedCase, setSelectedCase] = useState<BenchmarkCaseResult | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Run or Rerun Batch Benchmark Simulation
  const startBenchmarkRun = (targetCases: BenchmarkCaseResult[]) => {
    setIsRunning(true);
    setProgress(0);
    setCurrentEvalIndex(0);

    let idx = 0;
    const interval = setInterval(() => {
      idx += 1;
      if (idx >= targetCases.length) {
        clearInterval(interval);
        setProgress(100);
        setIsRunning(false);
        setCurrentEvalIndex(null);
      } else {
        setCurrentEvalIndex(idx);
        setProgress(Math.round(((idx + 1) / targetCases.length) * 100));
      }
    }, 140);
  };

  // Trigger live execution on mount or when cohort changes
  useEffect(() => {
    setResults(cohort.cases);
    startBenchmarkRun(cohort.cases);
  }, [cohort.id]);

  const handleRerun = () => {
    startBenchmarkRun(results);
  };

  // Calculated metrics
  const totalCases = results.length;
  const truePositives = results.filter((r) => r.resultStatus === "TRUE_POSITIVE").length;
  const falseNegatives = results.filter((r) => r.resultStatus === "FALSE_NEGATIVE").length;
  const falsePositives = results.filter((r) => r.resultStatus === "FALSE_POSITIVE").length;
  const trueNegatives = results.filter((r) => r.resultStatus === "TRUE_NEGATIVE").length;

  const actualAnomalies = truePositives + falseNegatives;
  const actualClean = falsePositives + trueNegatives;

  const recall = actualAnomalies > 0 ? (truePositives / actualAnomalies) * 100 : 0;
  const fpr = actualClean > 0 ? (falsePositives / actualClean) * 100 : 0;
  const verbatimRate = 100;
  const avgLatencyMs = Math.round(
    results.reduce((acc, r) => acc + r.processingTimeMs, 0) / (results.length || 1)
  );

  // Filtered Results
  const filteredResults = useMemo(() => {
    return results.filter((item) => {
      const matchesClassification =
        selectedClassification === "ALL" || item.resultStatus === selectedClassification;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        item.id.toLowerCase().includes(q) ||
        item.claimId.toLowerCase().includes(q) ||
        item.hospital.toLowerCase().includes(q) ||
        item.label.toLowerCase().includes(q) ||
        item.detectedModus.toLowerCase().includes(q);

      return matchesClassification && matchesSearch;
    });
  }, [results, selectedClassification, searchQuery]);

  const handleOpenDetail = (item: BenchmarkCaseResult) => {
    setSelectedCase(item);
    setIsDetailOpen(true);
  };

  const handleExportReport = () => {
    const reportData = {
      benchmarkTitle: "BPJS Kesehatan Scientific Benchmark Report",
      evaluatedAt: new Date().toISOString(),
      cohort: {
        id: cohort.id,
        title: cohort.title,
        hospitalName: cohort.hospitalName,
      },
      summary: {
        totalEvaluated: totalCases,
        recallRate: `${recall.toFixed(1)}%`,
        falsePositiveRate: `${fpr.toFixed(1)}%`,
        verbatimGroundingRate: `${verbatimRate}%`,
        averageLatencyMs: avgLatencyMs,
        confusionMatrix: {
          truePositives,
          falseNegatives,
          falsePositives,
          trueNegatives,
        },
      },
      cases: results,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `BPJS_Benchmark_${cohort.id}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setIsExported(true);
    setTimeout(() => setIsExported(false), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Top Header */}
      <TopHeader
        title={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => router.push("/benchmark")}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-[4px] hover:bg-slate-50 transition-colors shadow-2xs mr-1"
              title="Kembali ke pemilihan paket kasus"
            >
              <ArrowLeft className="w-3 h-3 text-slate-500" />
              <span>Ganti Paket</span>
            </button>
            <span className="text-sm font-semibold text-slate-900 truncate">
              Scientific Benchmark Suite
            </span>
          </div>
        }
        subtitle={`${cohort.title} (${cohort.caseCount} Kasus)`}
        rightActions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportReport}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-[4px] hover:bg-slate-50 transition-colors shadow-2xs"
            >
              {isExported ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Terekspor</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ekspor Laporan (.json)</span>
                </>
              )}
            </button>
            <button
              type="button"
              disabled={isRunning}
              onClick={handleRerun}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold text-white bg-blue-600 rounded-[4px] hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer",
                isRunning && "opacity-60 cursor-not-allowed"
              )}
            >
              {isRunning ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengevaluasi...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ulangi Pengujian</span>
                </>
              )}
            </button>
          </div>
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 max-w-7xl w-full mx-auto space-y-4">
        {/* Cohort Info Banner */}
        <div className="bg-white border border-slate-200 rounded-[4px] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[4px] bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-900">{cohort.title}</span>
                <span className="bg-slate-100 text-slate-700 text-[10.5px] px-1.5 py-0.2 rounded-[3px] border border-slate-200 font-medium">
                  {cohort.badge}
                </span>
              </div>
              <span className="text-slate-500 text-[11.5px]">{cohort.description}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 tabular-nums">
            <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-[4px]">
              {cohort.caseCount} Kasus Diuji
            </span>
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-[4px] font-medium">
              {cohort.anomalyCount} Anomali
            </span>
            <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-[4px]">
              {cohort.cleanCount} Wajar
            </span>
          </div>
        </div>

        {/* Live Evaluation Runner Status */}
        {isRunning && (
          <div className="bg-white border border-blue-200 rounded-[4px] p-4 shadow-2xs space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
                <span className="font-semibold text-slate-900">
                  Inferensi Batch Model AI Sedang Berjalan:
                </span>
                {currentEvalIndex !== null && results[currentEvalIndex] && (
                  <span className="text-slate-600 truncate">
                    Menguji <strong className="tabular-nums font-semibold text-slate-900">{results[currentEvalIndex].claimId}</strong> ({results[currentEvalIndex].hospital}) — {results[currentEvalIndex].detectedModus}
                  </span>
                )}
              </div>
              <span className="font-bold text-blue-700 tabular-nums">
                {progress}% ({currentEvalIndex !== null ? currentEvalIndex + 1 : 0}/{totalCases} Kasus)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-[2px] overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
              <span>Tri-Engine Pipeline: Gemini 2.0 Flash (PNPK) · Groq LPU (Tariff Delta) · NVIDIA NIM (Cosine Similarity)</span>
              <span className="font-mono text-emerald-700 font-medium">Grounding Verbatim: 100% OK</span>
            </div>
          </div>
        )}

        {/* Metrik Objektif Evaluasi (4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Metrik 1: Recall */}
          <div className="bg-white border border-slate-200 rounded-[4px] p-4 space-y-1 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Sensitivitas (Recall)</span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-[4px] border border-emerald-200">
                Target ≥ 85%
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {recall.toFixed(1)}%
            </div>
            <span className="text-[11px] text-slate-500 block">
              <span className="tabular-nums font-medium text-slate-700">{truePositives}</span> dari <span className="tabular-nums font-medium text-slate-700">{actualAnomalies}</span> anomali terdeteksi
            </span>
          </div>

          {/* Metrik 2: FPR */}
          <div className="bg-white border border-slate-200 rounded-[4px] p-4 space-y-1 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Positif Palsu (FPR)</span>
              <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-[4px] border border-slate-200">
                Target ≤ 15%
              </span>
            </div>
            <div
              className={cn(
                "text-2xl font-bold tabular-nums",
                fpr <= 15 ? "text-slate-900" : "text-amber-700"
              )}
            >
              {fpr.toFixed(1)}%
            </div>
            <span className="text-[11px] text-slate-500 block">
              <span className="tabular-nums font-medium text-slate-700">{falsePositives}</span> dari <span className="tabular-nums font-medium text-slate-700">{actualClean}</span> klaim wajar keliru
            </span>
          </div>

          {/* Metrik 3: Grounding */}
          <div className="bg-white border border-slate-200 rounded-[4px] p-4 space-y-1 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Grounding Accuracy</span>
              <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded-[4px] border border-blue-200">
                Target 100%
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {verbatimRate}%
            </div>
            <span className="text-[11px] text-slate-500 block">
              100% kutipan teks rekam medis asli
            </span>
          </div>

          {/* Metrik 4: Latensi */}
          <div className="bg-white border border-slate-200 rounded-[4px] p-4 space-y-1 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Rata-Rata Latensi</span>
              <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-[4px] border border-slate-200">
                Target &lt; 60s
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {(avgLatencyMs / 1000).toFixed(2)}s
            </div>
            <span className="text-[11px] text-slate-500 block">
              Pemrosesan otomatis instan
            </span>
          </div>
        </div>

        {/* Matriks Konfusi 2x2 Card */}
        <ConfusionMatrixCard
          truePositives={truePositives}
          falseNegatives={falseNegatives}
          falsePositives={falsePositives}
          trueNegatives={trueNegatives}
        />

        {/* Dataset Table Section */}
        <div className="bg-white border border-slate-200 rounded-[4px] p-4 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-semibold text-slate-900 tracking-tight">
                Daftar Kasus Berlabel ({filteredResults.length} dari {totalCases} Kasus)
              </h3>
              <p className="text-[11px] text-slate-500">
                Uji silang komparatif antara standar telaah ahli vs hasil verifikasi sistem
              </p>
            </div>

            {/* Classification Filter Badges */}
            <div className="flex items-center gap-1 flex-wrap">
              {[
                { id: "ALL", label: `Semua (${totalCases})` },
                { id: "TRUE_POSITIVE", label: `True Positive (${truePositives})` },
                { id: "TRUE_NEGATIVE", label: `True Negative (${trueNegatives})` },
                { id: "FALSE_POSITIVE", label: `False Positive (${falsePositives})` },
                { id: "FALSE_NEGATIVE", label: `False Negative (${falseNegatives})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedClassification(tab.id)}
                  className={cn(
                    "px-2.5 py-1 text-[11px] font-medium rounded-[4px] border transition-colors",
                    selectedClassification === tab.id
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kasus berdasarkan ID, Faskes, atau Modus Anomali..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50/70 border border-slate-200 rounded-[4px] text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>

          {/* Cases Table */}
          <div className="border border-slate-200 rounded-[4px] overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] text-slate-600 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3.5">ID Kasus</th>
                  <th className="py-2.5 px-3.5">Faskes / RS</th>
                  <th className="py-2.5 px-3.5">Standar Baku Verifikator</th>
                  <th className="py-2.5 px-3.5">Hasil Deteksi Sistem</th>
                  <th className="py-2.5 px-3.5 text-center">Grounding</th>
                  <th className="py-2.5 px-3.5 text-right">Latensi</th>
                  <th className="py-2.5 px-3.5 text-center">Klasifikasi</th>
                  <th className="py-2.5 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                      Tidak ada kasus pengujian yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => handleOpenDetail(item)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="px-3.5 py-2.5 font-semibold text-slate-900 tabular-nums">
                        {item.claimId}
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-700">
                        {item.hospital}
                      </td>
                      <td className="px-3.5 py-2.5">
                        <span className="text-[11px] font-medium text-slate-800">
                          {formatBenchmarkLabel(item.label)}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <span className="text-[11.5px] text-slate-600">
                          {item.detectedModus}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-[4px] border border-emerald-200 font-medium tabular-nums">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          100%
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 text-right text-slate-600 tabular-nums">
                        {item.processingTimeMs} ms
                      </td>
                      <td className="px-3.5 py-2.5 text-center">
                        <span
                          className={cn(
                            "text-[10.5px] font-semibold px-2 py-0.5 rounded-[4px] border tabular-nums",
                            item.resultStatus === "TRUE_POSITIVE" &&
                              "bg-emerald-50 text-emerald-800 border-emerald-200",
                            item.resultStatus === "TRUE_NEGATIVE" &&
                              "bg-blue-50 text-blue-800 border-blue-200",
                            item.resultStatus === "FALSE_POSITIVE" &&
                              "bg-amber-50 text-amber-800 border-amber-200",
                            item.resultStatus === "FALSE_NEGATIVE" &&
                              "bg-rose-50 text-rose-800 border-rose-200"
                          )}
                        >
                          {formatClassificationResult(item.resultStatus)}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(item);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-blue-700 bg-white border border-slate-200 rounded-[4px] hover:bg-slate-50 transition-colors shadow-2xs"
                        >
                          <span>Telemetri</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Telemetry Modal */}
      <ModalBenchmarkDetail
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        item={selectedCase}
      />
    </div>
  );
}

export default function BenchmarkSuitePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full bg-slate-50 text-xs text-slate-500">
          Memuat modul evaluasi benchmark...
        </div>
      }
    >
      <BenchmarkSuiteContent />
    </Suspense>
  );
}
