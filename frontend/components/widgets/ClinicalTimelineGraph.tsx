"use client";

import React, { useState } from "react";
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Activity,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ClinicalEvent, CitationLocation } from "@/lib/mockData";

interface ClinicalTimelineGraphProps {
  events: ClinicalEvent[];
  onSelectEvent?: (event: ClinicalEvent) => void;
  selectedEventId?: string | null;
  className?: string;
}

export function ClinicalTimelineGraph({
  events = [],
  onSelectEvent,
  selectedEventId,
  className,
}: ClinicalTimelineGraphProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!events || events.length === 0) {
    return null;
  }

  const conflictCount = events.filter((e) => e.hasConflict).length;

  return (
    <div
      className={cn(
        "rounded-[4px] border border-slate-200 bg-white overflow-hidden shadow-2xs transition-all",
        className
      )}
    >
      {/* Header Bar with Toggle */}
      <div className="px-3.5 py-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <span className="text-xs font-semibold text-slate-800">
            Visual Clinical Journey Timeline
          </span>
          <span className="text-[11px] text-slate-500 font-normal">
            ({events.length} Titik Perawatan)
          </span>
          {conflictCount > 0 && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-[3px] text-[10.5px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
              <AlertCircle className="w-3 h-3 text-rose-600" />
              <span>{conflictCount} Titik Diskrepansi</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
          title={isExpanded ? "Sembunyikan Grafik Timeline" : "Tampilkan Grafik Timeline"}
        >
          <span>{isExpanded ? "Ringkas" : "Rentangkan"}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>
      </div>

      {/* Expanded Horizontal Pathway */}
      {isExpanded && (
        <div className="p-3.5 bg-slate-50/40 overflow-x-auto">
          <div className="min-w-[680px] flex items-stretch gap-2.5 relative">
            {events.map((event, index) => {
              const isSelected = selectedEventId === event.id;
              const isLast = index === events.length - 1;

              return (
                <div
                  key={event.id}
                  className="flex-1 flex flex-col justify-between group"
                >
                  {/* Step Card */}
                  <div
                    onClick={() => onSelectEvent?.(event)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        onSelectEvent?.(event);
                      }
                    }}
                    className={cn(
                      "h-full p-2.5 rounded-[4px] border text-left cursor-pointer transition-all flex flex-col justify-between",
                      isSelected
                        ? "bg-blue-50/80 border-blue-400 shadow-xs"
                        : event.hasConflict
                        ? "bg-white border-rose-200 hover:border-rose-400 hover:bg-rose-50/30"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    )}
                  >
                    <div>
                      {/* Top Meta: Day & Status Indicator */}
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                          {event.dayOffset}
                        </span>
                        {event.hasConflict ? (
                          <span
                            className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded-[2px] text-[9.5px] font-semibold bg-rose-100 text-rose-800 border border-rose-300"
                            title={event.conflictTag}
                          >
                            <AlertCircle className="w-2.5 h-2.5 text-rose-600 flex-shrink-0" />
                            <span>Diskrepansi</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded-[2px] text-[9.5px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            <CheckCircle2 className="w-2.5 h-2.5 text-slate-500 flex-shrink-0" />
                            <span>Sesuai</span>
                          </span>
                        )}
                      </div>

                      {/* Department / Phase */}
                      <div className="text-[11px] font-semibold text-slate-900 leading-tight mb-1 line-clamp-1">
                        {event.department}
                      </div>

                      {/* Event Title */}
                      <div className="text-[10.5px] font-medium text-slate-700 leading-snug mb-1.5">
                        {event.eventTitle}
                      </div>

                      {/* Short Clinical Notes */}
                      <p className="text-[10px] text-slate-600 leading-relaxed line-clamp-3">
                        {event.clinicalNotes}
                      </p>
                    </div>

                    {/* Bottom Indicator for Click-to-Document */}
                    <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[9.5px] text-slate-400 group-hover:text-blue-600 transition-colors">
                      <span className="tabular-nums font-mono">
                        {event.timestamp.split(" ")[1] || event.timestamp}
                      </span>
                      {event.targetDocumentId && (
                        <span className="flex items-center gap-0.5 font-medium underline">
                          <FileText className="w-2.5 h-2.5" />
                          <span>Buka Bukti</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
