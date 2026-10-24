"use client";

import { ClaimItem, INITIAL_CLAIMS } from "@/lib/mockData";
import { AuditLogItem } from "@/components/widgets/AuditLogStream";

const CLAIMS_STORAGE_KEY = "clarix_bpjs_claims_v1";
const AUDIT_STORAGE_KEY = "clarix_bpjs_audit_logs_v1";

export const DEFAULT_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "AUD-2026-004",
    claimId: "CLM-2026-089",
    hospitalName: "RS Sejahtera Medika",
    verifierName: "dr. Siti Aminah",
    verifierRole: "Verifikator Utama BPJS",
    timestamp: "23 Okt 2026, 11:20 WIB",
    action: "PENDING_KLARIFIKASI_RS",
    finalTariff: 20100000,
    savedDeltaRupiah: 24900000,
    officialLetterNumber: "BA-BPJS/2026/KLM-089/KLARIFIKASI",
    notes: "Klarifikasi resmi diterbitkan ke Komite Medik RS Sejahtera Medika terkait selisih 1 unit Stent DES dan kriteria diagnosis Sepsis.",
  },
  {
    id: "AUD-2026-003",
    claimId: "CLM-2026-012",
    hospitalName: "RS Mitra Sehat",
    verifierName: "dr. Siti Aminah",
    verifierRole: "Verifikator Utama BPJS",
    timestamp: "23 Okt 2026, 09:45 WIB",
    action: "DOWNCODE_DIUSULKAN",
    finalTariff: 8200000,
    savedDeltaRupiah: 7800000,
    officialLetterNumber: "BA-BPJS/2026/KLM-012/ADJUST",
    notes: "Penyesuaian kode dari G-4-14-II ke G-4-14-I disetujui DPJP RS. Selisih tarif dikoreksi dalam Berita Acara Rekonsiliasi.",
  },
  {
    id: "AUD-2026-002",
    claimId: "CLM-2026-077",
    hospitalName: "RSUD Kota Madya",
    verifierName: "dr. Siti Aminah",
    verifierRole: "Kaidah Koding & Verifikasi",
    timestamp: "23 Okt 2026, 08:15 WIB",
    action: "DISETUJUI",
    finalTariff: 6400000,
    savedDeltaRupiah: 0,
    notes: "Klaim tervalidasi lengkap tanpa diskrepansi dokumen asli. Diteruskan ke proses realisasi pembayaran.",
  },
  {
    id: "AUD-2026-001",
    claimId: "CLM-2026-034",
    hospitalName: "RS Sentosa Kasih",
    verifierName: "dr. Hendrawan Sp.PK",
    verifierRole: "Dewan Pertimbangan Klinis",
    timestamp: "22 Okt 2026, 16:30 WIB",
    action: "ESKALASI_PK_JKN",
    finalTariff: 18500000,
    savedDeltaRupiah: 12400000,
    officialLetterNumber: "ESK-PKJKN/2026/10-091",
    notes: "Eskalasi ke tim Pencegahan Kecurangan JKN atas dugaan duplikasi catatan rekam medis (Note Cloning) berulang.",
  },
];

// Helper to safely get claims from localStorage
export function getStoredClaims(): ClaimItem[] {
  if (typeof window === "undefined") {
    return INITIAL_CLAIMS;
  }
  try {
    const data = localStorage.getItem(CLAIMS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(INITIAL_CLAIMS));
      return INITIAL_CLAIMS;
    }
    const parsed: ClaimItem[] = JSON.parse(data);
    const initialMap = new Map(INITIAL_CLAIMS.map((c) => [c.id.toLowerCase(), c]));
    return parsed.map((item) => {
      const init = initialMap.get(item.id.toLowerCase());
      if (!init) return item;
      return {
        ...init,
        ...item,
        findings: item.findings && item.findings.length > 0 ? item.findings : init.findings,
        documents: item.documents && item.documents.length > 0 ? item.documents : init.documents,
        recommendedAction: item.recommendedAction || init.recommendedAction,
        alternativeHypotheses: item.alternativeHypotheses || init.alternativeHypotheses,
      };
    });
  } catch (err) {
    console.error("Failed to read claims from storage:", err);
    return INITIAL_CLAIMS;
  }
}

