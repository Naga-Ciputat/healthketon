"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { TopHeader } from "@/components/widgets/TopHeader";
import { EvidenceCard } from "@/components/widgets/EvidenceCard";
import { TariffDeltaCalculator } from "@/components/widgets/TariffDeltaCalculator";
import { SmartDocumentViewer } from "@/components/widgets/SmartDocumentViewer";
import { DossierActionBar, ActionType } from "@/components/widgets/DossierActionBar";
import { ModalDisputeLetter } from "@/components/widgets/ModalDisputeLetter";
import { DiffViewerModal } from "@/components/widgets/DiffViewerModal";
import { ClaimSwitcher } from "@/components/widgets/ClaimSwitcher";
import { ReadmissionHistoryDrawer } from "@/components/widgets/ReadmissionHistoryDrawer";
import { ReadmissionFindingCard } from "@/components/widgets/ReadmissionFindingCard";
import { AuditLogItem } from "@/components/widgets/AuditLogStream";
import { ClaimItem, CitationLocation, FindingItem, INITIAL_CLAIMS } from "@/lib/mockData";
import { getStoredClaims, updateClaimStatus, addAuditLogEntry, saveClaims } from "@/lib/claimStore";
import { fetchClaimDetailFromBackend } from "@/lib/api";
import { useCopilot } from "@/lib/copilotContext";
import { cn, formatWIBDate } from "@/lib/utils";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Building2,
  User,
  Stethoscope,
  ShieldAlert,
  Clock,
  Mail,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Archive,
  History,
} from "lucide-react";

