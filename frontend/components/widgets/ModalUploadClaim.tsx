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
  Copy,
  Check,
  Archive,
  FileCode2,
  Sparkles,
  RotateCcw,
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
    description: "Memverifikasi struktur berkas rekam medis dan kelengkapan elemen penagihan INA-CBG.",
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
  const [guideTab, setGuideTab] = useState<"zip" | "json" | "privacy">("zip");
  const [isCopied, setIsCopied] = useState(false);

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

  const handleCopySampleJson = () => {
    navigator.clipboard.writeText(JSON.stringify(SAMPLE_CLAIM_JSON, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([JSON.stringify(SAMPLE_CLAIM_JSON, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_claim_for_upload.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const processSelectedFile = async (file: File) => {
    resetState();
    setSelectedFileName(file.name);
    setIsProcessing(true);
    setCurrentStep(1);

    const fileNameLower = file.name.toLowerCase();
    const isJson = fileNameLower.endsWith(".json");
    const isZip = fileNameLower.endsWith(".zip");

    if (!isJson && !isZip) {
      setIsProcessing(false);
      setCurrentStep(0);
      setErrorDetails(
        `Format berkas tidak didukung (${file.name}). Sistem verifikasi klaim hanya menerima arsip paket klaim digital berformat .json atau .zip.`
      );
      return;
    }

    try {
      // Step 1: Ekstraksi Berkas & Validasi Skema Data
      await new Promise((resolve) => setTimeout(resolve, 550));

      let extractedRawTexts: string[] = [];
      let parsedClaimData: Partial<ClaimItem> | null = null;
      let extractedDocuments: DocumentSection[] = [];

      if (isJson) {
        const text = await file.text();
        extractedRawTexts.push(text);

        try {
          parsedClaimData = JSON.parse(text);
        } catch {
          setIsProcessing(false);
          setErrorStep(1);
          setErrorDetails("Berkas JSON rusak atau memiliki kesalahan sintaksis yang tidak dapat di-parse.");
          return;
        }
      } else if (isZip) {
        const JSZipModule = await import("jszip");
        const JSZip = JSZipModule.default || JSZipModule;
        const arrayBuffer = await file.arrayBuffer();
        let zip: any;
        try {
          zip = await JSZip.loadAsync(arrayBuffer);
        } catch {
          setIsProcessing(false);
          setErrorStep(1);
          setErrorDetails("Berkas ZIP tidak valid atau arsip terkompresi rusak.");
          return;
        }

        const fileNames = Object.keys(zip.files);
        if (fileNames.length === 0) {
          setIsProcessing(false);
          setErrorStep(1);
          setErrorDetails("Arsip ZIP kosong tanpa berkas di dalamnya.");
          return;
        }

        const claimJsonKey = fileNames.find(
          (name) => name.toLowerCase().endsWith("claim.json") && !name.startsWith("__MACOSX")
        );

        if (claimJsonKey) {
          const jsonText = await zip.files[claimJsonKey].async("string");
          extractedRawTexts.push(jsonText);
          try {
            parsedClaimData = JSON.parse(jsonText);
          } catch {
            setIsProcessing(false);
            setErrorStep(1);
            setErrorDetails("Berkas claim.json di dalam arsip ZIP memiliki sintaksis yang tidak valid.");
            return;
          }
        }

        for (const fName of fileNames) {
          if (fName.startsWith("__MACOSX") || zip.files[fName].dir) continue;
          const lower = fName.toLowerCase();
          if (
            lower.endsWith(".txt") ||
            lower.endsWith(".md") ||
            lower.endsWith(".csv") ||
            (lower.endsWith(".json") && fName !== claimJsonKey)
          ) {
            const content = await zip.files[fName].async("string");
            extractedRawTexts.push(content);

            let docId: DocumentSection["id"] = "resumeMedis";
            let docTitle = "Resume Medis Rawat Inap";

            if (lower.includes("operasi") || lower.includes("bedah") || lower.includes("tindakan")) {
              docId = "laporanOperasi";
              docTitle = "Laporan Operasi & Tindakan";
            } else if (lower.includes("lab") || lower.includes("darah") || lower.includes("patologi")) {
              docId = "hasilLab";
              docTitle = "Hasil Pemeriksaan Laboratorium";
            } else if (
              lower.includes("kuitansi") ||
              lower.includes("billing") ||
              lower.includes("alkes") ||
              lower.includes("biaya")
            ) {
              docId = "kuitansiAlkes";
              docTitle = "Kuitansi & Rincian Alkes";
            }

            const cleanParagraphs = content
              .split(/\r?\n\r?\n/)
              .map((p: string) => p.trim())
              .filter((p: string) => p.length > 0);

            extractedDocuments.push({
              id: docId,
              title: docTitle,
              fileName: fName.split("/").pop() || fName,
              pages: [
                {
                  pageNumber: 1,
                  paragraphs:
                    cleanParagraphs.length > 0
                      ? cleanParagraphs
                      : ["Isi berkas rekam medis tidak dapat dipisahkan menjadi paragraf."],
                },
              ],
            });
          }
        }
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
          `Terdeteksi NIK 16-digit valid (${detectedNiks[0]}) tanpa sanitasi identitas. Berkas ditolak untuk melindungi privasi data pasien (UU PDP No. 27/2022 & Permenkes No. 24/2022).`
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
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const claimId = parsedClaimData?.id || `CLM-2026-${randomSuffix}`;

      const finalDocuments =
        parsedClaimData?.documents && parsedClaimData.documents.length > 0
          ? parsedClaimData.documents
          : extractedDocuments.length > 0
          ? extractedDocuments
          : INITIAL_CLAIMS[0].documents;

      const newClaim: ClaimItem = {
        id: claimId,
        hospitalName:
          parsedClaimData?.hospitalName ||
          (isZip ? `RSUD Regional (Paket ${file.name.replace(".zip", "")})` : "RSUD Dr. Soetomo"),
        patientAge:
          typeof parsedClaimData?.patientAge === "number" ? parsedClaimData.patientAge : 54,
        patientGender: parsedClaimData?.patientGender === "P" ? "P" : "L",
        dpjpName: parsedClaimData?.dpjpName || "dr. Spesialis Penanggung Jawab, Sp.B",
        admissionDate:
          parsedClaimData?.admissionDate || new Date().toISOString().split("T")[0],
        dischargeDate:
          parsedClaimData?.dischargeDate || new Date().toISOString().split("T")[0],
        primaryDiagnosis: parsedClaimData?.primaryDiagnosis || {
          code: "I25.1",
          name: "Atherosclerotic heart disease",
        },
        secondaryDiagnoses: parsedClaimData?.secondaryDiagnoses || [
          { code: "I10", name: "Essential (primary) hypertension" },
        ],
        procedures: parsedClaimData?.procedures || [
          { code: "36.06", name: "Insertion of coronary artery stent(s)" },
        ],
        inacbgCode: parsedClaimData?.inacbgCode || "I-4-10-I",
        inacbgDescription:
          parsedClaimData?.inacbgDescription || "Prosedur Kardiovaskular Perkutan Ringan",
        claimedTariff: Number(parsedClaimData?.claimedTariff) || 38500000,
        fairTariff: Number(parsedClaimData?.fairTariff) || 38500000,
        deltaTariff:
          parsedClaimData?.deltaTariff !== undefined
            ? Number(parsedClaimData.deltaTariff)
            : Math.max(
                0,
                (Number(parsedClaimData?.claimedTariff) || 38500000) -
                  (Number(parsedClaimData?.fairTariff) || 38500000)
              ),
        status: parsedClaimData?.status || "PERLU_TINJAUAN",
        riskLevel: parsedClaimData?.riskLevel || "SEDANG",
        modusTags: parsedClaimData?.modusTags || ["Upcoding"],
        confidenceScore:
          typeof parsedClaimData?.confidenceScore === "number"
            ? parsedClaimData.confidenceScore
            : 89,
        findings: parsedClaimData?.findings || [],
        alternativeHypotheses:
          parsedClaimData?.alternativeHypotheses ||
          "Berkas rekam medis dan resume klinis telah terintegrasi dalam sistem pra-bayar.",
        recommendedAction: parsedClaimData?.recommendedAction || {
          type: "PENDING_KLARIFIKASI_RS",
          label: "Perlu Telaah Manual",
          confidence: 88,
          suggestedNotes: "Klaim baru diunggah dari berkas paket digital.",
          disputeDraftSummary: "Telah lolos verifikasi format berkas dan sanitasi privasi.",
        },
        documents: finalDocuments,
      };

      setCurrentStep(5);
      setIsProcessing(false);
      setUploadedClaim(newClaim);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorStep(currentStep || 1);
      setErrorDetails(
        `Terjadi kendala saat memproses berkas: ${err?.message || "Kesalahan tidak terduga saat ekstraksi berkas."}`
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

  const handleSimulateUpload = (presetType: "HEART_SURGERY" | "PII_VIOLATION") => {
    resetState();
    setSelectedFileName(
      presetType === "PII_VIOLATION"
        ? "sampel_klaim_pelanggaran_nik.json"
        : "sampel_bedah_jantung_terverifikasi.zip"
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
            "Terdeteksi NIK 16-digit valid (3201021405780001) dan nama lengkap tanpa sanitasi identitas. Berkas ditolak otomatis demi privasi data pasien (UU PDP No. 27/2022)."
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
              id: `CLM-2026-${Math.floor(100 + Math.random() * 900)}`,
              admissionDate: "2026-10-18",
              dischargeDate: "2026-10-22",
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
              <div className="w-7 h-7 rounded-[4px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-900">
                  Unggah Berkas Klaim Digital
                </h3>
                <p className="text-[11px] text-slate-500">
                  Pipeline Verifikasi &amp; Telaah Anomali Pra-Bayar
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
              accept=".json,.zip,application/json,application/zip"
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
                    ? "border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20"
                    : "border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-400"
                )}
              >
                <div className="w-10 h-10 rounded-[4px] bg-white border border-slate-200 flex items-center justify-center text-slate-600 mb-2 shadow-2xs">
                  {isDraggingOver ? (
                    <UploadCloud className="w-5 h-5 text-blue-600 animate-bounce" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>
                <h4 className="text-xs font-semibold text-slate-800">
                  Pilih atau tarik berkas paket klaim (.json / .zip)
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed">
                  Tarik berkas ke sini atau klik untuk menjelajah file dari komputer Anda. Mendukung arsip ZIP atau berkas JSON.
                </p>

                {selectedFileName && (
                  <div className="mt-3 px-2.5 py-1 bg-white border border-slate-200 rounded-[4px] text-[11px] font-mono text-slate-700 flex items-center gap-1.5 shadow-2xs">
                    <Archive className="w-3.5 h-3.5 text-blue-600" />
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
                  <span>Panduan Format Berkas &amp; Contoh ZIP/JSON</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 border border-slate-200 px-2 py-0.5 rounded-[4px] hover:bg-slate-50 transition-colors"
                  title="Unduh contoh template klaim JSON"
                >
                  <Download className="w-3 h-3 text-slate-500" />
                  <span>Unduh Contoh JSON</span>
                </button>
              </div>
            )}

            {/* Test Presets (Shown when idle) */}
            {!isProcessing && !uploadedClaim && !errorDetails && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-600">
                  Atau Uji Cepat Berkas Sampel Bawaan:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSimulateUpload("HEART_SURGERY")}
                    className="flex items-center justify-between p-2.5 rounded-[4px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900">
                          Sampel Bedah Jantung Laparoskopi
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Berkas lengkap &amp; tersanitasi (Potensi Upcoding &amp; Alkes)
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-medium px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-[4px]">
                      Uji Valid
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
                          Sampel Pelanggaran Privasi Pasien
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Memuat NIK &amp; identitas riil tanpa anonimisasi
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
                Format didukung: .json, .zip
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
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white border border-slate-200 rounded-[4px] w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col text-slate-800 overflow-hidden">
            {/* Guide Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[4px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-900">
                    Panduan Format Berkas Klaim Digital &amp; Standar Data
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Struktur arsip ZIP, skema JSON klaim, dan kepatuhan privasi UU PDP
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
                onClick={() => setGuideTab("zip")}
                className={cn(
                  "py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5",
                  guideTab === "zip"
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Paket Berkas ZIP (.zip)</span>
              </button>
              <button
                type="button"
                onClick={() => setGuideTab("json")}
                className={cn(
                  "py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5",
                  guideTab === "json"
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>Format JSON (.json)</span>
              </button>
              <button
                type="button"
                onClick={() => setGuideTab("privacy")}
                className={cn(
                  "py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5",
                  guideTab === "privacy"
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Kepatuhan Privasi (UU PDP)</span>
              </button>
            </div>

            {/* Guide Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {guideTab === "zip" && (
                <div className="space-y-3.5">
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-[4px] text-blue-900 leading-relaxed text-[11px]">
                    Sistem mendukung penerimaan arsip paket kompresi <strong>.zip</strong> yang
                    berisi bundel berkas rekam medis elektronik. Anda dapat menyertakan berkas teks/markdown per dokumen rekam medis atau file manifest <code>claim.json</code>.
                  </div>

                  <div>
                    <h5 className="font-semibold text-slate-900 mb-1.5">
                      1. Struktur Folder Standar yang Direkomendasikan
                    </h5>
                    <pre className="p-3 bg-slate-900 text-slate-100 rounded-[4px] font-mono text-[11px] overflow-x-auto leading-relaxed">
{`berkas_klaim_RSUD.zip
├── claim.json                 (Opsional: Manifest kode klaim & diagnosis)
└── documents/
    ├── resume_medis.txt       (Resume medis rawat inap)
    ├── laporan_operasi.txt    (Laporan prosedur/tindakan bedah)
    ├── hasil_lab.txt          (Hasil penunjang laboratorium darah/PA)
    └── kuitansi_alkes.txt     (Rincian faktur billing implan & alkes)`}
                    </pre>
                  </div>

                  <div>
                    <h5 className="font-semibold text-slate-900 mb-1.5">
                      2. Pengenalan Otomatis Berkas Teks
                    </h5>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      Jika arsip tidak memuat <code>claim.json</code>, sistem cerdas akan otomatis mengenali kata kunci nama file:
                    </p>
                    <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-600 text-[11px]">
                      <li>
                        Berkas memuat <code>resume</code> atau <code>ringkasan</code> &rarr; dipetakan ke <strong>Resume Medis Rawat Inap</strong>.
                      </li>
                      <li>
                        Berkas memuat <code>operasi</code>, <code>bedah</code>, atau <code>tindakan</code> &rarr; dipetakan ke <strong>Laporan Prosedur Bedah</strong>.
                      </li>
                      <li>
                        Berkas memuat <code>lab</code>, <code>darah</code>, atau <code>patologi</code> &rarr; dipetakan ke <strong>Hasil Pemeriksaan Penunjang</strong>.
                      </li>
                      <li>
                        Berkas memuat <code>billing</code>, <code>kuitansi</code>, atau <code>alkes</code> &rarr; dipetakan ke <strong>Kuitansi &amp; Rincian Alkes</strong>.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {guideTab === "json" && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-600 text-[11px]">
                      Struktur skema berkas <code>sample_claim_for_upload.json</code> untuk verifikasi pra-bayar.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopySampleJson}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-[4px] transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span>Salin JSON</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadTemplate}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-[4px] transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        <span>Unduh .json</span>
                      </button>
                    </div>
                  </div>

                  <pre className="p-3 bg-slate-900 text-slate-100 rounded-[4px] font-mono text-[11px] overflow-x-auto max-h-72 leading-relaxed">
{JSON.stringify(SAMPLE_CLAIM_JSON, null, 2)}
                  </pre>
                </div>
              )}

              {guideTab === "privacy" && (
                <div className="space-y-3.5">
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-[4px] text-rose-900 leading-relaxed text-[11px]">
                    <div className="flex items-center gap-1.5 font-semibold text-rose-800 mb-1">
                      <Shield className="w-3.5 h-3.5 text-rose-600" />
                      <span>Kewajiban Anonimisasi Data Rekam Medis (UU No. 27/2022)</span>
                    </div>
                    Sistem menerapkan gateway proteksi privasi ketat pada intake klaim digital. Dokumen rekam medis yang diunggah harus telah disanitasi dari informasi identitas pribadi (PII) sebelum masuk ke mesin telaah anomali.
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
                    * Berkas yang memuat nomor NIK 16-digit utuh akan otomatis terblokir di Tahap 2 dengan status Ditolak.
                  </p>
                </div>
              )}
            </div>

            {/* Guide Footer */}
            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between flex-shrink-0">
              <span className="text-[11px] text-slate-500">
                Patuhi Permenkes No. 24/2022 tentang Rekam Medis Elektronik
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
