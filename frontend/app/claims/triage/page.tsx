"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TopHeader } from "@/components/widgets/TopHeader";
import { MetricHeader } from "@/components/widgets/MetricHeader";
import { ClaimFilterBar } from "@/components/widgets/ClaimFilterBar";
import { ClaimTable } from "@/components/widgets/ClaimTable";
import { ModalUploadClaim } from "@/components/widgets/ModalUploadClaim";
import { INITIAL_CLAIMS, ClaimItem } from "@/lib/mockData";
import { getStoredClaims, prependClaim } from "@/lib/claimStore";
import { UploadCloud, Layers, CheckCircle2, ArrowRight, X } from "lucide-react";

export default function TriagePage() {
  const router = useRouter();
  const [claims, setClaims] = useState<ClaimItem[]>(INITIAL_CLAIMS);

  // Synchronize with client store
  useEffect(() => {
    setClaims(getStoredClaims());
    const handleUpdate = () => {
      setClaims(getStoredClaims());
    };
    window.addEventListener("clarix_claims_updated", handleUpdate);
    return () => {
      window.removeEventListener("clarix_claims_updated", handleUpdate);
    };
  }, []);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("ALL");
  const [selectedRisk, setSelectedRisk] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedModus, setSelectedModus] = useState("ALL");

  // Sorting State
  const [sortBy, setSortBy] = useState<string>("priority");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modal Upload & Uploaded Notification
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [recentUploadNotice, setRecentUploadNotice] = useState<{
    id: string;
    hospital: string;
  } | null>(null);

  // Unique Hospital List
  const hospitals = useMemo(() => {
    return Array.from(new Set(claims.map((c) => c.hospitalName)));
  }, [claims]);

  // Handle Sort Change
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedHospital("ALL");
    setSelectedRisk("ALL");
    setSelectedStatus("ALL");
    setSelectedModus("ALL");
    setSortBy("priority");
    setSortOrder("desc");
  };

  // Filtered and Sorted Claims
  const filteredClaims = useMemo(() => {
    const riskWeight = { TINGGI: 3, SEDANG: 2, RENDAH: 1 };

    const filtered = claims.filter((claim) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        claim.id.toLowerCase().includes(q) ||
        claim.hospitalName.toLowerCase().includes(q) ||
        claim.primaryDiagnosis.name.toLowerCase().includes(q) ||
        claim.primaryDiagnosis.code.toLowerCase().includes(q) ||
        claim.inacbgCode.toLowerCase().includes(q);

      const matchesHospital =
        selectedHospital === "ALL" || claim.hospitalName === selectedHospital;

      const matchesRisk =
        selectedRisk === "ALL" || claim.riskLevel === selectedRisk;

      const matchesStatus =
        selectedStatus === "ALL" || claim.status === selectedStatus;

      const matchesModus =
        selectedModus === "ALL" ||
        claim.modusTags.some((tag) => tag.toLowerCase() === selectedModus.toLowerCase());

      return matchesSearch && matchesHospital && matchesRisk && matchesStatus && matchesModus;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "priority") {
        const weightA = riskWeight[a.riskLevel] * 100000000 + a.deltaTariff;
        const weightB = riskWeight[b.riskLevel] * 100000000 + b.deltaTariff;
        comparison = weightA - weightB;
      } else if (sortBy === "delta") {
        comparison = a.deltaTariff - b.deltaTariff;
      } else if (sortBy === "tariff") {
        comparison = a.claimedTariff - b.claimedTariff;
      } else if (sortBy === "risk") {
        comparison = riskWeight[a.riskLevel] - riskWeight[b.riskLevel];
      } else if (sortBy === "id") {
        comparison = a.id.localeCompare(b.id);
      } else if (sortBy === "status") {
        comparison = a.status.localeCompare(b.status);
      } else if (sortBy === "date") {
        comparison = new Date(a.admissionDate).getTime() - new Date(b.admissionDate).getTime();
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [claims, searchQuery, selectedHospital, selectedRisk, selectedStatus, selectedModus, sortBy, sortOrder]);

  const handleSelectClaim = (claimId: string) => {
    router.push(`/claims/${claimId}/dossier`);
  };

  const handleSuccessUpload = (newClaim: ClaimItem) => {
    prependClaim(newClaim);
    setIsUploadOpen(false);
    setRecentUploadNotice({ id: newClaim.id, hospital: newClaim.hospitalName });
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
            <span>Unggah Berkas Klaim</span>
          </button>
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 max-w-7xl w-full mx-auto">
        {/* Upload Success Banner */}
        {recentUploadNotice && (
          <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-[4px] text-xs text-emerald-900 shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                Berkas klaim <strong className="font-semibold tabular-nums">{recentUploadNotice.id}</strong> ({recentUploadNotice.hospital}) berhasil ditambahkan ke antrean telaah teratas.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSelectClaim(recentUploadNotice.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 rounded-[4px] font-semibold text-[11px] transition-colors shadow-2xs"
              >
                <span>Buka Ruang Telaah</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setRecentUploadNotice(null)}
                className="p-1 text-emerald-600 hover:text-emerald-900 rounded-[4px] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

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
          selectedModus={selectedModus}
          onModusChange={setSelectedModus}
          sortBy={sortBy}
          onSortByChange={(newSort) => {
            setSortBy(newSort);
            setSortOrder("desc");
          }}
          onResetFilters={handleResetFilters}
          hospitals={hospitals}
        />

        {/* Claim Table Widget */}
        <div className="bg-white rounded-[4px] border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
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
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>

      {/* Modal Upload Claim */}
      <ModalUploadClaim
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccessUpload={handleSuccessUpload}
      />
    </div>
  );
}