export default function DossierPage() {
  const params = useParams();
  const router = useRouter();
  const claimId = (params?.id as string) || "CLM-2026-089";

  const [claims, setClaims] = useState<ClaimItem[]>(INITIAL_CLAIMS);

  // Synchronize with client store & fetch live from PostgreSQL
  useEffect(() => {
    // 1. Initial fast local load
    setClaims(getStoredClaims());

    // 2. Fetch specific live dossier from backend
    fetchClaimDetailFromBackend(claimId).then((liveDetail) => {
      if (liveDetail) {
        setClaims((prev) => {
          const idx = prev.findIndex((c) => c.id.toLowerCase() === liveDetail.id.toLowerCase());
          let next;
          if (idx >= 0) {
            next = [...prev];
            next[idx] = liveDetail;
          } else {
            next = [liveDetail, ...prev];
          }
          saveClaims(next);
          return next;
        });
      }
    });

    const handleUpdate = () => {
      setClaims(getStoredClaims());
    };
    window.addEventListener("clarix_claims_updated", handleUpdate);
    return () => {
      window.removeEventListener("clarix_claims_updated", handleUpdate);
    };
  }, [claimId]);

  // Active Claim
  const activeClaim = useMemo(() => {
    return (
      claims.find((c) => c.id.toLowerCase() === claimId.toLowerCase()) ||
      claims[0] ||
      INITIAL_CLAIMS[0]
    );
  }, [claims, claimId]);

  // Document Viewer states
  const [activeCitation, setActiveCitation] = useState<CitationLocation | null>(null);

  // Modals
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [isDiffOpen, setIsDiffOpen] = useState(false);
  const [diffDetails, setDiffDetails] = useState<FindingItem["comparisonDetails"] | null>(null);
  const [selectedActionType, setSelectedActionType] = useState<ActionType>("PENDING_KLARIFIKASI_RS");
  const [isReadmissionDrawerOpen, setIsReadmissionDrawerOpen] = useState(false);

  // Archiving Transition Animation State
  const [archivingState, setArchivingState] = useState<{
    active: boolean;
    step: "pop" | "fly" | null;
    claimId: string;
    action: ActionType;
  } | null>(null);

  // Connect with Clarix AI Copilot
  const { setActiveClaim: setCopilotClaim, registerAction } = useCopilot();

  useEffect(() => {
    if (activeClaim) {
      setCopilotClaim(activeClaim);
    }
  }, [activeClaim, setCopilotClaim]);

  useEffect(() => {
    registerAction("jumpToCitation", (docId: string, pageNum: number, text: string) => {
      setActiveCitation({
        documentId: docId as CitationLocation["documentId"],
        documentTitle: docId,
        pageNumber: pageNum,
        paragraphIndex: 1,
        exactSubstring: text,
      });
    });

    registerAction("openDisputeModal", () => {
      setSelectedActionType("PENDING_KLARIFIKASI_RS");
      setIsDisputeOpen(true);
    });
  }, [registerAction]);

  // Handle jump from Citation click to Document Viewer
  const handleJumpToCitation = (citation: CitationLocation) => {
    setActiveCitation(citation);
  };

  const handleOpenDiffViewer = (details?: FindingItem["comparisonDetails"]) => {
    if (details) {
      setDiffDetails(details);
    }
    setIsDiffOpen(true);
  };

  const handleActionClick = (action: ActionType) => {
    setSelectedActionType(action);
    setIsDisputeOpen(true);
  };

  // Status Badge Helper
  const getStatusBadge = (status: ClaimItem["status"]) => {
    switch (status) {
      case "PERLU_TINJAUAN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600 flex-shrink-0" />
            <span>Perlu Telaah</span>
          </span>
        );
      case "PENDING_KLARIFIKASI_RS":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
            <Mail className="w-3 h-3 text-slate-600 flex-shrink-0" />
            <span>Klarifikasi RS</span>
          </span>
        );
      case "DOWNCODE_DIUSULKAN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
            <Sliders className="w-3 h-3 text-blue-600 flex-shrink-0" />
            <span>Penyesuaian Tarif</span>
          </span>
        );
      case "DISETUJUI":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
            <span>Disetujui (Valid)</span>
          </span>
        );
      case "ESKALASI_PK_JKN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600 flex-shrink-0" />
            <span>Eskalasi Khusus</span>
          </span>
        );
    }
  };

  const handleConfirmDecision = (notes: string, letterDraft: string) => {
    // 1. Update status
    updateClaimStatus(activeClaim.id, selectedActionType);

    // 2. Add audit log entry
    const newLog: AuditLogItem = {
      id: `AUD-2026-${Date.now().toString().slice(-4)}`,
      claimId: activeClaim.id,
      hospitalName: activeClaim.hospitalName,
      verifierName: "dr. Siti Aminah",
      verifierRole: "Verifikator Utama BPJS",
      timestamp: formatWIBDate(),
      action: selectedActionType,
      finalTariff: selectedActionType === "DISETUJUI" ? activeClaim.claimedTariff : activeClaim.fairTariff,
      savedDeltaRupiah: selectedActionType === "DISETUJUI" ? 0 : activeClaim.deltaTariff,
      officialLetterNumber:
        selectedActionType === "DISETUJUI"
          ? `BA-BPJS/2026/ACC/${activeClaim.id}`
          : selectedActionType === "DOWNCODE_DIUSULKAN"
          ? `BA-BPJS/2026/DOWNCODE/${activeClaim.id}`
          : selectedActionType === "ESKALASI_PK_JKN"
          ? `ND-BPJS/2026/ESK-PK/${activeClaim.id}`
          : `440/BPJS-KCU/KLARIF/X/2026`,
      notes: notes || activeClaim?.recommendedAction?.suggestedNotes || "",
      letterContent: letterDraft,
    };
    addAuditLogEntry(newLog);

    // Close modal and start animated transition to Audit Trail
    setIsDisputeOpen(false);
    setArchivingState({
      active: true,
      step: "pop",
      claimId: activeClaim.id,
      action: selectedActionType,
    });

    // Step 2: Animate card shrinking & flying toward Audit Trail tab in sidebar
    setTimeout(() => {
      setArchivingState((prev) => (prev ? { ...prev, step: "fly" } : null));
    }, 400);

    // Step 3: Route smoothly to Audit Trail page
    setTimeout(() => {
      router.push(`/claims/audit-trail?newClaimId=${activeClaim.id}&action=${selectedActionType}`);
    }, 950);
  };

  const currentIndex = claims.findIndex((c) => c.id.toLowerCase() === activeClaim.id.toLowerCase());
  const prevClaim = currentIndex > 0 ? claims[currentIndex - 1] : null;
  const nextClaim = currentIndex >= 0 && currentIndex < claims.length - 1 ? claims[currentIndex + 1] : null;

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-slate-50/50 transition-all duration-500",
        archivingState?.active && "scale-[0.99] opacity-80 blur-[0.5px]"
      )}
    >
      {/* Top Header */}
      <TopHeader
        title={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => router.push("/claims/triage")}
              className="p-1.5 rounded-[4px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
              title="Kembali ke Antrean Triage"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px] font-medium">Status:</span>
              {getStatusBadge(activeClaim.status)}
            </div>
          </div>
        }
        showBranchTag={false}
        rightActions={
          <div className="flex items-center gap-2">
            <ClaimSwitcher
              claims={claims}
              activeClaim={activeClaim}
              onSelectClaim={(id) => router.push(`/claims/${id}/dossier`)}
            />

            <div className="flex items-center gap-0.5">
              <button
                type="button"
                disabled={!prevClaim}
                onClick={() => prevClaim && router.push(`/claims/${prevClaim.id}/dossier`)}
                className="p-1 rounded-[4px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-white transition-colors"
                title={prevClaim ? `Klaim Sebelumnya: ${prevClaim.id}` : "Tidak ada klaim sebelumnya"}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={!nextClaim}
                onClick={() => nextClaim && router.push(`/claims/${nextClaim.id}/dossier`)}
                className="p-1 rounded-[4px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-white transition-colors"
                title={nextClaim ? `Klaim Berikutnya: ${nextClaim.id}` : "Tidak ada klaim berikutnya"}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        }
      />

      {/* Institutional Metadata Strip */}
      <div className="bg-white border-b border-slate-200 px-5 py-2 flex items-center justify-between text-xs text-slate-600 flex-shrink-0">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex items-center gap-1.5 font-medium text-slate-900">
            <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{activeClaim.hospitalName}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>
              Pasien: {activeClaim.patientAge} th ({activeClaim.patientGender === "L" ? "Laki-laki" : "Perempuan"}) · DPJP: {activeClaim.dpjpName}
            </span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>
              INA-CBG: <strong className="font-semibold text-slate-800 tabular-nums">{activeClaim.inacbgCode}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
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
          <div className="px-4 py-2 border-b border-slate-200 bg-slate-50/70 flex items-center gap-2 flex-shrink-0">
            <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span className="text-xs font-semibold text-slate-900">
              Temuan Diskrepansi Bukti Klinis
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Tariff Delta Calculator */}
            <TariffDeltaCalculator claim={activeClaim} />

            {/* Evidence Cards List */}
            <div className="space-y-3">
              {/* 30-Day Readmission Finding Card */}
              {activeClaim?.readmissionIntervalDays && (
                <ReadmissionFindingCard
                  claim={activeClaim}
                  onOpenDetail={() => setIsReadmissionDrawerOpen(true)}
                />
              )}

              {(activeClaim?.findings || []).map((finding) => (
                <EvidenceCard
                  key={finding.id}
                  finding={finding}
                  onSelectCitation={handleJumpToCitation}
                  onOpenDiffViewer={() => handleOpenDiffViewer(finding.comparisonDetails)}
                />
              ))}
            </div>

            {/* Alternative Explanations */}
            {activeClaim.alternativeHypotheses && (
              <div className="p-3.5 rounded-[4px] border border-slate-200 bg-slate-50/70 text-xs space-y-1.5">
                <span className="font-semibold text-slate-800">
                  Kemungkinan Penjelasan Alternatif (Non-Fraud):
                </span>
                <p className="text-slate-600 leading-relaxed text-[11.5px]">
                  {activeClaim.alternativeHypotheses}
                </p>
              </div>
            )}
          </div>

          {/* Fixed Action Bar at Bottom of Left Pane */}
          <DossierActionBar
            recommendedActionText={activeClaim?.recommendedAction?.label || "Rekomendasi Tindakan: Peninjauan Berkas"}
            confidenceScore={activeClaim?.recommendedAction?.confidence ?? 90}
            recommendedActionType={activeClaim?.recommendedAction?.type as ActionType}
            onTriggerAction={handleActionClick}
          />
        </div>

        {/* Right Pane (50%): Smart Document Viewer */}
        <div className="w-1/2 flex flex-col bg-white overflow-hidden">
          <SmartDocumentViewer
            documents={activeClaim?.documents || []}
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
        onConfirmDecision={handleConfirmDecision}
      />

      {/* Diff Viewer Modal for Note Cloning */}
      <DiffViewerModal
        isOpen={isDiffOpen}
        onClose={() => setIsDiffOpen(false)}
        donorClaimId={diffDetails?.donorClaimId || "CLM-2026-077"}
        similarityScore={diffDetails?.similarityScore || 94}
        donorText={diffDetails?.donorText}
        currentText={diffDetails?.currentText}
      />

      {/* 30-Day Readmission History Drawer */}
      <ReadmissionHistoryDrawer
        isOpen={isReadmissionDrawerOpen}
        onClose={() => setIsReadmissionDrawerOpen(false)}
        claim={activeClaim}
      />

      {/* Archiving Transition Miniature Card Overlay */}
      {archivingState?.active && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-slate-900/20 backdrop-blur-[1px] transition-opacity duration-300">
          <div
            style={{
              transform:
                archivingState.step === "fly"
                  ? "translate(-38vw, -14vh) scale(0.25)"
                  : "translate(0, 0) scale(1)",
              opacity: archivingState.step === "fly" ? 0 : 1,
              transition:
                archivingState.step === "fly"
                  ? "all 500ms cubic-bezier(0.4, 0, 0.2, 1)"
                  : "all 300ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className="w-full max-w-xs bg-white rounded-[4px] border border-slate-200 shadow-xl p-3.5 space-y-2 pointer-events-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <span className="text-xs font-semibold text-slate-800 tabular-nums">
                {archivingState.claimId}
              </span>
              {getStatusBadge(archivingState.action)}
            </div>

            <div className="space-y-1 text-xs">
              <p className="text-[11.5px] text-slate-600 truncate">
                {activeClaim.hospitalName}
              </p>
              <div className="pt-1 text-[11px] text-slate-500 flex justify-between items-center border-t border-slate-100">
                <span>Efisiensi:</span>
                <span className="font-semibold text-emerald-700 tabular-nums">
                  Rp {(archivingState.action === "DISETUJUI" ? 0 : activeClaim.deltaTariff).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
