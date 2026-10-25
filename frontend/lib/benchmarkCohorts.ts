import { BenchmarkCaseResult } from "@/lib/mockData";

export interface BenchmarkCohort {
  id: string;
  title: string;
  specialization: string;
  hospitalName: string;
  badge: string;
  description: string;
  focusModus: string[];
  caseCount: number;
  anomalyCount: number;
  cleanCount: number;
  estimatedDuration?: string;
  cases: BenchmarkCaseResult[];
}

// 1. Kluster RS Sejahtera Medika (Bedah & Kardiologi - Alkes)
const SEJAHTERA_CASES: BenchmarkCaseResult[] = [
  {
    id: "BM-SEJ-01",
    label: "INFLATED_STENT",
    claimId: "SYN-SEJ-001",
    hospital: "RS Sejahtera Medika",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1420,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Tagihan 2 Stent DES vs 1 Terpasang di Lap. Operasi",
  },
  {
    id: "BM-SEJ-02",
    label: "UPCODING_SEPSIS",
    claimId: "SYN-SEJ-002",
    hospital: "RS Sejahtera Medika",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1380,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Sepsis A41.9 Tanpa Kriteria Lab & Prokalsitonin",
  },
  {
    id: "BM-SEJ-03",
    label: "CLEAN_CLAIM",
    claimId: "SYN-SEJ-003",
    hospital: "RS Sejahtera Medika",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 910,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Klaim Bersih PCI 1 Stent Tervalidasi Lengkap",
  },
  {
    id: "BM-SEJ-04",
    label: "UNBUNDLING_PROC",
    claimId: "SYN-SEJ-004",
    hospital: "RS Sejahtera Medika",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1150,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Unbundling Kateterisasi Jantung dalam Paket PCI",
  },
  {
    id: "BM-SEJ-05",
    label: "INFLATED_STENT",
    claimId: "SYN-SEJ-005",
    hospital: "RS Sejahtera Medika",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1540,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Tagihan Mesh Hernia Ganda vs 1 di Laporan Bedah",
  },
  {
    id: "BM-SEJ-06",
    label: "CLEAN_CLAIM",
    claimId: "SYN-SEJ-006",
    hospital: "RS Sejahtera Medika",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 880,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Klaim Bersih Bedah Laparoskopi Kolesistektomi",
  },
  {
    id: "BM-SEJ-07",
    label: "UPCODING_SEPSIS",
    claimId: "SYN-SEJ-007",
    hospital: "RS Sejahtera Medika",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1460,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Diagnosa Komplikasi Sepsis Tanpa Bukti Kultur",
  },
  {
    id: "BM-SEJ-08",
    label: "CLEAN_CLAIM",
    claimId: "SYN-SEJ-008",
    hospital: "RS Sejahtera Medika",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 940,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Klaim Bersih Rawat Inap Kardiovaskular Terverifikasi",
  },
  {
    id: "BM-SEJ-09",
    label: "UNBUNDLING_PROC",
    claimId: "SYN-SEJ-009",
    hospital: "RS Sejahtera Medika",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1210,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Pemisahan Klaim Kuitansi Obat Injeksi Kamar Bedah",
  },
  {
    id: "BM-SEJ-10",
    label: "CLEAN_CLAIM",
    claimId: "SYN-SEJ-010",
    hospital: "RS Sejahtera Medika",
    expectedAnomaly: false,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1310,
    resultStatus: "FALSE_POSITIVE",
    detectedModus: "Klaim Wajar Tertandai Curiga Alkes (FPR Test)",
  },
];

