"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { TopHeader } from "@/components/widgets/TopHeader";
import { EvidenceCard } from "@/components/widgets/EvidenceCard";
import { TariffDeltaCalculator } from "@/components/widgets/TariffDeltaCalculator";
import { SmartDocumentViewer } from "@/components/widgets/SmartDocumentViewer";
import { DossierActionBar, ActionType } from "@/components/widgets/DossierActionBar";
import { ModalDisputeLetter } from "@/components/widgets/ModalDisputeLetter";
import { DiffViewerModal } from "@/components/widgets/DiffViewerModal";
import { INITIAL_CLAIMS, ClaimItem, CitationLocation } from "@/lib/mockData";
import {
  ArrowLeft,
  Building2,
  User,
  Stethoscope,
  ShieldAlert,
} from "lucide-react";

export default function DossierPage() {
  const params = useParams();
  const router = useRouter();
  const claimId = (params?.id as string) || "CLM-2026-089";

  const [claims] = useState<ClaimItem[]>(INITIAL_CLAIMS);

  // Active Claim
  const activeClaim = useMemo(() => {
    return claims.find((c) => c.id === claimId) || claims[0];
  }, [claims, claimId]);

  // Document Viewer states
  const [activeCitation, setActiveCitation] = useState<CitationLocation | null>(null);

  // Modals
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [isDiffOpen, setIsDiffOpen] = useState(false);
  const [selectedActionType, setSelectedActionType] = useState<ActionType>("PENDING_KLARIFIKASI_RS");

  // Handle jump from Citation click to Document Viewer
  const handleJumpToCitation = (citation: CitationLocation) => {
    setActiveCitation(citation);
  };

  const handleActionClick = (action: ActionType) => {
    setSelectedActionType(action);
    setIsDisputeOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Top Header */}
      <TopHeader
        title={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/claims/triage")}
              className="p-1 rounded-[4px] hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              title="Kembali ke Antrean Triage"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span>Dossier Telaah Bukti</span>
          </div>
        }
        subtitle={activeClaim.id}
        badge={
          <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-[4px] border border-emerald-200">
            Layar 2 (Dual-Pane)
          </span>
        }
      />

      {/* Institutional Metadata Strip */}
      <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center justify-between text-xs text-slate-600 flex-shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-1.5 font-medium text-slate-900">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{activeClaim.hospitalName}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Pasien: {activeClaim.patientAge} th ({activeClaim.patientGender}) · DPJP: {activeClaim.dpjpName}
            </span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
            <span>
              INA-CBG: <strong className="font-semibold text-slate-800">{activeClaim.inacbgCode}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-[11px] text-slate-500">
            Diajukan: <span className="font-semibold text-slate-800 tabular-nums">Rp {activeClaim.claimedTariff.toLocaleString("id-ID")}</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="text-[11px] text-emerald-700 font-semibold tabular-nums">
            Potensi Koreksi: Rp {activeClaim.deltaTariff.toLocaleString("id-ID")}
          </div>
        </div>
      </div>

      {/* Dual-Pane Workspace */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Pane (50%): Evidence Dossier */}
        <div className="w-1/2 border-r border-slate-200 flex flex-col bg-white overflow-hidden">
          <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-semibold text-slate-900">
                Temuan Diskrepansi Bukti Klinis ({activeClaim.findings.length})
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Confidence Score: <strong className="text-slate-800 tabular-nums">{activeClaim.confidenceScore}%</strong>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Tariff Delta Calculator */}
            <TariffDeltaCalculator claim={activeClaim} />

            {/* Evidence Cards List */}
            <div className="space-y-3">
              {activeClaim.findings.map((finding) => (
                <EvidenceCard
                  key={finding.id}
                  finding={finding}
                  onSelectCitation={handleJumpToCitation}
                  onOpenDiffViewer={() => setIsDiffOpen(true)}
                />
              ))}
            </div>

            {/* Alternative Explanations */}
            {activeClaim.alternativeHypotheses && (
              <div className="p-3.5 rounded-md border border-slate-200 bg-slate-50/60 text-xs space-y-1.5">
                <span className="font-semibold text-slate-800">
                  Kemungkinan Penjelasan Alternatif (Non-Fraud):
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {activeClaim.alternativeHypotheses}
                </p>
              </div>
            )}
          </div>

          {/* Fixed Action Bar at Bottom of Left Pane */}
          <DossierActionBar
            recommendedActionText={activeClaim.recommendedAction.label}
            confidenceScore={activeClaim.recommendedAction.confidence}
            onTriggerAction={handleActionClick}
          />
        </div>

        {/* Right Pane (50%): Smart Document Viewer */}
        <div className="w-1/2 flex flex-col bg-white overflow-hidden">
          <SmartDocumentViewer
            documents={activeClaim.documents}
            activeCitation={activeCitation}
          />
        </div>
      </div>

      {/* Dispute Letter Modal */}
      <ModalDisputeLetter
        isOpen={isDisputeOpen}
        onClose={() => setIsDisputeOpen(false)}
        claim={activeClaim}
        actionType={selectedActionType}
        onConfirmDecision={(notes: string) => {
          setIsDisputeOpen(false);
          router.push("/claims/audit-trail");
        }}
      />

      {/* Diff Viewer Modal for Note Cloning */}
      <DiffViewerModal
        isOpen={isDiffOpen}
        onClose={() => setIsDiffOpen(false)}
        donorClaimId="CLM-2026-077"
        similarityScore={94}
      />
    </div>
  );
}
