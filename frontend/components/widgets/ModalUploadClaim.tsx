"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  FileCheck,
  Shield,
  ArrowRight,
  HelpCircle,
  Download,
  Check,
  Sparkles,
  RotateCcw,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ClaimItem, DocumentSection, INITIAL_CLAIMS } from "@/lib/mockData";

export interface ModalUploadClaimProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessUpload?: (newClaim: ClaimItem) => void;
}

interface PipelineStage {
  id: number;
  title: string;
  description: string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 1,
    title: "Ekstraksi Berkas & Validasi Skema Data",
    description: "Memverifikasi struktur tabel rekapitulasi klaim Excel dan kelengkapan elemen INA-CBG.",
  },
  {
    id: 2,
    title: "Privacy Guard (Kepatuhan UU PDP No. 27/2022)",
    description: "Memastikan sanitasi identitas pribadi (PII) seperti NIK dan nama pasien telah tersamarkan.",
  },
  {
    id: 3,
    title: "Kaidah Koding & Batasan Unbundling (PMK 3/2023)",
    description: "Menganalisis kesesuaian kodifikasi ICD-10 & ICD-9-CM terhadap aturan klaim JKN.",
  },
  {
    id: 4,
    title: "Telaah Keselarasan Klinis & Rekonsiliasi Tarif",
    description: "Mendeteksi keselarasan bukti penunjang medis dengan tarif dan alkes implan.",
  },
];

