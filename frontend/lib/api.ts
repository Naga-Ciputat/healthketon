import { ClaimItem } from "@/lib/mockData";
import { AuditLogItem } from "@/components/widgets/AuditLogStream";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface OverviewMetrics {
  totalClaims: number;
  totalPotentialSavings: number;
  highRiskCount: number;
  verifiedCount: number;
  verificationRate: number;
}

export interface BenchmarkMetrics {
  totalCases: number;
  truePositives: number;
  trueNegatives: number;
  falsePositives: number;
  falseNegatives: number;
  precision: number;
  recall: number;
  f1Score: number;
  accuracy: number;
  verbatimVerificationRate: number;
  avgLatencyMs: number;
}

export interface BenchmarkResponse {
  metrics: BenchmarkMetrics;
  cases: any[];
}

/**
 * Fetch all claims from PostgreSQL backend with optional query filters
 */
export async function fetchClaimsFromBackend(filters?: {
  status?: string;
  risk?: string;
  hospital?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}): Promise<ClaimItem[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== "ALL") params.append("status", filters.status);
    if (filters?.risk && filters.risk !== "ALL") params.append("risk", filters.risk);
    if (filters?.hospital && filters.hospital !== "ALL") params.append("hospital_id", filters.hospital);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.sortBy) params.append("sort_by", filters.sortBy);
    if (filters?.sortOrder) params.append("sort_order", filters.sortOrder);

    const res = await fetch(`${API_BASE_URL}/claims?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Backend returned status ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn("[API] fetchClaimsFromBackend offline/fallback:", err);
    return [];
  }
}

/**
 * Fetch a single claim's full dossier including clinical documents & findings
 */
export async function fetchClaimDetailFromBackend(claimId: string): Promise<ClaimItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/claims/${encodeURIComponent(claimId)}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Backend returned status ${res.status}`);
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.warn(`[API] fetchClaimDetailFromBackend(${claimId}) offline/fallback:`, err);
    return null;
  }
}

/**
 * Update verification status of a claim in PostgreSQL
 */
export async function updateClaimStatusInBackend(
  claimId: string,
  newStatus: string,
  notes?: string
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/claims/${encodeURIComponent(claimId)}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, notes }),
    });
    return res.ok;
  } catch (err) {
    console.warn(`[API] updateClaimStatusInBackend(${claimId}) offline/fallback:`, err);
    return false;
  }
}

/**
 * Fetch append-only audit trail logs from PostgreSQL
 */
export async function fetchAuditLogsFromBackend(): Promise<AuditLogItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/audit-logs`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Backend returned status ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn("[API] fetchAuditLogsFromBackend offline/fallback:", err);
    return [];
  }
}

/**
 * Append a new audit log record to PostgreSQL
 */
export async function appendAuditLogInBackend(entry: AuditLogItem): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/audit-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    return res.ok;
  } catch (err) {
    console.warn("[API] appendAuditLogInBackend offline/fallback:", err);
    return false;
  }
}

/**
 * Fetch live triage header metrics from PostgreSQL
 */
export async function fetchOverviewMetricsFromBackend(): Promise<OverviewMetrics | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/metrics/overview`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Backend returned status ${res.status}`);
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.warn("[API] fetchOverviewMetricsFromBackend offline/fallback:", err);
    return null;
  }
}

/**
 * Fetch benchmark evaluation suite results
 */
export async function fetchBenchmarkFromBackend(): Promise<BenchmarkResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/benchmark/cases`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Backend returned status ${res.status}`);
    const json = await res.json();
    return json;
  } catch (err) {
    console.warn("[API] fetchBenchmarkFromBackend offline/fallback:", err);
    return null;
  }
}