// Helper to save claims
export function saveClaims(claims: ClaimItem[]): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(CLAIMS_STORAGE_KEY);
    const existingList: ClaimItem[] = raw ? JSON.parse(raw) : INITIAL_CLAIMS;
    const existingMap = new Map(existingList.map((c) => [c.id.toLowerCase(), c]));

    const merged = claims.map((newClaim) => {
      const prev = existingMap.get(newClaim.id.toLowerCase());
      if (!prev) return newClaim;
      return {
        ...prev,
        ...newClaim,
        findings: newClaim.findings && newClaim.findings.length > 0 ? newClaim.findings : prev.findings,
        documents: newClaim.documents && newClaim.documents.length > 0 ? newClaim.documents : prev.documents,
        recommendedAction: newClaim.recommendedAction || prev.recommendedAction,
        alternativeHypotheses: newClaim.alternativeHypotheses || prev.alternativeHypotheses,
      };
    });

    localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new Event("clarix_claims_updated"));
  } catch (err) {
    console.error("Failed to save claims to storage:", err);
  }
}

// Update a single claim status
export function updateClaimStatus(claimId: string, newStatus: ClaimItem["status"], notes?: string): void {
  const currentClaims = getStoredClaims();
  const updated = currentClaims.map((claim) => {
    if (claim.id.toLowerCase() === claimId.toLowerCase()) {
      return { ...claim, status: newStatus };
    }
    return claim;
  });
  saveClaims(updated);

  // Asynchronously sync with PostgreSQL backend
  import("@/lib/api").then(({ updateClaimStatusInBackend }) => {
    updateClaimStatusInBackend(claimId, newStatus, notes).catch((err) =>
      console.warn("Syncing status to backend failed:", err)
    );
  });
}

// Add a new claim (from upload)
export function prependClaim(newClaim: ClaimItem): void {
  const currentClaims = getStoredClaims();
  const exists = currentClaims.some((c) => c.id.toLowerCase() === newClaim.id.toLowerCase());
  if (exists) {
    saveClaims(currentClaims.map((c) => (c.id.toLowerCase() === newClaim.id.toLowerCase() ? newClaim : c)));
  } else {
    saveClaims([newClaim, ...currentClaims]);
  }
}

// Helper to safely get audit logs
export function getStoredAuditLogs(): AuditLogItem[] {
  if (typeof window === "undefined") {
    return DEFAULT_AUDIT_LOGS;
  }
  try {
    const data = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(DEFAULT_AUDIT_LOGS));
      return DEFAULT_AUDIT_LOGS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to read audit logs from storage:", err);
    return DEFAULT_AUDIT_LOGS;
  }
}

// Helper to add a new audit log
export function addAuditLogEntry(entry: AuditLogItem): void {
  if (typeof window === "undefined") return;
  try {
    const currentLogs = getStoredAuditLogs();
    const updated = [entry, ...currentLogs];
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("clarix_audit_updated"));

    // Asynchronously append to PostgreSQL backend
    import("@/lib/api").then(({ appendAuditLogInBackend }) => {
      appendAuditLogInBackend(entry).catch((err) =>
        console.warn("Appending audit log to backend failed:", err)
      );
    });
  } catch (err) {
    console.error("Failed to add audit log entry:", err);
  }
}

// Reset store to default
export function resetStoreToDefault(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CLAIMS_STORAGE_KEY);
  localStorage.removeItem(AUDIT_STORAGE_KEY);
  window.dispatchEvent(new Event("clarix_claims_updated"));
  window.dispatchEvent(new Event("clarix_audit_updated"));
}
