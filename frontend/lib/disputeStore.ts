"use client";

import {
  DisputeItem,
  DisputeClaimItem,
  DisputeStatus,
  INITIAL_DISPUTE_ITEMS,
  MediationAnalysisResponse,
  ArbitrationAgreementPayload,
} from "./disputeData";

const DISPUTE_STORAGE_KEY = "telisik_dispute_store_v1";

export interface DisputeResolutionPayload {
  resolutionType: "LAYAK" | "TIDAK_LAYAK" | "LAYAK_DENGAN_KOREKSI";
  finalTariff: number;
  officialLetterNumber: string;
  agreementSummary: string;
  agreedIcd10?: string;
  agreedInacbg?: string;
  arbitrationAgreement?: ArbitrationAgreementPayload;
}

export interface DisputeStats {
  total: number;
  pendingCount: number;
  disputeCount: number;
  resolvedCount: number;
  totalDisputedVariance: number;
  shortestSlaRemaining: number;
}

/**
 * Mendapatkan daftar sengketa klaim dari localStorage atau default mock data
 */
export function getStoredDisputes(): DisputeItem[] {
  if (typeof window === "undefined") {
    return INITIAL_DISPUTE_ITEMS;
  }

  try {
    const raw = localStorage.getItem(DISPUTE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DISPUTE_STORAGE_KEY, JSON.stringify(INITIAL_DISPUTE_ITEMS));
      return INITIAL_DISPUTE_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(DISPUTE_STORAGE_KEY, JSON.stringify(INITIAL_DISPUTE_ITEMS));
      return INITIAL_DISPUTE_ITEMS;
    }
    return parsed;
  } catch (err) {
    console.warn("[disputeStore] Error reading localStorage, using initial items:", err);
    return INITIAL_DISPUTE_ITEMS;
  }
}

/**
 * Menyimpan seluruh daftar sengketa ke localStorage
 */
export function setStoredDisputes(items: DisputeItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DISPUTE_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn("[disputeStore] Error writing to localStorage:", err);
  }
}

/**
 * Mengambil detail satu kasus sengketa berdasarkan claimId
 */
export function getStoredDisputeById(claimId: string): DisputeItem | undefined {
  const disputes = getStoredDisputes();
  return disputes.find((item) => item.claimId === claimId);
}

/**
 * Menyimpan hasil putusan arbitrase / kesepakatan sengketa klaim
 */
export function saveDisputeResolution(
  claimId: string,
  resolution: DisputeResolutionPayload
): DisputeItem {
  const disputes = getStoredDisputes();
  const index = disputes.findIndex((item) => item.claimId === claimId);

  if (index === -1) {
    throw new Error(`Klaim sengketa dengan ID ${claimId} tidak ditemukan.`);
  }

  let nextStatus: DisputeStatus = "RESOLVED_KOREKSI";
  if (resolution.resolutionType === "LAYAK") {
    nextStatus = "RESOLVED_LAYAK";
  } else if (resolution.resolutionType === "TIDAK_LAYAK") {
    nextStatus = "RESOLVED_TIDAK_LAYAK";
  }

  const updatedItem: DisputeItem = {
    ...disputes[index],
    disputeStatus: nextStatus,
    resolutionResult: {
      resolvedAt: new Date().toISOString(),
      resolutionType: resolution.resolutionType,
      finalTariff: resolution.finalTariff,
      officialLetterNumber: resolution.officialLetterNumber,
      agreementSummary: resolution.agreementSummary,
      arbitrationAgreement: resolution.arbitrationAgreement,
    },
  };

  disputes[index] = updatedItem;
  setStoredDisputes(disputes);
  return updatedItem;
}

/**
 * Menyimpan hasil inferensi analisis mediasi AI (LLaMA 3.3 / Gemini Flash)
 */
export function saveAiAnalysis(
  claimId: string,
  analysis: MediationAnalysisResponse
): DisputeItem {
  const disputes = getStoredDisputes();
  const index = disputes.findIndex((item) => item.claimId === claimId);

  if (index === -1) {
    throw new Error(`Klaim sengketa dengan ID ${claimId} tidak ditemukan.`);
  }

  const updatedItem: DisputeItem = {
    ...disputes[index],
    aiMediationAnalysis: analysis,
  };

  disputes[index] = updatedItem;
  setStoredDisputes(disputes);
  return updatedItem;
}

/**
 * Memperbarui status sengketa klaim
 */
export function updateDisputeStatus(claimId: string, status: DisputeStatus): DisputeItem {
  const disputes = getStoredDisputes();
  const index = disputes.findIndex((item) => item.claimId === claimId);

  if (index === -1) {
    throw new Error(`Klaim sengketa dengan ID ${claimId} tidak ditemukan.`);
  }

  const updatedItem: DisputeItem = {
    ...disputes[index],
    disputeStatus: status,
  };

  disputes[index] = updatedItem;
  setStoredDisputes(disputes);
  return updatedItem;
}

/**
 * Menghitung agregat metrik sengketa aktif
 */
export function getDisputeStats(): DisputeStats {
  const disputes = getStoredDisputes();
  const pendingCount = disputes.filter((d) => d.disputeStatus === "PENDING_KLARIFIKASI_RS").length;
  const disputeCount = disputes.filter((d) => d.disputeStatus === "DISPUTE" || d.disputeStatus === "IN_MEDIATION").length;
  const resolvedCount = disputes.filter(
    (d) =>
      d.disputeStatus === "RESOLVED_LAYAK" ||
      d.disputeStatus === "RESOLVED_TIDAK_LAYAK" ||
      d.disputeStatus === "RESOLVED_KOREKSI"
  ).length;

  const totalDisputedVariance = disputes.reduce((acc, curr) => acc + curr.deltaTariff, 0);
  const activeSlas = disputes
    .filter((d) => !d.disputeStatus.startsWith("RESOLVED_"))
    .map((d) => d.slaDaysRemaining);
  const shortestSlaRemaining = activeSlas.length > 0 ? Math.min(...activeSlas) : 0;

  return {
    total: disputes.length,
    pendingCount,
    disputeCount,
    resolvedCount,
    totalDisputedVariance,
    shortestSlaRemaining,
  };
}

/**
 * Mereset data sengketa ke kondisi awal
 */
export function resetDisputesToDefault(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DISPUTE_STORAGE_KEY, JSON.stringify(INITIAL_DISPUTE_ITEMS));
}
