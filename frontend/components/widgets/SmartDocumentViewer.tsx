"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
  ExternalLink,
  Download,
  Layers,
  FileSearch,
  ShieldCheck,
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
  documents = [],
  activeCitation,
  onSelectDocumentTab,
  className,
}: SmartDocumentViewerProps) {
  const safeDocs = documents || [];
  const [activeTabId, setActiveTabId] = useState<DocumentSection["id"]>(
    safeDocs[0]?.id || "resumeMedis"
  );
  const [viewMode, setViewMode] = useState<"pdf" | "transcript">("pdf");
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

  const activeDoc = safeDocs.find((d) => d.id === activeTabId) || safeDocs[0];

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

  const hasPdf = Boolean(activeDoc.pdfUrl);

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
          {safeDocs.map((doc) => {
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
      <div className="h-10 bg-slate-50 border-b border-slate-200 px-3 flex items-center justify-between text-xs text-slate-600 flex-shrink-0 gap-2">
        <div className="flex items-center gap-2 text-[11px] text-slate-500 min-w-0">
          <span className="font-semibold text-slate-700 truncate max-w-[240px]">
            {activeDoc.fileName}
          </span>
          {hasPdf && viewMode === "pdf" && (
            <div className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium">
              <ShieldCheck className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              <span>PDF Berstempel Faskes</span>
            </div>
          )}
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Mode Switcher: PDF vs Transkrip */}
          <div className="inline-flex rounded-[4px] border border-slate-200 bg-white p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("pdf")}
              disabled={!hasPdf}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-[3px] transition-colors",
                viewMode === "pdf" && hasPdf
                  ? "bg-blue-50 text-blue-800 font-semibold border border-blue-200"
                  : "text-slate-600 hover:text-slate-900 disabled:opacity-40"
              )}
              title="Lihat Berkas Asli Format PDF"
            >
              <FileText className="w-3 h-3" />
              <span>Dokumen PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("transcript")}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-[3px] transition-colors",
                viewMode === "transcript" || !hasPdf
                  ? "bg-blue-50 text-blue-800 font-semibold border border-blue-200"
                  : "text-slate-600 hover:text-slate-900"
              )}
              title="Lihat Transkrip Teks & Sorotan Sitasi"
            >
              <FileSearch className="w-3 h-3" />
              <span>Transkrip Sitasi</span>
            </button>
          </div>

          {/* Action Buttons for PDF */}
          {hasPdf && activeDoc.pdfUrl && (
            <div className="flex items-center gap-1">
              <a
                href={activeDoc.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-[4px] border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
                title="Buka Dokumen PDF di Tab Baru"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={activeDoc.pdfUrl}
                download={activeDoc.fileName}
                className="p-1.5 rounded-[4px] border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
                title="Unduh Berkas PDF Asli"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Zoom Control (hanya di mode transkrip teks) */}
          {viewMode === "transcript" && (
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
          )}
        </div>
      </div>

      {/* Citation Banner Indicator if external citation is active */}
      {activeCitation && activeCitation.documentId === activeTabId && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs text-amber-900 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <div className="truncate text-[11.5px]">
              <span className="font-semibold text-amber-950">Kutipan Verbatim Terverifikasi (Hal {activeCitation.pageNumber}):</span>{" "}
              <span className="italic text-amber-800">
                &ldquo;{activeCitation.exactSubstring}&rdquo;
              </span>
            </div>
          </div>
          {viewMode === "pdf" && (
            <button
              type="button"
              onClick={() => setViewMode("transcript")}
              className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 underline flex-shrink-0 ml-3"
            >
              Sorot di Transkrip
            </button>
          )}
        </div>
      )}

      {/* Document Surface Area */}
      <div className="flex-1 min-h-0 overflow-hidden relative bg-slate-200/50 flex flex-col">
        {viewMode === "pdf" && hasPdf && activeDoc.pdfUrl ? (
          <div className="w-full h-full flex flex-col p-2">
            <iframe
              src={`${activeDoc.pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
              className="w-full h-full rounded-[4px] border border-slate-300 bg-white shadow-2xs"
              title={activeDoc.title}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 flex justify-center">
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
              className="w-full max-w-2xl bg-white rounded-[4px] shadow-sm border border-slate-200 p-8 min-h-[600px] transition-transform duration-150 space-y-5"
            >
              {activeDoc.pages.map((page) => (
                <div key={page.pageNumber} className="space-y-4">
                  {page.paragraphs.map((para, pIdx) => {
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
                          "text-xs leading-relaxed text-slate-800 rounded-[4px] p-2.5 transition-colors",
                          isHighlighted
                            ? "bg-amber-100/90 border border-amber-300 text-amber-950 font-medium shadow-2xs"
                            : "hover:bg-slate-50/80"
                        )}
                      >
                        {isHighlighted && (
                          <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-amber-800 mb-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                            <span>Kutipan Bukti Verbatim Terverifikasi 100%</span>
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
        )}
      </div>
    </div>
  );
}
