"use client";

import React, { useState, useEffect } from "react";
import { TopHeader } from "@/components/widgets/TopHeader";
import { AuditLogStream, AuditLogItem } from "@/components/widgets/AuditLogStream";
import { getStoredAuditLogs } from "@/lib/claimStore";
import { fetchAuditLogsFromBackend } from "@/lib/api";
import { ShieldCheck, Download, Check, Banknote, ChevronDown, FileText, FileSpreadsheet } from "lucide-react";
import { ModalReconciliationReport } from "@/components/widgets/ModalReconciliationReport";

export default function AuditTrailPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Initial fast local load
    setLogs(getStoredAuditLogs());

    // 2. Fetch live audit trail from PostgreSQL
    fetchAuditLogsFromBackend().then((liveLogs) => {
      if (liveLogs && liveLogs.length > 0) {
        setLogs(liveLogs);
        if (typeof window !== "undefined") {
          localStorage.setItem("clarix_bpjs_audit_logs_v1", JSON.stringify(liveLogs));
        }
      }
    });

    const handleUpdate = () => {
      setLogs(getStoredAuditLogs());
    };
    window.addEventListener("clarix_audit_updated", handleUpdate);
    return () => {
      window.removeEventListener("clarix_audit_updated", handleUpdate);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const totalEfficiency = logs.reduce((sum, item) => sum + (item.savedDeltaRupiah || 0), 0);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  // 1. Ekspor CSV Terstruktur untuk Excel / SIMRS
  const handleExportCSV = () => {
    setIsExportMenuOpen(false);
    const headers = [
      "No",
      "ID Klaim",
      "Fasilitas Kesehatan",
      "Tanggal Putusan",
      "Verifikator",
      "Jabatan Verifikator",
      "Status Tindakan",
      "Nomor Surat Resmi",
      "Tarif Disetujui (IDR)",
      "Efisiensi Terkoreksi (IDR)",
      "Catatan Justifikasi",
    ];

    const rows = logs.map((l, idx) => [
      idx + 1,
      `"${l.claimId}"`,
      `"${(l.hospitalName || "").replace(/"/g, '""')}"`,
      `"${l.timestamp}"`,
      `"${(l.verifierName || "").replace(/"/g, '""')}"`,
      `"${(l.verifierRole || "Verifikator Utama").replace(/"/g, '""')}"`,
      `"${l.action}"`,
      `"${(l.officialLetterNumber || "-").replace(/"/g, '""')}"`,
      l.finalTariff || 0,
      l.savedDeltaRupiah || 0,
      `"${(l.notes || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
    ]);

    // UTF-8 BOM for seamless Microsoft Excel compatibility
    const csvContent =
      "\uFEFF" +
      [headers.join(";"), ...rows.map((row) => row.join(";"))].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Rekapitulasi_Audit_Klaim_BPJS_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    setExportFeedback("CSV Diunduh");
    setTimeout(() => setExportFeedback(null), 3000);
  };

  // 2. Ekspor Ringkasan Teks Lengkap (.TXT)
  const handleExportTXT = () => {
    setIsExportMenuOpen(false);
    const headerText = `REKAPITULASI BERITA ACARA AUDIT KLAIM BPJS KESEHATAN
Waktu Ekspor: ${new Date().toLocaleString("id-ID")}
Total Putusan: ${logs.length} berkas
Total Efisiensi Rekonsiliasi: ${formatRupiah(totalEfficiency)}
========================================================================

`;
    const bodyText = logs
      .map(
        (l, idx) =>
          `[${idx + 1}] ID KLAIM: ${l.claimId} | ${l.hospitalName}
Tanggal/Waktu: ${l.timestamp}
Verifikator: ${l.verifierName} (${l.verifierRole || "Verifikator Utama"})
Status: ${l.action}
Nomor Surat: ${l.officialLetterNumber || "-"}
Tarif Disetujui: Rp ${l.finalTariff.toLocaleString("id-ID")}
Efisiensi Terkoreksi: Rp ${l.savedDeltaRupiah.toLocaleString("id-ID")}
Catatan: ${l.notes}
------------------------------------------------------------------------`
      )
      .join("\n\n");

    const fullBlob = new Blob([headerText + bodyText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(fullBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Berita_Acara_Audit_BPJS_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setExportFeedback("TXT Diunduh");
    setTimeout(() => setExportFeedback(null), 3000);
  };

  // 3. Buka Modal Cetak PDF Berita Acara Rekonsiliasi Resmi
  const handleOpenReportModal = () => {
    setIsExportMenuOpen(false);
    setIsReportModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Top Header */}
      <TopHeader
        title="Audit Trail & Repositori Keputusan"
        subtitle="Log Append-Only Verifikasi Klaim"
        rightActions={
          <div className="flex items-center gap-2">
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-[4px] hover:bg-slate-50 transition-colors shadow-2xs"
              >
                {exportFeedback ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">{exportFeedback}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Ekspor Berita Acara</span>
                    <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
                  </>
                )}
              </button>

              {/* Dropdown Menu Pilihan Format Ekspor */}
              {isExportMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-[4px] shadow-md py-1 z-50 text-slate-800">
                  <button
                    type="button"
                    onClick={handleOpenReportModal}
                    className="w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition-colors font-medium"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>Cetak PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition-colors font-medium"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Unduh CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportTXT}
                    className="w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition-colors font-medium"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span>Unduh TXT</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 max-w-7xl w-full mx-auto space-y-4">
        {/* Compliance Notice Banner */}
        <div className="bg-white border border-slate-200 rounded-[4px] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[4px] bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 block">
                Jejak Audit Permanen Berbasis Hukum
              </span>
              <span className="text-slate-500">
                Seluruh putusan penyesuaian tarif dicatat secara append-only untuk mendukung akuntabilitas mediko-legal dan rekonsiliasi pembayaran faskes.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-[4px] border border-emerald-200 tabular-nums">
              <Banknote className="w-3.5 h-3.5" />
              <span>Total Efisiensi: {formatRupiah(totalEfficiency)}</span>
            </div>
            <div className="text-[11px] text-slate-500 tabular-nums font-medium bg-slate-50 px-2.5 py-1 rounded-[4px] border border-slate-200">
              {logs.length} Putusan Terekam
            </div>
          </div>
        </div>

        {/* Audit Log Stream Component */}
        <AuditLogStream entries={logs} title="Riwayat Keputusan Verifikator" />
      </div>

      {/* Modal Berita Acara Rekonsiliasi Kolektif */}
      <ModalReconciliationReport
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        logs={logs}
        totalEfficiency={totalEfficiency}
      />
    </div>
  );
}