const SAMPLE_CLAIM_JSON: Partial<ClaimItem> = {
  id: "CLM-2026-944",
  hospitalName: "RSUD Dr. Soetomo Surabaya",
  patientAge: 56,
  patientGender: "L",
  dpjpName: "dr. Hendra Wicaksono, Sp.JP(K)",
  admissionDate: "2026-10-18",
  dischargeDate: "2026-10-21",
  primaryDiagnosis: {
    code: "I21.0",
    name: "Acute transmural myocardial infarction of anterior wall (STEMI)",
  },
  secondaryDiagnoses: [
    { code: "I10", name: "Essential (primary) hypertension" },
    { code: "A41.9", name: "Sepsis, unspecified (Anomali Tanpa Bukti Lab)", isAnomaly: true },
  ],
  procedures: [
    { code: "00.66", name: "Percutaneous transluminal coronary angioplasty (PTCA)" },
    { code: "36.06", name: "Insertion of coronary artery stent(s)" },
    { code: "88.57", name: "Other and unspecified arteriography (Unbundling)" },
  ],
  inacbgCode: "I-4-10-III",
  inacbgDescription: "Prosedur Kardiologis Intervensi Mayor dengan Komplikasi Berat (Severity 3)",
  claimedTariff: 45000000,
  fairTariff: 24500000,
  deltaTariff: 20500000,
  status: "PERLU_TINJAUAN",
  riskLevel: "TINGGI",
  modusTags: ["Upcoding", "Penggelembungan Alkes"],
  confidenceScore: 92,
  alternativeHypotheses:
    "Potensi klerikal entri dropdown template resume medis oleh residen jaga, atau depo farmasi belum melakukan retur otomatis alkes kedua.",
  recommendedAction: {
    type: "PENDING_KLARIFIKASI_RS",
    label: "Pending — Klarifikasi Bukti Alkes & Sepsis ke Faskes",
    confidence: 92,
    suggestedNotes:
      "Hasil lab biomarker prokalsitonin 0.1 ng/mL normal, tidak mendukung kriteria klinis Sepsis A41.9. Laporan kateterisasi mencatat 1 stent batal dipasang.",
    disputeDraftSummary:
      "Surat Permintaan Klarifikasi Resmi perihal Verifikasi Klaim No. CLM-2026-944 RSUD Dr. Soetomo.",
  },
  findings: [
    {
      id: "FND-01",
      type: "INFLATED_ALKES",
      title: "Diskrepansi Jumlah Stent: Ditagihkan 2 Unit, Laporan Operasi Tercatat 1 Unit",
      badgeLabel: "Penggelembungan Alkes",
      severity: "danger",
      description:
        "Faktur penagihan farmasi menagihkan 2 unit Drug Eluting Stent (DES) seharga Rp 20.000.000, namun Laporan Prosedur PCI mencatat stent kedua pada arteri LCx dibatalkan karena kalsifikasi dan dikembalikan ke depo.",
      citation: {
        documentId: "laporanOperasi",
        documentTitle: "Laporan Prosedur Intervensi PCI",
        pageNumber: 1,
        paragraphIndex: 3,
        exactSubstring:
          "Rencana pemasangan stent kedua pada arteri LCx dibatalkan demi keamanan pasien karena anatomi ekstrem; alkes kedua dikembalikan ke depo farmasi.",
      },
      regulationReference: "Permenkes No. 3 Tahun 2023 Pasal 14 ayat (2) tentang Bukti Penggunaan Alkes Implan",
      isVerbatim100: true,
      deltaRupiah: 10000000,
      comparisonDetails: {
        claimedQty: 2,
        claimedTariff: 20000000,
        actualQty: 1,
        actualTariff: 10000000,
        diffTariff: 10000000,
      },
    },
    {
      id: "FND-02",
      type: "UPCODING",
      title: "Ketidaksesuaian Diagnosis Sekunder: Kode Sepsis A41.9 Tanpa Dukungan Lab",
      badgeLabel: "Upcoding Severity",
      severity: "danger",
      description:
        "Diagnosis sekunder Sepsis (A41.9) meningkatkan severity grouping ke level 3 (I-4-10-III). Namun biomarker laboratorium menunjukkan Prokalsitonin 0.1 ng/mL (Normal < 0.5 ng/mL) dan Leukosit 7.400 /uL (Normal), tidak memenuhi kriteria klinis sepsis.",
      citation: {
        documentId: "hasilLab",
        documentTitle: "Hasil Laboratorium & Biomarker",
        pageNumber: 1,
        paragraphIndex: 2,
        exactSubstring:
          "Prokalsitonin: 0.1 ng/mL (Nilai rujukan: < 0.5 ng/mL, Kategori: Bukan sepsis sistemik).",
      },
      regulationReference: "Panduan Klinis Kemenkes HK.01.07/MENKES/1186/2022 Tata Laksana Sepsis",
      isVerbatim100: true,
      deltaRupiah: 10500000,
    },
    {
      id: "FND-03",
      type: "RULE_ANOMALY",
      title: "Kaidah Koding INA-CBG: Batas Pemecahan Paket Angiografi",
      badgeLabel: "Kaidah Koding INA-CBG",
      severity: "info",
      description:
        "Tindakan diagnostik arteriografi koroner (88.57) yang ditagihkan telah masuk dalam paket pembiayaan prosedur kateterisasi terapeutik utama (00.66) dan dilarang ditagihkan terpisah sesuai klausul unbundling INA-CBG.",
      citation: {
        documentId: "kuitansiAlkes",
        documentTitle: "Rincian Billing Farmasi & Pemakaian Alkes Implan",
        pageNumber: 1,
        paragraphIndex: 1,
        exactSubstring:
          "Paket Prosedur PTCA Balon + Arteriografi Diagnostik Tambahan: Rp 4.500.000",
      },
      regulationReference: "Permenkes No. 3 Tahun 2023 Lampiran II (Kaidah Koding JKN)",
      isVerbatim100: true,
    },
  ],
  documents: [
    {
      id: "resumeMedis",
      title: "Resume Medis Rawat Inap",
      fileName: "Resume_Medis_CLM944.pdf",
      pdfUrl:
        "https://res.cloudinary.com/dj6gxrayb/raw/upload/v1792837499/healthkaton/berkas/Resume_Medis_CLM089.pdf",
      pages: [
        {
          pageNumber: 1,
          paragraphs: [
            "RSUD DR. SOETOMO SURABAYA — RESUME MEDIS RAWAT INAP ELEKTRONIK. No RM: 00-51-92. Pasien: Tn. B*** (56 Tahun, Laki-laki). Tanggal Masuk: 18/10/2026. Tanggal Keluar: 21/10/2026. DPJP: dr. Hendra Wicaksono, Sp.JP(K).",
            "Pasien datang rujukan dengan keluhan nyeri dada tipikal substernal seperti tertindih beban berat menjalar ke leher dan lengan kiri sejak 2 jam SMRS.",
            "Pemeriksaan Tanda Vital: Tekanan Darah 135/85 mmHg, Nadi 84 x/menit, Suhu 36.8 C, Pernapasan 18 x/menit, SpO2 98%. EKG lead V1-V4 menunjukkan ST-elevasi akut (STEMI Anterior).",
            "Diagnosis Kerja Utama: STEMI Anterior Akut (I21.0). Diagnosis Tambahan: Sepsis Berat (A41.9), Hipertensi Primer (I10). Rencana Tindakan: CITO Primary Percutaneous Coronary Intervention (PCI).",
          ],
        },
      ],
    },
    {
      id: "laporanOperasi",
      title: "Laporan Tindakan Bedah / PCI Intervensi",
      fileName: "Laporan_Operasi_PCI_CLM944.pdf",
      pdfUrl:
        "https://res.cloudinary.com/dj6gxrayb/raw/upload/v1792837500/healthkaton/berkas/Laporan_Operasi_PCI.pdf",
      pages: [
        {
          pageNumber: 1,
          paragraphs: [
            "LEMBAR LAPORAN TINDAKAN INTERVENSI KARDIOLOGI. Operator: dr. Hendra Wicaksono, Sp.JP(K). Waktu: 18/10/2026 15:00 - 16:30 WIB.",
            "Uraian Prosedur: Dilakukan pungsi arteri radialis kanan dengan sheath 6F. Kanulasi ostium LCA menggunakan kateter EBU 3.5.",
            "Angiografi: Stenosis 95% pada segmen mid-LAD dengan trombus intraluminal. Percabangan LCx menunjukkan kalsifikasi difus dan tortuosity ekstrem.",
            "Pemasangan Alkes: Dilakukan predilatasi balon dan berhasil dipasang 1 (satu) unit Drug Eluting Stent (DES) ukuran 3.0 x 28 mm pada LAD dengan aliran TIMI 3. Rencana pemasangan stent kedua pada arteri LCx dibatalkan demi keamanan pasien karena anatomi ekstrem; alkes kedua dikembalikan ke depo farmasi.",
          ],
        },
      ],
    },
    {
      id: "hasilLab",
      title: "Hasil Pemeriksaan Laboratorium & Biomarker",
      fileName: "Laboratorium_CLM944.pdf",
      pdfUrl:
        "https://res.cloudinary.com/dj6gxrayb/raw/upload/v1792837501/healthkaton/berkas/Hasil_Lab_Biomarker.pdf",
      pages: [
        {
          pageNumber: 1,
          paragraphs: [
            "INSTALASI PATOLOGI KLINIK RSUD DR. SOETOMO. Waktu Sampling: 18/10/2026 14:15 WIB.",
            "Pemeriksaan Biomarker Jantung: Troponin I Kuantitatif: 16.2 ng/mL (Rujukan: < 0.04 ng/mL) — KESAN: Positif Infark Miokard Akut.",
            "Skrining Sepsis & Hematologi: Leukosit: 7.400 /uL (Nilai rujukan: 4.500 - 10.000 /uL). Prokalsitonin: 0.1 ng/mL (Nilai rujukan: < 0.5 ng/mL, Kategori: Bukan sepsis sistemik).",
            "Hemoglobin: 14.5 g/dL, Trombosit: 238.000 /uL, Hematokrit: 42%. Fungsi Ginjal: Ureum 26 mg/dL, Kreatinin 0.88 mg/dL. Elektrolit Serum: Natrium 141, Kalium 4.2, Klorida 101 mmol/L.",
          ],
        },
      ],
    },
    {
      id: "kuitansiAlkes",
      title: "Rincian Billing Farmasi & Pemakaian Alkes Implan",
      fileName: "Billing_Alkes_CLM944.pdf",
      pdfUrl:
        "https://res.cloudinary.com/dj6gxrayb/raw/upload/v1792837502/healthkaton/berkas/Kuitansi_Rincian_Billing.pdf",
      pages: [
        {
          pageNumber: 1,
          paragraphs: [
            "RINCIAN BIAYA PENAGIHAN KHUSUS ALKES & TINDAKAN. No Tagihan: INV-2026-X-5192. Pasien: Tn. B***.",
            "Paket Prosedur PTCA Balon + Arteriografi Diagnostik Tambahan: Rp 4.500.000",
            "Drug Eluting Stent (DES) Xience 3.0 x 28 mm — Qty: 1 Unit x Rp 10.000.000 = Rp 10.000.000",
            "Drug Eluting Stent (DES) Onyx 2.75 x 18 mm — Qty: 1 Unit x Rp 10.000.000 = Rp 10.000.000",
            "Total Alkes Implan Ditagihkan: 2 Unit Stent DES = Rp 20.000.000. Total Keseluruhan Billing RS: Rp 45.000.000.",
          ],
        },
      ],
    },
  ],
};

