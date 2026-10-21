"use client";

import React, { useState } from "react";
import { TopHeader } from "@/components/widgets/TopHeader";
import { INITIAL_AUDIT_TRAIL, AuditTrailEntry } from "@/lib/mockData";
import {
  FileCheck2,
  ShieldCheck,
  FileText,
  Printer,
  Download,
  X,
  Lock,
  ChevronRight,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AuditTrailPage() {
  const [entries, setEntries] = useState<AuditTrailEntry[]>(INITIAL_AUDIT_TRAIL);
  const [selectedEntry, setSelectedEntry] = useState<AuditTrailEntry | null>(null);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getActionBadge = (action: AuditTrailEntry["action"]) => {
    switch (action) {
      case "DISETUJUI":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "PENDING_KLARIFIKASI_RS":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "DOWNCODE_DIUSULKAN":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "ESKALASI_PK_JKN":
        return "bg-rose-50 text-rose-700 border-rose-200";
    }
  };

  const totalSaved = entries.reduce((acc, e) => acc + e.savedDeltaRupiah, 0);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50/30">
      {/* Top Header */}
      <TopHeader
        title={
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
            <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Audit Trail &amp; Repositori Keputusan Resmi</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-medium border border-emerald-200 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" />
              <span>Append-Only</span>
            </span>
          </div>
        }
        subtitle="Jejak audit permanen tidak dapat diubah (immutable log)"
        showHelp={true}
        showAskAttio={false}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {/* KPI Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Total Keputusan Tercatat
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {entries.length} Kasus
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Setiap entri dilengkapi stempel waktu dan ID verifikator
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Efisiensi Dana Terselamatkan
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
              {formatRupiah(totalSaved)}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dana JKN terlindungi dari klaim berlebih</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Kepatuhan Hukum &amp; Regulasi
            </span>
            <div className="text-sm font-bold text-slate-900 mt-1">
              Permenkes No. 3/2023 &amp; UU PDP
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Arsip surat klarifikasi dapat diekspor untuk sidang mediasi
            </p>
          </div>
        </div>

        {/* Audit Trail Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900">
              Riwayat Keputusan Verifikator Medis
            </h3>
            <span className="text-[11px] text-slate-400">
              Terurut kronologis terbalik
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Waktu &amp; Verifikator</th>
                  <th className="py-3 px-4">Klaim &amp; Faskes</th>
                  <th className="py-3 px-4">Tindakan Diambil</th>
                  <th className="py-3 px-4 text-right">Tarif Disepakati</th>
                  <th className="py-3 px-4 text-right">Dana Diselamatkan</th>
                  <th className="py-3 px-4">Nomor Surat Resmi</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {entries.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Timestamp & Verifikator */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">
                          {item.verifierName}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {item.timestamp}
                        </span>
                      </div>
                    </td>

                    {/* Klaim & Faskes */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-blue-600 font-mono">
                          {item.claimId}
                        </span>
                        <span className="text-slate-600 truncate max-w-[160px]">
                          {item.hospitalName}
                        </span>
                      </div>
                    </td>

                    {/* Tindakan Diambil */}
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border",
                          getActionBadge(item.action)
                        )}
                      >
                        {item.action}
                      </span>
                    </td>

                    {/* Tarif Disepakati */}
                    <td className="py-3 px-4 text-right font-mono font-medium text-slate-900">
                      {formatRupiah(item.finalTariff)}
                    </td>

                    {/* Dana Diselamatkan */}
                    <td className="py-3 px-4 text-right">
                      {item.savedDeltaRupiah > 0 ? (
                        <span className="font-mono font-bold text-emerald-600">
                          +{formatRupiah(item.savedDeltaRupiah)}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">—</span>
                      )}
                    </td>

                    {/* No Surat Resmi */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {item.officialLetterNumber || "—"}
                    </td>

                    {/* Aksi Button */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedEntry(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition-colors shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>Lihat Surat</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal View Official Dispute Letter */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Surat Klarifikasi Resmi #{selectedEntry.officialLetterNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto font-serif text-xs leading-relaxed text-slate-800 space-y-3 bg-slate-50/20">
              <div className="border-b border-slate-200 pb-3 text-center space-y-0.5">
                <div className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
                  BADAN PENYELENGGARA JAMINAN SOSIAL KESEHATAN
                </div>
                <div className="font-sans text-[10px] text-slate-500">
                  KANTOR CABANG UTAMA (KCU) JAKARTA SELATAN
                </div>
              </div>

              <div className="flex justify-between text-[11px] font-sans text-slate-500 pt-2">
                <span>Nomor: {selectedEntry.officialLetterNumber}</span>
                <span>Waktu Terbit: {selectedEntry.timestamp}</span>
              </div>

              <div className="pt-2 space-y-2">
                <p>Kepada Yth. Direktur {selectedEntry.hospitalName}</p>
                <p>
                  Perihal: Permintaan Klarifikasi dan Bukti Pendukung Berkas Klaim #{selectedEntry.claimId}
                </p>
                <p className="pt-2">
                  Catatan Verifikator: "{selectedEntry.notes}"
                </p>
                <p>
                  Dasar Hukum: Permenkes No. 3 Tahun 2023 Pasal 24 tentang Tata Cara Penilaian Klaim dan PNPK Kemenkes RI.
                </p>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <button
                type="button"
                onClick={() => alert("Mengunduh salinan berkas PDF resmi...")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
