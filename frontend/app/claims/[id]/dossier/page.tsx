"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { TopHeader } from "@/components/widgets/TopHeader";
import { EvidenceCard } from "@/components/widgets/EvidenceCard";
import { SmartDocumentViewer } from "@/components/widgets/SmartDocumentViewer";
import { DossierActionBar, ActionType } from "@/components/widgets/DossierActionBar";
import { DiffViewerModal } from "@/components/widgets/DiffViewerModal";
import { ModalDisputeLetter } from "@/components/widgets/ModalDisputeLetter";
import { INITIAL_CLAIMS, CitationLocation, ClaimItem, FindingItem } from "@/lib/mockData";
import {
  ArrowLeft,
  Shield,
  FileCheck2,
  Building2,
  Calendar,
  User,
  Scale,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export default function ClaimDossierPage() {
  const params = useParams();
  const router = useRouter();
  const claimId = (params?.id as string) || "CLM-2026-089";

  // Find claim or fallback to flagship claim #CLM-2026-089
  const claim =
    INITIAL_CLAIMS.find((c) => c.id === claimId) || INITIAL_CLAIMS[0];

  // Active highlighted citation in right pane
  const [activeCitation, setActiveCitation] = useState<CitationLocation | null>(
    claim.findings[0]?.citation || null
  );

  // Diff viewer modal state
  const [isDiffOpen, setIsDiffOpen] = useState(false);
  const [diffDetails, setDiffDetails] = useState<FindingItem["comparisonDetails"] | null>(null);

  // Dispute letter modal state
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [selectedActionType, setSelectedActionType] = useState<ActionType>(
    "PENDING_KLARIFIKASI_RS"
  );

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleOpenDiff = (details: FindingItem["comparisonDetails"]) => {
    setDiffDetails(details);
    setIsDiffOpen(true);
  };

  const handleTriggerAction = (actionType: ActionType) => {
    setSelectedActionType(actionType);
    setIsDisputeModalOpen(true);
  };

  const handleConfirmDecision = (notes: string, letterDraft: string) => {
    setIsDisputeModalOpen(false);
    // Update claim status & redirect back to triage
    alert(
      `Keputusan berhasil direkam!\nStatus: ${selectedActionType}\nSurat Klarifikasi Resmi Nomor 440/BPJS-KCU/KLARIF/X/2026 telah diterbitkan ke ${claim.hospitalName}.\nJejak audit permanen telah dicatat.`
    );
    router.push("/claims/triage");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* Top Header with Breadcrumbs & Back Navigation */}
      <TopHeader
        title={
          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/claims/triage"
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors font-normal"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Antrean Triage</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-bold text-slate-900 font-mono">
              Dossier #{claim.id}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              Risiko {claim.riskLevel}
            </span>
          </div>
        }
        showHelp={true}
        showAskAttio={false}
        rightActions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-200">
              Selisih: -{formatRupiah(claim.deltaTariff)}
            </span>
          </div>
        }
      />

      {/* Main Dual-Pane 50% / 50% Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* =========================================
            LEFT PANE: Clinical Evidence Dossier (50%)
            ========================================= */}
        <div className="w-full md:w-1/2 flex flex-col h-full border-r border-slate-200 bg-slate-50/20 overflow-hidden">
          {/* Scrollable Dossier Content Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Case Overview Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    {claim.hospitalName}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pasien: Tn. R ({claim.patientAge} th, {claim.patientGender === "L" ? "Laki-laki" : "Perempuan"}) • DPJP: {claim.dpjpName}
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {claim.admissionDate} - {claim.dischargeDate}
                </span>
              </div>

              {/* INA-CBG Code & Diagnoses */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Diagnosa Primer
                  </span>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    <span className="font-mono text-blue-600 mr-1">
                      {claim.primaryDiagnosis.code}
                    </span>
                    <span className="truncate">{claim.primaryDiagnosis.name}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Kelompok Tarif INA-CBG
                  </span>
                  <div className="font-semibold text-slate-800 mt-0.5 font-mono">
                    {claim.inacbgCode} ({claim.inacbgDescription})
                  </div>
                </div>
              </div>

              {/* Tariff Comparison Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Tagihan RS Awal</span>
                  <span className="font-bold font-mono text-slate-900">
                    {formatRupiah(claim.claimedTariff)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Rekomendasi Tarif Adil</span>
                  <span className="font-bold font-mono text-emerald-700">
                    {formatRupiah(claim.fairTariff)}
                  </span>
                </div>
                <div className="bg-rose-50 rounded border border-rose-200/80 p-1">
                  <span className="text-[10px] text-rose-600 font-semibold block">Potensi Efisiensi</span>
                  <span className="font-bold font-mono text-rose-700">
                    -{formatRupiah(claim.deltaTariff)}
                  </span>
                </div>
              </div>
            </div>

            {/* Findings Section Header */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                <span>Temuan Investigasi Klinis ({claim.findings.length} Indikasi)</span>
              </div>
              <span className="text-[10px] text-slate-500">
                Klik kutipan untuk menyorot RME asli
              </span>
            </div>

            {/* Evidence Cards List */}
            <div className="space-y-3">
              {claim.findings.map((f) => (
                <EvidenceCard
                  key={f.id}
                  finding={f}
                  isSelected={activeCitation?.exactSubstring === f.citation?.exactSubstring}
                  onSelectCitation={(cit) => setActiveCitation(cit)}
                  onOpenDiffViewer={handleOpenDiff}
                />
              ))}
            </div>

            {/* Alternative Non-Fraud Hypotheses Card */}
            {claim.alternativeHypotheses && (
              <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Hipotesis Alternatif (Kemungkinan Non-Fraud)
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {claim.alternativeHypotheses}
                </p>
              </div>
            )}
          </div>

          {/* Fixed Action Bar at Bottom of Left Pane (F9) */}
          <DossierActionBar
            recommendedActionText={`Rekomendasi: ${claim.recommendedAction.label}`}
            confidenceScore={claim.recommendedAction.confidence}
            onTriggerAction={handleTriggerAction}
          />
        </div>

        {/* =========================================
            RIGHT PANE: Smart Document Viewer (50%)
            ========================================= */}
        <div className="w-full md:w-1/2 h-full overflow-hidden flex flex-col">
          <SmartDocumentViewer
            documents={claim.documents}
            activeCitation={activeCitation}
          />
        </div>
      </div>

      {/* Note Cloning Diff Viewer Modal (F6) */}
      <DiffViewerModal
        isOpen={isDiffOpen}
        onClose={() => setIsDiffOpen(false)}
        donorClaimId={diffDetails?.donorClaimId}
        similarityScore={diffDetails?.similarityScore}
        donorText={diffDetails?.donorText}
        currentText={diffDetails?.currentText}
      />

      {/* Official Dispute Clarification Letter Modal (F9) */}
      <ModalDisputeLetter
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        claim={claim}
        actionType={selectedActionType}
        onConfirmDecision={handleConfirmDecision}
      />
    </div>
  );
}
