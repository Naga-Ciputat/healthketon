"use client";

import React from "react";
import {
  Quote,
  CheckCircle2,
  ExternalLink,
  Copy,
  TrendingUp,
  FileSpreadsheet,
  AlertCircle,
  FileText,
  Scale,
} from "lucide-react";
import { cn, formatAnomalyCategory } from "@/lib/utils";
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

  const getFindingIcon = () => {
    switch (finding.type) {
      case "UPCODING":
        return <TrendingUp className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />;
      case "INFLATED_ALKES":
        return <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />;
      case "NOTE_CLONING":
        return <Copy className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />;
    }
  };

  // Severity styling: clean 4px badges with functional icon
  const getSeverityBadge = () => {
    if (finding.severity === "danger") {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    if (finding.severity === "warning") {
      return "bg-amber-50 text-amber-800 border-amber-200";
    }
    return "bg-blue-50 text-blue-800 border-blue-200";
  };

  return (
    <div
      className={cn(
        "bg-white border rounded-[4px] p-4 shadow-2xs transition-colors space-y-3",
        finding.severity === "danger"
          ? "border-rose-200 hover:border-rose-300"
          : finding.severity === "warning"
          ? "border-amber-200 hover:border-amber-300"
          : "border-slate-200 hover:border-slate-300",
        isSelected && "border-blue-600 bg-blue-50/20",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-semibold border",
                getSeverityBadge()
              )}
            >
              {getFindingIcon()}
              <span>{finding.badgeLabel || formatAnomalyCategory(finding.type)}</span>
            </span>

            {/* Verbatim Verified Badge */}
            {finding.isVerbatim100 && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[10.5px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                <span>Kutipan Terverifikasi</span>
              </span>
            )}

            {typeof finding.deltaRupiah === "number" && finding.deltaRupiah > 0 ? (
              <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-[4px] border border-rose-200 tabular-nums">
                Selisih: {formatRupiah(finding.deltaRupiah)}
              </span>
            ) : null}
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

      {/* Mini Comparison Table for Inflated Alkes */}
      {finding.type === "INFLATED_ALKES" && finding.comparisonDetails && (
        <div className="bg-slate-50/80 border border-slate-200 rounded-[4px] p-2.5 text-xs space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-700 flex items-center justify-between">
            <span>Komparasi Tagihan RS vs Laporan Tindakan Bedah</span>
            <span className="text-rose-700 font-semibold tabular-nums">Selisih 1 Unit</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-200 text-[11px]">
            <div className="bg-white p-1.5 rounded-[4px] border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block text-[10px]">Ditagihkan RS</span>
              <span className="font-semibold text-slate-900 tabular-nums">
                {finding.comparisonDetails.claimedQty} Unit (Rp 20 Jt)
              </span>
            </div>
            <div className="bg-white p-1.5 rounded-[4px] border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block text-[10px]">Laporan Bedah</span>
              <span className="font-semibold text-emerald-700 tabular-nums">
                {finding.comparisonDetails.actualQty} Unit (Rp 10 Jt)
              </span>
            </div>
            <div className="bg-rose-50 p-1.5 rounded-[4px] border border-rose-200 shadow-2xs">
              <span className="text-rose-600 block text-[10px]">Selisih Tagihan</span>
              <span className="font-semibold text-rose-700 tabular-nums">
                Rp 10.000.000
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Note Cloning Similarity & Diff Trigger */}
      {finding.type === "NOTE_CLONING" && finding.comparisonDetails && (
        <div className="bg-blue-50/50 border border-blue-200 rounded-[4px] p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[4px] bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs tabular-nums">
              {finding.comparisonDetails.similarityScore}%
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-900 block">
                Identik dengan Pasien #{finding.comparisonDetails.donorClaimId}
              </span>
              <span className="text-[11px] text-slate-600">
                Dirawat {finding.comparisonDetails.donorDate} oleh DPJP yang sama
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenDiffViewer?.(finding.comparisonDetails)}
            className="px-2.5 py-1 text-xs bg-white hover:bg-slate-50 text-blue-700 font-medium border border-blue-200 rounded-[4px] transition-colors inline-flex items-center gap-1 shadow-2xs"
          >
            <span>Bandingkan Teks</span>
            <ExternalLink className="w-3 h-3 text-blue-600" />
          </button>
        </div>
      )}

      {/* Citation Snippet & Deep-Link */}
      <div
        onClick={() => onSelectCitation?.(finding.citation)}
        className="bg-slate-50 hover:bg-blue-50/50 border border-slate-200 rounded-[4px] p-2.5 transition-colors cursor-pointer group"
      >
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span>{finding.citation.documentTitle} · Halaman {finding.citation.pageNumber}</span>
          </span>
          <span className="text-blue-700 font-semibold group-hover:underline flex items-center gap-0.5 text-[11px]">
            <span>Lihat Kutipan</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </span>
        </div>
        <div className="flex items-start gap-1.5 text-xs text-slate-700 italic">
          <Quote className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="line-clamp-2">
            &ldquo;{finding.citation.exactSubstring}&rdquo;
          </p>
        </div>
      </div>

      {/* Regulation Reference */}
      {finding.regulationReference && (
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <Scale className="w-3 h-3 text-slate-400 flex-shrink-0" />
          <span className="truncate">{finding.regulationReference}</span>
        </div>
      )}
    </div>
  );
}
