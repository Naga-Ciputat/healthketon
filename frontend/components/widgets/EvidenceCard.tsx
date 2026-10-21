"use client";

import React from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Quote,
  CheckCircle2,
  ExternalLink,
  Split,
  FileText,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FindingItem, CitationLocation } from "@/lib/mockData";

export interface EvidenceCardProps {
  finding: FindingItem;
  onSelectCitation?: (citation: CitationLocation) => void;
  onOpenDiffViewer?: (comparisonDetails: FindingItem["comparisonDetails"]) => void;
  isSelected?: boolean;
  className?: string;
}

export function EvidenceCard({
  finding,
  onSelectCitation,
  onOpenDiffViewer,
  isSelected = false,
  className,
}: EvidenceCardProps) {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getSeverityColors = (severity: FindingItem["severity"]) => {
    switch (severity) {
      case "danger":
        return {
          border: "border-rose-200 hover:border-rose-300",
          badge: "bg-rose-50 text-rose-700 border-rose-200",
          iconBg: "bg-rose-50 text-rose-600",
        };
      case "warning":
        return {
          border: "border-amber-200 hover:border-amber-300",
          badge: "bg-amber-50 text-amber-700 border-amber-200",
          iconBg: "bg-amber-50 text-amber-600",
        };
      case "info":
      default:
        return {
          border: "border-blue-200 hover:border-blue-300",
          badge: "bg-blue-50 text-blue-700 border-blue-200",
          iconBg: "bg-blue-50 text-blue-600",
        };
    }
  };

  const colors = getSeverityColors(finding.severity);

  return (
    <div
      className={cn(
        "bg-white border rounded-xl p-4 shadow-2xs transition-all space-y-3",
        colors.border,
        isSelected && "ring-2 ring-blue-500 border-blue-500",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                colors.badge
              )}
            >
              {finding.badgeLabel}
            </span>

            {/* 100% Verbatim Badge (F7) */}
            {finding.isVerbatim100 && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>100% Verbatim Verified</span>
              </span>
            )}

            {finding.deltaRupiah && (
              <span className="font-mono text-[11px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                -{formatRupiah(finding.deltaRupiah)}
              </span>
            )}
          </div>

          <h4 className="text-xs font-bold text-slate-900 leading-snug">
            {finding.title}
          </h4>
        </div>
      </div>

      {/* Narrative Explanation */}
      <p className="text-xs text-slate-600 leading-relaxed">
        {finding.description}
      </p>

      {/* Mini Comparison Table for Inflated Alkes (F5) */}
      {finding.type === "INFLATED_ALKES" && finding.comparisonDetails && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-xs space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Komparasi Fisik vs Tagihan</span>
            <span className="text-rose-600 font-mono font-bold">Selisih 1 Unit</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-200 text-[11px]">
            <div className="bg-white p-1.5 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Ditagihkan RS</span>
              <span className="font-bold text-slate-900">
                {finding.comparisonDetails.claimedQty} Unit (Rp 20 Jt)
              </span>
            </div>
            <div className="bg-white p-1.5 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Laporan Bedah Riil</span>
              <span className="font-bold text-emerald-700">
                {finding.comparisonDetails.actualQty} Unit (Rp 10 Jt)
              </span>
            </div>
            <div className="bg-rose-50 p-1.5 rounded border border-rose-200">
              <span className="text-rose-500 block text-[10px]">Inefisiensi Tidak Sah</span>
              <span className="font-bold text-rose-700 font-mono">
                -Rp 10.000.000
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Note Cloning Similarity & Diff Trigger (F6) */}
      {finding.type === "NOTE_CLONING" && finding.comparisonDetails && (
        <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-lg p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs font-mono">
              {finding.comparisonDetails.similarityScore}%
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-900 block">
                Identik dengan Pasien #{finding.comparisonDetails.donorClaimId}
              </span>
              <span className="text-[10px] text-indigo-700">
                Dirawat {finding.comparisonDetails.donorDate} oleh DPJP yang sama
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenDiffViewer?.(finding.comparisonDetails)}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-indigo-50 border border-indigo-300 text-indigo-700 text-xs font-medium rounded-md shadow-2xs transition-colors"
          >
            <Split className="w-3.5 h-3.5" />
            <span>Lihat Diff Teks</span>
          </button>
        </div>
      )}

      {/* Interactive Quotation Trigger (F7 & F8) */}
      {finding.citation && (
        <div
          onClick={() => onSelectCitation?.(finding.citation)}
          className="group/quote bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200/90 rounded-lg p-3 cursor-pointer transition-all space-y-1.5"
          title="Klik untuk membuka dokumen dan menyorot kutipan di pane kanan"
        >
          <div className="flex items-center justify-between text-[11px] text-amber-800 font-semibold">
            <div className="flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5 text-amber-600 rotate-180" />
              <span>
                {finding.citation.documentTitle} — Hal {finding.citation.pageNumber}
              </span>
            </div>
            <span className="text-[10px] text-amber-700 group-hover/quote:text-amber-900 underline flex items-center gap-0.5">
              <span>Sorot di Dokumen</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
          <p className="text-xs text-slate-800 italic font-serif leading-relaxed pl-2 border-l-2 border-amber-400">
            "{finding.citation.exactSubstring}"
          </p>
        </div>
      )}

      {/* Legal & PNPK Reference Footer */}
      {finding.regulationReference && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center gap-1">
            <Scale className="w-3 h-3 text-slate-400" />
            <span className="truncate">{finding.regulationReference}</span>
          </div>
        </div>
      )}
    </div>
  );
}
