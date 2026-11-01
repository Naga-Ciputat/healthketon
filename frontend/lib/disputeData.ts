/**
 * Model Data & Korpus Konsensus Mediasi Sengketa Klaim JKN
 * Mengacu pada Berita Acara Kesepakatan (BAK) Kemenkes RI (2020–2024)
 * dan Pedoman Nasional Pelayanan Kedokteran (PNPK).
 */

export type DisputeStatus =
  | "PENDING_KLARIFIKASI_RS"  // Masa sanggahan RS (SLA 3x24 jam / 14 hari)
  | "DISPUTE"                 // Sengketa formal aktif (SLA 14-30 hari)
  | "IN_MEDIATION"            // Sidang mediasi arbitrase berjalan
  | "RESOLVED_LAYAK"          // Putusan Arbitrase: Klaim RS Disetujui Penuh
  | "RESOLVED_TIDAK_LAYAK"    // Putusan Arbitrase: Sanggahan Ditolak / Klaim Gugur
  | "RESOLVED_KOREKSI";       // Putusan Arbitrase: Rekonsiliasi Sepakat (Downcode/Koreksi wajar)

export interface DisputedCodeDetail {
  primaryIcd10: { code: string; name: string };
  secondaryIcd10: Array<{ code: string; name: string; isDisputed: boolean }>;
  procedures: Array<{ code: string; name: string; isDisputed: boolean }>;
  inacbgCode: string;
  inacbgDescription: string;
  severityLevel: "I" | "II" | "III";
  tariff: number;
}

export interface MatchedBakClause {
  regulationCode: string;               // Misal: "BAK-KEMENKES-2023-INF"
  year: number;                         // 2020 | 2021 | 2022 | 2023 | 2024
  title: string;                        // Judul klausul kesepakatan
  topicCategory:
    | "SEPSIS_CRITERIA_BIOMARKER"
    | "APPENDICITIS_UNBUNDLING_DRAINAGE"
    | "ORTHOPEDIC_IMPLANT_STERILE_FIELD"
    | "SECTIO_CAESAREA_INDICATION"
    | "MECHANICAL_VENTILATION_HOURS"
    | "READMISSION_30_DAYS"
    | "ICU_ADMISSION_CRITERIA"
    | "STENT_UNBUNDLING_PTCA";
  relevantClause: string;               // Bunyi klausul resmi kesepakatan
  rulingInterpretation: string;        // Interpretasi hukum mediko-legal arbitrase
  pnpkReference?: string;               // Standar PNPK / Kepmenkes terkait
}

export interface HospitalAppeal {
  statement: string;                    // Argumen sanggahan resmi dari Komite Medik
  submittedAt: string;
  submittedBy: string;                  // Nama dokter/koder yang mewakili RS
  dpjpName: string;
  dpjpSpecialty: string;
  dpjpNotes: string;                    // Catatan klinis kronologis DPJP
  supportingEvidence: string[];         // Bukti objektif: CPPT, hasil lab, foto radiologi, dsb.
  demandedTariff: number;
}

export interface BpjsObjection {
  findingType: "UPCODING" | "UNBUNDLING" | "INFLATED_ALKES" | "NOTE_CLONING" | "INDICATION_LACKING";
  title: string;
  description: string;
  verbatimQuote: string;                // Kutipan verbatim rekam medis yang jadi masalah
  sourceDocument: string;
  auditorName: string;
  objectionDate: string;
  regulationReference: string;
  proposedTariff: number;
  claimedDeltaTariff: number;
}

export interface MediationAnalysisResponse {
  recommendationType: "LAYAK" | "TIDAK_LAYAK" | "LAYAK_DENGAN_KOREKSI" | "ESKALASI_TAPK";
  recommendedTariff: number;
  tariffAdjustmentDelta: number;
  bakMatchedArticle: string;
  clinicalRationale: string;
  reasoningSteps: string[];
  compromiseTerms: string[];
  confidenceScore: number;
  inferenceModelUsed: string;           // "Groq LPU LLaMA 3.3 70B" atau "Gemini 2.5 Flash" (Strictly NO Pro)
}

