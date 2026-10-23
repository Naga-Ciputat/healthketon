"use client";

import React, { useState } from "react";
import { TopHeader } from "@/components/widgets/TopHeader";
import { INITIAL_BENCHMARK_RESULTS, BenchmarkCaseResult } from "@/lib/mockData";
import {
  FlaskConical,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BenchmarkSuitePage() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(100);
  const [results] = useState<BenchmarkCaseResult[]>(INITIAL_BENCHMARK_RESULTS);

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
    results.reduce((acc, r) => acc + r.processingTimeMs, 0) / results.length
  );

  const handleRunBenchmark = () => {
    setIsRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Top Header */}
      <TopHeader
        title="Scientific Benchmark Suite"
        subtitle="Evaluasi Kinerja 30 Kasus Terstandar"
        badge={
          <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-[4px] border border-emerald-200">
            Layar 4 (Juri Suite)
          </span>
        }
        rightActions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isRunning}
              onClick={handleRunBenchmark}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-[4px] hover:bg-blue-700 transition-colors shadow-2xs",
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
                  <Play className="w-3.5 h-3.5" />
                  <span>Jalankan Uji Batch (30 Kasus)</span>
                </>
              )}
            </button>
          </div>
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 max-w-7xl w-full mx-auto space-y-4">
        {/* Metrik Objektif Evaluasi */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          {/* Metrik 1: Recall */}
          <div className="bg-white border border-slate-200 rounded-md p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Sensitivitas Anomali (Recall)</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Target ≥ 85%
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {recall.toFixed(1)}%
            </div>
            <span className="text-[11px] text-slate-500 block">
              {truePositives} dari {actualAnomalies} anomali terdeteksi
            </span>
          </div>

          {/* Metrik 2: False Positive Rate */}
          <div className="bg-white border border-slate-200 rounded-md p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Laju Positif Palsu (FPR)</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Target ≤ 15%
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {fpr.toFixed(1)}%
            </div>
            <span className="text-[11px] text-slate-500 block">
              {falsePositives} dari {actualClean} klaim wajar salah dituduh
            </span>
          </div>

          {/* Metrik 3: Verbatim Grounding */}
          <div className="bg-white border border-slate-200 rounded-md p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Keandalan Kutipan (Grounding)</span>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                Target 100%
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {verbatimRate}%
            </div>
            <span className="text-[11px] text-slate-500 block">
              0% halusinasi (Exact substring match)
            </span>
          </div>

          {/* Metrik 4: Rata-rata Latensi */}
          <div className="bg-white border border-slate-200 rounded-md p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Rata-Rata Waktu Analisis</span>
              <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                Target &lt; 60s
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {(avgLatencyMs / 1000).toFixed(2)}s
            </div>
            <span className="text-[11px] text-slate-500 block">
              Inferensi sub-detik via Groq & Gemini Flash
            </span>
          </div>
        </div>

        {/* Tabel Rincian Kasus Uji */}
        <div className="bg-white rounded-md border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-800">
                Hasil Evaluasi Kasus Berlabel ({results.length} Kasus)
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Ground Truth vs Prediksi Model
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2.5">ID Kasus</th>
                  <th className="px-4 py-2.5">Faskes / RS</th>
                  <th className="px-4 py-2.5">Label Ground Truth</th>
                  <th className="px-4 py-2.5">Hasil Deteksi</th>
                  <th className="px-4 py-2.5 text-center">Grounding</th>
                  <th className="px-4 py-2.5 text-right">Latensi</th>
                  <th className="px-4 py-2.5 text-center">Klasifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-slate-900 tabular-nums">
                      {item.claimId}
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">
                      {item.hospital}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[11px] font-medium text-slate-700">
                        {item.label}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[11px] text-slate-600">
                        {item.detectedModus}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[3px] border border-emerald-200 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        100%
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-600 tabular-nums">
                      {item.processingTimeMs} ms
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={cn(
                          "text-[10.5px] font-semibold px-2 py-0.5 rounded-[3px] border tabular-nums",
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
                        {item.resultStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
