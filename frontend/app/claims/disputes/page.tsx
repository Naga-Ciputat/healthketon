"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Scale,
  Search,
  Clock,
  Building2,
  User,
  Stethoscope,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  X,
  FileCheck,
  Calendar,
  Layers,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/userContext";
import {
  DisputeItem,
  DisputeStatus,
  MediationAnalysisResponse,
  ArbitrationAgreementPayload,
  INITIAL_DISPUTE_ITEMS,
} from "@/lib/disputeData";
import {
  getStoredDisputes,
  getStoredDisputeById,
  saveDisputeResolution,
  getDisputeStats,
} from "@/lib/disputeStore";
import {
  fetchDisputes,
  fetchDisputeDetail,
  analyzeDisputeWithAI,
  generateDisputeAgreement,
  resolveDispute,
} from "@/lib/api";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function DisputeWorkspacePage() {
  const { currentUser } = useUser();

  // State
  const [disputes, setDisputes] = useState<DisputeItem[]>([]);
  const [selectedClaimId, setSelectedClaimId] = useState<string>("CLM-2026-089");
  const [selectedDispute, setSelectedDispute] = useState<DisputeItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // AI Mediation State
  const [isAnalyzingAi, setIsAnalyzingAi] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<MediationAnalysisResponse | null>(null);

  // Modal State
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState<boolean>(false);
  const [resolutionType, setResolutionType] = useState<"LAYAK" | "TIDAK_LAYAK" | "LAYAK_DENGAN_KOREKSI">("LAYAK_DENGAN_KOREKSI");
  const [agreedTariff, setAgreedTariff] = useState<number>(0);
  const [agreedIcd10, setAgreedIcd10] = useState<string>("");
  const [agreedInacbg, setAgreedInacbg] = useState<string>("");
  const [mediatorNotes, setMediatorNotes] = useState<string>("");
  const [isSubmittingAgreement, setIsSubmittingAgreement] = useState<boolean>(false);

  // Initial load
  useEffect(() => {
    async function loadData() {
      const items = await fetchDisputes();
      setDisputes(items);
      const initialClaim = items.find((d) => d.claimId === selectedClaimId) || items[0] || null;
      if (initialClaim) {
        setSelectedClaimId(initialClaim.claimId);
        setSelectedDispute(initialClaim);
        setAiAnalysis(initialClaim.aiMediationAnalysis || null);
      }
    }
    loadData();
  }, []);

  // Update selected dispute when selectedClaimId changes
  useEffect(() => {
    const found = disputes.find((d) => d.claimId === selectedClaimId);
    if (found) {
      setSelectedDispute(found);
      setAiAnalysis(found.aiMediationAnalysis || null);
      // Pre-fill agreement defaults
      setAgreedTariff(found.bpjsProposedTariff);
      setAgreedIcd10(found.bpjsAuditProposed.primaryIcd10.code);
      setAgreedInacbg(found.bpjsAuditProposed.inacbgCode);
      setMediatorNotes(
        `Disepakati penyesuaian tarif berdasarkan klausul ${found.matchedBak.title} (${found.matchedBak.regulationCode}).`
      );
    }
  }, [selectedClaimId, disputes]);

  // Filtered list
  const filteredDisputes = useMemo(() => {
    return disputes.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.claimId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.disputeReason.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PENDING_KLARIFIKASI_RS" && item.disputeStatus === "PENDING_KLARIFIKASI_RS") ||
        (statusFilter === "DISPUTE" && (item.disputeStatus === "DISPUTE" || item.disputeStatus === "IN_MEDIATION")) ||
        (statusFilter === "RESOLVED" && item.disputeStatus.startsWith("RESOLVED_"));

      return matchesSearch && matchesStatus;
    });
  }, [disputes, searchQuery, statusFilter]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = disputes.length;
    const pendingCount = disputes.filter((d) => d.disputeStatus === "PENDING_KLARIFIKASI_RS").length;
    const disputeCount = disputes.filter((d) => d.disputeStatus === "DISPUTE" || d.disputeStatus === "IN_MEDIATION").length;
    const resolvedCount = disputes.filter((d) => d.disputeStatus.startsWith("RESOLVED_")).length;
    const totalVariance = disputes.reduce((acc, curr) => acc + curr.deltaTariff, 0);
    const activeSlas = disputes
      .filter((d) => !d.disputeStatus.startsWith("RESOLVED_"))
      .map((d) => d.slaDaysRemaining);
    const shortestSla = activeSlas.length > 0 ? Math.min(...activeSlas) : 0;

    return { total, pendingCount, disputeCount, resolvedCount, totalVariance, shortestSla };
  }, [disputes]);

  // Trigger AI Mediation Analysis
  const handleRunAiAnalysis = async () => {
    if (!selectedDispute) return;
    setIsAnalyzingAi(true);
    try {
      const result = await analyzeDisputeWithAI(selectedDispute.claimId);
      setAiAnalysis(result);
      if (result.recommendedTariff) {
        setAgreedTariff(result.recommendedTariff);
      }
      // Refresh local item in state
      setDisputes((prev) =>
        prev.map((d) => (d.claimId === selectedDispute.claimId ? { ...d, aiMediationAnalysis: result } : d))
      );
    } catch (err) {
      console.warn("Error running AI mediation analysis:", err);
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  // Open Arbitration Agreement Modal
  const handleOpenAgreementModal = () => {
    if (!selectedDispute) return;
    if (aiAnalysis) {
      setAgreedTariff(aiAnalysis.recommendedTariff);
      setMediatorNotes(aiAnalysis.clinicalRationale);
    } else {
      setAgreedTariff(selectedDispute.bpjsProposedTariff);
      setMediatorNotes(
        `Disepakati penyesuaian tarif berdasarkan konsensus ${selectedDispute.matchedBak.title}.`
      );
    }
    setResolutionType("LAYAK_DENGAN_KOREKSI");
    setAgreedIcd10(selectedDispute.bpjsAuditProposed.primaryIcd10.code);
    setAgreedInacbg(selectedDispute.bpjsAuditProposed.inacbgCode);
    setIsAgreementModalOpen(true);
  };

  // Submit and finalize arbitration agreement
  const handleFinalizeAgreement = async () => {
    if (!selectedDispute) return;
    setIsSubmittingAgreement(true);
    try {
      const now = new Date();
      const year = now.getFullYear();
      const monthRoman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"][now.getMonth()];
      const cleanId = selectedDispute.claimId.replace("CLM-", "");
      const officialLetterNumber = `BA-ARB/${year}/${monthRoman}/BPJS-RS/${cleanId}`;

      const legalClauses = [
        "Pasal 1 (Final dan Mengikat): Ketetapan yang tercantum dalam Berita Acara ini bersifat final, mengikat, dan berkekuatan hukum penuh.",
        "Pasal 2 (Pelepasan Hak Sengketa Ulang): Para pihak melepaskan hak untuk mengajukan sengketa ulang atas nomor klaim yang bersangkutan.",
        "Pasal 3 (Dasar Realisasi Keuangan): Berita Acara ini menjadi bukti sah untuk pembukuan dan realisasi pembayaran klaim pada sistem In-Monica BPJS Kesehatan.",
        `Pasal 4 (Dasar Regulasi): Kesepakatan berpedoman pada ${selectedDispute.matchedBak.title} (${selectedDispute.matchedBak.regulationCode}).`,
      ];

      const agreementPayload: ArbitrationAgreementPayload = {
        letterNumber: officialLetterNumber,
        agreementTitle: "BERITA ACARA KESEPAKATAN BERSAMA ARBITRASE SENGKETA KLAIM JKN",
        resolutionType,
        finalAgreedTariff: agreedTariff,
        agreedIcd10,
        agreedInacbg,
        hospitalName: selectedDispute.hospitalName,
        patientName: selectedDispute.patientName,
        sepNumber: selectedDispute.sepNumber,
        notes: mediatorNotes,
        mediatorRs: selectedDispute.hospitalRebuttal.submittedBy,
        mediatorBpjs: `${currentUser.name} (${currentUser.role})`,
        legalClauses,
        digitalSignatureId: `SHA256:TTE-${year}${cleanId}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        signedAt: now.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) + " WIB",
      };

      await resolveDispute(selectedDispute.claimId, {
        resolutionType,
        finalTariff: agreedTariff,
        officialLetterNumber,
        agreementText: mediatorNotes,
        notes: mediatorNotes,
        agreedIcd10,
        agreedInacbg,
        arbitrationAgreement: agreementPayload,
      });

      // Update local state quietly without decorative toast
      const updatedList = getStoredDisputes();
      setDisputes(updatedList);
      const updatedItem = updatedList.find((d) => d.claimId === selectedDispute.claimId);
      if (updatedItem) {
        setSelectedDispute(updatedItem);
      }
      setIsAgreementModalOpen(false);
    } catch (err) {
      console.error("Error finalizing arbitration agreement:", err);
    } finally {
      setIsSubmittingAgreement(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 text-slate-800 font-sans h-screen overflow-hidden">
      {/* Top Header Strip */}
      <header className="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[4px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 tracking-tight">
                Mediasi & Arbitrase Sengketa Klaim JKN
              </h1>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-[4px] border border-slate-200">
                BAK Kemenkes 2020–2024
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Ruang telaah komparatif sanggahan rumah sakit vs keberatan audit BPJS Kesehatan berdasar konsensus regulasi
            </p>
          </div>
        </div>

        {/* Aggregate KPI Strip (tabular-nums, restrained, no glowing/pulsing) */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex flex-col items-end border-r border-slate-200 pr-4">
            <span className="text-[10px] text-slate-500 font-medium">Total Nilai Sengketa</span>
            <span className="text-xs font-bold text-slate-900 tabular-nums">
              {formatRupiah(stats.totalVariance)}
            </span>
          </div>
          <div className="flex flex-col items-end border-r border-slate-200 pr-4">
            <span className="text-[10px] text-slate-500 font-medium">Batas Terkritis (SLA)</span>
            <span
              className={cn(
                "text-xs font-bold tabular-nums",
                stats.shortestSla <= 3 ? "text-rose-700" : "text-amber-700"
              )}
            >
              {stats.shortestSla} Hari Kalender
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-medium">Status Sengketa Aktif</span>
            <span className="text-xs font-bold text-slate-900 tabular-nums">
              {stats.disputeCount + stats.pendingCount} Kasus
            </span>
          </div>
        </div>
      </header>

      {/* Main Workspace: Left Sidebar Queue & Right Workspace */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Queue Panel (Width: 320px) */}
        <aside className="w-80 border-r border-slate-200 bg-white flex flex-col flex-shrink-0">
          {/* Queue Filter Bar */}
          <div className="p-3 border-b border-slate-200 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari ID klaim, RS, atau diagnosis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-[4px] focus:outline-none focus:border-blue-500 text-slate-700 placeholder-slate-400"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 text-[11px] font-medium pt-1">
              <button
                onClick={() => setStatusFilter("ALL")}
                className={cn(
                  "px-2 py-1 rounded-[3px] transition-colors",
                  statusFilter === "ALL"
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                Semua ({stats.total})
              </button>
              <button
                onClick={() => setStatusFilter("PENDING_KLARIFIKASI_RS")}
                className={cn(
                  "px-2 py-1 rounded-[3px] transition-colors",
                  statusFilter === "PENDING_KLARIFIKASI_RS"
                    ? "bg-amber-100 text-amber-900 font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                Klarifikasi ({stats.pendingCount})
              </button>
              <button
                onClick={() => setStatusFilter("DISPUTE")}
                className={cn(
                  "px-2 py-1 rounded-[3px] transition-colors",
                  statusFilter === "DISPUTE"
                    ? "bg-rose-100 text-rose-900 font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                Dispute ({stats.disputeCount})
              </button>
            </div>
          </div>

          {/* Queue List Stream */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredDisputes.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Tidak ada sengketa klaim yang sesuai dengan kriteria filter.
              </div>
            ) : (
              filteredDisputes.map((item) => {
                const isSelected = item.claimId === selectedClaimId;
                const isResolved = item.disputeStatus.startsWith("RESOLVED_");

                return (
                  <button
                    key={item.claimId}
                    onClick={() => setSelectedClaimId(item.claimId)}
                    className={cn(
                      "w-full text-left p-3 transition-colors flex flex-col gap-1.5 cursor-pointer",
                      isSelected
                        ? "bg-blue-50/70 border-l-3 border-blue-600"
                        : "hover:bg-slate-50/80 border-l-3 border-transparent"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 tabular-nums">
                        {item.claimId}
                      </span>
                      {isResolved ? (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[3px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Selesai
                        </span>
                      ) : (
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-1.5 py-0.5 rounded-[3px] border tabular-nums flex items-center gap-1",
                            item.slaDaysRemaining <= 3
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          )}
                        >
                          <Clock className="w-3 h-3" />
                          SLA {item.slaDaysRemaining} Hari
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-medium text-slate-800 line-clamp-1">
                      {item.hospitalName}
                    </div>

                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {item.patientName} ({item.patientAge} th, {item.patientGender}) • {item.primaryDiagnosis.code}
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-0.5 border-t border-slate-100 text-slate-600">
                      <span>Selisih Sengketa:</span>
                      <span className="font-semibold text-rose-700 tabular-nums">
                        {formatRupiah(item.deltaTariff)}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Workspace Area: Details & Comparator */}
        {selectedDispute ? (
          <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto">
            {/* Context Dossier Header Strip */}
            <div className="bg-white border-b border-slate-200 px-5 py-3 flex-shrink-0 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-sm text-slate-900 tabular-nums">
                    {selectedDispute.claimId}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    SEP: {selectedDispute.sepNumber}
                  </span>
                  <span
                    className={cn(
                      "text-[10.5px] font-semibold px-2 py-0.5 rounded-[3px] border",
                      selectedDispute.disputeStatus === "PENDING_KLARIFIKASI_RS"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : selectedDispute.disputeStatus === "DISPUTE"
                        ? "bg-rose-50 text-rose-800 border-rose-200"
                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
                    )}
                  >
                    {selectedDispute.disputeStatus}
                  </span>
                </div>

                {/* Dispute Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunAiAnalysis}
                    disabled={isAnalyzingAi}
                    className="px-3 py-1.5 text-xs font-semibold rounded-[4px] border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isAnalyzingAi ? "Menganalisis Konsensus..." : "Analisis Mediasi AI"}
                  </button>
                  <button
                    onClick={handleOpenAgreementModal}
                    className="px-3 py-1.5 text-xs font-semibold rounded-[4px] bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    Terbitkan Berita Acara
                  </button>
                </div>
              </div>

              {/* Clinical & Demographic Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">
                    {selectedDispute.hospitalName} (Kelas {selectedDispute.hospitalClass})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">
                    {selectedDispute.patientName} ({selectedDispute.patientAge} th, {selectedDispute.patientGender})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{selectedDispute.dpjpName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate tabular-nums">
                    Rawat: {selectedDispute.admissionDate} s.d {selectedDispute.dischargeDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Side-by-Side Dual Pane Comparator */}
            <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Pane: Hospital Appeal & Rebuttal */}
              <div className="bg-white border border-slate-200 rounded-[4px] flex flex-col">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-700" />
                    <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                      Argumen & Bukti Sanggahan RS
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 tabular-nums">
                    Diajukan: {selectedDispute.hospitalRebuttal.submittedAt}
                  </span>
                </div>

                <div className="p-4 space-y-3.5 flex-1 text-xs">
                  {/* Claimed Tariff Summary */}
                  <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-[4px] space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Pengajuan Awal Rumah Sakit:</span>
                      <span className="font-bold text-blue-900 tabular-nums text-sm">
                        {formatRupiah(selectedDispute.claimedTariff)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 flex items-center gap-2">
                      <span className="font-mono bg-white px-1.5 py-0.5 border border-blue-200 rounded-[2px] font-bold">
                        {selectedDispute.hospitalClaimed.inacbgCode}
                      </span>
                      <span className="truncate">{selectedDispute.hospitalClaimed.inacbgDescription}</span>
                    </div>
                  </div>

                  {/* DPJP Statement */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Pernyataan Sanggahan Komite Medik / DPJP:
                    </label>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-[4px] text-slate-800 leading-relaxed">
                      "{selectedDispute.hospitalRebuttal.statement}"
                    </div>
                  </div>

                  {/* Clinical CPPT Notes */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Catatan Kronologis CPPT ({selectedDispute.dpjpName}):
                    </label>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[4px] text-slate-700 font-mono text-[11px] leading-relaxed">
                      {selectedDispute.hospitalRebuttal.dpjpNotes}
                    </div>
                  </div>

                  {/* Supporting Evidence List */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Dokumen Bukti Medis yang Dilampirkan:
                    </label>
                    <div className="space-y-1.5">
                      {selectedDispute.hospitalRebuttal.supportingEvidence.map((evidence, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-2 bg-white border border-slate-200 rounded-[3px] text-slate-700"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-snug">{evidence}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Pane: BPJS Objection & Matched BAK Kemenkes */}
              <div className="bg-white border border-slate-200 rounded-[4px] flex flex-col">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                      Temuan Audit BPJS & Regulasi BAK
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 tabular-nums">
                    Audit: {selectedDispute.bpjsFinding.objectionDate}
                  </span>
                </div>

                <div className="p-4 space-y-3.5 flex-1 text-xs">
                  {/* Proposed Tariff Summary */}
                  <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-[4px] space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Usulan Penyesuaian BPJS:</span>
                      <span className="font-bold text-emerald-900 tabular-nums text-sm">
                        {formatRupiah(selectedDispute.bpjsProposedTariff)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 flex items-center gap-2">
                      <span className="font-mono bg-white px-1.5 py-0.5 border border-emerald-200 rounded-[2px] font-bold">
                        {selectedDispute.bpjsAuditProposed.inacbgCode}
                      </span>
                      <span className="truncate">{selectedDispute.bpjsAuditProposed.inacbgDescription}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-rose-700 pt-1 border-t border-emerald-200/50 font-semibold">
                      <span>Efisiensi Finansial (Delta):</span>
                      <span className="tabular-nums">-{formatRupiah(selectedDispute.deltaTariff)}</span>
                    </div>
                  </div>

                  {/* BPJS Finding Type & Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Pokok Keberatan Verifikator Medis:
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-rose-50 text-rose-700 border border-rose-200 rounded-[2px]">
                        {selectedDispute.bpjsFinding.findingType}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-[4px] text-slate-800 leading-relaxed">
                      {selectedDispute.bpjsFinding.description}
                    </div>
                  </div>

                  {/* Verbatim Record Quote */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Bukti Verbatim Rekam Medis ({selectedDispute.bpjsFinding.sourceDocument}):
                    </label>
                    <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-[4px] text-amber-950 font-mono text-[11px] leading-relaxed">
                      "{selectedDispute.bpjsFinding.verbatimQuote}"
                    </div>
                  </div>

                  {/* Matched BAK Kemenkes (2020-2024) Clause */}
                  <div className="p-3 bg-slate-50 border border-slate-300 rounded-[4px] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                        <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                        <span>Klausul Konsensus: {selectedDispute.matchedBak.title}</span>
                      </div>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-1.5 py-0.5 rounded-[2px]">
                        Tahun {selectedDispute.matchedBak.year}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed italic border-l-2 border-blue-500 pl-2">
                      "{selectedDispute.matchedBak.relevantClause}"
                    </p>
                    <div className="pt-1 text-[10.5px] text-slate-500">
                      Rujukan Otoritatif: {selectedDispute.matchedBak.pnpkReference}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Mediation Consensus Console (Fast model Groq LLaMA 3.3 / Gemini Flash) */}
            <div className="px-4 pb-6">
              <div className="bg-white border border-slate-200 rounded-[4px] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-[3px] bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-900">
                        Konsensus Arbitrase Mediasi AI
                      </h3>
                      <span className="text-[10.5px] text-slate-500">
                        Didukung model inferensi cepat (Groq LPU LLaMA 3.3 70B / Gemini 2.5 Flash — Bebas Gemini Pro)
                      </span>
                    </div>
                  </div>

                  {aiAnalysis && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500">Tingkat Keyakinan:</span>
                      <span className="font-bold text-emerald-700 tabular-nums bg-emerald-50 px-2 py-0.5 rounded-[3px] border border-emerald-200">
                        {aiAnalysis.confidenceScore}%
                      </span>
                    </div>
                  )}
                </div>

                {aiAnalysis ? (
                  <div className="space-y-3 text-xs">
                    {/* Recommendation Badge & Tariff */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-[4px]">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Rekomendasi Putusan Mediasi:
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={cn(
                              "font-bold text-xs px-2 py-0.5 rounded-[3px] border",
                              aiAnalysis.recommendationType === "LAYAK"
                                ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                : aiAnalysis.recommendationType === "TIDAK_LAYAK"
                                ? "bg-rose-100 text-rose-900 border-rose-300"
                                : "bg-blue-100 text-blue-900 border-blue-300"
                            )}
                          >
                            {aiAnalysis.recommendationType}
                          </span>
                          <span className="text-slate-600 text-[11px]">
                            {aiAnalysis.bakMatchedArticle}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 font-medium block">
                            Tarif Rekomendasi Mediasi
                          </span>
                          <span className="font-bold text-sm text-slate-900 tabular-nums">
                            {formatRupiah(aiAnalysis.recommendedTariff)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 font-medium block">
                            Koreksi Diselamatkan
                          </span>
                          <span className="font-bold text-sm text-emerald-700 tabular-nums">
                            +{formatRupiah(aiAnalysis.tariffAdjustmentDelta)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rationale & Reasoning Steps */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Pertimbangan Mediko-Legal:
                      </span>
                      <p className="text-slate-800 leading-relaxed bg-slate-50 p-2.5 rounded-[4px] border border-slate-200">
                        {aiAnalysis.clinicalRationale}
                      </p>
                    </div>

                    {/* Step-by-Step Reasoning */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                          Tahapan Penalaran Regulasi:
                        </span>
                        <ul className="space-y-1 bg-slate-50 p-2.5 rounded-[4px] border border-slate-200 text-[11px] text-slate-700">
                          {aiAnalysis.reasoningSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="font-bold text-slate-400 tabular-nums flex-shrink-0">
                                {idx + 1}.
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                          Klausul Kompromi Para Pihak:
                        </span>
                        <ul className="space-y-1 bg-slate-50 p-2.5 rounded-[4px] border border-slate-200 text-[11px] text-slate-700">
                          {aiAnalysis.compromiseTerms.map((term, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>{term}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-[4px] text-center space-y-2">
                    <p className="text-xs text-slate-600">
                      Belum ada analisis mediasi untuk berkas sengketa ini. Klik tombol di bawah untuk mencocokkan dokumen sanggahan terhadap korpus konsensus BAK Kemenkes (2020–2024).
                    </p>
                    <button
                      onClick={handleRunAiAnalysis}
                      disabled={isAnalyzingAi}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-[4px] bg-blue-600 text-white hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {isAnalyzingAi ? "Menganalisis Konsensus..." : "Jalankan Konsensus Mediasi AI Sekarang"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
            Pilih berkas sengketa dari antrean untuk membuka ruang mediasi.
          </div>
        )}
      </div>

      {/* Modal: Structured Berita Acara Kesepakatan Bersama Arbitrase Sengketa Klaim */}
      {isAgreementModalOpen && selectedDispute && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[6px] border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
            {/* Modal Header */}
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-700" />
                <h2 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Penerbitan Berita Acara Kesepakatan Arbitrase Sengketa Klaim
                </h2>
              </div>
              <button
                onClick={() => setIsAgreementModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-[3px] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Institutional Header Block */}
              <div className="text-center pb-3 border-b border-slate-200">
                <div className="font-bold text-xs text-slate-900 uppercase">
                  TIM MEDIASI & ARBITRASE SENGKETA KLAIM JKN
                </div>
                <div className="text-[11px] text-slate-600">
                  BPJS Kesehatan Bersama Komite Medik {selectedDispute.hospitalName}
                </div>
                <div className="text-[10.5px] text-slate-400 mt-0.5">
                  Nomor Registrasi: BA-ARB/2026/XI/BPJS-RS/{selectedDispute.claimId.replace("CLM-", "")}
                </div>
              </div>

              {/* 3 Resolution Options Selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  1. Putusan Hasil Kesepakatan Arbitrase (Pilih salah satu):
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setResolutionType("LAYAK_DENGAN_KOREKSI");
                      setAgreedTariff(selectedDispute.bpjsProposedTariff);
                    }}
                    className={cn(
                      "p-2.5 rounded-[4px] border text-left transition-colors cursor-pointer",
                      resolutionType === "LAYAK_DENGAN_KOREKSI"
                        ? "bg-blue-50/80 border-blue-500 text-blue-900 font-semibold"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <div className="font-bold text-xs mb-0.5">LAYAK DENGAN KOREKSI</div>
                    <div className="text-[10.5px] text-slate-500 leading-tight">
                      Rekonsiliasi sepakat penyesuaian kode dan tarif wajar
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setResolutionType("LAYAK");
                      setAgreedTariff(selectedDispute.claimedTariff);
                    }}
                    className={cn(
                      "p-2.5 rounded-[4px] border text-left transition-colors cursor-pointer",
                      resolutionType === "LAYAK"
                        ? "bg-emerald-50/80 border-emerald-500 text-emerald-900 font-semibold"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <div className="font-bold text-xs mb-0.5">LAYAK (DISETUJUI PENUH)</div>
                    <div className="text-[10.5px] text-slate-500 leading-tight">
                      Sanggahan RS diterima, klaim dibayar sesuai pengajuan
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setResolutionType("TIDAK_LAYAK");
                      setAgreedTariff(0);
                    }}
                    className={cn(
                      "p-2.5 rounded-[4px] border text-left transition-colors cursor-pointer",
                      resolutionType === "TIDAK_LAYAK"
                        ? "bg-rose-50/80 border-rose-500 text-rose-900 font-semibold"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <div className="font-bold text-xs mb-0.5">TIDAK LAYAK (DITOLAK)</div>
                    <div className="text-[10.5px] text-slate-500 leading-tight">
                      Sanggahan RS ditolak, klaim dinyatakan tidak memenuhi syarat
                    </div>
                  </button>
                </div>
              </div>

              {/* Agreed Financial & Coding Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-[4px]">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-600 block mb-1">
                    Tarif Final Disepakati (Rp):
                  </label>
                  <input
                    type="number"
                    value={agreedTariff}
                    onChange={(e) => setAgreedTariff(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-[3px] text-xs font-bold text-slate-900 tabular-nums focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-bold text-slate-600 block mb-1">
                    Kode ICD-10 Disepakati:
                  </label>
                  <input
                    type="text"
                    value={agreedIcd10}
                    onChange={(e) => setAgreedIcd10(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-[3px] text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-bold text-slate-600 block mb-1">
                    Kode INA-CBG Disepakati:
                  </label>
                  <input
                    type="text"
                    value={agreedInacbg}
                    onChange={(e) => setAgreedInacbg(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-[3px] text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Consensus Notes */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  2. Pertimbangan & Dasar Kesepakatan Bersama:
                </label>
                <textarea
                  rows={3}
                  value={mediatorNotes}
                  onChange={(e) => setMediatorNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-[4px] text-xs text-slate-800 focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              {/* Legal Clauses Preview */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-[4px] space-y-1">
                <span className="text-[10.5px] font-bold text-slate-600 block">
                  3. Klausul Hukum Mediko-Legal Baku:
                </span>
                <p className="text-[10.5px] text-slate-600 leading-relaxed">
                  • <strong>Pasal 1:</strong> Ketetapan dalam Berita Acara ini bersifat final, mengikat, dan berkekuatan hukum penuh.
                  <br />
                  • <strong>Pasal 2:</strong> Para pihak melepaskan hak untuk mengajukan sengketa ulang atas nomor klaim yang bersangkutan.
                  <br />
                  • <strong>Pasal 3:</strong> Berita Acara ini menjadi dasar resmi realisasi pencairan dana pada sistem keuangan In-Monica BPJS Kesehatan.
                </p>
              </div>

              {/* Dual Signature Blocks Preview */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-200 text-center text-[11px]">
                <div className="p-2 border border-slate-200 rounded-[3px] bg-slate-50/50">
                  <span className="text-slate-500 block">Pihak Pertama (Rumah Sakit)</span>
                  <span className="font-bold text-slate-900 block mt-0.5 truncate">
                    {selectedDispute.hospitalRebuttal.submittedBy}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-2 block">
                    [Tanda Tangan Elektronik Terverifikasi]
                  </span>
                </div>

                <div className="p-2 border border-slate-200 rounded-[3px] bg-slate-50/50">
                  <span className="text-slate-500 block">Pihak Kedua (BPJS Kesehatan)</span>
                  <span className="font-bold text-slate-900 block mt-0.5 truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-2 block">
                    [TTE SHA-256 Validated]
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsAgreementModalOpen(false)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-[4px] border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleFinalizeAgreement}
                disabled={isSubmittingAgreement}
                className="px-4 py-1.5 text-xs font-semibold rounded-[4px] bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <FileCheck className="w-3.5 h-3.5" />
                {isSubmittingAgreement ? "Menyimpan & Menandatangani..." : "Simpan & Sahkan Berita Acara"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