// 2. Kluster RS Mitra Sehat (Neurologi & Severity Upcoding)
const MITRA_CASES: BenchmarkCaseResult[] = [
  {
    id: "BM-MIT-01",
    label: "UPCODING_SEPSIS",
    claimId: "SYN-MIT-001",
    hospital: "RS Mitra Sehat",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1350,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Severity Upcoding G-4-14-II ke G-4-14-I (Downcode)",
  },
  {
    id: "BM-MIT-02",
    label: "CLEAN_CLAIM",
    claimId: "SYN-MIT-002",
    hospital: "RS Mitra Sehat",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 890,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Klaim Bersih Stroke Iskemik Kronis Wajar",
  },
  {
    id: "BM-MIT-03",
    label: "UPCODING_SEPSIS",
    claimId: "SYN-MIT-003",
    hospital: "RS Mitra Sehat",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1420,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Ensefalopati Sekunder Tanpa Penurunan Kesadaran GCS",
  },
  {
    id: "BM-MIT-04",
    label: "CLEAN_CLAIM",
    claimId: "SYN-MIT-004",
    hospital: "RS Mitra Sehat",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 910,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Klaim Bersih Perawatan Neurologi Akut Valid",
  },
  {
    id: "BM-MIT-05",
    label: "UNBUNDLING_PROC",
    claimId: "SYN-MIT-005",
    hospital: "RS Mitra Sehat",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1190,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Unbundling Biaya Fisioterapi Pasca-Stroke",
  },
  {
    id: "BM-MIT-06",
    label: "UPCODING_SEPSIS",
    claimId: "SYN-MIT-006",
    hospital: "RS Mitra Sehat",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1480,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Klaim Pneumonia Berat Tanpa Bukti Rontgen Toraks",
  },
  {
    id: "BM-MIT-07",
    label: "CLEAN_CLAIM",
    claimId: "SYN-MIT-007",
    hospital: "RS Mitra Sehat",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 860,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Klaim Bersih Cephalea & Rawat Inap Observasi",
  },
  {
    id: "BM-MIT-08",
    label: "UPCODING_SEPSIS",
    claimId: "SYN-MIT-008",
    hospital: "RS Mitra Sehat",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1390,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Penambahan Komplikasi Hipokalemia Ringan Menjadi Berat",
  },
  {
    id: "BM-MIT-09",
    label: "CLEAN_CLAIM",
    claimId: "SYN-MIT-009",
    hospital: "RS Mitra Sehat",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 930,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Klaim Bersih Terverifikasi 100% Sesuai PNPK",
  },
  {
    id: "BM-MIT-10",
    label: "UPCODING_SEPSIS",
    claimId: "SYN-MIT-010",
    hospital: "RS Mitra Sehat",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1260,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Ketidaksesuaian Resume Medis vs Kriteria INA-CBG",
  },
];

// 3. Kluster RS Sentosa Kasih (Fraud Semantik & Note Cloning)
const SENTOSA_CASES: BenchmarkCaseResult[] = [
  {
    id: "BM-SEN-01",
    label: "NOTE_CLONING",
    claimId: "SYN-SEN-001",
    hospital: "RS Sentosa Kasih",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1840,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Duplikasi Redaksional CPPT Harfiah (96% Kemiripan)",
  },
  {
    id: "BM-SEN-02",
    label: "NOTE_CLONING",
    claimId: "SYN-SEN-002",
    hospital: "RS Sentosa Kasih",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1790,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Duplikasi Catatan SOAP Antar-Pasien Beda SEP",
  },
  {
    id: "BM-SEN-03",
    label: "CLEAN_CLAIM",
    claimId: "SYN-SEN-003",
    hospital: "RS Sentosa Kasih",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 910,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Klaim Bersih Rawat Jalan Spesialis Tervalidasi",
  },
  {
    id: "BM-SEN-04",
    label: "NOTE_CLONING",
    claimId: "SYN-SEN-004",
    hospital: "RS Sentosa Kasih",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1920,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Penyalinan Narasi Laporan Operasi Minor Massal",
  },
  {
    id: "BM-SEN-05",
    label: "CLEAN_CLAIM",
    claimId: "SYN-SEN-005",
    hospital: "RS Sentosa Kasih",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 880,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Klaim Bersih Tindakan Hemodialisa Reguler",
  },
  {
    id: "BM-SEN-06",
    label: "NOTE_CLONING",
    claimId: "SYN-SEN-006",
    hospital: "RS Sentosa Kasih",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1810,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Kemiripan Vektor Cosine 94% dengan Berkas Donor",
  },
  {
    id: "BM-SEN-07",
    label: "CLEAN_CLAIM",
    claimId: "SYN-SEN-007",
    hospital: "RS Sentosa Kasih",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 950,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Klaim Bersih Rawat Inap Anak Demam Berdarah",
  },
  {
    id: "BM-SEN-08",
    label: "NOTE_CLONING",
    claimId: "SYN-SEN-008",
    hospital: "RS Sentosa Kasih",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1770,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Template CPPT Berulang Tanpa Modifikasi Tanda Vital",
  },
  {
    id: "BM-SEN-09",
    label: "CLEAN_CLAIM",
    claimId: "SYN-SEN-009",
    hospital: "RS Sentosa Kasih",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 920,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Klaim Bersih Persalinan Normal Pervaginam",
  },
  {
    id: "BM-SEN-10",
    label: "CLEAN_CLAIM",
    claimId: "SYN-SEN-010",
    hospital: "RS Sentosa Kasih",
    expectedAnomaly: false,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1410,
    resultStatus: "FALSE_POSITIVE",
    detectedModus: "Frasa Medis Standar Tertandai Kemiripan (FPR Test)",
  },
];

// 4. Multi-Center Golden Dataset BPJS (30 Kasus Standar Nasional)
const MULTI_CENTER_CASES: BenchmarkCaseResult[] = [
  ...SEJAHTERA_CASES,
  ...MITRA_CASES,
  ...SENTOSA_CASES,
];