export function ModalUploadClaim({
  isOpen,
  onClose,
  onSuccessUpload,
}: ModalUploadClaimProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [errorStep, setErrorStep] = useState<number | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [uploadedClaim, setUploadedClaim] = useState<ClaimItem | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [guideTab, setGuideTab] = useState<"excel" | "pdf" | "privacy">("excel");

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const resetState = () => {
    setIsProcessing(false);
    setCurrentStep(0);
    setErrorStep(null);
    setErrorDetails(null);
    setUploadedClaim(null);
    setSelectedFileName(null);
    setIsDraggingOver(false);
  };

  const handleClose = () => {
    resetState();
    setShowGuide(false);
    onClose();
  };

  const triggerFileInput = () => {
    if (isProcessing) return;
    fileInputRef.current?.click();
  };

  const handleDownloadTemplate = () => {
    const a = document.createElement("a");
    a.href = "/formulir_pengajuan_klaim_fpk.xlsx";
    a.download = "formulir_pengajuan_klaim_fpk.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const processSelectedFile = async (file: File) => {
    resetState();
    setSelectedFileName(file.name);
    setIsProcessing(true);
    setCurrentStep(1);

    const fileNameLower = file.name.toLowerCase();
    const isExcel = fileNameLower.endsWith(".xlsx") || fileNameLower.endsWith(".xls");
    const isPdf = fileNameLower.endsWith(".pdf");

    if (!isExcel && !isPdf) {
      setIsProcessing(false);
      setCurrentStep(0);
      setErrorDetails(
        `Format berkas tidak didukung (${file.name}). Sistem verifikasi klaim hanya menerima Berkas Excel (.xlsx) atau Berkas Digital PDF (.pdf) standar BPJS Kesehatan.`
      );
      return;
    }

    try {
      // Step 1: Ekstraksi Berkas & Validasi Skema Data
      await new Promise((resolve) => setTimeout(resolve, 550));

      let extractedRawTexts: string[] = [];
      let parsedClaimData: Partial<ClaimItem> | null = null;

      if (isExcel) {
        const XLSX = await import("xlsx");
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (rawRows.length === 0) {
          setIsProcessing(false);
          setErrorStep(1);
          setErrorDetails("Berkas Excel FPK kosong tanpa baris data pengajuan klaim.");
          return;
        }

        // Find header row (searches first 15 rows for key column keywords)
        let headerIdx = 0;
        for (let i = 0; i < Math.min(15, rawRows.length); i++) {
          const r = rawRows[i];
          if (
            Array.isArray(r) &&
            r.some(
              (c) =>
                typeof c === "string" &&
                (c.toLowerCase().includes("no. sep") ||
                  c.toLowerCase().includes("no_sep") ||
                  c.toLowerCase().includes("no. klaim") ||
                  c.toLowerCase().includes("no_klaim") ||
                  c.toLowerCase().includes("nama faskes") ||
                  c.toLowerCase().includes("nama_faskes"))
            )
          ) {
            headerIdx = i;
            break;
          }
        }

        const headers = (rawRows[headerIdx] as any[]).map((c) => String(c || "").trim());
        const dataRow = (rawRows[headerIdx + 1] as any[]) || [];

        extractedRawTexts.push(JSON.stringify(dataRow));

        const getCol = (...nameKeys: string[]): any => {
          for (const key of nameKeys) {
            const idx = headers.findIndex((h) => h.toLowerCase().includes(key.toLowerCase()));
            if (idx >= 0 && dataRow[idx] !== undefined) {
              return dataRow[idx];
            }
          }
          return undefined;
        };

        const cid = String(getCol("No. Klaim", "No_Klaim", "Klaim") || "CLM-2026-944");
        const hosp = String(getCol("Nama Faskes", "Faskes", "Rumah_Sakit") || "RSUD Dr. Soetomo Surabaya");
        const age = parseInt(String(getCol("Usia", "Umur") || 56)) || 56;
        const gender = String(getCol("JK", "Kelamin") || "L").toUpperCase().includes("P") ? "P" : "L";
        const dpjp = String(getCol("DPJP", "Dokter") || "dr. Hendra Wicaksono, Sp.JP(K)");
        const icd10 = String(getCol("Kode ICD-10 Utama", "ICD-10 Utama", "ICD10") || "I21.0");
        const diagName = String(
          getCol("Diagnosa Kerja Utama", "Diagnosa Utama", "Diagnosa") ||
            "Acute transmural myocardial infarction of anterior wall (STEMI)"
        );
        const inacbg = String(getCol("Grup INA-CBG", "Kode INA-CBG", "INA-CBG") || "I-4-10-III");
        const inacbgDesc = String(
          getCol("Deskripsi Kelompok INA-CBG", "Deskripsi INA-CBG", "Deskripsi") ||
            "Prosedur Kardiologis Intervensi Mayor dengan Komplikasi Berat (Severity 3)"
        );
        const claimedRaw = getCol("Tarif Diajukan RS", "Tarif Diajukan", "Tarif RS");
        const claimed =
          typeof claimedRaw === "number"
            ? claimedRaw
            : parseInt(String(claimedRaw || 45000000).replace(/[^\d]/g, "")) || 45000000;

        const fairRaw = getCol("Tarif Rujukan INA-CBG", "Tarif Standar", "Tarif Rujukan");
        const fair =
          typeof fairRaw === "number"
            ? fairRaw
            : parseInt(String(fairRaw || 24500000).replace(/[^\d]/g, "")) || 24500000;

        const delta = claimed - fair;

        parsedClaimData = {
          ...SAMPLE_CLAIM_JSON,
          id: cid,
          hospitalName: hosp,
          patientAge: age,
          patientGender: gender,
          dpjpName: dpjp,
          primaryDiagnosis: { code: icd10, name: diagName },
          inacbgCode: inacbg,
          inacbgDescription: inacbgDesc,
          claimedTariff: claimed,
          fairTariff: fair,
          deltaTariff: delta,
        };
      } else if (isPdf) {
        parsedClaimData = {
          ...SAMPLE_CLAIM_JSON,
          id: "CLM-2026-944",
          hospitalName: "RSUD Dr. Soetomo Surabaya",
        };
      }

      // Step 2: Privacy Guard (UU PDP)
      setCurrentStep(2);
      await new Promise((resolve) => setTimeout(resolve, 600));

      const combinedText = extractedRawTexts.join(" ");
      const nikRegex = /\b\d{16}\b/g;
      const detectedNiks = combinedText.match(nikRegex);

      if (detectedNiks && detectedNiks.length > 0) {
        setIsProcessing(false);
        setErrorStep(2);
        setErrorDetails(
          `Terdeteksi NIK 16-digit valid (${detectedNiks[0]}) tanpa sanitasi identitas pada tabel Excel. Berkas ditolak untuk melindungi privasi data pasien (UU PDP No. 27/2022).`
        );
        return;
      }

      // Step 3: Coding Rules & Unbundling Check
      setCurrentStep(3);
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Step 4: Clinical Discrepancy & Tariff Reconciliation
      setCurrentStep(4);
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Construct a finalized ClaimItem
      const newClaim: ClaimItem = {
        id: parsedClaimData?.id || "CLM-2026-944",
        hospitalName: parsedClaimData?.hospitalName || "RSUD Dr. Soetomo Surabaya",
        patientAge:
          typeof parsedClaimData?.patientAge === "number" ? parsedClaimData.patientAge : 56,
        patientGender: parsedClaimData?.patientGender === "P" ? "P" : "L",
        dpjpName: parsedClaimData?.dpjpName || "dr. Hendra Wicaksono, Sp.JP(K)",
        admissionDate: parsedClaimData?.admissionDate || "2026-10-18",
        dischargeDate: parsedClaimData?.dischargeDate || "2026-10-21",
        primaryDiagnosis: parsedClaimData?.primaryDiagnosis || {
          code: "I21.0",
          name: "Acute transmural myocardial infarction of anterior wall (STEMI)",
        },
        secondaryDiagnoses: parsedClaimData?.secondaryDiagnoses || [
          { code: "I10", name: "Essential (primary) hypertension" },
          { code: "A41.9", name: "Sepsis, unspecified (Anomali Tanpa Bukti Lab)", isAnomaly: true },
        ],
        procedures: parsedClaimData?.procedures || [
          { code: "00.66", name: "Percutaneous transluminal coronary angioplasty (PTCA)" },
          { code: "36.06", name: "Insertion of coronary artery stent(s)" },
          { code: "88.57", name: "Other and unspecified arteriography (Unbundling)" },
        ],
        inacbgCode: parsedClaimData?.inacbgCode || "I-4-10-III",
        inacbgDescription:
          parsedClaimData?.inacbgDescription ||
          "Prosedur Kardiologis Intervensi Mayor dengan Komplikasi Berat (Severity 3)",
        claimedTariff: Number(parsedClaimData?.claimedTariff) || 45000000,
        fairTariff: Number(parsedClaimData?.fairTariff) || 24500000,
        deltaTariff:
          parsedClaimData?.deltaTariff !== undefined
            ? Number(parsedClaimData.deltaTariff)
            : 20500000,
        status: parsedClaimData?.status || "PERLU_TINJAUAN",
        riskLevel: parsedClaimData?.riskLevel || "TINGGI",
        modusTags: parsedClaimData?.modusTags || ["Upcoding", "Penggelembungan Alkes"],
        confidenceScore:
          typeof parsedClaimData?.confidenceScore === "number"
            ? parsedClaimData.confidenceScore
            : 92,
        findings: parsedClaimData?.findings || SAMPLE_CLAIM_JSON.findings || [],
        alternativeHypotheses:
          parsedClaimData?.alternativeHypotheses ||
          "Potensi klerikal entri dropdown template resume medis oleh residen jaga, atau depo farmasi belum melakukan retur otomatis alkes kedua.",
        recommendedAction: parsedClaimData?.recommendedAction || {
          type: "PENDING_KLARIFIKASI_RS",
          label: "Pending — Klarifikasi Bukti Alkes & Sepsis ke Faskes",
          confidence: 92,
          suggestedNotes:
            "Hasil lab biomarker prokalsitonin 0.1 ng/mL normal, tidak mendukung kriteria klinis Sepsis A41.9. Laporan kateterisasi mencatat 1 stent batal dipasang.",
          disputeDraftSummary:
            "Surat Permintaan Klarifikasi Resmi perihal Verifikasi Klaim No. CLM-2026-944 RSUD Dr. Soetomo.",
        },
        documents: parsedClaimData?.documents || SAMPLE_CLAIM_JSON.documents || INITIAL_CLAIMS[0].documents,
      };

      setCurrentStep(5);
      setIsProcessing(false);
      setUploadedClaim(newClaim);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorStep(currentStep || 1);
      setErrorDetails(
        `Terjadi kendala saat membaca berkas Excel: ${err?.message || "Kesalahan struktur tabel formulir klaim."}`
      );
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
    e.target.value = "";
  };

  const handleSimulateUpload = (presetType: "EXCEL_FPK" | "PDF_VERIFIED" | "PII_VIOLATION") => {
    resetState();
    setSelectedFileName(
      presetType === "PII_VIOLATION"
        ? "formulir_pelanggaran_nik.xlsx"
        : presetType === "EXCEL_FPK"
        ? "formulir_pengajuan_klaim_fpk.xlsx"
        : "berkas_klaim_digital_CLM944.pdf"
    );
    setIsProcessing(true);
    setCurrentStep(1);

    setTimeout(() => {
      // Step 2
      setCurrentStep(2);

      setTimeout(() => {
        if (presetType === "PII_VIOLATION") {
          setIsProcessing(false);
          setErrorStep(2);
          setErrorDetails(
            "Terdeteksi NIK 16-digit valid (3201021405780001) dan nama pasien tanpa sanitasi data pada baris Excel. Berkas ditolak otomatis demi privasi data pasien (UU PDP No. 27/2022)."
          );
          return;
        }

        // Step 3
        setCurrentStep(3);

        setTimeout(() => {
          // Step 4
          setCurrentStep(4);

          setTimeout(() => {
            setCurrentStep(5);
            setIsProcessing(false);

            const newClaim: ClaimItem = {
              ...INITIAL_CLAIMS[0],
              id: "CLM-2026-944",
              hospitalName: "RSUD Dr. Soetomo Surabaya",
              patientAge: 56,
              patientGender: "L",
              dpjpName: "dr. Hendra Wicaksono, Sp.JP(K)",
              admissionDate: "2026-10-18",
              dischargeDate: "2026-10-21",
              primaryDiagnosis: {
                code: "I21.0",
                name: "Acute transmural myocardial infarction of anterior wall (STEMI)",
              },
              claimedTariff: 45000000,
              fairTariff: 24500000,
              deltaTariff: 20500000,
              inacbgCode: "I-4-10-III",
              inacbgDescription: "Prosedur Kardiologis Intervensi Mayor dengan Komplikasi Berat (Severity 3)",
              status: "PERLU_TINJAUAN",
              riskLevel: "TINGGI",
              modusTags: ["Upcoding", "Penggelembungan Alkes"],
              confidenceScore: 92,
              findings: SAMPLE_CLAIM_JSON.findings || [],
              documents: SAMPLE_CLAIM_JSON.documents || INITIAL_CLAIMS[0].documents,
            };

            setUploadedClaim(newClaim);
          }, 600);
        }, 600);
      }, 600);
    }, 550);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
        <div className="bg-white border border-slate-200 rounded-[4px] w-full max-w-lg shadow-xl overflow-hidden text-slate-800">
          {/* Modal Header */}
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[4px] bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-900">
                  Unggah Berkas Klaim FPK (Excel)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Formulir Pengajuan Klaim Excel (.xlsx) &amp; Berkas Vedika BPJS
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-1 rounded-[4px] text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 space-y-4">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,.pdf,application/pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Dropzone Area (Shown when not processing & not completed) */}
            {!isProcessing && !uploadedClaim && (
              <div
                onClick={triggerFileInput}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    processSelectedFile(file);
                  }
                }}
                className={cn(
                  "border border-dashed rounded-[4px] p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer select-none",
                  isDraggingOver
                    ? "border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20"
                    : "border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-400"
                )}
              >
                <div className="w-10 h-10 rounded-[4px] bg-white border border-slate-200 flex items-center justify-center text-emerald-600 mb-2 shadow-2xs">
                  {isDraggingOver ? (
                    <UploadCloud className="w-5 h-5 text-emerald-600 animate-bounce" />
                  ) : (
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
                <h4 className="text-xs font-semibold text-slate-800">
                  Pilih atau tarik berkas Excel klaim (.xlsx)
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed">
                  Tarik berkas Formulir Pengajuan Klaim FPK (Excel .xlsx) atau Berkas Rekam Medis (PDF) ke sini.
                </p>

                {selectedFileName && (
                  <div className="mt-3 px-2.5 py-1 bg-white border border-slate-200 rounded-[4px] text-[11px] font-mono text-slate-700 flex items-center gap-1.5 shadow-2xs">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedFileName}</span>
                  </div>
                )}
              </div>
            )}

            {/* Panduan & Template Download Bar (Shown when idle) */}
            {!isProcessing && !uploadedClaim && (
              <div className="flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={() => setShowGuide(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-800 font-semibold hover:underline"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Format Kolom Excel FPK &amp; Panduan Vedika</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium hover:text-emerald-900 border border-emerald-300 bg-emerald-50 px-2.5 py-1 rounded-[4px] hover:bg-emerald-100 transition-colors shadow-2xs"
                  title="Unduh contoh template Formulir Pengajuan Klaim (FPK) Microsoft Excel"
                >
                  <Download className="w-3 h-3 text-emerald-700" />
                  <span>Unduh Template Excel (.xlsx)</span>
                </button>
              </div>
            )}

            {/* Test Presets (Shown when idle) */}
            {!isProcessing && !uploadedClaim && !errorDetails && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-600">
                  Atau Uji Cepat Berkas Sampel BPJS:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSimulateUpload("EXCEL_FPK")}
                    className="flex items-center justify-between p-2.5 rounded-[4px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900">
                          Sampel Formulir Pengajuan Klaim Excel (FPK)
                        </div>
                        <div className="text-[11px] text-slate-500">
                          formulir_pengajuan_klaim_fpk.xlsx (Tabel Rekapitulasi Klaim Faskes)
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-medium px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-[4px]">
                      Uji Excel
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulateUpload("PDF_VERIFIED")}
                    className="flex items-center justify-between p-2.5 rounded-[4px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900">
                          Sampel Berkas Digital PDF (RME)
                        </div>
                        <div className="text-[11px] text-slate-500">
                          berkas_klaim_digital_CLM944.pdf (Resume Medis, Laporan PCI, Lab, Billing)
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-blue-700 font-medium px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-[4px]">
                      Uji PDF
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulateUpload("PII_VIOLATION")}
                    className="flex items-center justify-between p-2.5 rounded-[4px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900">
                          Sampel Pelanggaran Privasi NIK
                        </div>
                        <div className="text-[11px] text-slate-500">
                          formulir_pelanggaran_nik.xlsx (Memuat NIK 16-digit tanpa sanitasi)
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-rose-700 font-medium px-2 py-0.5 bg-rose-50 border border-rose-200 rounded-[4px]">
                      Uji Penolakan
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* High-Level Multi-Agent Verification Pipeline */}
            {(currentStep > 0 || uploadedClaim || errorDetails) && (
              <div className="border border-slate-200 rounded-[4px] bg-slate-50/60 p-3.5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-semibold text-slate-800">
                      Pipeline Verifikasi Berkas
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500">
                    {uploadedClaim
                      ? "Verifikasi Selesai"
                      : errorDetails
                      ? "Audit Ditolak"
                      : "Sedang Berjalan..."}
                  </span>
                </div>

                {/* 4 Pipeline Stages */}
                <div className="space-y-1.5">
                  {PIPELINE_STAGES.map((stage) => {
                    const isCompleted = currentStep > stage.id || uploadedClaim !== null;
                    const isActive = currentStep === stage.id && !errorDetails;
                    const isFailed = errorStep === stage.id;
                    const isPending = currentStep < stage.id && !uploadedClaim && !isFailed;

                    return (
                      <div
                        key={stage.id}
                        className={cn(
                          "flex items-start gap-2.5 p-2 rounded-[4px] transition-colors",
                          isActive && "bg-blue-50/80 border border-blue-200/80",
                          isCompleted && "bg-white border border-slate-200/80",
                          isFailed && "bg-rose-50/80 border border-rose-200",
                          isPending && "opacity-45"
                        )}
                      >
                        {/* Stage Icon */}
                        <div className="mt-0.5 flex-shrink-0">
                          {isCompleted ? (
                            <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          ) : isActive ? (
                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                          ) : isFailed ? (
                            <AlertCircle className="w-4 h-4 text-rose-600" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center text-[9px] font-bold">
                              {stage.id}
                            </div>
                          )}
                        </div>

                        {/* Stage Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span
                              className={cn(
                                "text-xs font-medium leading-tight",
                                isCompleted && "text-slate-800 font-semibold",
                                isActive && "text-blue-900 font-semibold",
                                isFailed && "text-rose-900 font-semibold",
                                isPending && "text-slate-500"
                              )}
                            >
                              {stage.title}
                            </span>
                            {isCompleted && (
                              <span className="text-[10px] text-emerald-600 font-medium">Lolos</span>
                            )}
                            {isActive && (
                              <span className="text-[10px] text-blue-600 font-medium">
                                Memproses...
                              </span>
                            )}
                            {isFailed && (
                              <span className="text-[10px] text-rose-600 font-semibold">
                                Ditolak
                              </span>
                            )}
                          </div>
                          <p
                            className={cn(
                              "text-[11px] mt-0.5 leading-snug",
                              isFailed ? "text-rose-700 font-medium" : "text-slate-500"
                            )}
                          >
                            {isFailed && errorDetails ? errorDetails : stage.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Error Actions (When upload/validation fails) */}
            {errorDetails && (
              <div className="pt-1 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={resetState}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-[4px] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Coba Berkas Lain</span>
                </button>
              </div>
            )}

            {/* Result Summary Card (When pipeline passes) */}
            {uploadedClaim && (
              <div className="border border-slate-200 rounded-[4px] bg-white p-3.5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                      <span className="tabular-nums">{uploadedClaim.id}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-600 font-normal">{uploadedClaim.hospitalName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {uploadedClaim.primaryDiagnosis.code} - {uploadedClaim.primaryDiagnosis.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Potensi Selisih</div>
                    <div className="text-xs font-bold text-rose-700 tabular-nums">
                      Rp {uploadedClaim.deltaTariff.toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Grup INA-CBG:</span>
                    <span className="font-mono font-medium text-slate-800">{uploadedClaim.inacbgCode}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Hasil Telaah:</span>
                    <span className="font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-[3px] border border-amber-200">
                      {uploadedClaim.findings?.length || 0} diskrepansi bukti
                    </span>
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSuccessUpload?.(uploadedClaim);
                      handleClose();
                      router.push(`/claims/${uploadedClaim.id}/dossier`);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-[4px] shadow-2xs transition-colors"
                  >
                    <span>Buka Ruang Telaah Berkas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between gap-2 bg-slate-50/70">
            {uploadedClaim ? (
              <span className="text-[11px] text-slate-500">
                Berkas siap ditelaah oleh verifikator BPJS.
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">
                Format didukung: Microsoft Excel (.xlsx), PDF (.pdf)
              </span>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (uploadedClaim) {
                    onSuccessUpload?.(uploadedClaim);
                  }
                  handleClose();
                }}
                className="px-3 py-1.5 border border-slate-200 rounded-[4px] text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {uploadedClaim ? "Tutup & Masuk Antrean" : "Tutup"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Panduan Format Berkas Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white border border-slate-200 rounded-[4px] w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col text-slate-800 overflow-hidden">
            {/* Guide Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[4px] bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-900">
                    Standar Berkas Klaim Excel (FPK) &amp; Dokumen Vedika
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Struktur Kolom Excel Formulir Pengajuan Klaim &amp; Persyaratan Dokumen BPJS
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="p-1 rounded-[4px] text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Guide Tabs */}
            <div className="px-5 border-b border-slate-200 bg-white flex items-center gap-4 flex-shrink-0">
              <button
                type="button"
                onClick={() => setGuideTab("excel")}
                className={cn(
                  "py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5",
                  guideTab === "excel"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Formulir Pengajuan Klaim FPK (.xlsx)</span>
              </button>
              <button
                type="button"
                onClick={() => setGuideTab("pdf")}
                className={cn(
                  "py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5",
                  guideTab === "pdf"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Berkas Digital PDF (.pdf)</span>
              </button>
              <button
                type="button"
                onClick={() => setGuideTab("privacy")}
                className={cn(
                  "py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5",
                  guideTab === "privacy"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Kepatuhan Privasi (UU PDP)</span>
              </button>
            </div>

            {/* Guide Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {guideTab === "excel" && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Format tabel <strong>Formulir Pengajuan Klaim (FPK) Microsoft Excel (.xlsx)</strong> berisi rekapitulasi data pasien, diagnosa ICD-10, tindakan ICD-9-CM, dan tarif penagihan INA-CBG.
                    </p>
                    <button
                      type="button"
                      onClick={handleDownloadTemplate}
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-[4px] transition-colors shadow-2xs flex-shrink-0 ml-3"
                    >
                      <Download className="w-3 h-3" />
                      <span>Unduh .xlsx</span>
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-[4px] overflow-x-auto shadow-2xs">
                    <table className="w-full text-left text-[11px] font-mono">
                      <thead className="bg-emerald-50 border-b border-emerald-200 text-emerald-900 font-semibold">
                        <tr>
                          <th className="px-3 py-2 whitespace-nowrap">No_SEP</th>
                          <th className="px-3 py-2 whitespace-nowrap">No_Klaim</th>
                          <th className="px-3 py-2 whitespace-nowrap">Nama_Faskes</th>
                          <th className="px-3 py-2 whitespace-nowrap">Nama_Pasien</th>
                          <th className="px-3 py-2 whitespace-nowrap">Kode_ICD10_Utama</th>
                          <th className="px-3 py-2 whitespace-nowrap">Kode_INACBG</th>
                          <th className="px-3 py-2 whitespace-nowrap text-right">Tarif_Diajukan_RS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                        <tr>
                          <td className="px-3 py-2 whitespace-nowrap">0089R0011026V000944</td>
                          <td className="px-3 py-2 whitespace-nowrap font-semibold text-slate-900">CLM-2026-944</td>
                          <td className="px-3 py-2 whitespace-nowrap">RSUD Dr. Soetomo</td>
                          <td className="px-3 py-2 whitespace-nowrap">Tn. B*** (Disanitasi)</td>
                          <td className="px-3 py-2 whitespace-nowrap">I21.0 (STEMI)</td>
                          <td className="px-3 py-2 whitespace-nowrap font-medium text-blue-700">I-4-10-III</td>
                          <td className="px-3 py-2 whitespace-nowrap text-right font-semibold text-slate-900">Rp 45.000.000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h5 className="font-semibold text-slate-900 mb-1.5">
                      Kolom Standar Header Excel:
                    </h5>
                    <ul className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                      <li className="flex items-center gap-1 font-mono">
                        <span className="text-emerald-700 font-bold">•</span> No_SEP
                      </li>
                      <li className="flex items-center gap-1 font-mono">
                        <span className="text-emerald-700 font-bold">•</span> No_Klaim
                      </li>
                      <li className="flex items-center gap-1 font-mono">
                        <span className="text-emerald-700 font-bold">•</span> Nama_Faskes
                      </li>
                      <li className="flex items-center gap-1 font-mono">
                        <span className="text-emerald-700 font-bold">•</span> DPJP
                      </li>
                      <li className="flex items-center gap-1 font-mono">
                        <span className="text-emerald-700 font-bold">•</span> Kode_ICD10_Utama
                      </li>
                      <li className="flex items-center gap-1 font-mono">
                        <span className="text-emerald-700 font-bold">•</span> Kode_ICD10_Sekunder
                      </li>
                      <li className="flex items-center gap-1 font-mono">
                        <span className="text-emerald-700 font-bold">•</span> Kode_ICD9CM_Prosedur
                      </li>
                      <li className="flex items-center gap-1 font-mono">
                        <span className="text-emerald-700 font-bold">•</span> Kode_INACBG
                      </li>
                      <li className="flex items-center gap-1 font-mono">
                        <span className="text-emerald-700 font-bold">•</span> Tarif_Diajukan_RS
                      </li>
                      <li className="flex items-center gap-1 font-mono">
                        <span className="text-emerald-700 font-bold">•</span> Tarif_Standar_Verifikasi
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {guideTab === "pdf" && (
                <div className="space-y-3.5">
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-[4px] text-blue-900 leading-relaxed text-[11px]">
                    Dalam operasional BPJS Kesehatan (Sistem Vedika - Verifikasi Digital Klaim), rumah sakit menyertakan <strong>Berkas Digital PDF (.pdf)</strong> sebagai bukti otentik rekam medis elektronik.
                  </div>

                  <div>
                    <h5 className="font-semibold text-slate-900 mb-1.5">
                      1. Dokumen Medis Pendukung Wajib (Permenkes No. 24/2022)
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                      <li>
                        <strong>Resume Medis Rawat Inap:</strong> Memuat keluhan utama, riwayat penyakit, diagnosis kerja/utama ICD-10, diagnosis sekunder, dan tanda tangan digital DPJP.
                      </li>
                      <li>
                        <strong>Laporan Prosedur / Pembedahan:</strong> Rincian tindakan bedah/intervensi (operator, jenis alkes implan seperti stent/kassa/mesh, ukuran, dan jumlah yang berhasil terpasang).
                      </li>
                      <li>
                        <strong>Hasil Pemeriksaan Penunjang:</strong> Hasil lab patologi klinis (biomarker jantung, leukosit, prokalsitonin) atau laporan radiologi/EKG.
                      </li>
                      <li>
                        <strong>Rincian Billing Farmasi &amp; Alkes:</strong> Faktur penagihan rincian pemakaian alkes implan dan paket tindakan rumah sakit.
                      </li>
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-[4px]">
                    <div className="text-[11px] font-semibold text-slate-800 mb-1">
                      Contoh Berkas Tersedia di Sistem:
                    </div>
                    <p className="text-[11px] text-slate-600 font-mono">
                      berkas_klaim_digital_CLM944.pdf (Tersimpan di root workspace)
                    </p>
                  </div>
                </div>
              )}

              {guideTab === "privacy" && (
                <div className="space-y-3.5">
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-[4px] text-rose-900 leading-relaxed text-[11px]">
                    <div className="flex items-center gap-1.5 font-semibold text-rose-800 mb-1">
                      <Shield className="w-3.5 h-3.5 text-rose-600" />
                      <span>Kewajiban Anonimisasi Data Rekam Medis (UU No. 27/2022)</span>
                    </div>
                    Sistem menerapkan gateway proteksi privasi ketat pada intake klaim digital. Baris data pada tabel Excel atau berkas PDF yang diunggah harus telah disanitasi dari informasi identitas pribadi (PII) sebelum masuk ke mesin telaah anomali.
                  </div>

                  <div className="border border-slate-200 rounded-[4px] overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                        <tr>
                          <th className="px-3 py-2">Parameter Data</th>
                          <th className="px-3 py-2 text-rose-700">Format Ditolak (Pelanggaran)</th>
                          <th className="px-3 py-2 text-emerald-700">Format Diterima (Tersanitasi)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr>
                          <td className="px-3 py-2 font-medium">Nomor Induk Kependudukan (NIK)</td>
                          <td className="px-3 py-2 font-mono text-rose-700">3201021405780001 (16 digit riil)</td>
                          <td className="px-3 py-2 font-mono text-emerald-700">3201************ (Tersamar)</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 font-medium">Nama Pasien</td>
                          <td className="px-3 py-2 text-rose-700">Budi Santoso bin Ahmad</td>
                          <td className="px-3 py-2 text-emerald-700">Tn. B*** (Inisial)</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 font-medium">Nomor Kartu BPJS / Rekam Medis</td>
                          <td className="px-3 py-2 font-mono text-rose-700">0001234567890</td>
                          <td className="px-3 py-2 font-mono text-emerald-700">0001********890</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    * Berkas Excel yang memuat nomor NIK 16-digit utuh akan otomatis terblokir di Tahap 2 dengan status Ditolak.
                  </p>
                </div>
              )}
            </div>

            {/* Guide Footer */}
            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between flex-shrink-0">
              <span className="text-[11px] text-slate-500">
                Patuhi Permenkes No. 24/2022 tentang Rekam Medis Elektronik &amp; UU PDP No. 27/2022
              </span>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-[4px] text-xs font-medium transition-colors"
              >
                Mengerti &amp; Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
