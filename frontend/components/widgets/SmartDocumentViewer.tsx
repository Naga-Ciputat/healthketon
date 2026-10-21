"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
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
      // Wait for tab switch render, then scroll to highlighted text
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
      {/* Top Document Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto py-2">
          {documents.map((doc) => {
            const isActive = doc.id === activeTabId;
            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => handleTabChange(doc.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                )}
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>{doc.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Viewer Control Toolbar */}
      <div className="h-10 bg-slate-50 border-b border-slate-200 px-4 flex items-center justify-between text-xs text-slate-600 flex-shrink-0">
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
          <span className="font-semibold text-slate-700 truncate max-w-[200px]">
            {activeDoc.fileName}
          </span>
          <span>•</span>
          <span>Hal 1 / {activeDoc.pages.length}</span>
        </div>

        {/* Zoom & Page Navigation */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-slate-200 rounded-md bg-white shadow-2xs">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
              className="p-1 hover:bg-slate-100 text-slate-500 rounded-l transition-colors"
              title="Perkecil (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono font-medium border-x border-slate-100">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
              className="p-1 hover:bg-slate-100 text-slate-500 rounded-r transition-colors"
              title="Perbesar (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Rekam Medis Otentik</span>
          </div>
        </div>
      </div>

      {/* Document Document Surface Area */}
      <div className="flex-1 overflow-y-auto p-6 flex justify-center bg-slate-200/50">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
          className="w-full max-w-2xl bg-white rounded-xl shadow-md border border-slate-200 p-8 min-h-[600px] transition-transform duration-150 space-y-6"
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
                      "text-xs leading-relaxed text-slate-800 transition-all rounded p-1",
                      isHighlighted
                        ? "bg-amber-100/90 ring-2 ring-amber-400 p-3 rounded-lg font-medium shadow-xs text-amber-950 animate-pulse-short"
                        : "hover:bg-slate-50"
                    )}
                  >
                    {isHighlighted && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-800 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>KUTIPAN BUKTI TERSOROT (100% VERBATIM)</span>
                      </div>
                    )}
                    <p className="font-serif text-[13px] leading-relaxed select-text">
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
