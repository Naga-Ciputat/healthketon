"use client";

import { ClaimItem, INITIAL_CLAIMS } from "@/lib/mockData";
import { AuditLogItem } from "@/components/widgets/AuditLogStream";

const CLAIMS_STORAGE_KEY = "clarix_bpjs_claims_v1";
const AUDIT_STORAGE_KEY = "clarix_bpjs_audit_logs_v1";

export const DEFAULT_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "AUD-2026-004",
    claimId: "CLM-2026-089",
    hospitalName: "RS Sejahtera Medika",
    verifierName: "dr. Siti Aminah",
    verifierRole: "Verifikator Utama BPJS",
    timestamp: "23 Okt 2026, 11:20 WIB",
    action: "PENDING_KLARIFIKASI_RS",
    finalTariff: 20100000,
    savedDeltaRupiah: 24900000,
    officialLetterNumber: "BA-BPJS/2026/KLM-089/KLARIFIKASI",
    notes: "Klarifikasi resmi diterbitkan ke Komite Medik RS Sejahtera Medika terkait selisih 1 unit Stent DES dan kriteria diagnosis Sepsis.",
    letterContent: `SURAT PERMINTAAN KLARIFIKASI DAN BUKTI PENDUKUNG KLAIM JKN
Nomor: BA-BPJS/2026/KLM-089/KLARIFIKASI
Tanggal: 23 Okt 2026, 11:20 WIB
Sifat: PENTING / SEGERA
Lampiran: 1 (Satu) Berkas Telaah Diskrepansi Medis
Perihal: Permintaan Klarifikasi Bukti Klinis atas Pengajuan Berkas Klaim CLM-2026-089

Kepada Yth.
Direktur RS Sejahtera Medika (Up. Komite Medik & Tim Casemix)
di Tempat

Dengan hormat,
Sehubungan dengan proses verifikasi pra-bayar pembiayaan JKN periode Oktober 2026, bersama surat ini kami sampaikan hasil penelaahan bukti klinis atas berkas tagihan CLM-2026-089:

1. Ketidaksesuaian Billing Alat Kesehatan Implan: Tercatat penagihan kuitansi alat implan stent sebanyak 2 unit, namun pada narasi Laporan Operasi Bedah Percutaneous Coronary Intervention (PCI) hanya tercatat pemasangan 1 unit Stent DES. Berdasarkan Permenkes No. 3 Tahun 2023 Pasal 24, penagihan alkes wajib mencerminkan pemakaian riil tindakan.
2. Pemenuhan Kriteria Klinis Komplikasi: Penagihan diagnosa sekunder Sepsis (A41.9) tidak didukung oleh hasil pemeriksaan penunjang objektif (kultur darah/biomarker infeksi) pada lembar CPPT.
3. Batas Waktu Tanggapan: Mohon menyampaikan surat tanggapan resmi dan berkas pendukung selambat-lambatnya dalam waktu 3 x 24 jam kerja sejak surat ini diterima.

Sebelum diterimanya klarifikasi dan kelengkapan berkas tersebut di atas, realisasi pembayaran atas klaim ini ditangguhkan sementara demi menjaga tertib administrasi dan akuntabilitas pembiayaan jaminan kesehatan.

Verifikator Medis BPJS Kesehatan,
dr. Siti Aminah
NIP: 198804122014022001`,
  },
  {
    id: "AUD-2026-003",
    claimId: "CLM-2026-012",
    hospitalName: "RS Mitra Sehat",
    verifierName: "dr. Siti Aminah",
    verifierRole: "Verifikator Utama BPJS",
    timestamp: "23 Okt 2026, 09:45 WIB",
    action: "DOWNCODE_DIUSULKAN",
    finalTariff: 8200000,
    savedDeltaRupiah: 7800000,
    officialLetterNumber: "BA-BPJS/2026/KLM-012/ADJUST",
    notes: "Penyesuaian kode dari G-4-14-II ke G-4-14-I disetujui DPJP RS. Selisih tarif dikoreksi dalam Berita Acara Rekonsiliasi.",
    letterContent: `BERITA ACARA REKONSILIASI PENYESUAIAN KODE TINGKAT KEPARAHAN (DOWNCODE)
Nomor: BA-BPJS/2026/KLM-012/ADJUST
Tanggal: 23 Okt 2026, 09:45 WIB
Sifat: BIASA
Lampiran: 1 (Satu) Lembar Ringkasan Rekonsiliasi Tarif
Perihal: Rekonsiliasi Penyesuaian Kode Diagnosis dan Tarif Berkas CLM-2026-012

Kepada Yth.
Komite Medik & Tim Kendali Mutu Kendali Biaya (TKMKB) RS Mitra Sehat
di Tempat

Dengan hormat,
Sehubungan dengan hasil penelaahan bukti klinis dan kaidah koding INA-CBG terhadap berkas klaim CLM-2026-012, bersama ini diterbitkan Berita Acara Rekonsiliasi Tarif sebagai tindak lanjut verifikasi pra-bayar:

1. Penyesuaian Kode INA-CBG: Pengalihan kode dari Severity Level II (G-4-14-II) ke Severity Level I (G-4-14-I) karena diagnosa sekunder komplikasi tidak didukung kriteria objektif pada CPPT.
2. Rekonsiliasi Tarif: Tarif pengajuan RS Rp 16.000.000 disesuaikan menjadi tarif wajar Rp 8.200.000.
3. Efisiensi Penyelamatan Dana JKN: Koreksi efisiensi pembiayaan yang disepakati adalah sebesar Rp 7.800.000.

Berita Acara ini mengikat sebagai dasar pembukuan rekonsiliasi klaim antara BPJS Kesehatan dengan Fasilitas Kesehatan rujukan.

Verifikator Medis BPJS Kesehatan,
dr. Siti Aminah
NIP: 198804122014022001`,
  },
  {
    id: "AUD-2026-002",
    claimId: "CLM-2026-077",
    hospitalName: "RSUD Kota Madya",
    verifierName: "dr. Siti Aminah",
    verifierRole: "Kaidah Koding & Verifikasi",
    timestamp: "23 Okt 2026, 08:15 WIB",
    action: "DISETUJUI",
    finalTariff: 6400000,
    savedDeltaRupiah: 0,
    notes: "Klaim tervalidasi lengkap tanpa diskrepansi dokumen asli. Diteruskan ke proses realisasi pembayaran.",
    letterContent: `BERITA ACARA PERSETUJUAN REALISASI PEMBAYARAN KLAIM JKN
Nomor: BA-BPJS/2026/KLM-077/ACC
Tanggal: 23 Okt 2026, 08:15 WIB
Sifat: BIASA
Lampiran: -
Perihal: Persetujuan Pembayaran Klaim Pelayanan Pasien CLM-2026-077

Kepada Yth.
Direktur & Bagian Keuangan RSUD Kota Madya
di Tempat

Dengan hormat,
Telah dilakukan verifikasi mediko-legal dan administratif terhadap berkas penagihan klaim CLM-2026-077 yang diajukan oleh RSUD Kota Madya. Berdasarkan penelaahan silang rekam medis elektronik, catatan tindakan bedah, hasil pemeriksaan laboratorium penunjang, serta kuitansi resmi, seluruh elemen penagihan tervalidasi 100% lengkap tanpa diskrepansi:

1. Kesesuaian Diagnosis & Tindakan: Kriteria klinis tercatat lengkap dan koheren antara resume medis DPJP dan bukti pemeriksaan diagnostik.
2. Ketiadaan Unbundling / Upcoding: Tidak ditemukan duplikasi tindakan atau pemisahan tagihan yang bertentangan dengan kaidah paket INA-CBG.
3. Status Realisasi Pembayaran: Klaim disetujui penuh sebesar Rp 6.400.000 dan diteruskan ke modul keuangan In-Monica untuk proses pencairan dana faskes.

Demikian Berita Acara Persetujuan ini diterbitkan untuk dipergunakan dalam proses rekonsiliasi dan realisasi pencairan dana jaminan kesehatan.

Verifikator Medis BPJS Kesehatan,
dr. Siti Aminah
NIP: 198804122014022001`,
  },
  {
    id: "AUD-2026-001",
    claimId: "CLM-2026-034",
    hospitalName: "RS Sentosa Kasih",
    verifierName: "dr. Hendrawan Sp.PK",
    verifierRole: "Dewan Pertimbangan Klinis",
    timestamp: "22 Okt 2026, 16:30 WIB",
    action: "ESKALASI_PK_JKN",
    finalTariff: 18500000,
    savedDeltaRupiah: 12400000,
    officialLetterNumber: "ESK-PKJKN/2026/10-091",
    notes: "Eskalasi ke tim Pencegahan Kecurangan JKN atas dugaan duplikasi catatan rekam medis (Note Cloning) berulang.",
    letterContent: `NOTA DINAS ESKALASI DUGAAN ANOMALI KE TIM PK-JKN (RAHASIA INTERNAL)
Nomor: ESK-PKJKN/2026/10-091
Tanggal: 22 Okt 2026, 16:30 WIB
Sifat: RAHASIA INTERNAL / SEGERA
Lampiran: 1 (Satu) Berkas Telaah Semantik & Bukti RME
Perihal: Pelimpahan Berkas Klaim Terindikasi Penyimpangan Berulang (Note Cloning)

Kepada Yth.
Ketua Tim Pencegahan Kecurangan JKN (PK-JKN) Kantor Cabang Utama
di Tempat

Dengan hormat,
Berdasarkan hasil penapisan sistem deteksi dini terpadu dan penelaahan mendalam terhadap berkas penagihan klaim CLM-2026-034 dari RS Sentosa Kasih, disampaikan bahwa berkas ini terindikasi memuat pola penyimpangan yang memerlukan audit investigasi komprehensif lanjutan:

1. Modus Indikasi Anomali: Duplikasi narasi klinis secara harfiah pada lembar Catatan Perkembangan Pasien Terintegrasi (CPPT) dengan tingkat kemiripan semantik > 90% terhadap berkas donor historis faskes.
2. Urgensi Mediko-Legal: Tindakan pembedahan dan peresepan obat eskalatif tidak didukung parameter tanda-tanda vital objektif yang memadai pada jam-jam kritis pemantauan intensif.
3. Mitigasi Pembiayaan Dana JKN: Pencegahan potensi kerugian pembiayaan JKN sebesar Rp 12.400.000 dari total tagihan diajukan Rp 18.500.000.

Sehubungan dengan hal tersebut, seluruh berkas klaim terlampir dialihkan dan dilimpahkan penanganannya kepada Tim Pencegahan Kecurangan JKN (PK-JKN) untuk pemeriksaan faktual lapangan sesuai prosedur operasional standar.

Verifikator Medis Pelapor,
dr. Hendrawan Sp.PK
Dewan Pertimbangan Klinis BPJS`,
  },
];

