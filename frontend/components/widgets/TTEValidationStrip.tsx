"use client";

import React, { useState } from "react";
import { ShieldCheck, Lock, FileKey, ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TTEValidationStripProps {
  signerName?: string;
  signerRole?: string;
  hospitalName?: string;
  certificateAuthority?: string;
  sha256Hash?: string;
  privacyCompliance?: string;
  verificationTimestamp?: string;
  className?: string;
}

export function TTEValidationStrip({
  signerName = "dr. Hendra Sp.JP",
  signerRole = "DPJP Spesialis Jantung (SIP: 446.1/1029/DISKES/2023)",
  hospitalName = "RS Sejahtera Medika",
  certificateAuthority = "BSrE - BSSN Terverifikasi",
  sha256Hash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  privacyCompliance = "Kepatuhan UU PDP No. 27/2022 Terpenuhi (NIK & Rekam Medis Ter-tokenisasi)",
  verificationTimestamp = "11 Okt 2026, 14:32:05 WIB",
  className,
}: TTEValidationStripProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-md p-3 text-xs text-slate-700 transition-all shadow-2xs",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Left Side: Signer & Certificate Authority */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-900 truncate">
                {signerName}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600 truncate">{hospitalName}</span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded text-[11px] font-medium inline-flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-700" />
                {certificateAuthority}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {signerRole}
            </p>
          </div>
        </div>

        {/* Right Side: Privacy Status & Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
          <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium inline-flex items-center gap-1">
            <Lock className="w-3 h-3 text-slate-500" />
            UU PDP Valid
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 rounded text-[11px] font-medium transition-colors"
          >
            <span>Detail Integritas</span>
            {isExpanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Technical Integrity Audit Pane */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
          <div className="bg-slate-50/70 border border-slate-200/60 rounded p-2.5">
            <span className="text-slate-500 block font-medium mb-1">
              Validasi Kriptografi Hash SHA-256
            </span>
            <p className="font-mono text-slate-800 break-all text-[10.5px]">
              {sha256Hash.substring(0, 32)}...
            </p>
            <span className="text-[10px] text-emerald-700 font-medium mt-1 inline-block">
              Integritas Berkas Valid (Tanpa Modifikasi)
            </span>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/60 rounded p-2.5">
            <span className="text-slate-500 block font-medium mb-1">
              Sanitasi & Penyamaran Identitas
            </span>
            <p className="text-slate-800 font-medium">
              {privacyCompliance}
            </p>
            <span className="text-[10px] text-slate-500 mt-1 inline-block">
              Token ID: TKN-2026-9912 (Dekripsi Sesuai Izin)
            </span>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/60 rounded p-2.5">
            <span className="text-slate-500 block font-medium mb-1">
              Waktu Penandatanganan & Stempel
            </span>
            <p className="text-slate-800 font-medium">
              {verificationTimestamp}
            </p>
            <span className="text-[10px] text-slate-500 mt-1 inline-block">
              TSA: Balai Sertifikasi Elektronik (BSSN)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