export const BENCHMARK_COHORTS: BenchmarkCohort[] = [
  {
    id: "RS_SEJAHTERA",
    title: "Kluster RS Sejahtera Medika",
    specialization: "Kasus Bedah Mayor, Kardiologi & Alkes Implan",
    hospitalName: "RS Sejahtera Medika (Jakarta Pusat)",
    badge: "Bedah & Alkes",
    description:
      "Validasi pencocokan kuitansi implan stent/mesh dengan narasi laporan operasi bedah serta kriteria sepsis objektif di wilayah DKI Jakarta.",
    focusModus: ["Inflated Stent", "Upcoding Sepsis", "Unbundling Tindakan"],
    caseCount: 10,
    anomalyCount: 6,
    cleanCount: 4,
    cases: SEJAHTERA_CASES,
  },
  {
    id: "RS_MITRA",
    title: "Kluster RS Mitra Sehat",
    specialization: "Kasus Rawat Inap, Neurologi & Severity Level",
    hospitalName: "RS Mitra Sehat (Tangerang Selatan)",
    badge: "Severity Upcoding",
    description:
      "Validasi deteksi inflasi tingkat keparahan severity level (G-4-14-II ke I) pada diagnosis sekunder tanpa bukti CPPT di wilayah Banten/Tangsel.",
    focusModus: ["Severity Upcoding", "Kaidah Koding", "Unbundling Pasca-Rawat"],
    caseCount: 10,
    anomalyCount: 6,
    cleanCount: 4,
    cases: MITRA_CASES,
  },
  {
    id: "RS_SENTOSA",
    title: "Kluster RS Sentosa Kasih",
    specialization: "Deteksi Fraud Semantik & Duplikasi Catatan Medis",
    hospitalName: "RS Sentosa Kasih (Kota Depok)",
    badge: "Note Cloning",
    description:
      "Validasi penapisan kesamaan teks semantik (>90%) rekam medis CPPT antar-pasien guna mendeteksi kecurangan duplikasi di koridor Depok-Jawa Barat.",
    focusModus: ["Note Cloning SOAP", "Template CPPT Massal", "Vektor Semantik"],
    caseCount: 10,
    anomalyCount: 6,
    cleanCount: 4,
    cases: SENTOSA_CASES,
  },
  {
    id: "MULTI_CENTER_BPJS",
    title: "Evaluasi Aglomerasi Jabodetabek (Multi-Faskes)",
    specialization: "Golden Dataset 30 Kasus Faskes Wilayah Jabodetabek",
    hospitalName: "Aglomerasi Jabodetabek (Seluruh Faskes Mitra)",
    badge: "Jabodetabek 30 Kasus",
    description:
      "Pengujian evaluasi komprehensif mencakup seluruh rumah sakit rujukan Jabodetabek (DKI Jakarta, Tangerang, Depok, dan faskes penyangga).",
    focusModus: ["Alkes Implan", "Severity Inflation", "Note Cloning", "Unbundling"],
    caseCount: 30,
    anomalyCount: 18,
    cleanCount: 12,
    cases: MULTI_CENTER_CASES,
  },
];

export const ALL_BENCHMARK_CASES = MULTI_CENTER_CASES;

export function getCohortById(cohortId?: string | null): BenchmarkCohort {
  if (!cohortId) return BENCHMARK_COHORTS[0];
  const found = BENCHMARK_COHORTS.find((c) => c.id.toLowerCase() === cohortId.toLowerCase());
  return found || BENCHMARK_COHORTS[0];
}

export function createCustomCohort(
  hospitalFilter: string,
  selectedModus: string[],
  targetRecall: number = 85,
  targetFpr: number = 15
): BenchmarkCohort {
  let filtered = [...MULTI_CENTER_CASES];

  if (hospitalFilter && hospitalFilter !== "ALL") {
    filtered = filtered.filter((c) =>
      c.hospital.toLowerCase().includes(hospitalFilter.toLowerCase())
    );
  }

  if (selectedModus && selectedModus.length > 0) {
    filtered = filtered.filter(
      (c) =>
        c.label === "CLEAN_CLAIM" ||
        selectedModus.some((m) => c.label.toLowerCase().includes(m.toLowerCase()))
    );
  }

  // Ensure at least some cases exist
  if (filtered.length === 0) {
    filtered = MULTI_CENTER_CASES.slice(0, 10);
  }

  const anomalyCount = filtered.filter((c) => c.expectedAnomaly).length;
  const cleanCount = filtered.filter((c) => !c.expectedAnomaly).length;

  return {
    id: "CUSTOM",
    title: "Uji Custom Parameter Terpilih",
    specialization:
      hospitalFilter !== "ALL"
        ? `Faskes: ${hospitalFilter}`
        : "Kluster Terpilih (Custom)",
    hospitalName: hospitalFilter !== "ALL" ? hospitalFilter : "Multi-Faskes Terpilih",
    badge: "Custom",
    description: `Pengujian parameter custom dengan ambang batas target recall ${targetRecall}% dan toleransi FPR maks. ${targetFpr}%.`,
    focusModus: selectedModus.length > 0 ? selectedModus : ["Seluruh Modus"],
    caseCount: filtered.length,
    anomalyCount,
    cleanCount,
    cases: filtered,
  };
}