// Helper to safely get claims from localStorage
export function getStoredClaims(): ClaimItem[] {
  if (typeof window === "undefined") {
    return INITIAL_CLAIMS;
  }
  try {
    const data = localStorage.getItem(CLAIMS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(INITIAL_CLAIMS));
      return INITIAL_CLAIMS;
    }
    const parsed: ClaimItem[] = JSON.parse(data);
    const initialMap = new Map(INITIAL_CLAIMS.map((c) => [c.id.toLowerCase(), c]));
    return parsed.map((item) => {
      const init = initialMap.get(item.id.toLowerCase());
      if (!init) return item;
      return {
        ...init,
        ...item,
        findings: item.findings && item.findings.length > 0 ? item.findings : init.findings,
        documents: item.documents && item.documents.length > 0 ? item.documents : init.documents,
        recommendedAction: item.recommendedAction || init.recommendedAction,
        alternativeHypotheses: item.alternativeHypotheses || init.alternativeHypotheses,
      };
    });
  } catch (err) {
    console.error("Failed to read claims from storage:", err);
    return INITIAL_CLAIMS;
  }
}

// Helper to save claims
export function saveClaims(claims: ClaimItem[]): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(CLAIMS_STORAGE_KEY);
    const existingList: ClaimItem[] = raw ? JSON.parse(raw) : INITIAL_CLAIMS;
    const existingMap = new Map(existingList.map((c) => [c.id.toLowerCase(), c]));

    const merged = claims.map((newClaim) => {
      const prev = existingMap.get(newClaim.id.toLowerCase());
      if (!prev) return newClaim;
      return {
        ...prev,
        ...newClaim,
        findings: newClaim.findings && newClaim.findings.length > 0 ? newClaim.findings : prev.findings,
        documents: newClaim.documents && newClaim.documents.length > 0 ? newClaim.documents : prev.documents,
        recommendedAction: newClaim.recommendedAction || prev.recommendedAction,
        alternativeHypotheses: newClaim.alternativeHypotheses || prev.alternativeHypotheses,
      };
    });

    localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new Event("clarix_claims_updated"));
  } catch (err) {
    console.error("Failed to save claims to storage:", err);
  }
}

