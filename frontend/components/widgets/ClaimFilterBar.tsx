"use client";

import React from "react";
import { Search, ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ClaimFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedHospital: string;
  onHospitalChange: (hospital: string) => void;
  hospitals: string[];
  selectedRisk: string;
  onRiskChange: (risk: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedModus?: string;
  onModusChange?: (modus: string) => void;
  sortBy?: string;
  onSortByChange?: (sort: string) => void;
  onResetFilters?: () => void;
  onOpenUpload?: () => void;
  className?: string;
}

export function ClaimFilterBar({
  searchQuery,
  onSearchChange,
  selectedHospital,
  onHospitalChange,
  hospitals,
  selectedRisk,
  onRiskChange,
  selectedStatus,
  onStatusChange,
  selectedModus = "ALL",
  onModusChange,
  sortBy = "priority",
  onSortByChange,
  onResetFilters,
  onOpenUpload,
  className,
}: ClaimFilterBarProps) {
  const riskOptions = [
    { id: "ALL", label: "Semua Risiko" },
    { id: "TINGGI", label: "Tinggi" },
    { id: "SEDANG", label: "Sedang" },
    { id: "RENDAH", label: "Rendah" },
  ];

  const isFiltered =
    searchQuery.trim().length > 0 ||
    selectedHospital !== "ALL" ||
    selectedRisk !== "ALL" ||
    selectedStatus !== "ALL" ||
    selectedModus !== "ALL";

  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 bg-white p-3 border border-slate-200 rounded-[4px] shadow-2xs",
        className
      )}
    >
      {/* Left side: Search & Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {/* Search Input */}
        <div className="relative min-w-[220px] flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari No SEP, Faskes, atau Diagnosis..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-[4px] text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all"
          />
        </div>

        {/* Hospital Dropdown */}
        <div className="relative">
          <select
            value={selectedHospital}
            onChange={(e) => onHospitalChange(e.target.value)}
            className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-slate-200 rounded-[4px] text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer shadow-2xs"
          >
            <option value="ALL">Semua Faskes</option>
            {hospitals.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-slate-200 rounded-[4px] text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer shadow-2xs"
          >
            <option value="ALL">Semua Status</option>
            <option value="PERLU_TINJAUAN">Perlu Telaah</option>
            <option value="PENDING_KLARIFIKASI_RS">Pending Klarifikasi RS</option>
            <option value="DOWNCODE_DIUSULKAN">Penyesuaian Tarif</option>
            <option value="DISETUJUI">Disetujui (Valid)</option>
            <option value="ESKALASI_PK_JKN">Eskalasi Khusus</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Modus Dropdown */}
        {onModusChange && (
          <div className="relative">
            <select
              value={selectedModus}
              onChange={(e) => onModusChange(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-slate-200 rounded-[4px] text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer shadow-2xs"
            >
              <option value="ALL">Semua Anomali</option>
              <option value="Upcoding">Upcoding</option>
              <option value="Inflated Alkes">Inflated Alkes</option>
              <option value="Note Cloning">Note Cloning</option>
              <option value="Unbundling">Unbundling</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}

        {/* Sorting Dropdown */}
        {onSortByChange && (
          <div className="relative flex items-center">
            <SlidersHorizontal className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="appearance-none pl-7 pr-7 py-1.5 bg-white border border-slate-200 rounded-[4px] text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer shadow-2xs"
            >
              <option value="priority">Urut: Prioritas Risiko Verifikasi</option>
              <option value="delta">Urut: Selisih Tarif Terbesar</option>
              <option value="tariff">Urut: Nilai Tagihan Terbesar</option>
              <option value="date">Urut: Tanggal Masuk Pasien</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}

        {/* Risk Segmented Buttons */}
        <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
          {riskOptions.map((opt) => {
            const isSelected = selectedRisk === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onRiskChange(opt.id)}
                className={cn(
                  "px-2 py-1 rounded-[4px] text-xs font-medium transition-colors",
                  isSelected
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Reset Filter Button */}
        {isFiltered && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-[4px] transition-colors"
            title="Reset semua filter ke default"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
