"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TopHeader } from "@/components/widgets/TopHeader";
import { MetricHeader } from "@/components/widgets/MetricHeader";
import { ClaimFilterBar } from "@/components/widgets/ClaimFilterBar";
import { ClaimTable } from "@/components/widgets/ClaimTable";
import { ModalUploadClaim } from "@/components/widgets/ModalUploadClaim";
import { INITIAL_CLAIMS, ClaimItem } from "@/lib/mockData";
import { Shield, Sparkles } from "lucide-react";

export default function ClaimsTriagePage() {
  const router = useRouter();
  const [claims, setClaims] = useState<ClaimItem[]>(INITIAL_CLAIMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("ALL");
  const [selectedRisk, setSelectedRisk] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Unique hospital list for filter dropdown
  const hospitals = useMemo(() => {
    return Array.from(new Set(claims.map((c) => c.hospitalName)));
  }, [claims]);

  // Filtered claims based on search & filters
  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      // Search filter
      const matchesSearch =
        claim.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.primaryDiagnosis.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.primaryDiagnosis.code.toLowerCase().includes(searchQuery.toLowerCase());

      // Hospital filter
      const matchesHospital =
        selectedHospital === "ALL" || claim.hospitalName === selectedHospital;

      // Risk filter
      const matchesRisk =
        selectedRisk === "ALL" || claim.riskLevel === selectedRisk;

      // Status filter
      const matchesStatus =
        selectedStatus === "ALL" || claim.status === selectedStatus;

      return matchesSearch && matchesHospital && matchesRisk && matchesStatus;
    });
  }, [claims, searchQuery, selectedHospital, selectedRisk, selectedStatus]);

  // Aggregate metrics
  const totalPending = claims.filter((c) => c.status === "PERLU_TINJAUAN").length;
  const highRiskCount = claims.filter((c) => c.riskLevel === "TINGGI").length;
  const totalInefficiency = claims.reduce((acc, c) => acc + c.deltaTariff, 0);
  const fastTrackedCount = claims.filter((c) => c.status === "DISETUJUI").length;

  const handleSelectClaim = (claimId: string) => {
    router.push(`/claims/${claimId}/dossier`);
  };

  const handleSuccessUpload = (claimName: string) => {
    // Add simulated newly ingested claim to top of list
    const newClaim: ClaimItem = {
      id: `CLM-2026-${Math.floor(Math.random() * 899 + 100)}`,
      hospitalName: "RS Sejahtera Medika",
      patientAge: 49,
      patientGender: "L",
      dpjpName: "dr. Hendra Sp.JP",
      admissionDate: "11 Okt 2026",
      dischargeDate: "11 Okt 2026",
      primaryDiagnosis: { code: "I20.0", name: "Unstable angina" },
      secondaryDiagnoses: [],
      procedures: [{ code: "88.55", name: "Coronary arteriography" }],
      inacbgCode: "I-4-17-I",
      inacbgDescription: "Pemeriksaan Kardiologi Invasif Ringan",
      claimedTariff: 12500000,
      fairTariff: 12500000,
      deltaTariff: 0,
      status: "PERLU_TINJAUAN",
      riskLevel: "RENDAH",
      modusTags: [],
      confidenceScore: 95,
      findings: [],
      alternativeHypotheses: "Klaim sintetis baru telah diverifikasi skema & UU PDP.",
      recommendedAction: {
        type: "DISETUJUI",
        label: "Setujui Klaim",
        confidence: 95,
        suggestedNotes: "Dokumen rujukan lengkap.",
        disputeDraftSummary: "",
      },
      documents: [],
    };
    setClaims((prev) => [newClaim, ...prev]);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50/30">
      {/* Top Header */}
      <TopHeader
        title={
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>Triage & Antrean Risiko JKN</span>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-medium border border-blue-200">
              Live Queue
            </span>
          </div>
        }
        subtitle="Verifikasi klaim terurut potensi inefisiensi & risiko klinis"
        showHelp={true}
        showAskAttio={false}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {/* Metric Header Cards */}
        <MetricHeader
          totalPendingCount={totalPending}
          highRiskCount={highRiskCount}
          totalInefficiencyRupiah={totalInefficiency}
          fastTrackedCount={fastTrackedCount}
          fastTrackedPercent={Math.round((fastTrackedCount / claims.length) * 100)}
        />

        {/* Filter Toolbar */}
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

        {/* Priority Claims Table */}
        <ClaimTable
          claims={filteredClaims}
          onSelectClaim={handleSelectClaim}
        />
      </div>

      {/* Modal Upload Claim (F1 Privacy Guard) */}
      <ModalUploadClaim
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccessUpload={handleSuccessUpload}
      />
    </div>
  );
}
