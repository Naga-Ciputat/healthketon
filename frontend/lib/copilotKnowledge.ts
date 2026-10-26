/**
 * Basis Pengetahuan Klinis, Regulasi JKN, dan Tata Letak UI untuk Clarix AI Copilot (TELISIK Platform)
 */

export interface CopilotCitation {
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  exactSubstring: string;
}

export interface CopilotAction {
  label: string;
  actionType: "JUMP_CITATION" | "OPEN_LETTER" | "SIMULATE_TARIFF" | "NAVIGATE" | "FILTER_TRIAGE" | "ASK_PROMPT";
  payload?: any;
}

export interface CopilotResponse {
  answerMarkdown: string;
  reasoningSteps: string[];
  citations?: CopilotCitation[];
  actions?: CopilotAction[];
}

export const REGULATION_KNOWLEDGE = {
  permenkes3_2023: {
    title: "Permenkes No. 3 Tahun 2023 tentang Standar Tarif Pelayanan Kesehatan dalam Program JKN",
    clauses: [
      {
        article: "Pasal 24 (Verifikasi Alkes Riil)",
        summary: "Penagihan alat kesehatan dan implan khusus (seperti stent jantung, ring, plat ortopedi) wajib diverifikasi kesesuaian jumlah unit fisik dan spesifikasinya dengan laporan tindakan pembedahan riil dokter operator di meja operasi. Selisih tagihan yang tidak terpasang tidak dapat ditagihkan ke BPJS Kesehatan.",
      },
      {
        article: "Lampiran II (Kaidah Koding INA-CBG & Larangan Unbundling)",
        summary: "Prosedur diagnostik (misal angiografi koroner 88.57) yang dilakukan bersamaan dalam satu sesi intervensi terapeutik utama (misal PTCA/Stenting 00.66) telah tercakup dalam tarif paket INA-CBG prosedur utama dan DILARANG ditagihkan secara terpisah (unbundling).",
      },
      {
        article: "Lampiran II & Pasal 28 (Klausul Kesinambungan Perawatan / Readmisi <= 30 Hari)",
        summary: "Pasien yang kembali dirawat inap dalam kurun waktu <= 30 hari dengan kelompok diagnosis yang berhubungan pada faskes dan DPJP yang sama wajib ditinjau kesinambungan perawatannya untuk mencegah kesengajaan fragmentasi episode klaim terencana.",
      },
    ],
  },
  pnpk_sepsis: {
    title: "PNPK Kemenkes RI No. HK.01.07/MENKES/2020 tentang Tata Laksana Sepsis Dewasa",
    summary: "Diagnosis komplikasi Sepsis (A41.9) wajib ditegakkan berdasarkan bukti infeksi terkonfirmasi, respon inflamasi sistemik (Leukosit >12.000 atau <4.000 /uL, Prokalsitonin >0.5 ng/mL), serta adanya disfungsi organ akut (penurunan tensi refrakter yang membutuhkan inotropik/vasopresor). Tanpa kriteria tersebut, penegakan sepsis sebagai diagnosis sekunder komplikasi berat tidak sah.",
  },
  permenkes24_2022: {
    title: "Permenkes No. 24 Tahun 2022 tentang Rekam Medis Elektronik",
    summary: "Setiap entri rekam medis wajib mencerminkan hasil pemeriksaan individual yang autentik. Penjiplakan atau copy-paste catatan medis (note cloning) antar-pasien tanpa pemeriksaan langsung melanggar integritas rekam medis elektronik.",
  },
};

export const UI_LAYOUT_KNOWLEDGE = {
  triage: {
    path: "/claims/triage",
    title: "Triage & Antrean Klaim",
    layout: "Menampilkan 3 kartu metrik operasional di bagian atas (Antrean Telaah, Potensi Koreksi, Fast-Track) dan tabel antrean klaim terprioritaskan risiko di bagian bawah. Verifikator dapat menyaring klaim berdasarkan RS, risiko, dan jenis anomali.",
  },
  dossier: {
    path: "/claims/:id/dossier",
    title: "Ruang Telaah Dossier Bukti Klinis",
    layout: "Tata letak Dual-Pane (50:50). Pane Kiri memuat kalkulator rekonsiliasi tarif, kartu-kartu temuan bukti klinis (Upcoding, Alkes, Note Cloning, Readmisi), dan action bar keputusan verifikasi. Pane Kanan memuat Smart Document Viewer untuk memeriksa berkas PDF asli (Resume Medis, Laporan Operasi, Hasil Lab, Kuitansi).",
  },
  auditTrail: {
    path: "/claims/audit-trail",
    title: "Audit Trail & Repositori",
    layout: "Log kronologis permanen (append-only) yang mencatat putusan verifikator, kepatuhan sanitasi data pribadi (UU PDP), dan arsip draf surat klarifikasi resmi ke faskes.",
  },
  benchmark: {
    path: "/benchmark",
    title: "Uji Kasus Benchmark",
    layout: "Suite evaluasi ilmiah terhadap 45 berkas klaim sintetis. Menampilkan Confusion Matrix, Precision (94.1%), Recall (91.4%), False Positive Rate (4.2%), dan uji grounding keaslian kutipan (100% verbatim).",
  },
  intelligence: {
    path: "/intelligence",
    title: "Clarix AI Studio",
    layout: "Studio komando investigasi makro bertenaga Clarix AI untuk analisis lintas-faskes, perbandingan tren fraud, simulasi efisiensi tarif, dan pencarian regulasi hukum JKN.",
  },
};
