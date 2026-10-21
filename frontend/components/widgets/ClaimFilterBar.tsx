"use client";

import React from "react";
import { Search, Filter, Upload, ChevronDown } from "lucide-react";
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
  onOpenUpload: () => void;
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
  onOpenUpload,
  className,
}: ClaimFilterBarProps) {
  const riskOptions = [
    { id: "ALL", label: "Semua Risiko" },
    { id: "TINGGI", label: "Tinggi", color: "text-rose-700 bg-rose-50 border-rose-200" },
    { id: "SEDANG", label: "Sedang", color: "text-amber-700 bg-amber-50 border-amber-200" },
    { id: "RENDAH", label: "Rendah", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  ];

  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-xl shadow-2xs",
        className
      )}
    >
      {/* Left side: Search & Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        {/* Search Input */}
        <div className="relative min-w-[240px] flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari ID klaim, RS, atau diagnosa..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Hospital Dropdown */}
        <div className="relative">
          <select
            value={selectedHospital}
            onChange={(e) => onHospitalChange(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
          >
            <option value="ALL">Semua Faskes / RS</option>
            {hospitals.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
          >
            <option value="ALL">Semua Status</option>
            <option value="PERLU_TINJAUAN">Perlu Tinjauan</option>
            <option value="PENDING_KLARIFIKASI_RS">Pending Klarifikasi RS</option>
            <option value="DOWNCODE_DIUSULKAN">Downcode Diusulkan</option>
            <option value="DISETUJUI">Disetujui</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Risk Filter Buttons */}
        <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
          {riskOptions.map((opt) => {
            const isSelected = selectedRisk === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onRiskChange(opt.id)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                  isSelected
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right side: Upload Claim Trigger */}
      <button
        type="button"
        onClick={onOpenUpload}
        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-medium shadow-2xs transition-colors flex-shrink-0"
      >
        <Upload className="w-3.5 h-3.5" />
        <span>Unggah Paket Klaim</span>
      </button>
    </div>
  );
}
