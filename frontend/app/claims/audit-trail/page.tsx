"use client";

import React from "react";
import { TopHeader } from "@/components/widgets/TopHeader";
import { AuditLogStream } from "@/components/widgets/AuditLogStream";
import { ShieldCheck, Download } from "lucide-react";

export default function AuditTrailPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Top Header */}
      <TopHeader
        title="Audit Trail & Repositori Keputusan"
        subtitle="Log Append-Only Verifikasi Klaim"
        badge={
          <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-[4px] border border-blue-200">
            Layar 3
          </span>
        }
        rightActions={
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-[4px] hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Ekspor Berita Acara</span>
          </button>
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 max-w-7xl w-full mx-auto space-y-4">
        {/* Compliance Notice Banner */}
        <div className="bg-white border border-slate-200 rounded-md p-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
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
          <div className="text-[11px] text-slate-500 tabular-nums font-medium bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
            Audit Trail Active
          </div>
        </div>

        {/* Audit Log Stream Component */}
        <AuditLogStream title="Riwayat Keputusan Verifikator" />
      </div>
    </div>
  );
}
