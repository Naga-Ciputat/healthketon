export type DocumentTypeId =
  | "resumeMedis"
  | "laporanOperasi"
  | "hasilLab"
  | "kuitansiAlkes"
  | "cpptKeperawatan";

export interface CitationLocation {
  documentId: DocumentTypeId;
  documentTitle: string;
  pageNumber: number;
  paragraphIndex: number;
  exactSubstring: string;
}

export type AnomalyType =
  | "RULE_ANOMALY"
  | "UPCODING"
  | "INFLATED_ALKES"
  | "NOTE_CLONING";

export interface FindingItem {
  id: string;
  type: AnomalyType;
  title: string;
  badgeLabel: string;
  severity: "danger" | "warning" | "info";
  description: string;
  citation: CitationLocation;
  regulationReference?: string;
  isVerbatim100: boolean;
  deltaRupiah?: number;
  comparisonDetails?: {
    claimedQty?: number;
    claimedTariff?: number;
    actualQty?: number;
    actualTariff?: number;
    diffTariff?: number;
    donorClaimId?: string;
    donorDate?: string;
    similarityScore?: number;
    donorText?: string;
    currentText?: string;
  };
}

export interface DocumentPage {
  pageNumber: number;
  paragraphs: string[];
}

export interface DocumentSection {
  id: DocumentTypeId;
  title: string;
  fileName: string;
  pdfUrl?: string;
  pages: DocumentPage[];
}