export interface ArbitrationAgreementPayload {
  letterNumber: string;
  agreementTitle: string;
  resolutionType: "LAYAK" | "TIDAK_LAYAK" | "LAYAK_DENGAN_KOREKSI";
  finalAgreedTariff: number;
  agreedIcd10: string;
  agreedInacbg: string;
  hospitalName: string;
  patientName: string;
  sepNumber: string;
  notes: string;
  mediatorRs: string;
  mediatorBpjs: string;
  legalClauses: string[];
  digitalSignatureId: string;
  signedAt: string;
}

export interface DisputeItem {
  claimId: string;
  sepNumber: string;
  hospitalName: string;
  hospitalClass: "A" | "B" | "C" | "D";
  patientName: string;
  patientAge: number;
  patientGender: "L" | "P";
  dpjpName: string;
  dpjpSpecialty: string;
  admissionDate: string;
  dischargeDate: string;
  disputeReason: string;
  disputeStatus: DisputeStatus;
  slaDaysRemaining: number;
  slaTotalDays: number;
  
  // Data Tagihan Awal vs Koreksi BPJS
  primaryDiagnosis: { code: string; name: string };
  claimedTariff: number;
  bpjsProposedTariff: number;
  deltaTariff: number;

  hospitalClaimed: DisputedCodeDetail;
  bpjsAuditProposed: DisputedCodeDetail;

  hospitalRebuttal: HospitalAppeal;
  bpjsFinding: BpjsObjection;
  matchedBak: MatchedBakClause;

  aiMediationAnalysis?: MediationAnalysisResponse;
  resolutionResult?: {
    resolvedAt: string;
    resolutionType: "LAYAK" | "TIDAK_LAYAK" | "LAYAK_DENGAN_KOREKSI";
    finalTariff: number;
    officialLetterNumber: string;
    agreementSummary: string;
    arbitrationAgreement?: ArbitrationAgreementPayload;
  };
}

export type DisputeClaimItem = DisputeItem;

/**
 * 8 Klaster Korpus Konsensus BAK Kemenkes (2020-2024)
 */
