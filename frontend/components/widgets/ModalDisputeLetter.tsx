"use client";

import React, { useState } from "react";
import { X, Send, FileText, CheckCircle2, AlertCircle, Edit3 } from "lucide-react";
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

  const defaultLetterBody = `Kepada Yth.
Direktur ${claim.hospitalName}
di Tempat

Perihal: Permintaan Klarifikasi dan Bukti Pendukung Tagihan Klaim JKN
Nomor Surat: 440/BPJS-KCU/KLARIF/X/2026
ID Klaim: ${claim.id} (Pasien: Tn. R / 58 Th)

Dengan hormat,
Sehubungan dengan proses verifikasi pasca-klaim pembiayaan JKN periode Oktober 2026, bersama surat ini kami sampaikan hasil penelaahan bukti klinis atas berkas tagihan ${claim.id}:

1. Selisih Alat Kesehatan Implan (Stent DES):
Berdasarkan rincian tagihan kuitansi, tercatat penagihan 2 (dua) unit Stent DES senilai Rp 20.000.000. Namun, berdasarkan lembar Laporan Operasi Kateterisasi tanggal 09/10/2026, secara eksplisit dicatat pemasangan stent hanya berhasil pada 1 (satu) unit di arteri LAD, sedangkan stent kedua batal dipasang dan dikembalikan ke depo. Sesuai Permenkes No. 3 Tahun 2023 Pasal 24, penagihan alkes wajib mencerminkan pemakaian riil tindakan.

2. Komplikasi Diagnosa Sepsis Berat (ICD-10 A41.9):
Diagnosa sekunder sepsis dicantumkan untuk menaikkan keparahan ke Tingkat III (I-4-10-III). Namun, pemeriksaan laboratorium biomarker menunjukkan Leukosit 7.800/uL (normal) dan Prokalsitonin 0.1 ng/mL, serta tidak ada pemberian vasopresor inotropik. Berdasarkan PNPK Tata Laksana Sepsis Kemenkes RI, kriteria klinis sepsis tidak terpenuhi.

Sehubungan dengan hal tersebut, kami memohon:
a. Memberikan klarifikasi tertulis serta bukti berita acara retur alkes terkait.
b. Menyesuaikan kode INA-CBG menjadi I-4-10-I dengan tarif wajar Rp 24.500.000 (Selisih efisiensi: Rp 20.500.000).

Demikian disampaikan, atas kerja sama yang baik kami ucapkan terima kasih.

Verifikator Medis KCU,
dr. Maya Indriati`;

  const [letterDraft, setLetterDraft] = useState(defaultLetterBody);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmDecision(verifierNotes, letterDraft);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Konfirmasi Keputusan &amp; Penerbitan Surat Klarifikasi Resmi
              </h3>
              <p className="text-[11px] text-slate-500">
                Tindakan: <span className="font-semibold text-amber-700">{actionType}</span> • Kasus #{claim.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Verifier Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Catatan Verifikator Medis (Append-Only Log):</span>
            </label>
            <textarea
              rows={2}
              value={verifierNotes}
              onChange={(e) => setVerifierNotes(e.target.value)}
              placeholder="Tuliskan catatan pertimbangan verifikator..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>

          {/* Official Letter Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Draf Surat Klarifikasi Resmi ke RS (Dapat diedit):
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                Format Baku BPJS Kesehatan
              </span>
            </div>
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/30">
              <textarea
                rows={12}
                value={letterDraft}
                onChange={(e) => setLetterDraft(e.target.value)}
                className="w-full text-xs font-serif leading-relaxed text-slate-800 bg-transparent border-none p-0 focus:outline-none focus:ring-0 resize-none select-text"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              Keputusan ini akan direkam secara permanen ke <strong>Append-Only Audit Trail</strong> dan status klaim diubah menjadi <strong>PENDING_KLARIFIKASI_RS</strong>.
            </span>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Konfirmasi &amp; Terbitkan Surat</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
