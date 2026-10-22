"use client";

import React, { useState, useMemo } from "react";
import { TopHeader } from "@/components/widgets/TopHeader";
import { MetricHeader } from "@/components/widgets/MetricHeader";
import { TTEValidationStrip } from "@/components/widgets/TTEValidationStrip";
import { ClaimFilterBar } from "@/components/widgets/ClaimFilterBar";
import { ClaimTable } from "@/components/widgets/ClaimTable";
import { EvidenceCard } from "@/components/widgets/EvidenceCard";
import { TariffDeltaCalculator } from "@/components/widgets/TariffDeltaCalculator";
import { AuditLogStream } from "@/components/widgets/AuditLogStream";
import { ModalUploadClaim } from "@/components/widgets/ModalUploadClaim";
import { ModalDisputeLetter } from "@/components/widgets/ModalDisputeLetter";
import { DiffViewerModal } from "@/components/widgets/DiffViewerModal";
import { INITIAL_CLAIMS, ClaimItem } from "@/lib/mockData";
import {
  Layers,
  FileCheck2,
  Calculator,
  Shield,
  FileText,
  Mail,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ExampleDashboardPage() {
  const [claims, setClaims] = useState<ClaimItem[]>(INITIAL_CLAIMS);
  const [selectedClaimId, setSelectedClaimId] = useState<string>("CLM-2026-089");
  const [activeTab, setActiveTab] = useState<"queue" | "evidence" | "audit">("queue");

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("ALL");
  const [selectedRisk, setSelectedRisk] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Modal States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [isDiffOpen, setIsDiffOpen] = useState(false);

  // Active Selected Claim
  const activeClaim = useMemo(() => {
    return claims.find((c) => c.id === selectedClaimId) || claims[0];
  }, [claims, selectedClaimId]);

  // Unique Hospitals for filter
  const hospitals = useMemo(() => {
    return Array.from(new Set(claims.map((c) => c.hospitalName)));
  }, [claims]);

  // Filtered Claims
  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const matchesSearch =
        claim.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.primaryDiagnosis.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.primaryDiagnosis.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesHospital =
        selectedHospital === "ALL" || claim.hospitalName === selectedHospital;

      const matchesRisk =
        selectedRisk === "ALL" || claim.riskLevel === selectedRisk;

      const matchesStatus =
        selectedStatus === "ALL" || claim.status === selectedStatus;

      return matchesSearch && matchesHospital && matchesRisk && matchesStatus;
    });
  }, [claims, searchQuery, selectedHospital, selectedRisk, selectedStatus]);

  // Handle dispute decision
  const handleConfirmDecision = (notes: string, letterDraft: string) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === activeClaim.id
          ? { ...c, status: "PENDING_KLARIFIKASI_RS" as const }
          : c
      )
    );
    setIsDisputeOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] text-slate-800 overflow-y-auto">
      {/* Top Attio-style Header */}
      <TopHeader
        title="Example Dashboard / JKN Claims Intelligence Queue"
        showShare={false}
        showHelp={true}
        showAskAttio={false}
      />

      {/* Main Content Body */}
      <div className="p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-4">
        {/* Executive Metrics Header */}
        <MetricHeader
          totalPendingCount={claims.length}
          highRiskCount={claims.filter((c) => c.riskLevel === "TINGGI").length}
          totalInefficiencyRupiah={142500000}
          fastTrackedCount={12}
          fastTrackedPercent={50}
        />

        {/* Institutional Electronic Signature & Privacy Compliance Strip */}
        <TTEValidationStrip
          signerName={activeClaim.dpjpName}
          hospitalName={activeClaim.hospitalName}
          certificateAuthority="BSrE - BSSN Terverifikasi"
          sha256Hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
          privacyCompliance="Kepatuhan UU PDP No. 27/2022 Terpenuhi (NIK & Rekam Medis Ter-tokenisasi)"
          verificationTimestamp="11 Okt 2026, 14:32:05 WIB"
        />

        {/* Navigation Tabs Bar */}
        <div className="bg-white border border-slate-200 rounded-md p-1.5 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("queue")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-2",
                activeTab === "queue"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Antrean Klaim Prioritas ({filteredClaims.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("evidence")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-2",
                activeTab === "evidence"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Dossier Bukti Klinis &amp; Rekonsiliasi</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("audit")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-2",
                activeTab === "audit"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Jejak Audit &amp; Putusan Append-Only</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Paket Klaim</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Antrean Klaim (Queue & Table) */}
        {activeTab === "queue" && (
          <div className="space-y-3">
            {/* Filter Bar */}
            <ClaimFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedHospital={selectedHospital}
              onHospitalChange={setSelectedHospital}
              hospitals={hospitals}
              selectedRisk={selectedRisk}
              onRiskChange={setSelectedRisk}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              onOpenUpload={() => setIsUploadOpen(true)}
            />

            {/* Claim Table */}
            <ClaimTable
              claims={filteredClaims}
              onSelectClaim={(id) => {
                setSelectedClaimId(id);
                setActiveTab("evidence");
              }}
            />
          </div>
        )}

        {/* TAB 2: Dossier Bukti Klinis & Rekonsiliasi (Evidence & Calculator) */}
        {activeTab === "evidence" && (
          <div className="space-y-4">
            {/* Active Claim Synopsis Header */}
            <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {activeClaim.id}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-xs font-semibold text-slate-800">
                    {activeClaim.hospitalName}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-xs text-slate-600">
                    DPJP: {activeClaim.dpjpName}
                  </span>
                  <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-medium">
                    Risiko {activeClaim.riskLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Diagnosis Primer:{" "}
                  <strong>{activeClaim.primaryDiagnosis.code}</strong> —{" "}
                  {activeClaim.primaryDiagnosis.name}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDisputeOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Draf Surat Klarifikasi RS</span>
                </button>
              </div>
            </div>

            {/* Dual Column Layout: Evidence Cards on Left, Tariff Calculator on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column: Finding Cards (7 cols) */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <h4 className="text-xs font-semibold text-slate-900">
                    Temuan Bukti Klinis &amp; Verifikasi Dokumen ({activeClaim.findings.length})
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Verbatim Grounding 100%
                  </span>
                </div>

                {activeClaim.findings.map((finding) => (
                  <EvidenceCard
                    key={finding.id}
                    finding={finding}
                    onOpenDiffViewer={() => setIsDiffOpen(true)}
                  />
                ))}
              </div>

              {/* Right Column: Tariff Delta Calculator & Regulatory Notes (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <TariffDeltaCalculator
                  claimedCode={activeClaim.inacbgCode}
                  claimedDescription={activeClaim.inacbgDescription}
                  claimedTariff={activeClaim.claimedTariff}
                  recommendedCode={activeClaim.fairTariff < activeClaim.claimedTariff ? "I-4-10-I" : activeClaim.inacbgCode}
                  recommendedDescription="Infark Miokard Akut Tanpa Komplikasi Berat (Severity Level I)"
                  recommendedTariff={activeClaim.fairTariff}
                />

                {/* Alternative Non-Fraud Hypothesis Box */}
                <div className="bg-white border border-slate-200 rounded-md p-4 text-xs shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-semibold">
                    <Shield className="w-4 h-4 text-slate-600" />
                    <span>Pertimbangan Hipotesis Alternatif Non-Fraud</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11.5px]">
                    {activeClaim.alternativeHypotheses ||
                      "Kondisi komplikasi mungkin diakibatkan oleh keterlambatan rujukan atau infeksi nosokomial. Namun penagihan tetap harus didasari bukti objektif laboratorium penunjang."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Jejak Audit (Append-Only Log Stream) */}
        {activeTab === "audit" && (
          <div className="space-y-3">
            <AuditLogStream title="Log Permanen Kepatuhan & Jejak Putusan Verifikator" />
          </div>
        )}
      </div>

      {/* Upload Claim Modal */}
      <ModalUploadClaim
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccessUpload={() => setIsUploadOpen(false)}
      />

      {/* Official Dispute Clarification Letter Modal */}
      <ModalDisputeLetter
        isOpen={isDisputeOpen}
        onClose={() => setIsDisputeOpen(false)}
        claim={activeClaim}
        actionType="PENDING_KLARIFIKASI_RS"
        onConfirmDecision={handleConfirmDecision}
      />

      {/* Medical Record Note-Cloning Diff Modal */}
      <DiffViewerModal
        isOpen={isDiffOpen}
        onClose={() => setIsDiffOpen(false)}
        donorClaimId="CLM-2026-077"
        similarityScore={94}
        donorText="Pasien mengeluh nyeri dada substernal menjalar ke lengan kiri sejak 3 jam SMRS disertai keringat dingin, mual, dan rasa tertekan beban berat pada dada sebelah kiri saat beristirahat."
        currentText="Pasien mengeluh nyeri dada substernal menjalar ke lengan kiri sejak 3 jam SMRS disertai keringat dingin, mual, dan rasa tertekan beban berat pada dada sebelah kiri saat beristirahat."
      />
    </div>
  );
}
