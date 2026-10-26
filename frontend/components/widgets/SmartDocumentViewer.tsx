"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  CheckCircle2,
  ExternalLink,
  Download,
  RotateCcw,
  ZoomIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DocumentSection, CitationLocation } from "@/lib/mockData";

export interface SmartDocumentViewerProps {
  documents: DocumentSection[];
  activeCitation?: CitationLocation | null;
  onSelectDocumentTab?: (docId: DocumentSection["id"]) => void;
  className?: string;
}

interface ZoomTarget {
  zoom: number;
  left: number;
  top: number;
}

function getCitationZoomCoordinates(citation?: CitationLocation | null): ZoomTarget | null {
  if (!citation) return null;
  const docId = citation.documentId;
  const text = (citation.exactSubstring || "").toLowerCase();
  const para = citation.paragraphIndex ?? 0;

  // 1. Hasil Lab Biomarker
  if (docId === "hasilLab") {
    if (text.includes("prokalsitonin") || text.includes("leukosit") || text.includes("pct")) {
      return { zoom: 150, left: 0, top: 270 };
    }
    if (text.includes("mikrobiologi") || text.includes("kultur")) {
      return { zoom: 145, left: 0, top: 460 };
    }
    return { zoom: 150, left: 0, top: 270 };
  }

  // 2. Laporan Operasi PCI
  if (docId === "laporanOperasi") {
    if (text.includes("stent") || text.includes("batal") || text.includes("cadangan") || text.includes("depo")) {
      return { zoom: 145, left: 0, top: 260 };
    }
    if (text.includes("rekonsiliasi") || text.includes("unit terpasang")) {
      return { zoom: 145, left: 0, top: 380 };
    }
    return { zoom: 145, left: 0, top: 250 };
  }

  // 3. Kuitansi Rincian Billing
  if (docId === "kuitansiAlkes") {
    if (text.includes("unbundling") || text.includes("paket")) {
      return { zoom: 145, left: 0, top: 280 };
    }
    return { zoom: 145, left: 0, top: 220 };
  }

  // 4. Resume Medis
  if (docId === "resumeMedis") {
    if (text.includes("anamnesis") || text.includes("nyeri dada") || text.includes("smrs") || text.includes("substernal")) {
      return { zoom: 140, left: 0, top: 190 };
    }
    if (text.includes("sepsis") || text.includes("a41.9") || text.includes("kodifikasi")) {
      return { zoom: 140, left: 0, top: 310 };
    }
    if (para >= 2) return { zoom: 140, left: 0, top: 290 };
    return { zoom: 140, left: 0, top: 180 };
  }

  return { zoom: 140, left: 0, top: 180 };
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
  const [isFocusedOnCitation, setIsFocusedOnCitation] = useState(false);
  const [focusNonce, setFocusNonce] = useState(0);
  const highlightedRef = useRef<HTMLDivElement>(null);

  // Sync active tab & trigger deep zoom whenever a citation is clicked
  useEffect(() => {
    if (activeCitation) {
      setActiveTabId(activeCitation.documentId);
      setIsFocusedOnCitation(true);
      setFocusNonce((prev) => prev + 1);

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
    setIsFocusedOnCitation(false);
    onSelectDocumentTab?.(docId);
  };

  const handleResetZoom = () => {
    setIsFocusedOnCitation(false);
    setFocusNonce((prev) => prev + 1);
  };

  if (!activeDoc) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400 text-xs">
        Tidak ada dokumen terlampir pada klaim ini.
      </div>
    );
  }

  const hasPdf = Boolean(activeDoc.pdfUrl);
  const targetPageNumber =
    activeCitation && activeCitation.documentId === activeTabId
      ? activeCitation.pageNumber || 1
      : 1;

  const zoomCoords =
    isFocusedOnCitation && activeCitation && activeCitation.documentId === activeTabId
      ? getCitationZoomCoordinates(activeCitation)
      : null;

  const pdfIframeSrc = zoomCoords
    ? `${activeDoc.pdfUrl}#page=${targetPageNumber}&zoom=${zoomCoords.zoom},${zoomCoords.left},${zoomCoords.top}`
    : `${activeDoc.pdfUrl}#page=${targetPageNumber}&toolbar=1&navpanes=0&view=FitH`;

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-slate-100/70 border-l border-slate-200 select-none",
        className
      )}
    >
      {/* Single Unified Header: Document Tabs + Action Controls */}
      <div className="bg-white border-b border-slate-200 px-3 flex items-center justify-between flex-shrink-0 h-10 gap-2">
        {/* Document Tabs */}
        <div className="flex-1 min-w-0 flex items-center gap-1 overflow-x-auto py-1">
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

        {/* Action Controls & Zoom Focus Status */}
        <div className="flex items-center gap-1.5 flex-shrink-0 pl-1 border-l border-slate-200">
          {zoomCoords && (
            <div className="flex items-center gap-1">
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[10.5px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                <ZoomIn className="w-3 h-3 text-blue-600 flex-shrink-0" />
                <span>Zoom {zoomCoords.zoom}%</span>
              </span>
              <button
                type="button"
                onClick={handleResetZoom}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-[4px] text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors"
                title="Kembalikan tampilan PDF ke ukuran penuh (Fit Width)"
              >
                <RotateCcw className="w-3 h-3 text-slate-500" />
                <span>Tampilan Penuh</span>
              </button>
            </div>
          )}

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
        </div>
      </div>

      {/* Document Surface Area: Direct PDF View with Coordinate Zoom */}
      <div className="flex-1 min-h-0 overflow-hidden relative bg-slate-200/50 flex flex-col">
        {hasPdf && activeDoc.pdfUrl ? (
          <div className="w-full h-full flex flex-col p-2">
            <iframe
              key={`${activeDoc.id}-${targetPageNumber}-${zoomCoords ? `zoom-${zoomCoords.top}` : "full"}-${focusNonce}`}
              src={pdfIframeSrc}
              className="w-full h-full rounded-[4px] border border-slate-300 bg-white shadow-2xs"
              title={activeDoc.title}
            />
          </div>
        ) : (
          /* Graceful Text Fallback for documents without PDF */
          <div className="flex-1 overflow-y-auto p-6 flex justify-center">
            <div className="w-full max-w-2xl bg-white rounded-[4px] shadow-sm border border-slate-200 p-8 min-h-[600px] space-y-5">
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
