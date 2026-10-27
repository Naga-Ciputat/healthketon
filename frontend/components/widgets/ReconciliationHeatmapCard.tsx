"use client";

import React, { useState, useMemo } from "react";
import { AuditLogItem } from "@/components/widgets/AuditLogStream";
import { cn } from "@/lib/utils";

export interface ReconciliationHeatmapCardProps {
  logs?: AuditLogItem[];
  className?: string;
}

export interface DayHeatData {
  dateKey: string; // YYYY-MM-DD
  dayLabel: string; // "Sen", "Sel", "Rab", etc.
  dateFormatted: string; // "23 Okt 2026"
  dayNameFull: string; // "Kamis"
  weekLabel: string; // "3 Pekan Lalu", "Pekan Ini", dll.
  weekIndex: number; // 0 to 3
  dayOfWeekIndex: number; // 0 (Sen) to 6 (Min)
  amountRupiah: number;
  decisionCount: number;
  level: 0 | 1 | 2 | 3 | 4;
}

// 7 Hari dalam sepekan (Senin s/d Minggu)
const DAY_LABELS = [
  { short: "Sen", full: "Senin" },
  { short: "Sel", full: "Selasa" },
  { short: "Rab", full: "Rabu" },
  { short: "Kam", full: "Kamis" },
  { short: "Jum", full: "Jumat" },
  { short: "Sab", full: "Sabtu" },
  { short: "Min", full: "Minggu" },
];

const WEEK_NAMES = ["3 Pekan Lalu", "2 Pekan Lalu", "Pekan Lalu", "Pekan Ini"];

