"use client";

import React from "react";
import {
  FileText,
  X,
  Printer,
  ShieldCheck,
  Building2,
  Calendar,
  Banknote,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Mail,
  QrCode,
} from "lucide-react";
import { AuditLogItem } from "@/components/widgets/AuditLogStream";
import { cn } from "@/lib/utils";

interface ModalReconciliationReportProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLogItem[];
  totalEfficiency: number;
}

export function ModalReconciliationReport({
  isOpen,
  onClose,
  logs,
  totalEfficiency,
}: ModalReconciliationReportProps) {
  if (!isOpen) return null;

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const totalFinalTariff = logs.reduce((sum, item) => sum + (item.finalTariff || 0), 0);
  const totalClaimedEstimate = totalFinalTariff + totalEfficiency;

  const handlePrint = () => {
    window.print();
  };

  const getActionBadge = (action: AuditLogItem["action"]) => {
    switch (action) {
      case "DISETUJUI":
        return "Disetujui (Valid)";
      case "DOWNCODE_DIUSULKAN":
        return "Penyesuaian Tarif";
      case "ESKALASI_PK_JKN":
        return "Eskalasi Khusus";
      case "PENDING_KLARIFIKASI_RS":
      default:
        return "Klarifikasi RS";
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static"
    >
      <div className="bg-slate-100 border border-slate-300 rounded-[4px] w-full max-w-5xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden print:max-h-none print:border-none print:shadow-none print:w-full">
        {/* Top Header Chrome (Hidden on Print) */}
        <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 flex-shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[4px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xs font-semibold text-slate-900 tracking-tight">
                  Pratinjau Berita Acara Rekonsiliasi Kolektif (Format Cetak PDF / A4)
                </h3>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-[4px] text-[11px] font-semibold">
                  Dokumen Resmi BPJS KCU
                </span>
              </div>
              <p className="text-[11px] text-slate-500 tabular-nums">
                Nomor Register: BA-REKON/BPJS-KCU/2026/X-10 · Merangkum {logs.length} berkas putusan audit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-[4px] hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-200" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-[4px] text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Tutup dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Paper Sheet Preview Container (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-200/70 print:p-0 print:bg-white print:overflow-visible">
          <div className="bg-white border border-slate-300 rounded-[4px] shadow-xs p-6 sm:p-10 max-w-4xl mx-auto text-slate-900 space-y-6 print:border-none print:shadow-none print:p-0 print:max-w-none print:space-y-4">
            
            {/* Kop Surat Resmi BPJS Kesehatan */}
            <div className="text-center border-b-2 border-slate-900 pb-3">
              <div className="flex items-center justify-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-[4px] bg-emerald-700 text-white flex items-center justify-center font-bold text-sm tracking-widest shadow-2xs">
                  JKN
                </div>
                <div>
                  <h1 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-slate-950">
                    BADAN PENYELENGGARA JAMINAN SOSIAL KESEHATAN (BPJS KESEHATAN)
                  </h1>
                  <h2 className="text-[11px] sm:text-xs font-semibold tracking-wide uppercase text-slate-800">
                    KANTOR CABANG UTAMA JAKARTA SELATAN
                  </h2>
                </div>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium">
                Kedeputian Wilayah Pengawasan Verifikasi Klaim, Manajemen Manfaat & Mutu Pelayanan Faskes
              </p>
              <p className="text-[9.5px] sm:text-[10px] text-slate-500 mt-0.5">
                Jl. Raya Pasar Minggu No. 17, Jakarta Selatan · Telp: (021) 7919-8000 · e-verifikasi@bpjs-kesehatan.go.id
              </p>
            </div>

            {/* Judul Berita Acara Rekonsiliasi */}
            <div className="text-center space-y-1">
              <h3 className="text-xs sm:text-sm font-bold text-slate-950 uppercase tracking-tight underline decoration-slate-900 underline-offset-4">
                BERITA ACARA REKONSILIASI KLAIM FASILITAS KESEHATAN RUJUKAN TINGKAT LANJUT (FKRTL)
              </h3>
              <p className="text-xs font-semibold text-slate-700 tabular-nums">
                Nomor: BA-REKON/BPJS-KCU/2026/X-10 · Periode Verifikasi: Oktober 2026
              </p>
            </div>

            {/* Konsideran Paragraf Pembuka */}
            <div className="text-xs sm:text-[12px] leading-relaxed text-slate-800 space-y-2 text-justify">
              <p className="indent-6">
                Pada hari ini, <strong className="text-slate-900">Sabtu</strong> tanggal <strong className="text-slate-900">Dua Puluh Empat</strong> bulan <strong className="text-slate-900">Oktober</strong> tahun <strong className="text-slate-900">Dua Ribu Dua Puluh Enam</strong> (24-10-2026), bertempat di Kantor Cabang Utama BPJS Kesehatan Jakarta Selatan, telah diselenggarakan rapat rekonsiliasi dan penelaahan akhir berkas penagihan klaim pembiayaan Program Jaminan Kesehatan Nasional (JKN) periode pelayanan berjalan.
              </p>
              <p className="indent-6">
                Penelaahan mediko-legal dan administratif ini diselenggarakan berlandaskan pada Peraturan Menteri Kesehatan Republik Indonesia No. 3 Tahun 2023 tentang Standar Tarif Pelayanan Kesehatan dalam Penyelenggaraan Program Jaminan Kesehatan serta Petunjuk Teknis Verifikasi Klaim FKRTL BPJS Kesehatan. Seluruh hasil telaah dan putusan verifikator dicatat secara permanen (*append-only*) dalam sistem repositori putusan.
              </p>
            </div>

            {/* Ringkasan Eksekutif Finansial (KPI Penyelamatan Dana) */}
            <div className="bg-slate-50 border border-slate-200 rounded-[4px] p-3.5 text-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 flex-wrap gap-2">
                <span className="font-bold text-slate-900 uppercase text-[11px] tracking-wide">
                  Ringkasan Rekonsiliasi Finansial Pembiayaan JKN
                </span>
                <span className="text-[11px] text-slate-500 tabular-nums">
                  Total Berkas Diputuskan: <strong className="text-slate-800">{logs.length} Berkas</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-0.5">
                <div className="p-2.5 bg-white border border-slate-200 rounded-[4px]">
                  <span className="text-[10.5px] text-slate-500 block">Total Pengajuan Faskes</span>
                  <span className="text-sm font-bold text-slate-900 tabular-nums">
                    {formatRupiah(totalClaimedEstimate)}
                  </span>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-[4px]">
                  <span className="text-[10.5px] text-slate-500 block">Total Realisasi Disetujui</span>
                  <span className="text-sm font-bold text-blue-800 tabular-nums">
                    {formatRupiah(totalFinalTariff)}
                  </span>
                </div>
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-[4px]">
                  <span className="text-[10.5px] text-emerald-800 block font-medium">Total Koreksi Efisiensi JKN</span>
                  <span className="text-sm font-bold text-emerald-700 tabular-nums">
                    {formatRupiah(totalEfficiency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabel Rekapitulasi Rinci Putusan Klaim */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                Daftar Rekapitulasi Putusan Berkas Klaim
              </h4>
              <div className="border border-slate-200 rounded-[4px] overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold">
                      <th className="py-2 px-2.5 w-8 text-center">No</th>
                      <th className="py-2 px-2.5">ID Klaim</th>
                      <th className="py-2 px-2.5">Fasilitas Kesehatan</th>
                      <th className="py-2 px-2.5">Status Putusan</th>
                      <th className="py-2 px-2.5">Nomor Surat Dinas</th>
                      <th className="py-2 px-2.5 text-right">Tarif Disetujui</th>
                      <th className="py-2 px-2.5 text-right">Efisiensi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {logs.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-2.5 text-center text-slate-500 tabular-nums">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-2.5 font-semibold text-slate-900 tabular-nums">
                          {item.claimId}
                        </td>
                        <td className="py-2 px-2.5 text-slate-800 font-medium">
                          {item.hospitalName}
                        </td>
                        <td className="py-2 px-2.5">
                          <span className="font-medium text-slate-700">
                            {getActionBadge(item.action)}
                          </span>
                        </td>
                        <td className="py-2 px-2.5 font-mono text-[11px] text-slate-600 tabular-nums">
                          {item.officialLetterNumber || "-"}
                        </td>
                        <td className="py-2 px-2.5 text-right font-semibold text-slate-800 tabular-nums">
                          {formatRupiah(item.finalTariff)}
                        </td>
                        <td className="py-2 px-2.5 text-right font-semibold text-emerald-700 tabular-nums">
                          {item.savedDeltaRupiah > 0 ? formatRupiah(item.savedDeltaRupiah) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Klausul Ketetapan Mediko-Legal */}
            <div className="space-y-1.5 text-xs text-slate-800 leading-relaxed pt-1">
              <p className="font-semibold text-slate-900">Ketetapan Kesepakatan Bersama:</p>
              <ol className="list-decimal pl-5 space-y-1 text-slate-700">
                <li>
                  Berkas klaim yang berstatus <strong className="text-slate-900">Disetujui (Valid)</strong> disahkan untuk proses realisasi pencairan dana pada modul keuangan In-Monica.
                </li>
                <li>
                  Berkas dengan status <strong className="text-slate-900">Penyesuaian Tarif (Downcode)</strong> disepakati bersama oleh tim verifikator dan komite medis faskes sebagai dasar penyesuaian buku besar piutang.
                </li>
                <li>
                  Berkas dengan status <strong className="text-slate-900">Permintaan Klarifikasi</strong> ditangguhkan sementara pembayarannya hingga faskes menyampaikan kelengkapan berkas selambat-lambatnya 3x24 jam.
                </li>
                <li>
                  Berkas dengan indikasi anomali klinis/duplikasi <strong className="text-slate-900">dialihkan penanganannya ke Tim PK-JKN</strong> sesuai amanat Permenkes No. 16 Tahun 2019 untuk pemeriksaan investigatif lanjutan.
                </li>
              </ol>
            </div>

            {/* Lembar Pengesahan Para Pihak (2 Kolom TTE) */}
            <div className="pt-6 border-t border-slate-200">
              <p className="text-center text-xs font-semibold text-slate-900 mb-4">
                PENGESAHAN HASIL REKONSILIASI KLAIM
              </p>
              <div className="grid grid-cols-2 gap-8 text-xs text-center">
                {/* Pihak Pertama (BPJS) */}
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">PIHAK PERTAMA</p>
                  <p className="text-slate-600 text-[11px]">BPJS Kesehatan Kantor Cabang Utama</p>
                  <p className="text-[11px] text-slate-500">Kepala Bidang Penjaminan Manfaat</p>
                  <div className="h-14 flex items-center justify-center my-1">
                    <span className="font-serif italic text-xs text-slate-500 border border-slate-200 px-3 py-1 bg-slate-50 rounded-[2px]">
                      [ TTE Digital Validated ]
                    </span>
                  </div>
                  <p className="font-bold text-slate-950 underline decoration-slate-900">
                    dr. Siti Aminah
                  </p>
                  <p className="text-slate-600 font-mono text-[11px] tabular-nums">
                    NIP: 198804122014022001
                  </p>
                </div>

                {/* Pihak Kedua (Faskes / TKMKB) */}
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">PIHAK KEDUA</p>
                  <p className="text-slate-600 text-[11px]">Asosiasi Fasilitas Kesehatan / TKMKB</p>
                  <p className="text-[11px] text-slate-500">Ketua Tim Kendali Mutu Kendali Biaya</p>
                  <div className="h-14 flex items-center justify-center my-1">
                    <span className="font-serif italic text-xs text-slate-500 border border-slate-200 px-3 py-1 bg-slate-50 rounded-[2px]">
                      [ TTE Digital Validated ]
                    </span>
                  </div>
                  <p className="font-bold text-slate-950 underline decoration-slate-900">
                    dr. Hendrawan Sp.PK
                  </p>
                  <p className="text-slate-600 font-mono text-[11px] tabular-nums">
                    NIP: 198403152010121002
                  </p>
                </div>
              </div>
            </div>

            {/* Footer QR Verification */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dokumen ini disahkan secara elektronik melalui sistem Append-Only Audit Trail Clarix AI BPJS Kesehatan.</span>
              </div>
              <span className="font-mono tabular-nums">ID-AUTH: REC-2026-X10-BPJS</span>
            </div>

          </div>
        </div>

        {/* Footer Actions (Hidden on Print) */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between gap-3 flex-shrink-0 print:hidden">
          <div className="text-xs text-slate-500">
            Gunakan tombol cetak untuk menyimpan salinan resmi format PDF berukuran A4.
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-[4px] hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-200" />
              <span>Cetak / Simpan PDF</span>
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
