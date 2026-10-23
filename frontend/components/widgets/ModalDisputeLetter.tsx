"use client";

import React, { useState, useEffect } from "react";
import { X, Send, FileText, AlertCircle, Edit3, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [verifierNotes, setVerifierNotes] = useState(
    claim.recommendedAction.suggestedNotes || ""
  );

  const generateLetterBody = (type: ActionType): string => {
    const todayStr = "23 Oktober 2026";
    if (type === "DISETUJUI") {
      return `BERITA ACARA PERSETUJUAN KLAIM JKN
Nomor: BA-BPJS/2026/ACC/${claim.id}
Tanggal: ${todayStr}

Kepada Yth.
Direktur ${claim.hospitalName}
di Tempat

Perihal: Rekomendasi Realisasi Pembayaran Klaim Rawat Inap JKN
ID Klaim: ${claim.id}
Pasien: Tn./Ny. Pasien (${claim.patientAge} th)
INA-CBG: ${claim.inacbgCode} - ${claim.inacbgDescription}

Dengan hormat,
Berdasarkan hasil verifikasi substantif dan uji silang bukti rekam medis elektronik terhadap berkas pengajuan klaim ${claim.id}, kami menyatakan bahwa:

1. Seluruh kelengkapan berkas resume medis, laporan operasi, dan bukti penunjang telah terverifikasi memenuhi standar kriteria koding Permenkes No. 3 Tahun 2023.
2. Tidak ditemukan indikasi upcoding, unbundling, maupun duplikasi tindakan bedah.
3. Klaim disetujui sebesar Rp ${claim.claimedTariff.toLocaleString("id-ID")} dan diteruskan ke bagian perbendaharaan untuk proses realisasi pembayaran.

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
      return `NOTA DINAS ESKALASI DUGAAN ANOMALI KE TIM PK-JKN
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

1. Modus Terindikasi: ${claim.modusTags.join(", ")}.
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

  const [letterDraft, setLetterDraft] = useState(generateLetterBody(actionType));

  useEffect(() => {
    setLetterDraft(generateLetterBody(actionType));
  }, [actionType, claim]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmDecision(verifierNotes, letterDraft);
  };

  const getActionLabel = () => {
    switch (actionType) {
      case "DISETUJUI":
        return "Persetujuan Pembayaran Klaim";
      case "PENDING_KLARIFIKASI_RS":
        return "Permintaan Klarifikasi Faskes";
      case "DOWNCODE_DIUSULKAN":
        return "Penyesuaian Kode INA-CBG (Downcode)";
      case "ESKALASI_PK_JKN":
        return "Eskalasi ke Tim PK-JKN";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white border border-slate-200 rounded-[4px] w-full max-w-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] text-slate-800">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[4px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-900">
                Konfirmasi Putusan Verifikator &amp; Draf Dokumen Resmi
              </h3>
              <p className="text-[11px] text-slate-500">
                Tindakan: <strong className="font-semibold text-slate-800">{getActionLabel()}</strong> • Berkas <span className="tabular-nums font-semibold">{claim.id}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-[4px] text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Verifier Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span>Catatan Pertimbangan Verifikator (Wajib Dicatat ke Jejak Audit):</span>
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

          {/* Official Letter Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800">
                Draf Surat / Berita Acara Resmi BPJS Kesehatan:
              </label>
              <span className="text-[11px] text-slate-500">
                Format Standar Korespondensi Faskes
              </span>
            </div>
            <div className="border border-slate-200 rounded-[4px] p-3.5 bg-slate-50/40">
              <textarea
                rows={11}
                value={letterDraft}
                onChange={(e) => setLetterDraft(e.target.value)}
                className="w-full text-xs leading-relaxed text-slate-800 bg-transparent border-none p-0 focus:outline-none focus:ring-0 resize-none select-text font-normal"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-[4px] text-xs text-blue-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              Putusan ini akan direkam secara permanen ke dalam <strong>Jejak Audit Append-Only</strong> dan status berkas diperbarui.
            </span>
          </div>

          {/* Modal Footer */}
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
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-[4px] text-xs font-semibold shadow-2xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Konfirmasi &amp; Rekam Putusan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
