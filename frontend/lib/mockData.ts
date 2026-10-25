export interface CitationLocation {
  documentId: "resumeMedis" | "laporanOperasi" | "hasilLab" | "kuitansiAlkes";
  documentTitle: string;
  pageNumber: number;
  paragraphIndex: number;
  exactSubstring: string;
}

export interface FindingItem {
  id: string;
  type: "RULE_ANOMALY" | "UPCODING" | "INFLATED_ALKES" | "NOTE_CLONING";
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

export interface DocumentSection {
  id: "resumeMedis" | "laporanOperasi" | "hasilLab" | "kuitansiAlkes";
  title: string;
  fileName: string;
  pdfUrl?: string;
  pages: {
    pageNumber: number;
    paragraphs: string[];
  }[];
}

export interface ClaimItem {
  id: string;
  hospitalName: string;
  patientAge: number;
  patientGender: "L" | "P";
  dpjpName: string;
  admissionDate: string;
  dischargeDate: string;
  primaryDiagnosis: { code: string; name: string };
  secondaryDiagnoses: { code: string; name: string; isAnomaly?: boolean }[];
  procedures: { code: string; name: string }[];
  inacbgCode: string;
  inacbgDescription: string;
  claimedTariff: number;
  fairTariff: number;
  deltaTariff: number;
  status:
    | "PERLU_TINJAUAN"
    | "PENDING_KLARIFIKASI_RS"
    | "DOWNCODE_DIUSULKAN"
    | "DISETUJUI"
    | "ESKALASI_PK_JKN";
  riskLevel: "TINGGI" | "SEDANG" | "RENDAH";
  modusTags: string[];
  confidenceScore: number;
  findings: FindingItem[];
  alternativeHypotheses: string;
  recommendedAction: {
    type: "PENDING_KLARIFIKASI_RS" | "DOWNCODE_DIUSULKAN" | "DISETUJUI" | "ESKALASI_PK_JKN";
    label: string;
    confidence: number;
    suggestedNotes: string;
    disputeDraftSummary: string;
  };
  documents: DocumentSection[];
}

export interface AuditTrailEntry {
  id: string;
  claimId: string;
  hospitalName: string;
  verifierName: string;
  timestamp: string;
  action: "DISETUJUI" | "PENDING_KLARIFIKASI_RS" | "DOWNCODE_DIUSULKAN" | "ESKALASI_PK_JKN";
  finalTariff: number;
  savedDeltaRupiah: number;
  notes: string;
  officialLetterNumber?: string;
  letterDraft?: string;
}

export interface BenchmarkCaseResult {
  id: string;
  label: "UPCODING_SEPSIS" | "INFLATED_STENT" | "NOTE_CLONING" | "CLEAN_CLAIM" | "UNBUNDLING_PROC";
  claimId: string;
  hospital: string;
  expectedAnomaly: boolean;
  detectedAnomaly: boolean;
  verbatimVerified: boolean;
  processingTimeMs: number;
  resultStatus: "TRUE_POSITIVE" | "TRUE_NEGATIVE" | "FALSE_POSITIVE" | "FALSE_NEGATIVE";
  detectedModus: string;
}

export const INITIAL_CLAIMS: ClaimItem[] = [
  {
    id: "CLM-2026-089",
    hospitalName: "RS Sejahtera Medika",
    patientAge: 58,
    patientGender: "L",
    dpjpName: "dr. Hendra Sp.JP",
    admissionDate: "09 Okt 2026",
    dischargeDate: "11 Okt 2026",
    primaryDiagnosis: {
      code: "I21.0",
      name: "Acute transmural myocardial infarction of anterior wall",
    },
    secondaryDiagnoses: [
      {
        code: "A41.9",
        name: "Sepsis, unspecified (Severity Level III)",
        isAnomaly: true,
      },
      { code: "I10", name: "Essential (primary) hypertension" },
    ],
    procedures: [
      {
        code: "00.66",
        name: "Percutaneous transluminal coronary angioplasty (PTCA)",
      },
      {
        code: "36.06",
        name: "Insertion of coronary artery stent(s)",
      },
    ],
    inacbgCode: "I-4-10-III",
    inacbgDescription:
      "Prosedur Kardiologis Intervensi Mayor dengan Komplikasi Berat (Severity Level 3)",
    claimedTariff: 45000000,
    fairTariff: 24500000,
    deltaTariff: 20500000,
    status: "PERLU_TINJAUAN",
    riskLevel: "TINGGI",
    modusTags: ["Upcoding", "Inflated Alkes", "Note Cloning"],
    confidenceScore: 92,
    findings: [
      {
        id: "FND-01",
        type: "UPCODING",
        title: "Indikasi Upcoding: Sepsis Berat (A41.9) Tanpa Bukti Laboratorium",
        badgeLabel: "Kontradiksi Klinis",
        severity: "danger",
        description:
          "Diagnosis komplikasi Sepsis Berat (A41.9) ditagihkan untuk menaikkan severity level ke Tingkat III (+Rp10.500.000). Namun, hasil laboratorium menunjukkan Leukosit 7.800/µL (normal) dan Prokalsitonin 0.1 ng/mL (negatif sepsis), serta tidak ada pemberian inotropik vasopresor di lembar observasi TTV.",
        citation: {
          documentId: "hasilLab",
          documentTitle: "Hasil Laboratorium & Biomarker",
          pageNumber: 1,
          paragraphIndex: 2,
          exactSubstring:
            "Leukosit: 7.800 /uL (Nilai rujukan: 4.500 - 10.000). Prokalsitonin: 0.1 ng/mL (Kategori: Bukan sepsis sistemik).",
        },
        regulationReference: "PNPK Kemenkes RI No. HK.01.07/MENKES/2020 tentang Tata Laksana Sepsis",
        isVerbatim100: true,
        deltaRupiah: 10500000,
      },
      {
        id: "FND-02",
        type: "INFLATED_ALKES",
        title: "Penggelembungan Alkes: Selisih 1 Unit Stent Jantung Koroner (DES)",
        badgeLabel: "Diskrepansi Kuitansi vs Laporan Bedah",
        severity: "danger",
        description:
          "Kuitansi penagihan mencantumkan 2 unit Drug-Eluting Stent (DES) senilai Rp20.000.000. Namun, narasi laporan operasi bedah secara eksplisit menyatakan hanya 1 unit stent berhasil dipasang di arteri LAD, sedangkan stent kedua di cabang LCx batal dipasang karena tortuosity pembuluh darah.",
        citation: {
          documentId: "laporanOperasi",
          documentTitle: "Laporan Tindakan Kateterisasi & Operasi",
          pageNumber: 1,
          paragraphIndex: 3,
          exactSubstring:
            "Dilakukan pemasangan 1 unit stent DES pada arteri LAD dengan hasil TIMI flow 3. Percobaan stenting pada cabang LCx batal dipasang karena tortuosity anatomi ekstrem; alkes kedua dikembalikan ke depo.",
        },
        regulationReference: "Permenkes No. 3 Tahun 2023 Pasal 24 (Verifikasi Alkes Riil)",
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
        id: "FND-03",
        type: "NOTE_CLONING",
        title: "Peringatan Duplikasi Catatan Medis (94% Match Antar-Pasien)",
        badgeLabel: "Duplikasi Catatan Medis",
        severity: "warning",
        description:
          "Teks riwayat penyakit dan catatan perkembangan SOAP pada resume medis memiliki kemiripan semantik 94% dengan Pasien #CLM-2026-077 yang dirawat 2 hari sebelumnya oleh DPJP yang sama, mengindikasikan copy-paste narasi tanpa pemeriksaan individual yang komprehensif.",
        citation: {
          documentId: "resumeMedis",
          documentTitle: "Resume Medis Rawat Inap (RME)",
          pageNumber: 1,
          paragraphIndex: 1,
          exactSubstring:
            "Pasien mengeluh nyeri dada substernal menjalar ke lengan kiri sejak 3 jam SMRS disertai keringat dingin, mual, dan rasa tertekan beban berat pada dada sebelah kiri saat beristirahat.",
        },
        regulationReference: "Permenkes No. 24 Tahun 2022 tentang Integritas Rekam Medis Elektronik",
        isVerbatim100: true,
        comparisonDetails: {
          donorClaimId: "CLM-2026-077",
          donorDate: "07 Okt 2026",
          similarityScore: 94,
          donorText:
            "Pasien mengeluh nyeri dada substernal menjalar ke lengan kiri sejak 3 jam SMRS disertai keringat dingin, mual, dan rasa tertekan beban berat pada dada sebelah kiri saat beristirahat.",
          currentText:
            "Pasien mengeluh nyeri dada substernal menjalar ke lengan kiri sejak 3 jam SMRS disertai keringat dingin, mual, dan rasa tertekan beban berat pada dada sebelah kiri saat beristirahat.",
        },
      },
      {
        id: "FND-04",
        type: "RULE_ANOMALY",
        title: "Aturan Kodifikasi INA-CBG: Batas Pemecahan Paket Angiografi",
        badgeLabel: "Kaidah Koding INA-CBG",
        severity: "info",
        description:
          "Tindakan diagnostik arteriografi koroner (88.57) yang ditagihkan telah masuk dalam paket pembiayaan prosedur kateterisasi terapeutik utama (00.66) dan dilarang ditagihkan terpisah sesuai klausul unbundling INA-CBG.",
        citation: {
          documentId: "kuitansiAlkes",
          documentTitle: "Lembar Tagihan Rincian Billing",
          pageNumber: 1,
          paragraphIndex: 1,
          exactSubstring:
            "Paket Prosedur PTCA Balon + Diagnostik Koroner Angiografi Tambahan Rp 4.500.000",
        },
        regulationReference: "Permenkes No. 3 Tahun 2023 Lampiran II (Kaidah Koding JKN)",
        isVerbatim100: true,
      },
    ],
    alternativeHypotheses:
      "Potensi salah input klerikal oleh koder faskes saat memilih dropdown template SOAP, atau depo farmasi belum melakukan retur otomatis pada pembatalan alkes kedua.",
    recommendedAction: {
      type: "PENDING_KLARIFIKASI_RS",
      label: "Pending — Minta Dokumen Tambahan & Klarifikasi Alkes ke RS",
      confidence: 92,
      suggestedNotes:
        "Ditemukan selisih 1 unit stent DES antara kuitansi dan laporan bedah. Diagnosis sepsis A41.9 tidak didukung bukti biomarker lab. Rekomendasi klarifikasi dan penyesuaian tarif ke I-4-10-I.",
      disputeDraftSummary:
        "Surat Permintaan Klarifikasi Resmi Nomor 440/BPJS-KCU/X/2026 perihal Verifikasi Klaim Pasien No. CLM-2026-089 RS Sejahtera Medika.",
    },
    documents: [
      {
        id: "resumeMedis",
        title: "Resume Medis Pasien",
        fileName: "Resume_Medis_CLM089.pdf",
        pdfUrl: "https://res.cloudinary.com/dj6gxrayb/raw/upload/v1792837499/healthkaton/berkas/Resume_Medis_CLM089.pdf",
        pages: [
          {
            pageNumber: 1,
            paragraphs: [
              "RUMAH SAKIT SEJAHTERA MEDIKA — RESUME MEDIS RAWAT INAP ELEKTRONIK. No RM: 00-48-29. Nama: Pasien Anonim (Tn. R). Usia: 58 Tahun. Jenis Kelamin: Laki-laki. Tanggal Masuk: 09/10/2026. Tanggal Keluar: 11/10/2026. DPJP: dr. Hendra Sp.JP.",
              "Pasien mengeluh nyeri dada substernal menjalar ke lengan kiri sejak 3 jam SMRS disertai keringat dingin, mual, dan rasa tertekan beban berat pada dada sebelah kiri saat beristirahat.",
              "Pemeriksaan Fisik Awal: Keadaan umum sedang, Compos Mentis. Tekanan Darah: 130/80 mmHg, Nadi: 88 x/menit teratur, Suhu: 36.8 C, Pernapasan: 20 x/menit, SpO2: 98% room air. Suara jantung S1/S2 reguler murni, murmur (-), gallop (-). Ronkhi basah halus basal (-).",
              "Diagnosis Kerja Utama: STEMI Anterior Akut (I21.0). Diagnosis Sekunder: Sepsis Berat (A41.9), Hipertensi Grade 1 (I10). Rencana Tindakan: Primary Percutaneous Coronary Intervention (PCI).",
            ],
          },
        ],
      },
      {
        id: "laporanOperasi",
        title: "Laporan Tindakan Operasi",
        fileName: "Laporan_Operasi_PCI_CLM089.pdf",
        pdfUrl: "https://res.cloudinary.com/dj6gxrayb/raw/upload/v1792837500/healthkaton/berkas/Laporan_Operasi_PCI.pdf",
        pages: [
          {
            pageNumber: 1,
            paragraphs: [
              "RUMAH SAKIT SEJAHTERA MEDIKA — LEMBAR LAPORAN TINDAKAN INTERVENSI KARDIOLOGI. Operator: dr. Hendra Sp.JP. Asisten: Ns. Budi. Tindakan: Percutaneous Coronary Intervention (PCI) stenting. Waktu Tindakan: 09/10/2026 14:15 - 15:45 WIB.",
              "Uraian Prosedur: Pasien tidur terlentang dengan anestesi lokal lidokain 2%. Dilakukan punksi arteri radialis dekstra dengan sheath 6F. Kanulasi ostium LCA menggunakan guiding catheter EBU 3.5 6F.",
              "Angiografi LCA: Arteri LAD menunjukkan lesi stenosis 95% trombotik di mid-LAD. Arteri LCx menunjukkan stenosis 70% difus dengan tortuosity berat. Arteri RCA patent dengan plak minor.",
              "Dilakukan pemasangan 1 unit stent DES pada arteri LAD dengan hasil TIMI flow 3. Percobaan stenting pada cabang LCx batal dipasang karena tortuosity anatomi ekstrem; alkes kedua dikembalikan ke depo.",
              "Sheath dilepas dengan kompresi hemostatik radial band. Perdarahan minimal. Pasien ditransfer ke ruang CVCU dalam kondisi stabil tanpa komplikasi.",
            ],
          },
        ],
      },
      {
        id: "hasilLab",
        title: "Hasil Laboratorium & Biomarker",
        fileName: "Laboratorium_CLM089.pdf",
        pdfUrl: "https://res.cloudinary.com/dj6gxrayb/raw/upload/v1792837501/healthkaton/berkas/Hasil_Lab_Biomarker.pdf",
        pages: [
          {
            pageNumber: 1,
            paragraphs: [
              "LABORATORIUM PATOLOGI KLINIK RS SEJAHTERA MEDIKA. Waktu Pengambilan Sampel: 09/10/2026 13:30 WIB.",
              "Troponin I Kuantitatif: 14.8 ng/mL (Nilai rujukan: < 0.04 ng/mL) — KESAN: Positif Infark Miokard Akut.",
              "Leukosit: 7.800 /uL (Nilai rujukan: 4.500 - 10.000). Prokalsitonin: 0.1 ng/mL (Kategori: Bukan sepsis sistemik).",
              "Hemoglobin: 14.2 g/dL, Trombosit: 245.000 /uL, Hematokrit: 41%. Gula Darah Sewaktu: 138 mg/dL. Ureum: 28 mg/dL, Kreatinin: 0.9 mg/dL. Elektrolit: Na 140, K 4.1, Cl 102 mmol/L.",
            ],
          },
        ],
      },
      {
        id: "kuitansiAlkes",
        title: "Rincian Billing & Alkes",
        fileName: "Kuitansi_Alkes_CLM089.pdf",
        pdfUrl: "https://res.cloudinary.com/dj6gxrayb/raw/upload/v1792837502/healthkaton/berkas/Kuitansi_Rincian_Billing.pdf",
        pages: [
          {
            pageNumber: 1,
            paragraphs: [
              "RINCIAN BIAYA PENAGIHAN KHUSUS ALKES & OBAT RS SEJAHTERA MEDIKA. No Tagihan: INV-2026-X-4829. Pasien: Tn. R.",
              "Paket Prosedur PTCA Balon + Diagnostik Koroner Angiografi Tambahan Rp 4.500.000",
              "Drug Eluting Stent (DES) Xience Alpine 3.0 x 28 mm — Qty: 1 Unit x Rp 10.000.000 = Rp 10.000.000",
              "Drug Eluting Stent (DES) Resolute Onyx 2.75 x 18 mm — Qty: 1 Unit x Rp 10.000.000 = Rp 10.000.000",
              "Total Alkes Implan Ditagihkan: 2 Unit Stent DES = Rp 20.000.000. Grand Total Billing: Rp 45.000.000.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "CLM-2026-077",
    hospitalName: "RS Sejahtera Medika",
    patientAge: 62,
    patientGender: "L",
    dpjpName: "dr. Hendra Sp.JP",
    admissionDate: "07 Okt 2026",
    dischargeDate: "09 Okt 2026",
    primaryDiagnosis: {
      code: "I21.1",
      name: "Acute transmural myocardial infarction of inferior wall",
    },
    secondaryDiagnoses: [{ code: "I10", name: "Hypertension" }],
    procedures: [{ code: "00.66", name: "PTCA" }, { code: "36.06", name: "Stent" }],
    inacbgCode: "I-4-10-I",
    inacbgDescription: "Prosedur Kardiologis Intervensi Mayor Ringan (Severity 1)",
    claimedTariff: 24500000,
    fairTariff: 24500000,
    deltaTariff: 0,
    status: "DISETUJUI",
    riskLevel: "RENDAH",
    modusTags: [],
    confidenceScore: 98,
    findings: [],
    alternativeHypotheses: "Kasus historis acuan donor.",
    recommendedAction: {
      type: "DISETUJUI",
      label: "Setujui Klaim",
      confidence: 98,
      suggestedNotes: "Klaim historis sah.",
      disputeDraftSummary: "",
    },
    documents: [
      {
        id: "resumeMedis",
        title: "Resume Medis Pasien Donor",
        fileName: "Resume_Medis_Donor_CLM077.pdf",
        pdfUrl: "https://res.cloudinary.com/dj6gxrayb/raw/upload/v1792837503/healthkaton/berkas/Resume_Medis_Donor_CLM077.pdf",
        pages: [
          {
            pageNumber: 1,
            paragraphs: [
              "RUMAH SAKIT SEJAHTERA MEDIKA — RESUME MEDIS RAWAT INAP ELEKTRONIK (BERKAS ACUAN DONOR). No RM: 00-47-19. Nama: Tn. M (Pasien Donor). Tanggal Masuk: 07/10/2026. Tanggal Keluar: 09/10/2026. DPJP: dr. Hendra Sp.JP.",
              "Pasien mengeluh nyeri dada substernal menjalar ke lengan kiri sejak 3 jam SMRS disertai keringat dingin, mual, dan rasa tertekan beban berat pada dada sebelah kiri saat beristirahat.",
              "Pemeriksaan Fisik Awal: Keadaan umum sedang, Compos Mentis. Tekanan Darah: 130/80 mmHg, Nadi: 88 x/menit teratur, Suhu: 36.8 C.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "CLM-2026-092",
    hospitalName: "RS Mitra Husada",
    patientAge: 45,
    patientGender: "P",
    dpjpName: "dr. Farhan Sp.B",
    admissionDate: "10 Okt 2026",
    dischargeDate: "11 Okt 2026",
    primaryDiagnosis: {
      code: "K35.8",
      name: "Acute appendicitis, other and unspecified",
    },
    secondaryDiagnoses: [],
    procedures: [{ code: "47.09", name: "Other appendectomy" }],
    inacbgCode: "K-4-13-I",
    inacbgDescription: "Apendektomi Ringan Tanpa Komplikasi",
    claimedTariff: 8200000,
    fairTariff: 8200000,
    deltaTariff: 0,
    status: "DISETUJUI",
    riskLevel: "RENDAH",
    modusTags: [],
    confidenceScore: 96,
    findings: [],
    alternativeHypotheses: "Klaim bersih sesuai standar operasional dan bukti histopatologi.",
    recommendedAction: {
      type: "DISETUJUI",
      label: "Setujui Klaim (Fast-Tracked)",
      confidence: 96,
      suggestedNotes: "Seluruh bukti tindakan dan hasil PA lengkap.",
      disputeDraftSummary: "",
    },
    documents: [],
  },
  {
    id: "CLM-2026-095",
    hospitalName: "RSUD Dharma Kasih",
    patientAge: 52,
    patientGender: "P",
    dpjpName: "dr. Linda Sp.OG",
    admissionDate: "08 Okt 2026",
    dischargeDate: "11 Okt 2026",
    primaryDiagnosis: {
      code: "O82.0",
      name: "Delivery by elective caesarean section",
    },
    secondaryDiagnoses: [{ code: "O99.0", name: "Anemia complicating pregnancy" }],
    procedures: [{ code: "74.1", name: "Low cervical cesarean section" }],
    inacbgCode: "O-4-10-II",
    inacbgDescription: "Seksio Sesarea dengan Komplikasi Sedang",
    claimedTariff: 16500000,
    fairTariff: 11200000,
    deltaTariff: 5300000,
    status: "DOWNCODE_DIUSULKAN",
    riskLevel: "SEDANG",
    modusTags: ["Upcoding"],
    confidenceScore: 88,
    findings: [
      {
        id: "FND-05",
        type: "UPCODING",
        title: "Anemia Komplikasi Hamil Tanpa Bukti Transfusi / Kadar Hb",
        badgeLabel: "Upcoding Ringan",
        severity: "warning",
        description:
          "Diagnosa sekunder O99.0 dicantumkan tanpa lampiran hasil Hb pra-operasi atau riwayat transfusi darah selama perawatan.",
        citation: {
          documentId: "resumeMedis",
          documentTitle: "Resume Medis",
          pageNumber: 1,
          paragraphIndex: 1,
          exactSubstring: "Diagnosis: Seksio sesarea elektif atas indikasi bekas SC.",
        },
        isVerbatim100: true,
        deltaRupiah: 5300000,
      },
    ],
    alternativeHypotheses: "Koder lupa mengunggah lampiran lab darah lengkap.",
    recommendedAction: {
      type: "DOWNCODE_DIUSULKAN",
      label: "Usulkan Downcode ke O-4-10-I",
      confidence: 88,
      suggestedNotes: "Turunkan tarif ke tingkat keparahan I karena ketiadaan bukti lab.",
      disputeDraftSummary: "Usulan penyesuaian tarif klaim seksio sesarea elektif.",
    },
    documents: [],
  },
  {
    id: "CLM-2026-099",
    hospitalName: "RS Kartika Medika",
    patientAge: 39,
    patientGender: "L",
    dpjpName: "dr. Adrian Sp.OT",
    admissionDate: "06 Okt 2026",
    dischargeDate: "10 Okt 2026",
    primaryDiagnosis: {
      code: "S82.2",
      name: "Fracture of shaft of tibia",
    },
    secondaryDiagnoses: [],
    procedures: [
      { code: "79.36", name: "Open reduction of fracture of tibia/fibula with internal fixation" },
    ],
    inacbgCode: "M-4-12-I",
    inacbgDescription: "Rekonstruksi Tulang Panjang Ekstremitas Bawah",
    claimedTariff: 28000000,
    fairTariff: 19500000,
    deltaTariff: 8500000,
    status: "PERLU_TINJAUAN",
    riskLevel: "TINGGI",
    modusTags: ["Inflated Alkes"],
    confidenceScore: 91,
    findings: [
      {
        id: "FND-06",
        type: "INFLATED_ALKES",
        title: "Selisih Jumlah Plat Fiksasi Internal Ortopedi (ORIF)",
        badgeLabel: "Diskrepansi Plat Implan",
        severity: "danger",
        description:
          "Ditagihkan 2 buah plate fiksasi tibia, laporan radiologi paska-operasi hanya memperlihatkan 1 anatomical LCP plate terpasang.",
        citation: {
          documentId: "laporanOperasi",
          documentTitle: "Laporan Bedah Ortopedi",
          pageNumber: 1,
          paragraphIndex: 1,
          exactSubstring: "Dilakukan reduksi fraktur dan fiksasi dengan 1 buah anatomical plate LCP 8 lubang.",
        },
        isVerbatim100: true,
        deltaRupiah: 8500000,
      },
    ],
    alternativeHypotheses: "Kemungkinan salah kode billing implan sekrup vs plat.",
    recommendedAction: {
      type: "PENDING_KLARIFIKASI_RS",
      label: "Minta Klarifikasi Kuitansi Implan Ortopedi",
      confidence: 91,
      suggestedNotes: "Minta foto rontgen post-op dan stiker implan resmi dari ruang operasi.",
      disputeDraftSummary: "Permintaan klarifikasi billing plat ortopedi.",
    },
    documents: [],
  },
];

export const INITIAL_AUDIT_TRAIL: AuditTrailEntry[] = [
  {
    id: "AUD-2026-001",
    claimId: "CLM-2026-077",
    hospitalName: "RS Sejahtera Medika",
    verifierName: "dr. Maya Indriati",
    timestamp: "10 Okt 2026 16:42 WIB",
    action: "DISETUJUI",
    finalTariff: 24500000,
    savedDeltaRupiah: 0,
    notes: "Klaim telah diverifikasi lengkap. Bukti kateterisasi dan pemasangan stent 1 unit terbukti valid.",
    officialLetterNumber: "440/BPJS-KCU/APPR/X/2026",
  },
  {
    id: "AUD-2026-002",
    claimId: "CLM-2026-064",
    hospitalName: "RS Bintang Sehat",
    verifierName: "dr. Maya Indriati",
    timestamp: "09 Okt 2026 11:15 WIB",
    action: "DOWNCODE_DIUSULKAN",
    finalTariff: 18200000,
    savedDeltaRupiah: 7400000,
    notes: "Komplikasi pneumonia sekunder tidak memenuhi kriteria kultur dahak. Disepakati penyesuaian tarif.",
    officialLetterNumber: "440/BPJS-KCU/DOWN/X/2026",
  },
  {
    id: "AUD-2026-003",
    claimId: "CLM-2026-051",
    hospitalName: "RS Pelita Harapan",
    verifierName: "dr. Maya Indriati",
    timestamp: "08 Okt 2026 14:20 WIB",
    action: "ESKALASI_PK_JKN",
    finalTariff: 0,
    savedDeltaRupiah: 34000000,
    notes: "Ditemukan pola berulang cloning catatan medis 6 pasien berturut-turut pada ruang bedah yang sama.",
    officialLetterNumber: "440/BPJS-KCU/ESK/X/2026",
  },
];

export const INITIAL_BENCHMARK_RESULTS: BenchmarkCaseResult[] = [
  {
    id: "BM-01",
    label: "UPCODING_SEPSIS",
    claimId: "CLM-2026-301",
    hospital: "RS Siloam",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1420,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Upcoding Sepsis A41.9",
  },
  {
    id: "BM-02",
    label: "INFLATED_STENT",
    claimId: "CLM-2026-302",
    hospital: "RS Mitra Keluarga",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1650,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Inflated Stent (2 billed vs 1 placed)",
  },
  {
    id: "BM-03",
    label: "NOTE_CLONING",
    claimId: "CLM-2026-303",
    hospital: "RSUD Pasar Minggu",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1890,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Medical Note Duplication (96% Match)",
  },
  {
    id: "BM-04",
    label: "CLEAN_CLAIM",
    claimId: "CLM-2026-304",
    hospital: "RS Panti Rapih",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 980,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Clean Claim (Fast-Tracked)",
  },
  {
    id: "BM-05",
    label: "UNBUNDLING_PROC",
    claimId: "CLM-2026-305",
    hospital: "RS Hermina",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1100,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Unbundling Permenkes 3/2023",
  },
  {
    id: "BM-06",
    label: "CLEAN_CLAIM",
    claimId: "CLM-2026-306",
    hospital: "RS Bhayangkara",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 890,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Clean Claim (Fast-Tracked)",
  },
  {
    id: "BM-07",
    label: "UPCODING_SEPSIS",
    claimId: "CLM-2026-307",
    hospital: "RS Medika",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1380,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Upcoding Sepsis A41.9",
  },
  {
    id: "BM-08",
    label: "INFLATED_STENT",
    claimId: "CLM-2026-308",
    hospital: "RS Prima Husada",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1540,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Inflated Mesh Hernia (2 billed vs 1)",
  },
  {
    id: "BM-09",
    label: "CLEAN_CLAIM",
    claimId: "CLM-2026-309",
    hospital: "RS Sentosa",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 920,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Clean Claim (Fast-Tracked)",
  },
  {
    id: "BM-10",
    label: "NOTE_CLONING",
    claimId: "CLM-2026-310",
    hospital: "RS Sejahtera",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1950,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "SOAP Note Cloning (92% Match)",
  },
  {
    id: "BM-11",
    label: "CLEAN_CLAIM",
    claimId: "CLM-2026-311",
    hospital: "RS Harapan Bunda",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 840,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Clean Claim (Fast-Tracked)",
  },
  {
    id: "BM-12",
    label: "UPCODING_SEPSIS",
    claimId: "CLM-2026-312",
    hospital: "RS Husada",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1470,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Upcoding Shock Kardiogenik",
  },
  {
    id: "BM-13",
    label: "UNBUNDLING_PROC",
    claimId: "CLM-2026-313",
    hospital: "RS Kasih Ibu",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1120,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Unbundling Lab Darah Rutin",
  },
  {
    id: "BM-14",
    label: "CLEAN_CLAIM",
    claimId: "CLM-2026-314",
    hospital: "RS Graha Kedoya",
    expectedAnomaly: false,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 910,
    resultStatus: "FALSE_POSITIVE",
    detectedModus: "Borderline Coding Ambiguity (Flagged for Review)",
  },
  {
    id: "BM-15",
    label: "INFLATED_STENT",
    claimId: "CLM-2026-315",
    hospital: "RS Melati",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1620,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Inflated Ortopedi Screw (+4 pcs)",
  },
  {
    id: "BM-16",
    label: "CLEAN_CLAIM",
    claimId: "CLM-2026-316",
    hospital: "RS Bethesda",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 870,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Clean Claim (Fast-Tracked)",
  },
  {
    id: "BM-17",
    label: "NOTE_CLONING",
    claimId: "CLM-2026-317",
    hospital: "RS Surya Husadha",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1880,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Discharge Summary Cloning (91%)",
  },
  {
    id: "BM-18",
    label: "CLEAN_CLAIM",
    claimId: "CLM-2026-318",
    hospital: "RS Pertamina Jaya",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 900,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Clean Claim (Fast-Tracked)",
  },
  {
    id: "BM-19",
    label: "UPCODING_SEPSIS",
    claimId: "CLM-2026-319",
    hospital: "RS Sari Asih",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1390,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Upcoding Gagal Nafas Akut",
  },
  {
    id: "BM-20",
    label: "CLEAN_CLAIM",
    claimId: "CLM-2026-320",
    hospital: "RS Royal Taruma",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 940,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Clean Claim (Fast-Tracked)",
  },
  {
    id: "BM-21",
    label: "INFLATED_STENT",
    claimId: "CLM-2026-321",
    hospital: "RS Puri Indah",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1580,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Inflated IOL Mata Phacoemulsification",
  },
  {
    id: "BM-22",
    label: "CLEAN_CLAIM",
    claimId: "CLM-2026-322",
    hospital: "RS Family",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 820,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Clean Claim (Fast-Tracked)",
  },
  {
    id: "BM-23",
    label: "UNBUNDLING_PROC",
    claimId: "CLM-2026-323",
    hospital: "RS Ananda",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1190,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Unbundling EKG & Treadmill Test",
  },
  {
    id: "BM-24",
    label: "CLEAN_CLAIM",
    claimId: "CLM-2026-324",
    hospital: "RS Insan Permata",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 880,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Clean Claim (Fast-Tracked)",
  },
  {
    id: "BM-25",
    label: "NOTE_CLONING",
    claimId: "CLM-2026-325",
    hospital: "RS Bakti Asih",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1910,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Medical History Duplication (89%)",
  },
  {
    id: "BM-26",
    label: "CLEAN_CLAIM",
    claimId: "CLM-2026-326",
    hospital: "RS Kartini",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 910,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Clean Claim (Fast-Tracked)",
  },
  {
    id: "BM-27",
    label: "UPCODING_SEPSIS",
    claimId: "CLM-2026-327",
    hospital: "RS Medistra",
    expectedAnomaly: true,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 1410,
    resultStatus: "FALSE_NEGATIVE",
    detectedModus: "Subtle Clinical Note (Under-threshold)",
  },
  {
    id: "BM-28",
    label: "CLEAN_CLAIM",
    claimId: "CLM-2026-328",
    hospital: "RS Premier",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 860,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Clean Claim (Fast-Tracked)",
  },
  {
    id: "BM-29",
    label: "INFLATED_STENT",
    claimId: "CLM-2026-329",
    hospital: "RS Columbia Asia",
    expectedAnomaly: true,
    detectedAnomaly: true,
    verbatimVerified: true,
    processingTimeMs: 1610,
    resultStatus: "TRUE_POSITIVE",
    detectedModus: "Inflated Dialyzer Re-use",
  },
  {
    id: "BM-30",
    label: "CLEAN_CLAIM",
    claimId: "CLM-2026-330",
    hospital: "RS Primaya",
    expectedAnomaly: false,
    detectedAnomaly: false,
    verbatimVerified: true,
    processingTimeMs: 850,
    resultStatus: "TRUE_NEGATIVE",
    detectedModus: "Clean Claim (Fast-Tracked)",
  },
];

export const BENCHMARK_SYNTHETIC_DATASET = INITIAL_BENCHMARK_RESULTS;
export const BENCHMARK_EVALUATION_DATASET = INITIAL_BENCHMARK_RESULTS;
