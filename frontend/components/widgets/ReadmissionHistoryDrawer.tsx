"use client";

import React from "react";
import {
  History,
  X,
  AlertTriangle,
  Calendar,
  Building2,
  User,
  Stethoscope,
  ArrowRight,
  ShieldAlert,
  FileText,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ClaimItem, PatientEncounter } from "@/lib/mockData";

interface ReadmissionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  claim: ClaimItem;
}

export function ReadmissionHistoryDrawer({
  isOpen,
  onClose,
  claim,
}: ReadmissionHistoryDrawerProps) {
  if (!isOpen) return null;

  const encounters = claim.priorEncounters || [];
  const intervalDays = claim.readmissionIntervalDays || 15;

  const prior = encounters.find((e) => e.encounterType === "PRIOR_ADMISSION");
  const current = encounters.find((e) => e.encounterType === "CURRENT_ADMISSION");

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-[4px] bg-amber-100 text-amber-800">
              <History className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  Riwayat Readmisi &le; 30 Hari
                </h3>
                <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-[3px] bg-amber-50 text-amber-800 border border-amber-200">
                  Interval {intervalDays} Hari
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Pemeriksaan kesinambungan episode perawatan pasien (Permenkes No. 3 Tahun 2023)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-[4px] text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Regulatory Alert Strip */}
        <div className="px-5 py-3 bg-amber-50/70 border-b border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-[11.5px] leading-relaxed">
            <span className="font-semibold text-amber-950">
              Klausul Regulasi Permenkes No. 3/2023 Lampiran II:
            </span>
            <p className="text-amber-800">
              Pasien kembali dirawat inap dalam kurun waktu <strong>&le; 30 hari</strong> dengan diagnosis kardiovaskular terkait pada faskes dan DPJP yang sama. Verifikator wajib memastikan tidak terjadi kesengajaan fragmentasi atau pemecahan episode klaim (<em>unbundled hospital admission</em>).
            </p>
          </div>
        </div>

        {/* Comparison Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/40">
          {/* Summary Metric Strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-[4px] border border-slate-200 bg-white shadow-2xs">
              <span className="text-[10.5px] text-slate-500 font-medium">Jarak Readmisi</span>
              <div className="text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                {intervalDays} Hari
              </div>
              <span className="text-[10px] text-amber-700 font-medium">&le; 30 hari (Audit Aktif)</span>
            </div>

            <div className="p-3 rounded-[4px] border border-slate-200 bg-white shadow-2xs">
              <span className="text-[10.5px] text-slate-500 font-medium">Kesamaan DPJP</span>
              <div className="text-xs font-semibold text-slate-900 truncate mt-1">
                {claim.dpjpName}
              </div>
              <span className="text-[10px] text-slate-500">Spesialis Kardiologi</span>
            </div>

            <div className="p-3 rounded-[4px] border border-slate-200 bg-white shadow-2xs">
              <span className="text-[10.5px] text-slate-500 font-medium">Akumulasi Klaim</span>
              <div className="text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                Rp {((prior?.claimedTariff || 0) + (current?.claimedTariff || 0)).toLocaleString("id-ID")}
              </div>
              <span className="text-[10px] text-slate-500">2 Rawat Inap Beruntun</span>
            </div>
          </div>

          {/* Sequential Encounter Cards */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Perbandingan Dua Episode Rawat Inap:</span>
            </div>

            {/* Encounter 1: Prior Admission */}
            <div className="p-4 rounded-[4px] border border-slate-200 bg-white shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-[3px] text-[10.5px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    Rawat Inap 1 (Historis)
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {prior?.id || "ENC-2026-SEP-4829"}
                  </span>
                </div>
                <span className="text-xs text-slate-600 font-medium">
                  {prior?.admissionDate} &mdash; {prior?.dischargeDate}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10.5px] text-slate-400">Diagnosis Utama:</span>
                  <div className="font-medium text-slate-800">
                    {prior?.primaryDiagnosis.code} &mdash; {prior?.primaryDiagnosis.name}
                  </div>
                </div>
                <div>
                  <span className="text-[10.5px] text-slate-400">Kode INA-CBG:</span>
                  <div className="font-semibold text-slate-800 tabular-nums">
                    {prior?.inacbgCode} (Rp {(prior?.claimedTariff || 18500000).toLocaleString("id-ID")})
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-[4px] border border-slate-100">
                <span className="font-medium text-slate-700">Catatan Klinis:</span>{" "}
                {prior?.notes}
              </div>
            </div>

            {/* Downward indicator */}
            <div className="flex justify-center -my-1 text-slate-400">
              <div className="px-3 py-1 bg-white border border-slate-200 rounded-[4px] text-[10.5px] font-medium text-amber-800 flex items-center gap-1.5 shadow-2xs">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>Jeda Selisih 15 Hari Pasca Pulang</span>
              </div>
            </div>

            {/* Encounter 2: Current Admission */}
            <div className="p-4 rounded-[4px] border border-blue-200 bg-blue-50/30 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-[3px] text-[10.5px] font-semibold bg-blue-100 text-blue-800 border border-blue-300">
                    Rawat Inap 2 (Klaim Berjalan)
                  </span>
                  <span className="text-xs font-mono text-blue-700 font-medium">
                    {claim.id}
                  </span>
                </div>
                <span className="text-xs text-slate-700 font-semibold">
                  {current?.admissionDate || claim.admissionDate} &mdash; {current?.dischargeDate || claim.dischargeDate}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10.5px] text-slate-500">Diagnosis Utama:</span>
                  <div className="font-semibold text-slate-900">
                    {claim.primaryDiagnosis.code} &mdash; {claim.primaryDiagnosis.name}
                  </div>
                </div>
                <div>
                  <span className="text-[10.5px] text-slate-500">Kode INA-CBG:</span>
                  <div className="font-semibold text-slate-900 tabular-nums">
                    {claim.inacbgCode} (Rp {claim.claimedTariff.toLocaleString("id-ID")})
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-700 bg-white p-2.5 rounded-[4px] border border-blue-200">
                <span className="font-semibold text-slate-800">Evaluasi Episode:</span>{" "}
                {current?.notes || "Readmisi 15 hari pasca rawat inap UAP. Menjadi indikasi evaluasi klausul readmisi < 30 hari kesinambungan perawatan Permenkes 3/2023."}
              </div>
            </div>
          </div>

          {/* Verification Verdict Box */}
          <div className="p-3.5 rounded-[4px] border border-slate-200 bg-white text-xs space-y-1.5">
            <span className="font-semibold text-slate-800">
              Rekomendasi Verifikator BPJS Kesehatan:
            </span>
            <p className="text-slate-600 leading-relaxed text-[11.5px]">
              Klaim saat ini dapat ditindaklanjuti untuk klarifikasi dokumen rawat jalan dan resume rawat inap pertama. Bila terbukti prosedur PCI yang dilakukan adalah rencana elektif dari rawat inap sebelumnya yang sengaja ditunda demi pembentukan 2 klaim terpisah, maka dilakukan konsolidasi klaim.
            </p>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <FileText className="w-3.5 h-3.5" />
            <span>Regulasi: PMK No. 3/2023 Pasal 28</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-[4px] shadow-2xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