export const BAK_KEMENKES_CORPUS: MatchedBakClause[] = [
  {
    regulationCode: "BAK-KEMENKES-2023-INF-04",
    year: 2023,
    title: "Kriteria Diagnosis Sepsis & Pemenuhan Biomarker Terapi",
    topicCategory: "SEPSIS_CRITERIA_BIOMARKER",
    relevantClause:
      "Penegakan diagnosis sekunder Sepsis (A41.9) sebagai Major Complication (MCC Level III) wajib dibuktikan secara objektif melalui respon inflamasi sistemik dengan biomarker spesifik (Prokalsitonin > 0.5 ng/mL atau leukositosis > 12.000/uL) disertai disfungsi organ akut terdokumentasi (skor SOFA/qSOFA >= 2). Pasien febris tanpa biomarker dan tanpa penurunan fungsi organ hanya berhak dikodekan sesuai fokus infeksi primer.",
    rulingInterpretation:
      "Jika biomarker PCT normal (< 0.5 ng/mL) dan hemodinamik stabil tanpa inotropik, klaim downcode ke Level I (K-4-10-I) disepakati sebagai Rekonsiliasi Layak dengan Koreksi.",
    pnpkReference: "Kepmenkes RI No. HK.01.07/MENKES/2020 tentang PNPK Tata Laksana Sepsis Dewasa",
  },
  {
    regulationCode: "BAK-KEMENKES-2022-DIG-02",
    year: 2022,
    title: "Integritas Paket Tindakan Bedah Digestif & Larangan Unbundling Drain",
    topicCategory: "APPENDICITIS_UNBUNDLING_DRAINAGE",
    relevantClause:
      "Pemasangan peritoneal drain (54.59) dan debridement adhesiolisis ringan pada laparatomi appendectomy merupakan kesatuan integral dari tindakan pembedahan utama (47.09) dan telah terakomodasi dalam tarif INA-CBG K-2-11. Tindakan drainase tidak dapat dipisahkan menjadi prosedur mayor sekunder kecuali terdapat laparatomi eksplorasi ulang terjadwal akibat peritonitis generalisata masif.",
    rulingInterpretation:
      "Kode 54.59 dicabut dari tagihan prosedur sekunder. Tarif disesuaikan ke subgrup prosedur standar K-2-11-I dengan persetujuan bersama.",
    pnpkReference: "Kepmenkes No. HK.01.07/MENKES/2021 tentang PNPK Bedah Digestif Akut",
  },
  {
    regulationCode: "BAK-KEMENKES-2021-ORT-07",
    year: 2021,
    title: "Pertanggungan Alkes Implan Ortopedi & Kerusakan Intra-Operatif",
    topicCategory: "ORTHOPEDIC_IMPLANT_STERILE_FIELD",
    relevantClause:
      "Pembiayaan klaim implan ortopedi (plat, screw, nail) dalam skema INA-CBG hanya berlaku untuk instrumen alkes yang terpasang secara permanen in-situ pada tubuh pasien. Kerusakan teknis implan (fatigue fracture, stripping thread, bengkok) yang terjadi di meja operasi sebelum atau selama fiksasi menjadi beban garansi distributor atau biaya operasional faskes, dan tidak dapat ditagihkan ganda kepada kas BPJS Kesehatan.",
    rulingInterpretation:
      "Implan kedua yang rusak di meja operasi dieksklusikan dari tagihan klaim. Biaya klaim disepakati sesuai tarif 1 set implan in-situ yang diverifikasi radiologi pasca bedah.",
    pnpkReference: "Permenkes No. 3 Tahun 2023 Lampiran II Standar Tarif Alkes JKN",
  },
  {
    regulationCode: "BAK-KEMENKES-2023-OBS-01",
    year: 2023,
    title: "Indikasi Medis Mutlak vs Relatif Sectio Caesarea (Subgrup O-6-10)",
    topicCategory: "SECTIO_CAESAREA_INDICATION",
    relevantClause:
      "Tindakan Sectio Caesarea wajib didukung indikasi medis obstetri terdokumentasi (CPD, Preeklampsia Berat, Gawat Janin, Plasenta Previa). Ketiadaan lembar partograf atau hasil USG yang membuktikan penyulit melarang penagihan komplikasi tingkat sedang/berat (Level II/III).",
    rulingInterpretation:
      "Jika indikasi medis terpenuhi namun komplikasi tidak terdokumentasi, disepakati downcode ke SC Ringan (O-6-10-I).",
    pnpkReference: "PNPK Kebidanan & Neonatologi Kemenkes RI 2023",
  },
  {
    regulationCode: "BAK-KEMENKES-2022-RES-05",
    year: 2022,
    title: "Perhitungan Jam Ventilasi Mekanik Continuous ICU (Kode 96.71 vs 96.72)",
    topicCategory: "MECHANICAL_VENTILATION_HOURS",
    relevantClause:
      "Penghitungan durasi jam ventilasi mekanik continuous invasif dimulai sejak intubasi endotrakeal terpasang di ruang ICU/ICCU/PICU dan berakhir saat ekstubasi terencana. Waktu observasi pemulihan di PACU/Recovery Room tidak dapat diakumulasikan untuk mencapai ambang 96 jam (96.72).",
    rulingInterpretation:
      "Durasi observasi ventilator diverifikasi lembar monitoring per jam. Koreksi ke 96.71 jika durasi riil < 96 jam.",
    pnpkReference: "Standar Pelayanan ICU Kepmenkes RI 2022",
  },
  {
    regulationCode: "BAK-KEMENKES-2023-ADM-03",
    year: 2023,
    title: "Ketentuan Interval Readmisi Rawat Inap <= 30 Hari",
    topicCategory: "READMISSION_30_DAYS",
    relevantClause:
      "Admisi ulang pasien dalam kurun waktu <= 30 hari kalender dengan diagnosis primer atau sistem organ terkait langsung dianggap sebagai satu kesatuan episode perawatan yang tak terpisahkan (bundled claim), kecuali terbukti kegawatdaruratan akut baru.",
    rulingInterpretation:
      "Penagihan dua episode disatukan ke episode rawat pertama guna mencegah unbundling pemulangan prematur.",
    pnpkReference: "Permenkes No. 3 Tahun 2023 Pasal 17 jo. Pasal 28",
  },
  {
    regulationCode: "BAK-KEMENKES-2022-ICU-08",
    year: 2022,
    title: "Kriteria Kelayakan Rawat Intensif ICU/PICU/NICU",
    topicCategory: "ICU_ADMISSION_CRITERIA",
    relevantClause:
      "Indikasi rawat ICU prioritas 1 & 2 memerlukan dukungan hemodinamik invasif dan pemantauan titrasi obat vasoaktif. Pasien pasca-operasi elektif stabil yang hanya diobservasi semalam tidak berhak ditagihkan sebagai bobot hari rawat ICU intensif.",
    rulingInterpretation:
      "Penyesuaian bobot hari rawat intensif ke ruang rawat inap biasa jika indikasi ICU tidak terpenuhi.",
    pnpkReference: "Pedoman Kemenkes tentang Akreditasi Pelayanan Rawat Kritis",
  },
  {
    regulationCode: "BAK-KEMENKES-2023-CRD-06",
    year: 2023,
    title: "Prosedur Kardiovaskular: Inklusivitas Kateterisasi & Stenting PTCA",
    topicCategory: "STENT_UNBUNDLING_PTCA",
    relevantClause:
      "Tindakan diagnostik angiografi koroner (88.57) yang dilanjutkan langsung dengan pemasangan stent (00.66) dalam satu sesi kateterisasi telah inklusif dalam satu paket tarif INA-CBG dan dilarang ditagihkan sebagai prosedur ganda terpisah.",
    rulingInterpretation:
      "Klaim angiografi diagnostik digabungkan dengan klaim tindakan terapeutik PCI/PTCA.",
    pnpkReference: "Panduan Praktik Klinis PERKI tentang PCI / Stenting",
  },
];

