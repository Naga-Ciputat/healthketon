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
        "bg-white border-t border-slate-200 p-4 shadow-lg flex flex-col gap-3 flex-shrink-0",
        className
      )}
    >
      {/* Agent Recommendation Banner */}
      <div className="flex items-center justify-between px-3 py-2 bg-blue-50/80 border border-blue-200 rounded-lg text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="font-semibold text-blue-900 truncate">
            {recommendedActionText}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          <span className="text-[10px] text-blue-700">Keyakinan AI:</span>
          <span className="px-1.5 py-0.2 bg-blue-600 text-white font-mono font-bold text-[10px] rounded">
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
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-[0.98]"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Setujui</span>
        </button>

        {/* Pending Request Documents (Recommended) */}
        <button
          type="button"
          onClick={() => onTriggerAction("PENDING_KLARIFIKASI_RS")}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-all active:scale-[0.98] ring-2 ring-amber-300 ring-offset-1"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending — Klarifikasi</span>
        </button>

        {/* Propose Downcode */}
        <button
          type="button"
          onClick={() => onTriggerAction("DOWNCODE_DIUSULKAN")}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-purple-50 text-purple-700 border border-purple-300 rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-[0.98]"
        >
          <ArrowDownCircle className="w-3.5 h-3.5" />
          <span>Downcode</span>
        </button>

        {/* Escalate to PK-JKN */}
        <button
          type="button"
          onClick={() => onTriggerAction("ESKALASI_PK_JKN")}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-[0.98]"
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Eskalasi PK-JKN</span>
        </button>
      </div>
    </div>
  );
}
