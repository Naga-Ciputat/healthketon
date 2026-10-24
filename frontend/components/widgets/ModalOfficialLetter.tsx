"use client";

import React, { useState } from "react";
import {
  FileText,
  X,
  Printer,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Building2,
  Calendar,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  Mail,
  QrCode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  generateStructuredOfficialLetter,
  OfficialLetterData,
  StructuredOfficialLetter,
} from "@/lib/officialLetterTemplates";

interface ModalOfficialLetterProps {
  isOpen: boolean;
  onClose: () => void;
  letterData: OfficialLetterData | null;
}

export function ModalOfficialLetter({
  isOpen,
  onClose,
  letterData,
}: ModalOfficialLetterProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !letterData) return null;

  const letter: StructuredOfficialLetter = generateStructuredOfficialLetter(letterData);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letter.fullTextPlain);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Gagal menyalin teks surat:", err);
    }
  };

  const handleDownload = () => {
    const filename = `${letterData.letterNumber.replace(/[\/\\]/g, "_") || "Surat_Resmi_BPJS"}.txt`;
    const blob = new Blob([letter.fullTextPlain], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const getActionBadge = () => {
    switch (letterData.letterType) {
      case "DISETUJUI":
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-[4px] text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Persetujuan Pembayaran</span>
          </span>
        );
      case "DOWNCODE_DIUSULKAN":
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-[4px] text-xs font-semibold">
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>Penyesuaian Tarif</span>
          </span>
        );
      case "ESKALASI_PK_JKN":
        return (
          <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-[4px] text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Eskalasi Khusus PK-JKN</span>
          </span>
        );
      case "PENDING_KLARIFIKASI_RS":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-[4px] text-xs font-semibold">
            <Mail className="w-3.5 h-3.5 text-slate-600" />
            <span>Permintaan Klarifikasi</span>
          </span>
        );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static"
    >
      <div className="bg-slate-100 border border-slate-300 rounded-[4px] w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden print:max-h-none print:border-none print:shadow-none print:w-full">
        {/* Top Header Chrome (Hidden on Print) */}
        <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 flex-shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[4px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xs font-semibold text-slate-900 tracking-tight">
                  Dokumen Kedinasan Resmi — Berkas {letterData.claimId}
                </h3>
                {getActionBadge()}
              </div>
              <p className="text-[11px] text-slate-500 tabular-nums">
                Nomor Register: {letter.metadata.letterNumber} · Terekam Permanen pada Audit Trail
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-[4px] text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Tutup dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Paper Sheet Preview Container (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-200/70 print:p-0 print:bg-white print:overflow-visible">
          <div className="bg-white border border-slate-300 rounded-[4px] shadow-xs p-6 sm:p-10 max-w-3xl mx-auto text-slate-900 space-y-6 print:border-none print:shadow-none print:p-0 print:max-w-none print:space-y-4">
            
            {/* Kop Surat Resmi BPJS Kesehatan */}
            <div className="text-center border-b-2 border-slate-900 pb-3">
              <div className="flex items-center justify-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-[4px] bg-emerald-700 text-white flex items-center justify-center font-bold text-sm tracking-widest shadow-2xs">
                  JKN
                </div>
                <div>
                  <h1 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-slate-950">
                    {letter.header.institution}
                  </h1>
                  <h2 className="text-[11px] sm:text-xs font-semibold tracking-wide uppercase text-slate-800">
                    {letter.header.branch}
                  </h2>
                </div>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium">
                {letter.header.division}
              </p>
              <p className="text-[9.5px] sm:text-[10px] text-slate-500 mt-0.5">
                {letter.header.address}
              </p>
            </div>

            {/* Judul Jenis Naskah Dinas */}
            <div className="text-center space-y-1">
              <h3 className="text-xs sm:text-sm font-bold text-slate-950 uppercase tracking-tight underline decoration-slate-900 underline-offset-4">
                {letter.metadata.letterTypeTitle}
              </h3>
              <p className="text-xs font-semibold text-slate-700 tabular-nums">
                Nomor: {letter.metadata.letterNumber}
              </p>
            </div>

            {/* Metadata Surat (Nomor, Sifat, Lampiran, Tanggal, Tujuan) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1 border-t border-slate-200">
              <div className="space-y-1">
                <div className="flex items-start gap-2">
                  <span className="w-16 font-semibold text-slate-600 flex-shrink-0">Sifat</span>
                  <span className="text-slate-900">: {letter.metadata.nature}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-16 font-semibold text-slate-600 flex-shrink-0">Lampiran</span>
                  <span className="text-slate-900">: {letter.metadata.attachments}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-16 font-semibold text-slate-600 flex-shrink-0">Perihal</span>
                  <span className="text-slate-900 font-medium">: {letter.metadata.subject}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-start gap-2">
                  <span className="w-16 font-semibold text-slate-600 flex-shrink-0">Tanggal</span>
                  <span className="text-slate-900 tabular-nums">: {letter.metadata.date}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-16 font-semibold text-slate-600 flex-shrink-0">Kepada</span>
                  <span className="text-slate-900 font-medium">: Yth. {letter.metadata.recipient}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-16 font-semibold text-slate-600 flex-shrink-0">Di</span>
                  <span className="text-slate-700">: {letter.metadata.recipientAddress}</span>
                </div>
              </div>
            </div>

            {/* Ringkasan Parameter Klaim & Nilai Finansial */}
            <div className="bg-slate-50 border border-slate-200 rounded-[4px] p-3 text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-semibold text-slate-900">
                    {letter.claimSummary.hospitalName}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-mono text-slate-700 tabular-nums">
                    {letter.claimSummary.claimId}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 flex items-center gap-1">
                  <span>Verifikator:</span>
                  <strong className="text-slate-800 font-semibold">{letter.claimSummary.verifierName}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-0.5">
                <div>
                  <span className="text-[10.5px] text-slate-500 block">Tarif Pengajuan RS</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {formatRupiah(letter.claimSummary.claimedTariff || letter.claimSummary.finalTariff)}
                  </span>
                </div>
                <div>
                  <span className="text-[10.5px] text-slate-500 block">Tarif Disetujui/Rujukan</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {formatRupiah(letter.claimSummary.finalTariff)}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10.5px] text-slate-500 block">Koreksi Efisiensi JKN</span>
                  <span
                    className={cn(
                      "font-semibold tabular-nums",
                      letter.claimSummary.savedDeltaRupiah > 0
                        ? "text-emerald-700"
                        : "text-slate-600"
                    )}
                  >
                    {formatRupiah(letter.claimSummary.savedDeltaRupiah)}
                  </span>
                </div>
              </div>
            </div>

            {/* Isi Batang Tubuh Surat */}
            <div className="space-y-3 text-xs sm:text-[12.5px] leading-relaxed text-slate-800">
              <p className="font-semibold text-slate-900">Dengan hormat,</p>
              {letter.paragraphs.map((p, idx) => (
                <p key={idx} className="text-justify indent-6">
                  {p}
                </p>
              ))}

              {letter.points && letter.points.length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="font-semibold text-slate-900">
                    {letter.pointsTitle || "Pokok-pokok Telaah Mediko-Legal:"}
                  </p>
                  <ol className="list-decimal pl-5 space-y-1.5">
                    {letter.points.map((pt, idx) => (
                      <li key={idx} className="text-slate-800 pl-1">
                        <strong className="text-slate-950 font-semibold">{pt.title}:</strong>{" "}
                        <span>{pt.desc}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <p className="text-justify indent-6 pt-1">{letter.conclusion}</p>
            </div>

            {/* Dasar Hukum Regulasi */}
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 space-y-1">
              <span className="font-semibold text-slate-800 block">Dasar Hukum & Ketentuan Regulasi:</span>
              <ul className="list-disc pl-4 space-y-0.5">
                {letter.legalBasis.map((lb, idx) => (
                  <li key={idx}>{lb}</li>
                ))}
              </ul>
            </div>

            {/* Tanda Tangan & Verifikasi Digital Elektronik (TTE) */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-slate-200">
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-[4px] max-w-xs">
                <div className="w-12 h-12 bg-white border border-slate-300 rounded-[2px] p-1 flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-10 h-10 text-slate-800" />
                </div>
                <div className="text-[10px] space-y-0.5">
                  <div className="flex items-center gap-1 font-semibold text-emerald-800">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                    <span>Tervalidasi Digital (TTE)</span>
                  </div>
                  <p className="text-slate-500 font-mono tabular-nums leading-tight truncate">
                    {letter.signatory.digitalSignatureId}
                  </p>
                  <p className="text-slate-400 text-[9px]">
                    Integritas rekaman terjamin pada append-only audit trail
                  </p>
                </div>
              </div>

              <div className="text-right sm:text-right space-y-1">
                <p className="text-xs text-slate-700">{letter.signatory.cityAndDate}</p>
                <p className="text-xs font-semibold text-slate-900">{letter.signatory.position}</p>
                <div className="h-10 flex items-center justify-end">
                  <span className="font-serif italic text-sm text-slate-600 tracking-wider">
                    [ Ditandatangani Secara Elektronik ]
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-950 underline decoration-slate-900 underline-offset-2">
                  {letter.signatory.name}
                </p>
                <p className="text-[11px] text-slate-600 font-mono tabular-nums">
                  {letter.signatory.nip}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions (Hidden on Print) */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 flex-shrink-0 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="tabular-nums">Dokumen ini memiliki kekuatan pembuktian mediko-legal resmi.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-[4px] hover:bg-slate-50 transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Tersalin ke Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Salin Naskah</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-[4px] hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Unduh .TXT</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-[4px] hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-200" />
              <span>Cetak Dokumen</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-[4px] transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
