"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  CheckCircle2,
  ExternalLink,
  Download,
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
  const highlightedRef = useRef<HTMLDivElement>(null);

  // Sync active tab whenever an external citation is clicked in left pane
  useEffect(() => {
    if (activeCitation) {
      setActiveTabId(activeCitation.documentId);
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
  const targetPageNumber =
    activeCitation && activeCitation.documentId === activeTabId
      ? activeCitation.pageNumber || 1
      : 1;

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

        {/* Action Controls for PDF */}
        {hasPdf && activeDoc.pdfUrl && (
          <div className="flex items-center gap-1 flex-shrink-0 pl-1 border-l border-slate-200">
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

      {/* Citation Highlight Indicator when an evidence citation is active */}
      {activeCitation && activeCitation.documentId === activeTabId && (
        <div className="bg-amber-50 border-b border-amber-200 px-3.5 py-1.5 flex items-center justify-between text-xs text-amber-950 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <div className="truncate text-[11.5px]">
              <span className="font-semibold text-amber-950">
                Kutipan Bukti Terverifikasi (Halaman {activeCitation.pageNumber}):
              </span>{" "}
              <span className="italic text-amber-900 font-medium bg-amber-100/80 px-1 py-0.5 rounded-[2px]">
                &ldquo;{activeCitation.exactSubstring}&rdquo;
              </span>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded-[3px] border border-amber-300 flex-shrink-0 ml-2">
            100% Verbatim Match
          </span>
        </div>
      )}

      {/* Document Surface Area: Direct PDF View */}
      <div className="flex-1 min-h-0 overflow-hidden relative bg-slate-200/50 flex flex-col">
        {hasPdf && activeDoc.pdfUrl ? (
          <div className="w-full h-full flex flex-col p-2">
            <iframe
              key={`${activeDoc.id}-${targetPageNumber}`}
              src={`${activeDoc.pdfUrl}#page=${targetPageNumber}&toolbar=1&navpanes=0&view=FitH`}
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
