export type BenchmarkAnomalyLabel =
  | "UPCODING_SEPSIS"
  | "INFLATED_STENT"
  | "NOTE_CLONING"
  | "CLEAN_CLAIM"
  | "UNBUNDLING_PROC";

export type BenchmarkResultClassification =
  | "TRUE_POSITIVE"
  | "TRUE_NEGATIVE"
  | "FALSE_POSITIVE"
  | "FALSE_NEGATIVE";

export interface BenchmarkCaseResult {
  id: string;
  label: BenchmarkAnomalyLabel;
  claimId: string;
  hospital: string;
  expectedAnomaly: boolean;
  detectedAnomaly: boolean;
  verbatimVerified: boolean;
  processingTimeMs: number;
  resultStatus: BenchmarkResultClassification;
  detectedModus: string;
}

export interface BenchmarkMetricsSummary {
  totalCases: number;
  recallAnomaly: number; // target >= 85%
  falsePositiveRate: number; // target <= 15%
  verbatimGroundingRate: number; // target 100%
  averageProcessingTimeMs: number; // target < 60,000ms
}
