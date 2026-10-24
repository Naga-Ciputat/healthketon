"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Send,
  FileText,
  AlertCircle,
  Edit3,
  CheckCircle2,
  Clock,
  Sliders,
  AlertOctagon,
  Check,
  Building2,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  FileCheck2,
  Lock,
} from "lucide-react";
import { cn, formatAnomalyCategory } from "@/lib/utils";
import { ClaimItem } from "@/lib/mockData";
import { ActionType } from "./DossierActionBar";

export interface ModalDisputeLetterProps {
  isOpen: boolean;
  onClose: () => void;
  claim: ClaimItem;
  actionType: ActionType;
  onConfirmDecision: (notes: string, letterDraft: string) => void;
}

export function ModalDisputeLetter({
  isOpen,
  onClose,
  claim,
  actionType,
  onConfirmDecision,
}: ModalDisputeLetterProps) {
  // Generate default verifier notes tailored to the action type
  const getDefaultNotes = (type: ActionType): string => {
    switch (type) {
      case "DISETUJUI":
        return "Klaim telah diverifikasi substantif. Seluruh berkas rekam medis dan penunjang tindakan terbukti valid sesuai kaidah koding Permenkes No. 3/2023. Disetujui penuh untuk realisasi pembayaran.";
      case "DOWNCODE_DIUSULKAN":
        return `Berdasarkan telaah klinis rekam medis, diagnosa sekunder komplikasi berat tidak didukung bukti objektif. Diusulkan penyesuaian kode dari Severity Level III ke Severity Level I dengan efisiensi tarif Rp ${claim.deltaTariff.toLocaleString("id-ID")}.`;
      case "ESKALASI_PK_JKN":
        return `Ditemukan indikasi anomali berulang (${(claim?.modusTags || []).map(formatAnomalyCategory).join(", ")}) dengan kemiripan redaksional teks rekam medis historis dan selisih alat implan. Berkas dilimpahkan ke Tim PK-JKN untuk audit investigasi lapangan.`;
      case "PENDING_KLARIFIKASI_RS":
      default:
        return (
          claim?.recommendedAction?.suggestedNotes ||
          "Dimintakan klarifikasi faktur pemakaian alkes implan serta bukti penunjang lab diagnosa komplikasi berat."
        );
    }
  };

  const generateLetterBody = (type: ActionType): string => {
    const todayStr = "23 Oktober 2026";
    if (type === "DISETUJUI") {
      return `BERITA ACARA PERSETUJUAN KLAIM JKN
Nomor: BA-BPJS/2026/ACC/${claim.id}
Tanggal: ${todayStr}

Kepada Yth.
Bagian Perbendaharaan & Keuangan BPJS Kesehatan Kantor Cabang
di Tempat

Perihal: Rekomendasi Realisasi Pembayaran Klaim Rawat Inap JKN
ID Klaim: ${claim.id}
Fasilitas Kesehatan: ${claim.hospitalName}
Pasien: Tn./Ny. Pasien (${claim.patientAge} th)
INA-CBG: ${claim.inacbgCode} - ${claim.inacbgDescription}

Dengan hormat,
Berdasarkan hasil verifikasi substantif dan uji silang bukti rekam medis elektronik terhadap berkas pengajuan klaim ${claim.id}, kami menyatakan bahwa:

1. Seluruh kelengkapan berkas resume medis, laporan operasi, dan bukti penunjang telah terverifikasi memenuhi standar kriteria koding Permenkes No. 3 Tahun 2023.
2. Tidak ditemukan indikasi upcoding, unbundling, maupun duplikasi tindakan bedah.
3. Klaim disetujui sebesar Rp ${claim.claimedTariff.toLocaleString("id-ID")} dan direkomendasikan untuk proses pencairan dana.

Demikian disampaikan untuk dipergunakan sebagaimana mestinya.

Verifikator Medis BPJS Kesehatan,
dr. Siti Aminah
NIP: 198804122014022001`;
    }

    if (type === "DOWNCODE_DIUSULKAN") {
      return `BERITA ACARA PENYESUAIAN KODE TINGKAT KEPARAHAN (DOWNCODE)
Nomor: BA-BPJS/2026/DOWNCODE/${claim.id}
Tanggal: ${todayStr}

Kepada Yth.
Komite Medik & Tim Kendali Mutu ${claim.hospitalName}
di Tempat

Perihal: Usulan Penyesuaian Kode INA-CBG dan Rekonsiliasi Tarif
ID Klaim: ${claim.id} (Pasien: ${claim.patientAge} Th)

Dengan hormat,
Sehubungan dengan hasil penelaahan audit klinis terhadap berkas penagihan ${claim.id}:

1. Kode Awal Pengajuan RS: ${claim.inacbgCode} (Severity Level III) - Nilai Tagihan: Rp ${claim.claimedTariff.toLocaleString("id-ID")}.
2. Temuan Klinis: Diagnosa sekunder komplikasi berat tidak didukung oleh kriteria klinis objektif pada lembar CPPT dan hasil laboratorium.
3. Usulan Kode Penyesuaian: I-4-10-I (Severity Level I) - Tarif Rujukan Wajar: Rp ${claim.fairTariff.toLocaleString("id-ID")}.
4. Nilai Koreksi Efisiensi: Rp ${claim.deltaTariff.toLocaleString("id-ID")}.

Mohon konfirmasi persetujuan penyesuaian kode ini dalam waktu 3 x 24 jam untuk penerbitan berita acara rekonsiliasi final.

Verifikator Medis BPJS Kesehatan,
dr. Siti Aminah`;
    }

    if (type === "ESKALASI_PK_JKN") {
      return `NOTA DINAS ESKALASI DUGAAN ANOMALI KE TIM PK-JKN (RAHASIA INTERNAL)
Nomor: ND-BPJS/2026/ESK-PK/${claim.id}
Tanggal: ${todayStr}

Kepada Yth.
Ketua Tim Pencegahan Kecurangan JKN (PK-JKN) Kantor Cabang
di Tempat

Perihal: Pelimpahan Berkas Klaim Terindikasi Penyimpangan Berulang
ID Berkas: ${claim.id}
Fasilitas Kesehatan: ${claim.hospitalName}

Dengan hormat,
Berdasarkan sistem deteksi dini dan telaah bukti verifikator, klaim ${claim.id} terindikasi memuat pola penyimpangan yang memerlukan audit investigasi komprehensif:

1. Modus Terindikasi: ${claim.modusTags.map(formatAnomalyCategory).join(", ")}.
2. Bukti Dokumen: Ditemukan kemiripan redaksional harfiah catatan medis SOAP dengan berkas donor historis faskes dan selisih pemakaian alat kesehatan implan.
3. Nilai Risiko Pembiayaan: Rp ${claim.claimedTariff.toLocaleString("id-ID")}.

Berkas ini dialihkan untuk penanganan investigasi lapangan oleh Tim PK-JKN sesuai Permenkes No. 16 Tahun 2019.

Verifikator Medis Pelapor,
dr. Siti Aminah`;
    }

    // Default: PENDING_KLARIFIKASI_RS
    return `SURAT PERMINTAAN KLARIFIKASI DAN BUKTI PENDUKUNG KLAIM JKN
Nomor: 440/BPJS-KCU/KLARIF/X/2026
Tanggal: ${todayStr}

Kepada Yth.
Direktur ${claim.hospitalName}
di Tempat

Perihal: Klarifikasi Bukti Klinis atas Pengajuan Berkas Klaim ${claim.id}
ID Klaim: ${claim.id} (Pasien: ${claim.patientAge} Th / DPJP: ${claim.dpjpName})

Dengan hormat,
Sehubungan dengan proses verifikasi pra-bayar pembiayaan JKN periode Oktober 2026, bersama surat ini kami sampaikan hasil penelaahan bukti klinis atas berkas tagihan ${claim.id}:

1. Selisih Alat Kesehatan Implan:
Tercatat penagihan kuitansi alat implan stent yang tidak bersesuaian dengan narasi tindakan pada Laporan Operasi Bedah. Berdasarkan Permenkes No. 3 Tahun 2023 Pasal 24, penagihan alkes wajib mencerminkan pemakaian riil tindakan.

2. Pemenuhan Kriteria Klinis Komplikasi:
Diagnosa sekunder komplikasi berat yang diajukan tidak didukung oleh hasil pemeriksaan penunjang lab objektif pada rekam medis.

Sehubungan dengan hal tersebut, kami memohon:
a. Memberikan klarifikasi tertulis serta bukti pendukung berita acara retur/pemakaian alat terkait.
b. Menyesuaikan kode penagihan ke tingkat keparahan yang bersesuaian dengan tarif wajar Rp ${claim.fairTariff.toLocaleString("id-ID")} (Potensi efisiensi: Rp ${claim.deltaTariff.toLocaleString("id-ID")}).

Demikian disampaikan, atas kerja sama faskes kami ucapkan terima kasih.

Verifikator Medis BPJS Kesehatan,
dr. Siti Aminah
NIP: 198804122014022001`;
  };

  const [verifierNotes, setVerifierNotes] = useState(getDefaultNotes(actionType));
  const [letterDraft, setLetterDraft] = useState(generateLetterBody(actionType));
  const [showLetterEditor, setShowLetterEditor] = useState(actionType !== "DISETUJUI");

  // Sync state whenever modal opens or actionType / claim changes
  useEffect(() => {
    setVerifierNotes(getDefaultNotes(actionType));
    setLetterDraft(generateLetterBody(actionType));
    setShowLetterEditor(actionType !== "DISETUJUI");
  }, [actionType, claim.id]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmDecision(verifierNotes, letterDraft);
  };

  // Dedicated Visual Configurations per Action Type
  const getConfig = () => {
    switch (actionType) {
      case "DISETUJUI":
        return {
          headerBg: "bg-emerald-50/80 border-b border-emerald-200",
          iconBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-700" />,
          title: "Persetujuan Realisasi Pembayaran Klaim JKN",
          badge: "Disetujui untuk Pencairan",
          badgeClass: "bg-emerald-100 text-emerald-800 border border-emerald-300",
          btnColor: "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white",
          btnIcon: <Check className="w-3.5 h-3.5" />,
          btnLabel: "Sahkan Persetujuan Klaim",
          notesLabel: "Catatan Kelayakan Pembayaran (Tercatat di Jejak Audit Keuangan):",
          alertBg: "bg-emerald-50 border-emerald-200 text-emerald-900",
          alertText:
            "Klaim ini akan disahkan statusnya menjadi 'Disetujui' dan Berita Acara Persetujuan diteruskan ke bagian perbendaharaan untuk pencairan dana.",
          letterLabel: "Draf Berita Acara Persetujuan Pembayaran (BA-BPJS/2026/ACC/...):",
        };
      case "DOWNCODE_DIUSULKAN":
        return {
          headerBg: "bg-blue-50/80 border-b border-blue-200",
          iconBg: "bg-blue-100 text-blue-800 border-blue-300",
          icon: <Sliders className="w-4 h-4 text-blue-700" />,
          title: "Usulan Penyesuaian Kode INA-CBG & Rekonsiliasi Tarif",
          badge: "Penyesuaian Tarif (Downcode)",
          badgeClass: "bg-blue-100 text-blue-800 border border-blue-300",
          btnColor: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white",
          btnIcon: <Sliders className="w-3.5 h-3.5" />,
          btnLabel: "Terbitkan Usulan Penyesuaian Tarif",
          notesLabel: "Justifikasi Klinis Penyesuaian Koding (Wajib Dicatat ke Audit Log):",
          alertBg: "bg-blue-50 border-blue-200 text-blue-900",
          alertText:
            "Berita Acara usulan penyesuaian kode akan diterbitkan untuk ditandatangani bersama Komite Medik & Tim Kendali Mutu Faskes.",
          letterLabel: "Draf Berita Acara Rekonsiliasi Kode (BA-BPJS/2026/DOWNCODE/...):",
        };
      case "ESKALASI_PK_JKN":
        return {
          headerBg: "bg-rose-50/80 border-b border-rose-200",
          iconBg: "bg-rose-100 text-rose-800 border-rose-300",
          icon: <AlertOctagon className="w-4 h-4 text-rose-700" />,
          title: "Pelimpahan Berkas Dugaan Anomali ke Tim PK-JKN",
          badge: "Dokumen Rahasia Internal BPJS",
          badgeClass: "bg-rose-100 text-rose-800 border border-rose-300 font-semibold",
          btnColor: "bg-rose-700 hover:bg-rose-800 active:bg-rose-900 text-white",
          btnIcon: <AlertOctagon className="w-3.5 h-3.5" />,
          btnLabel: "Limpahkan ke Tim Audit PK-JKN",
          notesLabel: "Catatan Temuan Intelijen Verifikator (Wajib Mencantumkan Titik Kejanggalan):",
          alertBg: "bg-rose-50 border-rose-200 text-rose-900",
          alertText:
            "PERHATIAN: Berkas ini adalah Nota Dinas Internal BPJS dan TIDAK DIKIRIM ke Rumah Sakit. Berkas dialihkan ke Tim Anti-Kecurangan JKN untuk investigasi audit lapangan.",
          letterLabel: "Draf Nota Dinas Internal Pelimpahan Kasus (ND-BPJS/2026/ESK-PK/...):",
        };
      case "PENDING_KLARIFIKASI_RS":
      default:
        return {
          headerBg: "bg-amber-50/80 border-b border-amber-200",
          iconBg: "bg-amber-100 text-amber-800 border-amber-300",
          icon: <Clock className="w-4 h-4 text-amber-700" />,
          title: "Surat Permintaan Klarifikasi Bukti Klinis ke Rumah Sakit",
          badge: "Korespondensi Eksternal Faskes",
          badgeClass: "bg-amber-100 text-amber-900 border border-amber-300",
          btnColor: "bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white",
          btnIcon: <Send className="w-3.5 h-3.5" />,
          btnLabel: "Kirim Surat Klarifikasi ke Faskes",
          notesLabel: "Instruksi Tindak Lanjut Verifikator (Dicatat di Jejak Audit):",
          alertBg: "bg-amber-50 border-amber-200 text-amber-950",
          alertText:
            "Status klaim akan diubah menjadi 'Pending Klarifikasi Faskes'. Waktu penyelesaian (SLA) ditangguhkan sementara hingga faskes mengunggah bukti susulan.",
          letterLabel: "Draf Surat Resmi Klarifikasi ke Direktur RS (440/BPJS-KCU/KLARIF/...):",
        };
    }
  };

  const config = getConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white border border-slate-200 rounded-[4px] w-full max-w-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] text-slate-800 animate-in fade-in zoom-in-95 duration-100">
        {/* Differentiated Modal Header */}
        <div className={cn("px-5 py-3.5 flex items-center justify-between flex-shrink-0", config.headerBg)}>
          <div className="flex items-center gap-2.5">
            <div className={cn("w-7 h-7 rounded-[4px] border flex items-center justify-center flex-shrink-0", config.iconBg)}>
              {config.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold text-slate-900">{config.title}</h3>
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded-[4px]", config.badgeClass)}>
                  {config.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Berkas <span className="tabular-nums font-semibold text-slate-800">{claim.id}</span> • Fasilitas:{" "}
                <span className="font-semibold text-slate-800">{claim.hospitalName}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-[4px] text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body with Contextual Widgets */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* ACTION SPECIFIC CONTEXT WIDGET */}
          {actionType === "DISETUJUI" && (
            <div className="bg-emerald-50/40 border border-emerald-200 rounded-[4px] p-3.5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white border border-emerald-200/80 p-2.5 rounded-[4px]">
                  <span className="text-[10px] text-slate-500 font-medium block">Total Nilai Disetujui:</span>
                  <span className="text-sm font-bold text-emerald-900 tabular-nums">
                    Rp {claim.claimedTariff.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="bg-white border border-emerald-200/80 p-2.5 rounded-[4px]">
                  <span className="text-[10px] text-slate-500 font-medium block">Kode INA-CBG Sah:</span>
                  <span className="text-xs font-semibold text-slate-900 truncate block">
                    {claim.inacbgCode} (Severity III)
                  </span>
                </div>
                <div className="bg-white border border-emerald-200/80 p-2.5 rounded-[4px]">
                  <span className="text-[10px] text-slate-500 font-medium block">Target Penerima Dokumen:</span>
                  <span className="text-xs font-semibold text-slate-900 block truncate">
                    Bag. Perbendaharaan BPJS
                  </span>
                </div>
              </div>

              {/* Substantive Checklist */}
              <div className="border-t border-emerald-200/60 pt-2.5 space-y-1.5 text-xs text-slate-700">
                <span className="text-[11px] font-semibold text-emerald-950 block">
                  Pernyataan Verifikasi Substantif:
                </span>
                <div className="flex items-center gap-2 text-[11px]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Resume medis, laporan operasi, dan bukti tindakan terverifikasi autentik.</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Tidak terdeteksi pemecahan episode rawat, upcoding koding, atau selisih alkes implan.</span>
                </div>
              </div>
            </div>
          )}

          {actionType === "DOWNCODE_DIUSULKAN" && (
            <div className="bg-blue-50/40 border border-blue-200 rounded-[4px] p-3.5 space-y-3">
              <div className="text-[11px] font-semibold text-blue-950 flex items-center justify-between">
                <span>Rekonsiliasi Tarif &amp; Usulan Penyesuaian Tingkat Keparahan:</span>
                <span className="text-[10px] text-blue-700 bg-blue-100/70 border border-blue-200 px-1.5 py-0.5 rounded-[4px]">
                  Permenkes No. 3/2023
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* 1. Pengajuan Awal RS */}
                <div className="bg-white border border-slate-200 p-2.5 rounded-[4px]">
                  <span className="text-[10px] text-slate-500 font-medium block">Pengajuan Awal RS:</span>
                  <span className="text-xs font-bold text-slate-800 block">{claim.inacbgCode} (Severity III)</span>
                  <span className="text-xs text-slate-700 font-medium tabular-nums block mt-0.5">
                    Rp {claim.claimedTariff.toLocaleString("id-ID")}
                  </span>
                </div>

                {/* 2. Rekomendasi Koreksi */}
                <div className="bg-blue-50/70 border border-blue-200 p-2.5 rounded-[4px]">
                  <span className="text-[10px] text-blue-700 font-medium block">Usulan Koreksi BPJS:</span>
                  <span className="text-xs font-bold text-blue-900 block">I-4-10-I (Severity I)</span>
                  <span className="text-xs text-blue-800 font-medium tabular-nums block mt-0.5">
                    Rp {claim.fairTariff.toLocaleString("id-ID")}
                  </span>
                </div>

                {/* 3. Efisiensi Biaya JKN */}
                <div className="bg-emerald-50/80 border border-emerald-300 p-2.5 rounded-[4px]">
                  <span className="text-[10px] text-emerald-800 font-medium flex items-center gap-1">
                    <TrendingDown className="w-3 h-3 text-emerald-700" />
                    <span>Potensi Efisiensi:</span>
                  </span>
                  <span className="text-sm font-bold text-emerald-950 tabular-nums block mt-0.5">
                    Rp {claim.deltaTariff.toLocaleString("id-ID")}
                  </span>
                  <span className="text-[9.5px] text-emerald-700 block">Optimalisasi Dana JKN</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 bg-white border border-slate-200 p-2 rounded-[4px]">
                <strong>Dasar Penelaahan:</strong> Diagnosa sekunder komplikasi berat tidak didukung hasil pemeriksaan penunjang lab objektif pada rekam medis. Kode disesuaikan ke tingkat keparahan yang sesuai fakta klinis.
              </div>
            </div>
          )}

          {actionType === "PENDING_KLARIFIKASI_RS" && (
            <div className="bg-amber-50/40 border border-amber-200 rounded-[4px] p-3.5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-white border border-amber-200/80 p-2.5 rounded-[4px]">
                  <span className="text-[10px] text-slate-500 font-medium block">Batas Waktu Respons Faskes:</span>
                  <span className="text-xs font-bold text-amber-900 block">3 x 24 Jam Kerja</span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">SLA 15 hari ditangguhkan sementara</span>
                </div>
                <div className="bg-white border border-amber-200/80 p-2.5 rounded-[4px]">
                  <span className="text-[10px] text-slate-500 font-medium block">Tujuan Surat Dinas:</span>
                  <span className="text-xs font-bold text-slate-800 block truncate">
                    Direktur &amp; Tim Casemix {claim.hospitalName}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Korespondensi Formal Luar Jaringan</span>
                </div>
              </div>

              {/* Required Clarification Points */}
              <div className="border-t border-amber-200/60 pt-2.5 space-y-1.5 text-xs text-slate-700">
                <span className="text-[11px] font-semibold text-amber-950 block">
                  Poin Bukti yang Diminta dari Rumah Sakit:
                </span>
                <div className="flex items-center gap-2 text-[11px]">
                  <Check className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                  <span>Faktur / Berita Acara Pemakaian Riil Alkes Implan Stent &amp; Retur Barang.</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <Check className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                  <span>Hasil laboratorium objektif pendukung diagnosa komplikasi sekunder berat.</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <Check className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                  <span>Lembar Catatan Perkembangan Pasien Terintegrasi (CPPT) asli DPJP.</span>
                </div>
              </div>
            </div>
          )}

          {actionType === "ESKALASI_PK_JKN" && (
            <div className="space-y-3">
              {/* Strict Confidentiality Warning */}
              <div className="bg-rose-50 border border-rose-300 rounded-[4px] p-3 text-xs text-rose-950 flex items-start gap-2.5 shadow-2xs">
                <ShieldAlert className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-semibold block text-rose-900">
                    KLASIFIKASI DOKUMEN: RAHASIA INTERNAL BPJS KESEHATAN
                  </span>
                  <p className="text-[11.5px] text-rose-800 leading-relaxed">
                    Nota Dinas ini <strong>TIDAK DIKIRIMKAN KE RUMAH SAKIT</strong>. Berkas dilimpahkan ke Tim Pencegahan Kecurangan JKN (PK-JKN) Kantor Cabang untuk penyelidikan forensik dan audit lapangan sesuai Permenkes No. 16 Tahun 2019.
                  </p>
                </div>
              </div>

              {/* Fraud Indication Dossier Card */}
              <div className="bg-rose-50/30 border border-rose-200 rounded-[4px] p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-rose-950">
                    Indikasi Modus &amp; Risiko Pembiayaan:
                  </span>
                  <span className="text-[10px] text-rose-800 bg-rose-100 border border-rose-200 px-1.5 py-0.5 rounded-[4px] font-medium">
                    Prioritas Tinggi
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {claim.modusTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-900 border border-rose-200 rounded-[4px] text-[11px] font-medium"
                    >
                      <AlertOctagon className="w-3 h-3 text-rose-700" />
                      <span>{formatAnomalyCategory(tag)}</span>
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-rose-200/60">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Nilai Risiko Tagihan:</span>
                    <span className="text-xs font-bold text-rose-950 tabular-nums">
                      Rp {claim.claimedTariff.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Unit Penerima Berkas:</span>
                    <span className="text-xs font-semibold text-slate-800 truncate block">
                      Tim Investigasi PK-JKN KC
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verifier Notes Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>{config.notesLabel}</span>
              </span>
              <span className="text-[11px] text-slate-500 font-normal">Audit Trail Wajib</span>
            </label>
            <textarea
              rows={2}
              required
              value={verifierNotes}
              onChange={(e) => setVerifierNotes(e.target.value)}
              placeholder="Tuliskan justifikasi pertimbangan medis dan dasar verifikasi..."
              className="w-full text-xs p-2.5 rounded-[4px] border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-slate-50/50 text-slate-900 placeholder-slate-400"
            />
          </div>

          {/* Official Letter / Document Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                <span>{config.letterLabel}</span>
              </label>
              {actionType === "DISETUJUI" && (
                <button
                  type="button"
                  onClick={() => setShowLetterEditor(!showLetterEditor)}
                  className="text-[11px] text-blue-700 hover:text-blue-900 font-medium underline"
                >
                  {showLetterEditor ? "Tutup Draf Berita Acara" : "Periksa & Edit Draf Berita Acara"}
                </button>
              )}
            </div>

            {showLetterEditor && (
              <div className="border border-slate-200 rounded-[4px] p-3 bg-slate-50/60">
                <textarea
                  rows={actionType === "DISETUJUI" ? 6 : 9}
                  value={letterDraft}
                  onChange={(e) => setLetterDraft(e.target.value)}
                  className="w-full text-xs leading-relaxed text-slate-800 bg-transparent border-none p-0 focus:outline-none focus:ring-0 resize-none select-text font-mono"
                />
              </div>
            )}
          </div>

          {/* Dynamic Alert Banner */}
          <div className={cn("p-2.5 border rounded-[4px] text-xs flex items-center gap-2", config.alertBg)}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="leading-snug">{config.alertText}</span>
          </div>

          {/* Modal Footer with Distinct Button States */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 rounded-[4px] text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[4px] text-xs font-semibold shadow-2xs transition-colors",
                config.btnColor
              )}
            >
              {config.btnIcon}
              <span>{config.btnLabel}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