export function ReconciliationHeatmapCard({
  logs = [],
  className,
}: ReconciliationHeatmapCardProps) {
  const [hoveredDay, setHoveredDay] = useState<DayHeatData | null>(null);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  // Bangun 28 hari terakhir (4 pekan x 7 hari)
  const heatmapData = useMemo(() => {
    // Parsing nilai efisiensi per tanggal dari logs aktif
    const logEfficiencyMap = new Map<string, { amount: number; count: number }>();

    logs.forEach((log) => {
      if (!log.timestamp) return;
      const match = log.timestamp.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
      if (match) {
        const day = match[1].padStart(2, "0");
        const monthStr = match[2].toLowerCase();
        const year = match[3];
        const monthNum =
          monthStr.startsWith("okt") || monthStr.startsWith("oct")
            ? "10"
            : monthStr.startsWith("sep")
            ? "09"
            : "10";
        const key = `${year}-${monthNum}-${day}`;
        const prev = logEfficiencyMap.get(key) || { amount: 0, count: 0 };
        logEfficiencyMap.set(key, {
          amount: prev.amount + (log.savedDeltaRupiah || 0),
          count: prev.count + 1,
        });
      }
    });

    // Distribusi baseline efisiensi harian 28 hari terakhir (30 Sep - 27 Okt 2026)
    const baselineDailyAmounts: Record<string, { amount: number; count: number }> = {
      // Pekan 3 (Terkini)
      "2026-10-27": { amount: 24900000, count: 2 }, // Hari ini (Selasa)
      "2026-10-26": { amount: 0, count: 0 },
      "2026-10-25": { amount: 0, count: 0 }, // Minggu
      "2026-10-24": { amount: 0, count: 0 }, // Sabtu
      "2026-10-23": { amount: 32700000, count: 3 }, // Kamis (Puncak audit klarifikasi)
      "2026-10-22": { amount: 12400000, count: 1 }, // Rabu
      "2026-10-20": { amount: 48800000, count: 4 }, // Senin (Audit Triase Masif)

      // Pekan 2
      "2026-10-17": { amount: 5300000, count: 1 },
      "2026-10-16": { amount: 8200000, count: 1 },
      "2026-10-15": { amount: 16500000, count: 2 },
      "2026-10-14": { amount: 0, count: 0 },
      "2026-10-13": { amount: 14200000, count: 2 },

      // Pekan 1
      "2026-10-10": { amount: 0, count: 1 }, // Disetujui valid (0 rupiah koreksi)
      "2026-10-09": { amount: 7400000, count: 1 },
      "2026-10-08": { amount: 34000000, count: 2 }, // Puncak Note Cloning
      "2026-10-07": { amount: 6200000, count: 1 },
      "2026-10-06": { amount: 0, count: 0 },

      // Pekan 0
      "2026-10-03": { amount: 0, count: 0 },
      "2026-10-02": { amount: 9800000, count: 1 },
      "2026-10-01": { amount: 12000000, count: 2 },
      "2026-09-30": { amount: 4500000, count: 1 },
    };

    // Matriks 7 baris (Senin-Minggu) x 4 kolom (pekan)
    const grid: DayHeatData[][] = [];
    const startDate = new Date(2026, 8, 29); // 29 Sep 2026 (Senin)

    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      const row: DayHeatData[] = [];
      for (let weekIdx = 0; weekIdx < 4; weekIdx++) {
        const cellDate = new Date(startDate);
        cellDate.setDate(startDate.getDate() + weekIdx * 7 + dayIdx);

        const y = cellDate.getFullYear();
        const m = String(cellDate.getMonth() + 1).padStart(2, "0");
        const d = String(cellDate.getDate()).padStart(2, "0");
        const dateKey = `${y}-${m}-${d}`;

        const MONTH_NAMES_ID = [
          "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
          "Jul", "Ags", "Sep", "Okt", "Nov", "Des",
        ];
        const dateFormatted = `${cellDate.getDate()} ${MONTH_NAMES_ID[cellDate.getMonth()]} ${y}`;

        const logged = logEfficiencyMap.get(dateKey);
        const baseline = baselineDailyAmounts[dateKey] || { amount: 0, count: 0 };
        const amountRupiah = logged ? logged.amount : baseline.amount;
        const decisionCount = logged ? logged.count : baseline.count;

        let level: DayHeatData["level"] = 0;
        if (amountRupiah > 40000000) {
          level = 4;
        } else if (amountRupiah >= 25000000) {
          level = 3;
        } else if (amountRupiah >= 10000000) {
          level = 2;
        } else if (amountRupiah > 0) {
          level = 1;
        } else {
          level = 0;
        }

        row.push({
          dateKey,
          dayLabel: DAY_LABELS[dayIdx].short,
          dateFormatted,
          dayNameFull: DAY_LABELS[dayIdx].full,
          weekLabel: WEEK_NAMES[weekIdx],
          weekIndex: weekIdx,
          dayOfWeekIndex: dayIdx,
          amountRupiah,
          decisionCount,
          level,
        });
      }
      grid.push(row);
    }

    return grid;
  }, [logs]);

  // Helper styling warna cell sesuai tema TELISIK (Emerald Palette)
  const getCellColorClass = (level: DayHeatData["level"]) => {
    switch (level) {
      case 0:
        return "bg-slate-100 hover:bg-slate-200 border-slate-200/50";
      case 1:
        return "bg-emerald-100 hover:bg-emerald-200 border-emerald-200 text-emerald-800";
      case 2:
        return "bg-emerald-300 hover:bg-emerald-400 border-emerald-400/80 text-emerald-950";
      case 3:
        return "bg-emerald-500 hover:bg-emerald-600 border-emerald-600 text-white";
      case 4:
        return "bg-emerald-700 hover:bg-emerald-800 border-emerald-800 text-white shadow-2xs";
      default:
        return "bg-slate-100 border-slate-200/50";
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-visible bg-white border border-slate-200 rounded-md p-3 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between w-full h-full select-none",
        className
      )}
    >
      {/* Header Card: Judul, Subtitle & Mini Legend */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col min-w-0">
          <span className="text-[12px] font-semibold text-slate-700 tracking-tight truncate leading-tight">
            Efisiensi Harian (28 Hari Terakhir)
          </span>
          <span className="text-[10px] text-slate-500 truncate leading-tight">
            Distribusi rekonsiliasi klaim
          </span>
        </div>

        {/* Mini Legend di Kanan Atas */}
        <div className="flex items-center gap-1 flex-shrink-0 text-[9.5px] text-slate-400 font-medium">
          <span className="mr-0.5">Rp 0</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-100 border border-slate-200/80" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-100 border border-emerald-200" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-300 border border-emerald-400" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500 border border-emerald-600" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-700 border border-emerald-800" />
          <span className="ml-0.5">Puncak</span>
        </div>
      </div>

      {/* Heatmap Grid Area: 7 Baris x 4 Kolom (Senin s/d Minggu) */}
      <div className="flex flex-col gap-[2px] my-auto">
        {heatmapData.map((row, rowIdx) => (
          <div key={rowIdx} className="flex items-center gap-2">
            {/* Label Hari di Sisi Kiri */}
            <span className="w-5 text-[9.5px] font-medium text-slate-500 flex-shrink-0 text-left leading-none">
              {DAY_LABELS[rowIdx].short}
            </span>

            {/* 4 Kolom Baris Ini */}
            <div className="flex-1 grid grid-cols-4 gap-1.5">
              {row.map((day, colIdx) => {
                const isHovered = hoveredDay?.dateKey === day.dateKey;
                return (
                  <div
                    key={day.dateKey}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={cn(
                      "relative h-[8.5px] rounded-[2.5px] border cursor-pointer transition-all duration-100",
                      getCellColorClass(day.level),
                      isHovered && "ring-1.5 ring-slate-800 scale-[1.04] z-30"
                    )}
                  >
                    {/* Tooltip Mengambang Saat Di-hover */}
                    {isHovered && (
                      <div
                        className={cn(
                          "absolute px-2.5 py-1.5 rounded-[4px] bg-slate-900/95 text-white shadow-xl border border-slate-700/80 pointer-events-none z-50 whitespace-nowrap backdrop-blur-xs transition-opacity duration-150 animate-in fade-in-50 min-w-[155px]",
                          // Penempatan vertikal: Baris 0, 1, 2 (Sen, Sel, Rab) render ke bawah
                          rowIdx <= 2 ? "top-full mt-2" : "bottom-full mb-2",
                          // Penempatan horizontal: Kolom paling kanan render ke kiri agar tidak terpotong
                          colIdx === 3
                            ? "right-0 left-auto translate-x-0"
                            : colIdx === 0
                            ? "left-0 translate-x-0"
                            : "left-1/2 -translate-x-1/2"
                        )}
                      >
                        <div className="flex flex-col gap-0.5 text-left">
                          <div className="flex items-center justify-between text-[10px] text-slate-300 border-b border-slate-700/80 pb-0.5 gap-2">
                            <span className="font-semibold text-slate-100">
                              {day.dayNameFull}, {day.dateFormatted}
                            </span>
                            <span className="text-[9px] text-slate-400">
                              {day.weekLabel}
                            </span>
                          </div>
                          <div className="flex items-baseline justify-between gap-3 pt-0.5">
                            <span className="text-[10px] text-slate-400">
                              Efisiensi:
                            </span>
                            <span
                              className={cn(
                                "text-[11.5px] font-bold tabular-nums",
                                day.amountRupiah > 0
                                  ? "text-emerald-400"
                                  : "text-slate-400"
                              )}
                            >
                              {day.amountRupiah > 0
                                ? formatRupiah(day.amountRupiah)
                                : "Rp 0"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 gap-3">
                            <span>Putusan Klaim:</span>
                            <span className="text-slate-200 font-medium">
                              {day.decisionCount > 0
                                ? `${day.decisionCount} berkas koreksi`
                                : "Nihil koreksi"}
                            </span>
                          </div>
                        </div>

                        {/* Tooltip Caret / Pointer */}
                        <div
                          className={cn(
                            "absolute w-1.5 h-1.5 bg-slate-900 border-slate-700/80 transform rotate-45",
                            rowIdx <= 2
                              ? "-top-1 -rotate-135 border-t border-l"
                              : "-bottom-1 border-r border-b",
                            colIdx === 3
                              ? "right-5 left-auto"
                              : colIdx === 0
                              ? "left-5"
                              : "left-1/2 -translate-x-1/2"
                          )}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
