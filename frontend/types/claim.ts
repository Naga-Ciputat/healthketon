import { FindingItem, DocumentSection } from "./evidence";

export type RiskLevel = "TINGGI" | "SEDANG" | "RENDAH";

export type ClaimVerificationStatus =
  | "PERLU_TINJAUAN"
  | "PENDING_KLARIFIKASI_RS"
  | "DOWNCODE_DIUSULKAN"
  | "DISETUJUI"
  | "SIAP_BAYAR"
  | "ESKALASI_PK_JKN";

export interface ClaimDiagnosis {
  code: string;
  name: string;
  isAnomaly?: boolean;
}

export interface ClaimProcedure {
  code: string;
  name: string;
}

export interface ClaimRecord {
  id: string; // misal "CLM-2026-089"
  hospitalId?: string;
  hospitalName: string;
  patientSyntheticId?: string;
  patientAge: number;
  patientGender: "L" | "P";
  dpjpName: string;
  admissionDate: string;
  dischargeDate: string;
  primaryDiagnosis: ClaimDiagnosis;
  secondaryDiagnoses: ClaimDiagnosis[];
  procedures: ClaimProcedure[];
  inacbgCode: string;
  inacbgDescription: string;
  claimedTariff: number;
  fairTariff: number;
  deltaTariff: number;
  status: ClaimVerificationStatus;
  riskLevel: RiskLevel;
  priorityScore?: number;
  modusTags: string[];
  confidenceScore: number;
  findings: FindingItem[];
  alternativeHypotheses: string;
  recommendedAction: {
    type: ClaimVerificationStatus;
    label: string;
    confidence: number;
    suggestedNotes: string;
    disputeDraftSummary: string;
  };
  documents: DocumentSection[];
}