/**
 * 3 Skenario Sengketa Klinis Otoritatif Grounded BAK Kemenkes (2020-2024)
 */
export const INITIAL_DISPUTE_ITEMS: DisputeItem[] = [
  {
    claimId: "CLM-2026-089",
    sepNumber: "0112R0011026V000891",
    hospitalName: "RS Sejahtera Medika",
    hospitalClass: "B",
    patientName: "Tn. Anwar Wijaya",
    patientAge: 58,
    patientGender: "L",
    dpjpName: "dr. Hendrawan Sp.PD-KPTI",
    dpjpSpecialty: "Spesialis Penyakit Dalam - Konsultan Penyakit Tropik Infeksi",
    admissionDate: "2026-10-18",
    dischargeDate: "2026-10-23",
    disputeReason: "Sanggahan Koding Sepsis (A41.9) — Dugaan Upcoding Severity Level III",
    disputeStatus: "DISPUTE",
    slaDaysRemaining: 8,
    slaTotalDays: 30,
    primaryDiagnosis: { code: "K29.7", name: "Gastritis, unspecified" },
    claimedTariff: 14850000,
    bpjsProposedTariff: 6200000,
    deltaTariff: 8650000,
    hospitalClaimed: {
      primaryIcd10: { code: "K29.7", name: "Gastritis, unspecified" },
      secondaryIcd10: [
        { code: "A41.9", name: "Sepsis, unspecified", isDisputed: true },
        { code: "E11.9", name: "Type 2 diabetes mellitus without complications", isDisputed: false },
      ],
      procedures: [
        { code: "90.59", name: "Microscopic examination of blood", isDisputed: false },
      ],
      inacbgCode: "K-4-10-III",
      inacbgDescription: "Infeksi & Gangguan Saluran Cerna Lain (Komplikasi Berat)",
      severityLevel: "III",
      tariff: 14850000,
    },
    bpjsAuditProposed: {
      primaryIcd10: { code: "K29.7", name: "Gastritis, unspecified" },
      secondaryIcd10: [
        { code: "E11.9", name: "Type 2 diabetes mellitus without complications", isDisputed: false },
      ],
      procedures: [
        { code: "90.59", name: "Microscopic examination of blood", isDisputed: false },
      ],
      inacbgCode: "K-4-10-I",
      inacbgDescription: "Infeksi & Gangguan Saluran Cerna Lain (Ringan)",
      severityLevel: "I",
      tariff: 6200000,
    },
    hospitalRebuttal: {
      statement:
        "Komite Medik RS Sejahtera Medika menolak usulan downcode. Pasien masuk IGD dengan riwayat demam akut 38.9°C, takikardia 104x/menit, dan leukosit shift to the left yang memenuhi kriteria SIRS bakteremia gastrointestinal. DPJP telah memberikan terapi antibiotik seftriakson intravena dosis sepsis.",
      submittedAt: "2026-10-25 14:15 WIB",
      submittedBy: "dr. Hendrawan Sp.PD-KPTI (DPJP) & Tim Casemix RS",
      dpjpName: "dr. Hendrawan Sp.PD-KPTI",
      dpjpSpecialty: "Penyakit Dalam (KPTI)",
      dpjpNotes:
        "Catatan CPPT H+1: Pasien febris menggigil, kecurigaan translokasi bakteri lumen lambung pada pasien diabetes melitus tipe 2. Pemberian ceftriaxone 2x1g IV dimulai secara empiris. Sepsis klinis tegak berdasarkan kriteria sindrom klinis saat triase IGD.",
      supportingEvidence: [
        "Lembar Asesmen Triase IGD: Suhu 38.9°C, HR 104x/menit, RR 22x/menit",
        "Hasil Lab Darah: Leukosit 8.400 /uL (segmen 78%), Trombosit 210.000 /uL",
        "Pemberian Antibiotik Terjadwal: Injeksi Ceftriaxone 1 gr / 12 jam selama 4 hari",
        "Surat Keterangan Direktur Medik No. 445/SM-DIR/X/2026 tentang Kebijakan Diagnosis Klinis Sepsis RS",
      ],
      demandedTariff: 14850000,
    },
    bpjsFinding: {
      findingType: "UPCODING",
      title: "Ketidaksesuaian Kriteria Diagnosis Sepsis (A41.9)",
      description:
        "Pemeriksaan biomarker penunjang menunjukkan Prokalsitonin hanya 0.12 ng/mL (Normal < 0.5 ng/mL). Tidak ditemukan disfungsi organ akut: Tekanan darah sistolik 120/80 mmHg tanpa inotropik, saturasi O2 98% room air, kreatinin 0.9 mg/dL, bilirubin 0.6 mg/dL. Skor SOFA = 0 (tidak memenuhi konsensus Sepsis-3).",
      verbatimQuote:
        "Hasil Lab Patologi Klinik Tanggal 19/10/2026: Procalcitonin 0.12 ng/mL (Normal < 0.50 ng/mL). Hemodinamik stabil tanpa inotropik, tensi 122/78 mmHg, respirasi 18x/menit.",
      sourceDocument: "Lembar Hasil Laboratorium RS & Resume Medis Hal. 3",
      auditorName: "dr. Siti Aminah (Verifikator Utama BPJS)",
      objectionDate: "2026-10-24 10:30 WIB",
      regulationReference: "BAK Kemenkes 2023 No. HK.01.07/MENKES/2023/BAK-04 & PNPK Sepsis Kemenkes 2020",
      proposedTariff: 6200000,
      claimedDeltaTariff: 8650000,
    },
    matchedBak: {
      regulationCode: "BAK-KEMENKES-2023-INF-04",
      year: 2023,
      title: "Kriteria Diagnosis Sepsis & Pemenuhan Biomarker Terapi",
      topicCategory: "SEPSIS_CRITERIA_BIOMARKER",
      relevantClause:
        "Penegakan diagnosis sekunder Sepsis (A41.9) sebagai Major Complication (MCC Level III) wajib dibuktikan secara objektif melalui respon inflamasi sistemik dengan biomarker spesifik (Prokalsitonin > 0.5 ng/mL atau leukositosis > 12.000/uL) disertai disfungsi organ akut terdokumentasi (skor SOFA/qSOFA >= 2). Pasien febris tanpa biomarker dan tanpa penurunan fungsi organ hanya berhak dikodekan sesuai fokus infeksi primer.",
      rulingInterpretation:
        "Biomarker Prokalsitonin pasien Tn. Anwar Wijaya adalah 0.12 ng/mL (jauh di bawah batas cutoff 0.5 ng/mL) dan skor SOFA 0. Berdasarkan konsensus BAK Kemenkes 2023, diagnosis A41.9 wajib dicabut. Rekomendasi arbitrase: Rekonsiliasi sepakat penyesuaian tarif ke K-4-10-I (Layak dengan Koreksi).",
      pnpkReference: "Kepmenkes RI No. HK.01.07/MENKES/2020 tentang PNPK Tata Laksana Sepsis Dewasa",
    },
  },
  {
    claimId: "CLM-2026-099",
    sepNumber: "0112R0021026V000993",
    hospitalName: "RS Mitra Husada",
    hospitalClass: "C",
    patientName: "Ny. Rahmawati",
    patientAge: 34,
    patientGender: "P",
    dpjpName: "dr. Fajar Nugroho, Sp.B",
    dpjpSpecialty: "Spesialis Bedah Umum",
    admissionDate: "2026-10-22",
    dischargeDate: "2026-10-26",
    disputeReason: "Sanggahan Unbundling Drainase Peritoneal (54.59) pada Appendectomy (47.09)",
    disputeStatus: "PENDING_KLARIFIKASI_RS",
    slaDaysRemaining: 3,
    slaTotalDays: 14,
    primaryDiagnosis: { code: "K35.8", name: "Acute appendicitis, other and unspecified" },
    claimedTariff: 11200000,
    bpjsProposedTariff: 7100000,
    deltaTariff: 4100000,
    hospitalClaimed: {
      primaryIcd10: { code: "K35.8", name: "Acute appendicitis, other and unspecified" },
      secondaryIcd10: [
        { code: "K65.0", name: "Acute peritonitis (localized)", isDisputed: false },
      ],
      procedures: [
        { code: "47.09", name: "Other appendectomy", isDisputed: false },
        { code: "54.59", name: "Other lysis of peritoneal adhesions / drainage", isDisputed: true },
      ],
      inacbgCode: "K-2-11-II",
      inacbgDescription: "Prosedur Usus Buntu dengan Prosedur Pembedahan Mayor (Sedang)",
      severityLevel: "II",
      tariff: 11200000,
    },
    bpjsAuditProposed: {
      primaryIcd10: { code: "K35.8", name: "Acute appendicitis, other and unspecified" },
      secondaryIcd10: [
        { code: "K65.0", name: "Acute peritonitis (localized)", isDisputed: false },
      ],
      procedures: [
        { code: "47.09", name: "Other appendectomy", isDisputed: false },
      ],
      inacbgCode: "K-2-11-I",
      inacbgDescription: "Prosedur Usus Buntu Standar (Ringan)",
      severityLevel: "I",
      tariff: 7100000,
    },
    hospitalRebuttal: {
      statement:
        "Rumah Sakit menyanggah temuan unbundling. Saat operasi laparatomi appendectomy dilakukan, ditemukan eksudat purulen masif 150 cc di cavum Douglas dengan perlekatan omentum tebal yang menutupi fossa iliaka dextra. Dokter spesialis bedah membutuhkan waktu adhesiolisis terpisah 45 menit dan memasang drain silikon Jackson-Pratt ukuran 19 Fr.",
      submittedAt: "2026-10-27 11:20 WIB",
      submittedBy: "dr. Fajar Nugroho, Sp.B (DPJP)",
      dpjpName: "dr. Fajar Nugroho, Sp.B",
      dpjpSpecialty: "Spesialis Bedah",
      dpjpNotes:
        "Laporan Operasi Hal. 2: Adhesiolisis omentum dan ileum terminalis dilakukan secara tajam dan tumpul untuk membebaskan appendiks nekrotik. Diputuskan pemasangan drain peritoneal abdomen kuadran kanan bawah karena risiko kebocoran puntung appendiks. Tindakan bukan penutupan luka biasa melainkan manipulasi kavum abdomen luas.",
      supportingEvidence: [
        "Laporan Operasi Rinci: Durasi pembedahan 110 menit (adhesiolisis 45 menit)",
        "Foto Klinis Intra-operatif: Penampakan eksudat cavum Douglas dan insersi drain",
        "Kuitansi Alkes BHP: Silicon Jackson-Pratt Flat Drain 19 Fr + Reservoir",
      ],
      demandedTariff: 11200000,
    },
    bpjsFinding: {
      findingType: "UNBUNDLING",
      title: "Unbundling Pemasangan Drainase Peritoneal (54.59) pada Paket Appendectomy",
      description:
        "Pemasangan drainase peritoneal abdomen dan lisis perlekatan omentum ringan pada operasi appendicitis perforasi adalah standar surgical closure dan pencegahan abses, yang sudah terlingkup dalam paket INA-CBG prosedur appendectomy utama (47.09). Penagihan terpisah kode 54.59 mendistorsi pengelompokan casemix menjadi prosedur mayor.",
      verbatimQuote:
        "Laporan Pembedahan No. REG-OP-2026-1092: 'Dilakukan insersi drain JP silikon di kavum Douglas, fiksasi kulit dengan silk 2.0, dilanjutkan penutupan dinding abdomen lapis demi lapis.'",
      sourceDocument: "Lembar Laporan Pembedahan Hal. 1 & 2",
      auditorName: "dr. Budi Santoso, Sp.A (Verifikator Medis)",
      objectionDate: "2026-10-26 15:40 WIB",
      regulationReference: "BAK Kemenkes 2022 No. HK.01.07/MENKES/2022/BAK-DIG-02",
      proposedTariff: 7100000,
      claimedDeltaTariff: 4100000,
    },
    matchedBak: {
      regulationCode: "BAK-KEMENKES-2022-DIG-02",
      year: 2022,
      title: "Integritas Paket Tindakan Bedah Digestif & Larangan Unbundling Drain",
      topicCategory: "APPENDICITIS_UNBUNDLING_DRAINAGE",
      relevantClause:
        "Pemasangan peritoneal drain (54.59) dan debridement adhesiolisis ringan pada laparatomi appendectomy merupakan kesatuan integral dari tindakan pembedahan utama (47.09) dan telah terakomodasi dalam tarif INA-CBG K-2-11. Tindakan drainase tidak dapat dipisahkan menjadi prosedur mayor sekunder kecuali terdapat laparatomi eksplorasi ulang terjadwal akibat peritonitis generalisata masif.",
      rulingInterpretation:
        "Meskipun adhesiolisis dilakukan selama 45 menit, pembedahan berlangsung dalam satu insisi operasi yang sama dan merupakan tatalaksana standar appendicitis perforasi lokal. Kode 54.59 tidak dapat ditagihkan terpisah. Rekomendasi: Layak dengan Koreksi penyesuaian tarif ke K-2-11-I (Rp 7.100.000).",
      pnpkReference: "Kepmenkes No. HK.01.07/MENKES/2021 tentang PNPK Bedah Digestif Akut",
    },
  },
  {
    claimId: "CLM-2026-034",
    sepNumber: "0112R0031026V000347",
    hospitalName: "RS Sentosa Bhakti",
    hospitalClass: "B",
    patientName: "Sdr. Kevin Pratama",
    patientAge: 26,
    patientGender: "L",
    dpjpName: "dr. Aryo Wicaksono, Sp.OT",
    dpjpSpecialty: "Spesialis Ortopedi & Traumatologi",
    admissionDate: "2026-10-14",
    dischargeDate: "2026-10-20",
    disputeReason: "Sanggahan Penagihan Implan Ganda (78.65 / 79.35) — Kerusakan Implan di Medan Steril",
    disputeStatus: "DISPUTE",
    slaDaysRemaining: 12,
    slaTotalDays: 30,
    primaryDiagnosis: { code: "S72.3", name: "Fracture of shaft of femur" },
    claimedTariff: 32400000,
    bpjsProposedTariff: 23500000,
    deltaTariff: 8900000,
    hospitalClaimed: {
      primaryIcd10: { code: "S72.3", name: "Fracture of shaft of femur" },
      secondaryIcd10: [
        { code: "W19.9", name: "Unspecified fall, causing fracture", isDisputed: false },
      ],
      procedures: [
        { code: "79.35", name: "Open reduction of fracture with internal fixation, femur", isDisputed: false },
        { code: "78.65", name: "Removal of internal fixation device, femur (intra-op defect)", isDisputed: true },
      ],
      inacbgCode: "M-1-40-II",
      inacbgDescription: "Prosedur Fiksasi Fraktur Femur Mayor dengan Alkes Rekonstruksi (Sedang)",
      severityLevel: "II",
      tariff: 32400000,
    },
    bpjsAuditProposed: {
      primaryIcd10: { code: "S72.3", name: "Fracture of shaft of femur" },
      secondaryIcd10: [
        { code: "W19.9", name: "Unspecified fall, causing fracture", isDisputed: false },
      ],
      procedures: [
        { code: "79.35", name: "Open reduction of fracture with internal fixation, femur", isDisputed: false },
      ],
      inacbgCode: "M-1-40-I",
      inacbgDescription: "Prosedur Fiksasi Fraktur Femur Mayor Tunggal (Ringan)",
      severityLevel: "I",
      tariff: 23500000,
    },
    hospitalRebuttal: {
      statement:
        "Sanggahan dari Komite Medik RS Sentosa Bhakti: Saat melakukan fiksasi fraktur kominutif femur, plat rekonstruksi pertama (Broad LCP 12 Holes) yang telah dibuka ke meja steril mengalami keretakan pada lubang ke-4 saat pembentukan kontur lengkung femur. Demi keselamatan pasien dan pencegahan kegagalan implan pasca bedah, DPJP membuka set implan steril baru kedua. Rumah Sakit menagihkan biaya penggantian plat pertama karena kerusakan terjadi di dalam medan operasi.",
      submittedAt: "2026-10-21 09:15 WIB",
      submittedBy: "dr. Aryo Wicaksono, Sp.OT (DPJP) & Komite Etik Medis RS",
      dpjpName: "dr. Aryo Wicaksono, Sp.OT",
      dpjpSpecialty: "Spesialis Ortopedi",
      dpjpNotes:
        "Catatan Kronologi Ruang Bedah: Broad DCP plate serial #B-88392 patah mikro saat ditekuk dengan plate bender standard. Plat kedua serial #B-88401 berhasil dipasang stabil dengan 8 kortikal screw. Radiologi C-arm mengonfirmasi fiksasi rigid sempurna.",
      supportingEvidence: [
        "Laporan Kerusakan Instrumen Medis / Adverse Event Form Ruang OK Cito",
        "Foto Implan Patah di Atas Meja Steril Bertanggal dan Bernomor Batch",
        "Rontgen X-Ray Femur Pasca-Op: Terpasang 1 set broad LCP plate 12 holes in-situ",
        "Surat Permohonan Kompensasi Khusus Beban Kas RS No. 129/DIR-RSB/X/2026",
      ],
      demandedTariff: 32400000,
    },
    bpjsFinding: {
      findingType: "INFLATED_ALKES",
      title: "Penagihan Alkes Implan Ganda yang Tidak Terpasang In-Situ (78.65 / 79.35)",
      description:
        "Kuitansi klaim memuat 2 unit Broad LCP Femoral Plate (Rp 8.900.000 x 2). Berdasarkan foto rontgen verifikasi pasca bedah, hanya 1 unit plat yang terpasang pada tulang pasien. Biaya kegagalan alkes sebelum implantasi definitif di luar kewajiban penjaminan BPJS Kesehatan.",
      verbatimQuote:
        "Expertise Rontgen Femur AP/Lat No. RAD-2026-8812: 'Tampak terpasang satu buah internal fixation plate pada 1/3 tengah diafisis femur sinistra dengan reduksi anatomis baik.'",
      sourceDocument: "Lembar Radiologi Pasca Bedah & Rincian Billing Farmasi",
      auditorName: "dr. Hendra Pratama (Analis Tim PK-JKN)",
      objectionDate: "2026-10-20 16:00 WIB",
      regulationReference: "Permenkes No. 3 Tahun 2023 Lampiran II & BAK Kemenkes 2021 No. BAK-ORT-07",
      proposedTariff: 23500000,
      claimedDeltaTariff: 8900000,
    },
    matchedBak: {
      regulationCode: "BAK-KEMENKES-2021-ORT-07",
      year: 2021,
      title: "Pertanggungan Alkes Implan Ortopedi & Kerusakan Intra-Operatif",
      topicCategory: "ORTHOPEDIC_IMPLANT_STERILE_FIELD",
      relevantClause:
        "Pembiayaan klaim implan ortopedi (plat, screw, nail) dalam skema INA-CBG hanya berlaku untuk instrumen alkes yang terpasang secara permanen in-situ pada tubuh pasien. Kerusakan teknis implan (fatigue fracture, stripping thread, bengkok) yang terjadi di meja operasi sebelum atau selama fiksasi menjadi beban garansi distributor atau biaya operasional faskes, dan tidak dapat ditagihkan ganda kepada kas BPJS Kesehatan.",
      rulingInterpretation:
        "Sesuai klausul BAK Kemenkes 2021, plat kedua yang patah saat konturasi harus diajukan klaim garansi cacat produk (warranty claim) ke pihak prinsipal distributor alkes oleh pihak rumah sakit. Klaim BPJS dibayarkan sebesar 1 set implan terpasang (Rp 23.500.000). Rekomendasi: Layak dengan Koreksi.",
      pnpkReference: "Permenkes No. 3 Tahun 2023 Lampiran II Standar Tarif Alkes JKN",
    },
  },
];
