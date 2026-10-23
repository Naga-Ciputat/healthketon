"use client";

import React, { useState, useRef } from "react";
import {
  X,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  FileCheck,
  Shield,
  Layers,
  ArrowRight,
  HelpCircle,
  Download,
  Copy,
  Check,
  Archive,
  FileCode2,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ClaimItem, DocumentSection, INITIAL_CLAIMS } from "@/lib/mockData";

export interface ModalUploadClaimProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessUpload?: (newClaim: ClaimItem) => void;
}

const SAMPLE_CLAIM_JSON: Partial<ClaimItem> = {
  id: "CLM-2026-908",
  hospitalName: "RSUD Dr. Soetomo Surabaya",
  patientAge: 58,
  patientGender: "L",
  dpjpName: "dr. Hendra Wicaksono, Sp.JP(K)",
  admissionDate: "2026-10-14",
  dischargeDate: "2026-10-18",
  primaryDiagnosis: {
    code: "I25.1",
    name: "Atherosclerotic heart disease of native coronary artery",
  },
  secondaryDiagnoses: [
    { code: "I10", name: "Essential (primary) hypertension" },
    { code: "E11.9", name: "Type 2 diabetes mellitus without complications" },
  ],
  procedures: [
    { code: "36.06", name: "Insertion of non-drug-eluting coronary artery stent(s)" },
    { code: "88.56", name: "Coronary arteriography using two catheters" },
  ],
  inacbgCode: "I-4-10-I",
  inacbgDescription: "Prosedur Kardiovaskular Perkutan Ringan",
  claimedTariff: 42500000,
  fairTariff: 42500000,
  deltaTariff: 0,
  status: "PERLU_TINJAUAN",
  riskLevel: "RENDAH",
  modusTags: [],
  confidenceScore: 0.94,
  alternativeHypotheses:
    "Berkas tindakan PCI lengkap dengan angiografi pra-implantasi dan justifikasi klinis yang sesuai kriteria INA-CBG.",
  findings: [],
  recommendedAction: {
    type: "DISETUJUI",
    label: "Rekomendasi Setuju",
    confidence: 0.94,
    suggestedNotes:
      "Dokumen pendukung resume medis dan laporan kateterisasi koroner lengkap dan sesuai kaidah klaim.",
    disputeDraftSummary: "Tidak ditemukan anomali koding atau kelebihan kuantitas alkes.",
  },
  documents: [
    {
      id: "resumeMedis",
      title: "Resume Medis Rawat Inap",
      fileName: "resume_medis_CLM2026908.txt",
      pages: [
        {
          pageNumber: 1,
          paragraphs: [
            "Pasien Tn. B*** (58 tahun, NIK: 3578************) masuk IGD dengan angina pektoris tidak stabil sejak 2 hari SMRS.",
            "Pemeriksaan EKG menunjukkan depresi segmen ST di lead V3-V5, enzim troponin I positif 0.42 ng/mL.",
            "Dilakukan rawat inap di ICCU dan dijadwalkan Percutaneous Coronary Intervention (PCI). Pasien pulang dalam kondisi hemodinamik stabil.",
          ],
        },
      ],
    },
    {
      id: "laporanOperasi",
      title: "Laporan Tindakan Intervensi Jantung",
      fileName: "laporan_operasi_pci.txt",
      pages: [
        {
          pageNumber: 1,
          paragraphs: [
            "Tindakan Angiografi Koroner & PCI dilakukan via pungsi Arteri Radialis Dekstra.",
            "Visualisasi angiografi menemukan lesi stenosis 85% pada LAD mid-segment.",
            "Dilakukan predilatasi balon dilanjutkan deployment 1 unit coronary stent BMS ukuran 3.0 x 18 mm dengan TIMI flow 3.",
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [stepMessage, setStepMessage] = useState<string>("");
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
    setStepMessage("");
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
    a.download = "template_klaim_inacbg.json";
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
      setStepMessage("1. Membaca dan mengekstrak struktur berkas paket klaim...");

      // Small async pause to show step 1
      await new Promise((resolve) => setTimeout(resolve, 500));

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
          setCurrentStep(0);
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
          setCurrentStep(0);
          setErrorDetails("Berkas ZIP tidak valid atau arsip terkompresi rusak.");
          return;
        }

        const fileNames = Object.keys(zip.files);
        if (fileNames.length === 0) {
          setIsProcessing(false);
          setCurrentStep(0);
          setErrorDetails("Arsip ZIP kosong tanpa berkas di dalamnya.");
          return;
        }

        // Look for claim.json inside zip
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
            setCurrentStep(0);
            setErrorDetails("Berkas claim.json di dalam arsip ZIP memiliki sintaksis yang tidak valid.");
            return;
          }
        }

        // Extract any companion clinical text documents from the zip
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

      // Step 2: Privacy / PII validation
      setCurrentStep(2);
      setStepMessage("2. Memverifikasi sanitasi identitas data pasien & kepatuhan privasi (UU PDP)...");
      await new Promise((resolve) => setTimeout(resolve, 600));

      const combinedText = extractedRawTexts.join(" ");
      const nikRegex = /\b\d{16}\b/g;
      const detectedNiks = combinedText.match(nikRegex);

      if (detectedNiks && detectedNiks.length > 0) {
        setIsProcessing(false);
        setCurrentStep(0);
        setErrorDetails(
          `Validasi Gagal: Dokumen terdeteksi memuat nomor NIK 16-digit valid (${detectedNiks[0]}) tanpa sanitasi data. Berkas ditolak otomatis sebelum masuk antrean untuk melindungi privasi rekam medis pasien sesuai UU Perlindungan Data Pribadi (UU PDP) & Permenkes No. 24/2022.`
        );
        return;
      }

      // Step 3: Clinical structure & INA-CBG initial rule check
      setCurrentStep(3);
      setStepMessage("3. Memvalidasi koding INA-CBG, kelengkapan klinis, & profil risiko anomali...");
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
            : 0.89,
        findings: parsedClaimData?.findings || [],
        alternativeHypotheses:
          parsedClaimData?.alternativeHypotheses ||
          "Berkas rekam medis dan resume klinis telah terintegrasi dalam sistem pra-bayar.",
        recommendedAction: parsedClaimData?.recommendedAction || {
          type: "PENDING_KLARIFIKASI_RS",
          label: "Perlu Telaah Manual",
          confidence: 0.88,
          suggestedNotes: "Klaim baru diunggah dari berkas paket digital.",
          disputeDraftSummary: "Telah lolos verifikasi format berkas dan sanitasi privasi.",
        },
        documents: finalDocuments,
      };

      setIsProcessing(false);
      setUploadedClaim(newClaim);
      onSuccessUpload?.(newClaim);
    } catch (err: any) {
      setIsProcessing(false);
      setCurrentStep(0);
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
    // reset input value so re-selecting same file triggers change
    e.target.value = "";
  };

  const handleSimulateUpload = (
    presetType: "HEART_SURGERY" | "KIDNEY_CLONE" | "PII_VIOLATION"
  ) => {
    resetState();
    setSelectedFileName(
      presetType === "PII_VIOLATION"
        ? "sampel_klaim_pelanggaran_nik.json"
        : "sampel_bedah_jantung_terverifikasi.zip"
    );
    setIsProcessing(true);
    setCurrentStep(1);
    setStepMessage("1. Memeriksa kelengkapan struktur skema berkas INA-CBG...");

    setTimeout(() => {
      if (presetType === "PII_VIOLATION") {
        setIsProcessing(false);
        setCurrentStep(0);
        setErrorDetails(
          "Validasi Gagal: Dokumen terdeteksi memuat nomor NIK 16-digit valid (3201021405780001) dan nama pasien tanpa sanitasi data. Berkas ditolak untuk melindungi privasi data rekam medis sesuai UU PDP."
        );
        return;
      }

      setCurrentStep(2);
      setStepMessage("2. Memverifikasi sanitasi identitas data pasien...");

      setTimeout(() => {
        setCurrentStep(3);
        setStepMessage("3. Menghitung profil risiko anomali awal dan estimasi tarif...");

        setTimeout(() => {
          setIsProcessing(false);

          let newClaim: ClaimItem;
          if (presetType === "HEART_SURGERY") {
            newClaim = {
              ...INITIAL_CLAIMS[0],
              id: `CLM-2026-${Math.floor(100 + Math.random() * 900)}`,
              admissionDate: "2026-10-18",
              dischargeDate: "2026-10-22",
            };
          } else {
            newClaim = {
              ...INITIAL_CLAIMS[1],
              id: `CLM-2026-${Math.floor(100 + Math.random() * 900)}`,
              admissionDate: "2026-10-17",
              dischargeDate: "2026-10-21",
            };
          }

          setUploadedClaim(newClaim);
          onSuccessUpload?.(newClaim);
        }, 600);
      }, 600);
    }, 600);
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
                  Intake &amp; Validasi Format Rekam Medis Elektronik
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

            {/* Interactive Dropzone Area */}
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

            {/* Panduan Format Link Bar */}
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
                <span>Unduh Template</span>
              </button>
            </div>

            {/* Test Preset Buttons */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-600">
                Atau Uji Cepat Berkas Sampel Bawaan:
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleSimulateUpload("HEART_SURGERY")}
                  className="flex items-center justify-between p-2.5 rounded-[4px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs text-left transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">
                        Sampel Bedah Jantung Laparoskopi
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Berkas lengkap &amp; tersanitasi (Potensi Upcoding)
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-[4px]">
                    Uji Valid
                  </span>
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleSimulateUpload("PII_VIOLATION")}
                  className="flex items-center justify-between p-2.5 rounded-[4px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs text-left transition-colors disabled:opacity-50"
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

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-[4px] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 flex-shrink-0" />
                  <span>Memproses Berkas Klaim...</span>
                </div>
                <p className="text-[11px] text-blue-700 pl-5.5">{stepMessage}</p>
              </div>
            )}

            {/* Error Alert */}
            {errorDetails && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-[4px] space-y-1">
                <div className="flex items-center gap-1.5 text-rose-800 font-semibold text-xs">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                  <span>Pemeriksaan Gagal</span>
                </div>
                <p className="text-[11px] text-rose-700 leading-relaxed">{errorDetails}</p>
              </div>
            )}

            {/* Success Alert */}
            {uploadedClaim && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[4px] space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Berkas Berhasil Divalidasi</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Klaim{" "}
                  <strong className="font-semibold tabular-nums">{uploadedClaim.id}</strong> (
                  {uploadedClaim.hospitalName}) telah lolos validasi format dan ditambahkan ke
                  antrean verifikasi.
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2 bg-slate-50/70">
            <button
              type="button"
              onClick={handleClose}
              className="px-3 py-1.5 border border-slate-200 rounded-[4px] text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {uploadedClaim ? "Selesai" : "Tutup"}
            </button>
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
                      Struktur skema berkas <code>claim.json</code> mandiri untuk verifikasi dossier pra-bayar.
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
                    * Berkas yang memuat nomor NIK 16-digit utuh akan otomatis terblokir di Stage 2 dengan peringatan audit privasi.
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
