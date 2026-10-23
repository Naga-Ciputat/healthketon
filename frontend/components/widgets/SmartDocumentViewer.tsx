"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DocumentSection, CitationLocation } from "@/lib/mockData";

export interface SmartDocumentViewerProps {
  documents: DocumentSection[];
  activeCitation?: CitationLocation | null;
  onSelectDocumentTab?: (docId: DocumentSection["id"]) => void;
  className?: string;
}

export function SmartDocumentViewer({
  documents,
  activeCitation,
  onSelectDocumentTab,
  className,
}: SmartDocumentViewerProps) {
  const [activeTabId, setActiveTabId] = useState<DocumentSection["id"]>(
    documents[0]?.id || "resumeMedis"
  );
  const [zoomLevel, setZoomLevel] = useState(100);
  const highlightedRef = useRef<HTMLDivElement>(null);

  // Sync active tab whenever an external citation is clicked in left pane
  useEffect(() => {
    if (activeCitation) {
      setActiveTabId(activeCitation.documentId);
      // Wait for tab switch render, then scroll smoothly to highlighted text
      setTimeout(() => {
        highlightedRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [activeCitation]);

  const activeDoc = documents.find((d) => d.id === activeTabId) || documents[0];

  const handleTabChange = (docId: DocumentSection["id"]) => {
    setActiveTabId(docId);
    onSelectDocumentTab?.(docId);
  };

  if (!activeDoc) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400 text-xs">
        Tidak ada dokumen terlampir pada klaim ini.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-slate-100/70 border-l border-slate-200 select-none",
        className
      )}
    >
      {/* Top Document Tabs: Surface Contrast */}
      <div className="bg-white border-b border-slate-200 px-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto py-1.5">
          {documents.map((doc) => {
            const isActive = doc.id === activeTabId;
            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => handleTabChange(doc.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-slate-100 text-slate-900 border border-slate-300 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                )}
              >
                <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>{doc.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Viewer Control Toolbar */}
      <div className="h-9 bg-slate-50 border-b border-slate-200 px-4 flex items-center justify-between text-xs text-slate-600 flex-shrink-0">
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-700 truncate max-w-[200px]">
            {activeDoc.fileName}
          </span>
          <span>•</span>
          <span className="tabular-nums">Hal 1 / {activeDoc.pages.length}</span>
        </div>

        {/* Zoom & Page Navigation */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-slate-200 rounded-[4px] bg-white shadow-2xs">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
              className="p-1 hover:bg-slate-100 text-slate-500 rounded-l-[4px] transition-colors"
              title="Perkecil (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-medium border-x border-slate-100 tabular-nums">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
              className="p-1 hover:bg-slate-100 text-slate-500 rounded-r-[4px] transition-colors"
              title="Perbesar (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-[4px] border border-emerald-200">
            <FileCheck className="w-3 h-3 text-emerald-600 flex-shrink-0" />
            <span>Rekam Medis Otentik</span>
          </div>
        </div>
      </div>

      {/* Document Surface Area */}
      <div className="flex-1 overflow-y-auto p-6 flex justify-center bg-slate-200/40">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
          className="w-full max-w-2xl bg-white rounded-[4px] shadow-sm border border-slate-200 p-8 min-h-[600px] transition-transform duration-150 space-y-5"
        >
          {activeDoc.pages.map((page) => (
            <div key={page.pageNumber} className="space-y-4">
              {page.paragraphs.map((para, pIdx) => {
                // Check if this paragraph contains the active verbatim quotation
                const isHighlighted =
                  activeCitation &&
                  activeCitation.documentId === activeTabId &&
                  (para.includes(activeCitation.exactSubstring) ||
                    activeCitation.exactSubstring.includes(para.slice(0, 30)));

                return (
                  <div
                    key={pIdx}
                    ref={isHighlighted ? highlightedRef : undefined}
                    className={cn(
                      "text-xs leading-relaxed text-slate-800 rounded-[4px] p-2 transition-colors",
                      isHighlighted
                        ? "bg-amber-100/80 border border-amber-200 text-amber-950 font-medium"
                        : "hover:bg-slate-50/80"
                    )}
                  >
                    {isHighlighted && (
                      <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-amber-800 mb-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                        <span>Kutipan Bukti Verbatim</span>
                      </div>
                    )}
                    <p className="font-serif text-[12.5px] leading-relaxed select-text">
                      {para}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
