import { ClaimVerificationStatus } from "./claim";

export interface AuditTrailItem {
  id: string;
  claimId: string;
  hospitalName: string;
  verifierName: string;
  timestamp: string;
  action: ClaimVerificationStatus;
  finalTariff: number;
  savedDeltaRupiah: number;
  notes: string;
  officialLetterNumber?: string;
  letterDraft?: string;
}
