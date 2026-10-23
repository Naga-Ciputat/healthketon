"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TopHeader } from "@/components/widgets/TopHeader";
import { MetricHeader } from "@/components/widgets/MetricHeader";
import { ClaimFilterBar } from "@/components/widgets/ClaimFilterBar";
import { ClaimTable } from "@/components/widgets/ClaimTable";
import { ModalUploadClaim } from "@/components/widgets/ModalUploadClaim";
import { INITIAL_CLAIMS, ClaimItem } from "@/lib/mockData";
import { UploadCloud, Layers } from "lucide-react";

export default function TriagePage() {
  const router = useRouter();
  const [claims] = useState<ClaimItem[]>(INITIAL_CLAIMS);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("ALL");
  const [selectedRisk, setSelectedRisk] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Modal Upload
  const [isUploadOpen, setIsUploadOpen] = useState(false);

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

  const handleSelectClaim = (claimId: string) => {
    router.push(`/claims/${claimId}/dossier`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Top Header */}
      <TopHeader
        title="Triage & Antrean Klaim"
        subtitle="Verifikasi Pra-Bayar Faskes"
        badge={
          <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-[4px] border border-blue-200">
            Layar 1
          </span>
        }
        rightActions={
          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-emerald-600 rounded-[4px] hover:bg-emerald-700 transition-colors shadow-2xs"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Berkas Klaim</span>
          </button>
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 max-w-7xl w-full mx-auto">
        {/* Metric Header Widget */}
        <MetricHeader claims={claims} />

        {/* Filter Bar */}
        <ClaimFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedHospital={selectedHospital}
          onHospitalChange={setSelectedHospital}
          selectedRisk={selectedRisk}
          onRiskChange={setSelectedRisk}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          hospitals={hospitals}
          onOpenUpload={() => setIsUploadOpen(true)}
        />

        {/* Claim Table Widget */}
        <div className="bg-white rounded-md border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-800">
                Daftar Klaim Terprioritaskan ({filteredClaims.length})
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Klik baris klaim untuk membuka ruang telaah bukti
            </span>
          </div>

          <ClaimTable
            claims={filteredClaims}
            onSelectClaim={handleSelectClaim}
          />
        </div>
      </div>

      {/* Modal Upload Claim */}
      <ModalUploadClaim
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccessUpload={() => setIsUploadOpen(false)}
      />
    </div>
  );
}
