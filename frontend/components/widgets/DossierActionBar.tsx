"use client";

import React from "react";
import { Sparkles, Check, Clock, ArrowDownCircle, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActionType = "DISETUJUI" | "PENDING_KLARIFIKASI_RS" | "DOWNCODE_DIUSULKAN" | "ESKALASI_PK_JKN";

export interface DossierActionBarProps {
  recommendedActionText: string;
  confidenceScore: number;
  recommendedActionType?: ActionType;
  onTriggerAction: (actionType: ActionType) => void;
  className?: string;
}

export function DossierActionBar({
  recommendedActionText,
  confidenceScore = 92,
  recommendedActionType,
  onTriggerAction,
  className,
}: DossierActionBarProps) {
  // Determine which action is recommended
  const activeRecommendedType: ActionType =
    recommendedActionType ||
    (recommendedActionText.toLowerCase().includes("setuju")
      ? "DISETUJUI"
      : recommendedActionText.toLowerCase().includes("downcode") ||
        recommendedActionText.toLowerCase().includes("koreksi") ||
        recommendedActionText.toLowerCase().includes("penyesuaian")
      ? "DOWNCODE_DIUSULKAN"
      : recommendedActionText.toLowerCase().includes("eskalasi")
      ? "ESKALASI_PK_JKN"
      : "PENDING_KLARIFIKASI_RS");

  const isApproveRecommended = activeRecommendedType === "DISETUJUI";
  const isKlarifikasiRecommended = activeRecommendedType === "PENDING_KLARIFIKASI_RS";
  const isDowncodeRecommended = activeRecommendedType === "DOWNCODE_DIUSULKAN";
  const isEskalasiRecommended = activeRecommendedType === "ESKALASI_PK_JKN";

  return (
    <div
      className={cn(
        "bg-white border-t border-slate-200 p-4 shadow-sm flex flex-col gap-2.5 flex-shrink-0",
        className
      )}
    >
      {/* Recommendation Banner */}
      <div className="flex items-center justify-between px-3 py-2 bg-blue-50 border border-blue-200 rounded-[4px] text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src="/images/clarix-ai-icon.png"
            alt="Clarix AI"
            className="w-4 h-4 flex-shrink-0 object-contain"
          />
          <span className="font-semibold text-blue-950 truncate">
            {recommendedActionText}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          <span className="text-[11px] text-blue-700">Skor Keyakinan:</span>
          <span className="px-1.5 py-0.5 bg-blue-700 text-white font-semibold text-[10.5px] rounded-[4px] tabular-nums">
            {confidenceScore}%
          </span>
        </div>
      </div>

      {/* 4 Verifier Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Approve */}
        <button
          type="button"
          onClick={() => onTriggerAction("DISETUJUI")}
          className={cn(
            "flex items-center justify-center gap-1.5 px-3 py-2 rounded-[4px] text-xs font-semibold shadow-2xs transition-colors",
            isApproveRecommended
              ? "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white border border-emerald-600 shadow-xs"
              : "bg-white hover:bg-emerald-50 active:bg-emerald-100 text-emerald-800 border border-emerald-300"
          )}
        >
          <Check className={cn("w-3.5 h-3.5", isApproveRecommended ? "text-white" : "text-emerald-600")} />
          <span>Setujui Klaim</span>
        </button>

        {/* Pending Request Klarifikasi */}
        <button
          type="button"
          onClick={() => onTriggerAction("PENDING_KLARIFIKASI_RS")}
          className={cn(
            "flex items-center justify-center gap-1.5 px-3 py-2 rounded-[4px] text-xs font-semibold shadow-2xs transition-colors",
            isKlarifikasiRecommended
              ? "bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white border border-amber-600 shadow-xs"
              : "bg-white hover:bg-amber-50 active:bg-amber-100 text-amber-800 border border-amber-300"
          )}
        >
          <Clock className={cn("w-3.5 h-3.5", isKlarifikasiRecommended ? "text-white" : "text-amber-600")} />
          <span>Klarifikasi RS</span>
        </button>

        {/* Propose Downcode (BPJS Blue) */}
        <button
          type="button"
          onClick={() => onTriggerAction("DOWNCODE_DIUSULKAN")}
          className={cn(
            "flex items-center justify-center gap-1.5 px-3 py-2 rounded-[4px] text-xs font-semibold shadow-2xs transition-colors",
            isDowncodeRecommended
              ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border border-blue-600 shadow-xs"
              : "bg-white hover:bg-blue-50 active:bg-blue-100 text-blue-800 border border-blue-300"
          )}
        >
          <ArrowDownCircle className={cn("w-3.5 h-3.5", isDowncodeRecommended ? "text-white" : "text-blue-600")} />
          <span>Koreksi Kode</span>
        </button>

        {/* Escalate to PK-JKN */}
        <button
          type="button"
          onClick={() => onTriggerAction("ESKALASI_PK_JKN")}
          className={cn(
            "flex items-center justify-center gap-1.5 px-3 py-2 rounded-[4px] text-xs font-semibold shadow-2xs transition-colors",
            isEskalasiRecommended
              ? "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white border border-rose-600 shadow-xs"
              : "bg-white hover:bg-rose-50 active:bg-rose-100 text-rose-800 border border-rose-300"
          )}
        >
          <AlertOctagon className={cn("w-3.5 h-3.5", isEskalasiRecommended ? "text-white" : "text-rose-600")} />
          <span>Eskalasi Audit</span>
        </button>
      </div>
    </div>
  );
}
