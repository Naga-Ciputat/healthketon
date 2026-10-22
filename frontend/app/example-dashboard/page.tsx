"use client";

import React, { useState, useMemo } from "react";
import { TopHeader } from "@/components/widgets/TopHeader";
import { MetricHeader } from "@/components/widgets/MetricHeader";
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
  FileText,
  Mail,
  UploadCloud,
  AlertCircle,
  Building2,
  User,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ExampleDashboardPage() {
  const [claims, setClaims] = useState<ClaimItem[]>(INITIAL_CLAIMS);
  const [selectedClaimId, setSelectedClaimId] = useState<string>("CLM-2026-089");
  const [activeTab, setActiveTab] = useState<"queue" | "evidence" | "audit">("queue");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("ALL");
  const [selectedRisk, setSelectedRisk] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [isDiffOpen, setIsDiffOpen] = useState(false);

  // Active Claim
  const activeClaim = useMemo(() => {
    return claims.find((c) => c.id === selectedClaimId) || claims[0];
  }, [claims, selectedClaimId]);

  // Unique Hospital List
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

  // Handle dispute decision confirmation
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
    <div className="flex flex-col h-full bg-[#F8FAFC] text-slate-800 overflow-y-auto">
      {/* Top Header */}
      <TopHeader
        title="Verifikasi Klaim JKN / Antrean Triage"
        showShare={false}
        showHelp={true}
        showAskAttio={false}
      />

      {/* Main Workspace Body */}
      <div className="p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-4">
        {/* Executive Metrics Header (BPJS Blue & Green Dominant) */}
        <MetricHeader
          totalPendingCount={claims.length}
          highRiskCount={claims.filter((c) => c.riskLevel === "TINGGI").length}
          totalInefficiencyRupiah={142500000}
          fastTrackedCount={12}
          fastTrackedPercent={50}
        />

        {/* Tab Navigation & Action Bar */}
        <div className="bg-white border border-slate-200 rounded-md p-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-1.5 flex-wrap">
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
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Antrean Berkas Klaim ({filteredClaims.length})</span>
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
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Detail Telaah &amp; Rekonsiliasi Tarif</span>
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
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Riwayat Putusan &amp; Surat Resmi</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors shadow-2xs"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Paket Berkas</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Antrean Berkas Klaim (Queue Table & Filter) */}
        {activeTab === "queue" && (
          <div className="space-y-3">
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

            <ClaimTable
              claims={filteredClaims}
              onSelectClaim={(id) => {
                setSelectedClaimId(id);
                setActiveTab("evidence");
              }}
            />
          </div>
        )}

        {/* TAB 2: Detail Telaah & Rekonsiliasi Tarif */}
        {activeTab === "evidence" && (
          <div className="space-y-4">
            {/* Active Claim Synopsis Header */}
            <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-slate-900">
                    {activeClaim.id}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs font-medium text-slate-700 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {activeClaim.hospitalName}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs text-slate-600 flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                    {activeClaim.dpjpName}
                  </span>

                  {/* High Risk Alert Badge */}
                  {activeClaim.riskLevel === "TINGGI" ? (
                    <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                      <AlertCircle className="w-3 h-3 text-rose-600" />
                      Risiko Tinggi
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium">
                      Risiko {activeClaim.riskLevel}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600">
                  Diagnosa Utama:{" "}
                  <strong className="text-slate-800">{activeClaim.primaryDiagnosis.code}</strong> —{" "}
                  {activeClaim.primaryDiagnosis.name} (INA-CBG: {activeClaim.inacbgCode})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDisputeOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors shadow-2xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Draf Surat Klarifikasi Faskes</span>
                </button>
              </div>
            </div>

            {/* Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column: Finding Cards (7 cols) */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <h4 className="text-xs font-semibold text-slate-900">
                    Daftar Bukti Klinis &amp; Ketidaksesuaian ({activeClaim.findings.length} Temuan)
                  </h4>
                  <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Kutipan Terverifikasi Dokumen Medis
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

              {/* Right Column: Tariff Reconciliation Calculator (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <TariffDeltaCalculator
                  claimedCode={activeClaim.inacbgCode}
                  claimedDescription={activeClaim.inacbgDescription}
                  claimedTariff={activeClaim.claimedTariff}
                  recommendedCode={activeClaim.fairTariff < activeClaim.claimedTariff ? "I-4-10-I" : activeClaim.inacbgCode}
                  recommendedDescription="Infark Miokard Akut Tanpa Komplikasi Berat (Severity Level I)"
                  recommendedTariff={activeClaim.fairTariff}
                />

                {/* Clinical Notes Context */}
                <div className="bg-white border border-slate-200 rounded-md p-4 text-xs shadow-2xs space-y-2">
                  <h5 className="font-semibold text-slate-900 text-xs">
                    Catatan Rekomendasi Verifikator:
                  </h5>
                  <p className="text-slate-600 leading-relaxed text-[11.5px]">
                    {activeClaim.recommendedAction.suggestedNotes ||
                      "Klarifikasi ke rumah sakit mengenai kriteria diagnosis komplikasi dan jumlah riil implan stent yang terpasang pada laporan operasi."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Riwayat Putusan & Jejak Audit */}
        {activeTab === "audit" && (
          <div className="space-y-3">
            <AuditLogStream title="Riwayat Verifikasi & Surat Resmi BPJS Kesehatan" />
          </div>
        )}
      </div>

      {/* Modal Upload Berkas */}
      <ModalUploadClaim
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccessUpload={() => setIsUploadOpen(false)}
      />

      {/* Modal Draf Surat Klarifikasi */}
      <ModalDisputeLetter
        isOpen={isDisputeOpen}
        onClose={() => setIsDisputeOpen(false)}
        claim={activeClaim}
        actionType="PENDING_KLARIFIKASI_RS"
        onConfirmDecision={handleConfirmDecision}
      />

      {/* Modal Diff Note-Cloning */}
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
