import { ClaimItem } from "./mockData";
import { CopilotResponse, REGULATION_KNOWLEDGE, UI_LAYOUT_KNOWLEDGE } from "./copilotKnowledge";

/**
 * Engine Penalaran Pintar Clarix AI Copilot (Dual Context: UI Layout + Clinical Data)
 */
export async function generateCopilotAnswer(
  query: string,
  pathname: string,
  activeClaim: ClaimItem | null
): Promise<CopilotResponse> {
  // Simulasi latency inferensi cepat (< 400ms) untuk realisme UX
  await new Promise((resolve) => setTimeout(resolve, 350));

  const lowerQ = query.toLowerCase();

  // -------------------------------------------------------------
  // SKENARIO 1: Pertanyaan Seputar Sepsis / Upcoding pada Klaim Aktif
  // -------------------------------------------------------------
  if (
    lowerQ.includes("sepsis") ||
    lowerQ.includes("upcoding") ||
    lowerQ.includes("a41.9") ||
    lowerQ.includes("leukosit") ||
    lowerQ.includes("prokalsitonin")
  ) {
    return {
      reasoningSteps: [
        "Mendeteksi kueri terkait diagnosis komplikasi Sepsis (A41.9)",
        "Memeriksa lembar hasil laboratorium patologi klinik pasien #CLM-2026-089",
        "Mencocokkan nilai biomarker terhadap kriteria PNPK Sepsis Kemenkes 2020",
        "Menghitung selisih tarif jika severity level diturunkan dari Level III ke Level I",
      ],
      answerMarkdown: `Diagnosis komplikasi **Sepsis Berat (A41.9)** pada klaim ini ditandai sebagai anomali **Upcoding** karena kontradiksi bukti objektif rekam medis:

1. **Kontradiksi Hasil Laboratorium:**
   - **Leukosit:** Terukur **7.800 /µL** (Nilai normal: 4.500 - 10.000 /µL, tidak ada leukositosis).
   - **Prokalsitonin:** Terukur **0.1 ng/mL** (Ambang batas sepsis sistemik adalah >0.5 ng/mL).
2. **Observasi Klinis & Hemodinamik:**
   - Tanda-tanda vital stabil (TD: 130/80 mmHg, Nadi: 88 x/m) tanpa kebutuhan obat inotropik/vasopresor.
3. **Konsekuensi Tarif INA-CBG:**
   - Penambahan kode komplikasi ini menaikkan paket dari **I-4-10-I** (Rp 20.100.000) menjadi **I-4-10-III** (Rp 45.000.000).
   - Terdapat **potensi efisiensi beban JKN sebesar Rp 24.900.000** jika klaim dikembalikan ke tingkat keparahan riil.`,
      citations: [
        {
          documentId: "hasilLab",
          documentTitle: "Hasil Laboratorium & Biomarker",
          pageNumber: 1,
          exactSubstring: "Leukosit: 7.800 /uL (Nilai rujukan: 4.500 - 10.000). Prokalsitonin: 0.1 ng/mL (Kategori: Bukan sepsis sistemik).",
        },
      ],
      actions: [
        {
          label: "Lompat ke Bukti Lab di PDF Viewer",
          actionType: "JUMP_CITATION",
          payload: { documentId: "hasilLab", pageNumber: 1, exactSubstring: "Leukosit: 7.800 /uL" },
        },
        {
          label: "Buka Draf Surat Klarifikasi Resmi",
          actionType: "OPEN_LETTER",
        },
      ],
    };
  }

  // -------------------------------------------------------------
  // SKENARIO 2: Pertanyaan Seputar Alkes / Stent Jantung (DES)
  // -------------------------------------------------------------
  if (
    lowerQ.includes("stent") ||
    lowerQ.includes("alkes") ||
    lowerQ.includes("kuitansi") ||
    lowerQ.includes("laporan operasi") ||
    lowerQ.includes("inflated")
  ) {
    return {
      reasoningSteps: [
        "Menganalisis diskrepansi tagihan farmasi/alkes vs laporan tindakan bedah",
        "Mengekstrak jumlah unit stent Drug-Eluting Stent (DES) pada kuitansi INV-2026-X-4829",
        "Mengekstrak narasi tindakan dokter operator pada Laporan Operasi PCI",
        "Menghitung selisih fisik alkes yang tidak terpasang di meja operasi",
      ],
      answerMarkdown: `Terdeteksi diskrepansi fisik alkes **Drug-Eluting Stent (DES)** sebesar **1 unit** senilai **Rp 10.000.000**:

• **Ditagihkan di Kuitansi RS:** 2 Unit Stent DES (Xience Alpine + Resolute Onyx) = Rp 20.000.000.  
• **Fakta Laporan Bedah Riil:** Hanya **1 unit** berhasil dipasang di arteri LAD. Pemasangan stent kedua di arteri LCx dibatalkan karena anatomi ekstrem dan alkes dikembalikan ke depo.  
• **Dasar Hukum:** Permenkes No. 3 Tahun 2023 Pasal 24 menegaskan alkes yang ditagihkan wajib sesuai pemakaian riil di meja operasi.`,
      citations: [
        {
          documentId: "laporanOperasi",
          documentTitle: "Laporan Tindakan Kateterisasi & Operasi",
          pageNumber: 1,
          exactSubstring: "Dilakukan pemasangan 1 unit stent DES pada arteri LAD dengan hasil TIMI flow 3. Percobaan stenting pada cabang LCx batal dipasang karena tortuosity anatomi ekstrem; alkes kedua dikembalikan ke depo.",
        },
      ],
      actions: [
        {
          label: "Lompat ke Laporan Bedah (Hal. 1)",
          actionType: "JUMP_CITATION",
          payload: { documentId: "laporanOperasi", pageNumber: 1, exactSubstring: "Dilakukan pemasangan 1 unit stent DES" },
        },
      ],
    };
  }

  // -------------------------------------------------------------
  // SKENARIO 3: Pertanyaan Seputar Readmisi <= 30 Hari
  // -------------------------------------------------------------
  if (
    lowerQ.includes("readmisi") ||
    lowerQ.includes("15 hari") ||
    lowerQ.includes("30 hari") ||
    lowerQ.includes("rawat inap") ||
    lowerQ.includes("fragmentasi")
  ) {
    return {
      reasoningSteps: [
        "Mengevaluasi riwayat rawat inap pasien nomor rekam medis 00-48-29",
        "Menghitung jeda tanggal pulang rawat inap 1 (24 Sep 2026) ke tanggal masuk rawat inap 2 (09 Okt 2026)",
        "Memvalidasi kesamaan DPJP (dr. Hendra Sp.JP) dan kelompok penyakit kardiovaskular",
        "Mencocokkan klausul unbundled hospital admission Permenkes 3/2023",
      ],
      answerMarkdown: `Pasien terdata mengalami **Readmisi 15 Hari** yang memenuhi kriteria audit khusus:

• **Kronologi Dua Episode:**  
  1. *Rawat Inap 1 (21–24 Sep 2026):* Kasus UAP (I20.0) senilai Rp 18.500.000. Dokter mencatat rencana evaluasi kateterisasi elektif.  
  2. *Rawat Inap 2 (09–11 Okt 2026):* Masuk kembali 15 hari kemudian untuk tindakan pasang ring stent senilai Rp 45.000.000.  
• **Indikasi Investigasi:** Faskes diduga sengaja memulangkan pasien agar tindakan pasang ring bisa ditagihkan sebagai klaim rawat inap kedua terpisah (*unbundling admission*).  
• **Dasar Hukum:** Permenkes No. 3 Tahun 2023 Lampiran II & Pasal 28 mewajibkan konsolidasi klaim jika terbukti merupakan satu kesatuan rencana perawatan.`,
      actions: [
        {
          label: "Buka Draf Surat Klarifikasi ke RS",
          actionType: "OPEN_LETTER",
        },
      ],
    };
  }

  // -------------------------------------------------------------
  // SKENARIO 4: Pertanyaan Regulasi / PMK 3/2023
  // -------------------------------------------------------------
  if (
    lowerQ.includes("permenkes") ||
    lowerQ.includes("regulasi") ||
    lowerQ.includes("pasal") ||
    lowerQ.includes("dasar hukum") ||
    lowerQ.includes("aturan")
  ) {
    return {
      reasoningSteps: [
        "Menelusuri basis regulasi jaminan kesehatan nasional",
        "Mengekstrak klausul tarif INA-CBG dan tata kelola klaim BPJS Kesehatan",
      ],
      answerMarkdown: `Berikut rangkuman dasar hukum utama yang menjadi acuan audit klaim di TELISIK:

1. **Permenkes No. 3 Tahun 2023 Pasal 24:**
   * Alkes khusus dan implan yang ditagihkan wajib dibuktikan pemakaian riilnya di laporan operasi.
2. **Permenkes No. 3 Tahun 2023 Lampiran II (Kaidah Koding):**
   * Tindakan diagnostik (misal angiografi) yang dilakukan bersamaan dengan tindakan terapeutik (PTCA) telah tercakup dalam tarif paket dan dilarang ditagihkan terpisah (*unbundling*).
3. **Permenkes No. 3 Tahun 2023 Lampiran II & Pasal 28:**
   * Klausul kesinambungan episode perawatan: audit readmisi $\\le 30$ hari untuk mendeteksi pemecahan episode klaim fiktif.
4. **Permenkes No. 24 Tahun 2022:**
   * Integritas Rekam Medis Elektronik: melarang fabrikasi atau penjiplakan catatan medis (*note cloning*).`,
      actions: [
        {
          label: "Buka Clarix AI Studio (Eksplorasi Regulasi)",
          actionType: "NAVIGATE",
          payload: { path: "/intelligence" },
        },
      ],
    };
  }

  // -------------------------------------------------------------
  // SKENARIO 5: Panduan Tata Letak UI / Cara Pakai Aplikasi
  // -------------------------------------------------------------
  if (
    lowerQ.includes("cara") ||
    lowerQ.includes("layout") ||
    lowerQ.includes("tampilan") ||
    lowerQ.includes("fitur") ||
    lowerQ.includes("panduan") ||
    lowerQ.includes("menu")
  ) {
    const activeLayout = Object.values(UI_LAYOUT_KNOWLEDGE).find((k) =>
      pathname.includes(k.path.replace(":id", ""))
    ) || UI_LAYOUT_KNOWLEDGE.dossier;

    return {
      reasoningSteps: [
        `Mendeteksi verifikator berada di halaman ${activeLayout.title}`,
        "Menyusun panduan tata letak UI dan alur kerja operasional",
      ],
      answerMarkdown: `Anda saat ini berada di **${activeLayout.title}** (\`${pathname}\`).

**Struktur & Cara Penggunaan:**
• **${activeLayout.layout}**

**Panduan Langkah Cepat Verifikator:**
1. Periksa kalkulator selisih tarif di bagian atas untuk melihat estimasi penghematan beban JKN.
2. Telusuri kartu temuan anomali klinis (Upcoding, Alkes, Note Cloning, Readmisi).
3. Klik tombol *"Lihat Kutipan"* pada kartu untuk langsung menyorot bukti verbatim di penampil dokumen kanan.
4. Tentukan keputusan di Action Bar bawah: **Setujui Klaim**, **Klarifikasi RS**, **Koreksi Kode**, atau **Eskalasi Audit**.`,
    };
  }

  // -------------------------------------------------------------
  // SKENARIO 6: Jawaban Default / General Assistant
  // -------------------------------------------------------------
  const claimContextSnippet = activeClaim
    ? `Saat ini Anda sedang menelaah klaim **#${activeClaim.id}** (${activeClaim.hospitalName}) untuk pasien **${activeClaim.patientAge} th** dengan diagnosis **${activeClaim.primaryDiagnosis.code}**. Ada potensi koreksi sebesar **Rp ${activeClaim.deltaTariff.toLocaleString("id-ID")}**.`
    : "Saya adalah Clarix AI, asisten investigasi klinis dan regulasi pada platform TELISIK.";

  return {
    reasoningSteps: [
      "Menganalisis kueri bebas verifikator",
      "Memetakan ke konteks rekam medis dan basis aturan JKN yang tersedia",
    ],
    answerMarkdown: `${claimContextSnippet}

Apa yang ingin Anda telusuri lebih lanjut? Anda dapat menanyakan:
• *"Kenapa diagnosis sepsis pada klaim ini dianulir?"*
• *"Berapa selisih alkes stent yang ditagihkan RS?"*
• *"Apa dasar hukum penolakan pemecahan paket angiografi?"*
• *"Bagaimana alur dan panduan tata letak ruang telaah ini?"*`,
    actions: activeClaim
      ? [
          {
            label: "Jelaskan Anomali Sepsis & Lab",
            actionType: "JUMP_CITATION",
            payload: { documentId: "hasilLab", pageNumber: 1, exactSubstring: "Leukosit: 7.800 /uL" },
          },
          {
            label: "Buka Draf Surat Klarifikasi Resmi",
            actionType: "OPEN_LETTER",
          },
        ]
      : undefined,
  };
}