// Update a single claim status
export function updateClaimStatus(claimId: string, newStatus: ClaimItem["status"], notes?: string): void {
  const currentClaims = getStoredClaims();
  const updated = currentClaims.map((claim) => {
    if (claim.id.toLowerCase() === claimId.toLowerCase()) {
      return { ...claim, status: newStatus };
    }
    return claim;
  });
  saveClaims(updated);

  // Asynchronously sync with PostgreSQL backend
  import("@/lib/api").then(({ updateClaimStatusInBackend }) => {
    updateClaimStatusInBackend(claimId, newStatus, notes).catch((err) =>
      console.warn("Syncing status to backend failed:", err)
    );
  });
}

// Add a new claim (from upload)
export function prependClaim(newClaim: ClaimItem): void {
  const currentClaims = getStoredClaims();
  const exists = currentClaims.some((c) => c.id.toLowerCase() === newClaim.id.toLowerCase());
  if (exists) {
    saveClaims(currentClaims.map((c) => (c.id.toLowerCase() === newClaim.id.toLowerCase() ? newClaim : c)));
  } else {
    saveClaims([newClaim, ...currentClaims]);
  }
}

// Helper to safely get audit logs
export function getStoredAuditLogs(): AuditLogItem[] {
  if (typeof window === "undefined") {
    return DEFAULT_AUDIT_LOGS;
  }
  try {
    const data = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(DEFAULT_AUDIT_LOGS));
      return DEFAULT_AUDIT_LOGS;
    }
    const parsed: AuditLogItem[] = JSON.parse(data);
    const defaultMap = new Map(DEFAULT_AUDIT_LOGS.map((l) => [l.id, l]));
    return parsed.map((item) => {
      const def = defaultMap.get(item.id);
      if (!def) return item;
      return {
        ...def,
        ...item,
        letterContent:
          item.letterContent && !item.letterContent.endsWith("...")
            ? item.letterContent
            : def.letterContent,
      };
    });
  } catch (err) {
    console.error("Failed to read audit logs from storage:", err);
    return DEFAULT_AUDIT_LOGS;
  }
}

// Helper to add a new audit log
export function addAuditLogEntry(entry: AuditLogItem): void {
  if (typeof window === "undefined") return;
  try {
    const currentLogs = getStoredAuditLogs();
    const updated = [entry, ...currentLogs];
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("clarix_audit_updated"));

    // Asynchronously append to PostgreSQL backend
    import("@/lib/api").then(({ appendAuditLogInBackend }) => {
      appendAuditLogInBackend(entry).catch((err) =>
        console.warn("Appending audit log to backend failed:", err)
      );
    });
  } catch (err) {
    console.error("Failed to add audit log entry:", err);
  }
}

// Reset store to default
export function resetStoreToDefault(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CLAIMS_STORAGE_KEY);
  localStorage.removeItem(AUDIT_STORAGE_KEY);
  window.dispatchEvent(new Event("clarix_claims_updated"));
  window.dispatchEvent(new Event("clarix_audit_updated"));
}
