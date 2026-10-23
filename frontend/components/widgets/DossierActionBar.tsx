"use client";

import React from "react";
import { Sparkles, Check, Clock, ArrowDownCircle, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActionType = "DISETUJUI" | "PENDING_KLARIFIKASI_RS" | "DOWNCODE_DIUSULKAN" | "ESKALASI_PK_JKN";

export interface DossierActionBarProps {
  recommendedActionText: string;
  confidenceScore: number;
  onTriggerAction: (actionType: ActionType) => void;
  className?: string;
}

export function DossierActionBar({
  recommendedActionText,
  confidenceScore = 92,
  onTriggerAction,
  className,
}: DossierActionBarProps) {
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
          <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
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
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-[4px] text-xs font-semibold shadow-2xs transition-colors"
        >
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>Setujui Klaim</span>
        </button>

        {/* Pending Request Klarifikasi (Recommended) */}
        <button
          type="button"
          onClick={() => onTriggerAction("PENDING_KLARIFIKASI_RS")}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white border border-amber-600 rounded-[4px] text-xs font-semibold shadow-2xs transition-colors"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Klarifikasi RS</span>
        </button>

        {/* Propose Downcode (BPJS Blue) */}
        <button
          type="button"
          onClick={() => onTriggerAction("DOWNCODE_DIUSULKAN")}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-blue-50 text-blue-800 border border-blue-300 rounded-[4px] text-xs font-semibold shadow-2xs transition-colors"
        >
          <ArrowDownCircle className="w-3.5 h-3.5 text-blue-600" />
          <span>Koreksi Kode</span>
        </button>

        {/* Escalate to PK-JKN */}
        <button
          type="button"
          onClick={() => onTriggerAction("ESKALASI_PK_JKN")}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-rose-50 text-rose-800 border border-rose-300 rounded-[4px] text-xs font-semibold shadow-2xs transition-colors"
        >
          <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
          <span>Eskalasi Audit</span>
        </button>
      </div>
    </div>
  );
}
