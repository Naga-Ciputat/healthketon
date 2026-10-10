# 3b — Alur End-to-End & Jalur Produk (End-to-End Workflows & Tracks)

**Tema Hackathon:** Detect Smarter, Protect JKN  
**Kategori:** Efisiensi Risiko Fasilitas Kesehatan (Kategori 3.1)  
**Dokumen Pendukung:** [`docs/3-lean-prd.md`](file:///d:/Projects/Web%20Shi/healthkaton/docs/3-lean-prd.md), [`docs/3a-features.md`](file:///d:/Projects/Web%20Shi/healthkaton/docs/3a-features.md)  
**Tujuan Dokumen:** Memetakan topologi keterhubungan 10 fitur ke dalam jalur operasional tertutup (*Closed-Loop Golden Path*), alur *pipeline ingest*, dan jalur evaluasi juri, sehingga implementasi teknis dan skenario demo berjalan mulus tanpa risiko kegagalan teknis di panggung hackathon.

---

## 1. Topologi Arsitektur 3 Jalur (Three-Track System Topology)

Tidak semua fitur harus dipaksakan ke dalam satu alur eksekusi sekuensial tunggal. Sistem dibagi menjadi **3 Jalur Terpisah dengan Tanggung Jawab Khusus**:

```mermaid
flowchart TD
    subgraph Track_2 [Track 2: Ingestion & Investigation Pipeline (Background / Seeded)]
        F1[F1: Upload Intake & UU PDP Check] --> F3[F3: Deterministic Fast Filter]
        F3 --> AgentLoop[Agentic Multi-Tool Loop: F4 Upcoding + F5 Alkes + F6 Cloning]
        AgentLoop --> F7[F7: Verbatim Grounding Check]
        F7 --> DB[(Database Klaim & Hasil Analisis)]
    end

    subgraph Track_1 [Track 1: The Operational Golden Path (Closed-Loop Demo Utama)]
        DB --> F2[F2: Triage Queue Dashboard]
        F2 -->|1. Klik Klaim Prioritas| F8[F8: Dual-Pane Evidence Dossier]
        F8 -->|2. Klik Kutipan Bukti| F8_High[Highlight Teks Verbatim di Dokumen]
        F8_High -->|3. Ambil Tindakan| F9[F9: Action Bar & Draf Klarifikasi]
        F9 -->|4. Simpan Keputusan| F9_Audit[(Append-Only Audit Trail)]
        F9_Audit -->|5. Perbarui Status Klaim| F2
    end

    subgraph Track_3 [Track 3: Scientific Benchmark Track (Halaman Pembuktian Juri)]
        F10[F10: Synthetic Benchmark Runner] --> BatchRun[Batch Pipeline Execution 30-50 Kasus]
        BatchRun --> MetricsReport[Laporan Metrik: Recall, FPR, Grounding Rate]
    end
```

---

## 1.1 Struktur Rute Semantik (End-to-End Route Hierarchy)

Rute URL disusun secara ekspresif mengikuti siklus hidup (*lifecycle*) klaim di meja verifikator:

| Tahap Siklus Klaim | Rute URL Semantik | Peran & Tanggung Jawab Halaman |
|---|---|---|
| **1. Intake & Pemilahan Risiko** | `/claims/triage`<br>*(redirect dari `/`)* | Antrean prioritas berbasis risiko klinis & rupiah, kartu metrik inefisiensi, dan portal upload paket klaim sintetis. |
| **2. Investigasi & Telaah Bukti** | `/claims/:id/dossier` | Workspace interaktif Dual-Pane: kartu temuan AI di kiri, penampil dokumen rekam medis dengan *1-click verbatim highlight* di kanan. |
| **3. Tata Kelola & Jejak Audit** | `/claims/audit-trail` | Arsip riwayat keputusan append-only, log verifikator, dan repositori surat klarifikasi resmi yang diterbitkan ke RS. |
| **4. Pembuktian Ilmiah Juri** | `/benchmark/evaluation-suite` | Halaman eksekusi batch benchmark 30–50 kasus sintetis dengan metrik recall, FPR, dan zero-hallucination. |

---

## 2. Rincian Jalur 1: The Operational Golden Path (Jalur Utama Closed-Loop)

Jalur ini adalah **pengalaman utama pengguna (dr. Maya)** dan merupakan alur yang **wajib berjalan 100% mulus dari awal hingga akhir tanpa hambatan**:

$$\mathbf{/claims/triage \rightarrow /claims/:id/dossier \rightarrow (F4 + F5 + F6 + F7) \rightarrow F9 \rightarrow /claims/triage}$$

### Langkah demi Langkah Alur Tertutup (*Closed-Loop Sequence*):
1. **Langkah 1 — Triage Dashboard (F2):**
   - dr. Maya membuka dashboard di `/claims/triage` (atau `/`).
   - Melihat metrik agregat: Total Klaim (24 kasus), Potensi Inefisiensi Terdeteksi (Rp142.500.000), Klaim Lolos Cepat (12 kasus).
   - Memilih baris teratas: *Klaim #CLM-2026-089 — Pasien Bedah RS Sejahtera — Tagihan Rp45.000.000 — Risiko Tinggi (Merah)*.
2. **Langkah 2 — Membuka Dual-Pane Workspace (F8):**
   - Antarmuka beralih ke `/claims/CLM-2026-089/dossier`.
   - **Pane Kiri:** Menampilkan kartu-kartu temuan berbasis bukti yang dihasilkan oleh AI (F4, F5, F6) lengkap dengan kalkulasi selisih biaya.
   - **Pane Kanan:** Menampilkan dokumen asli (Laporan Operasi, Resume Medis, Hasil Lab, Billing).
3. **Langkah 3 — Verifikasi Bukti 1-Klik (F7 $\rightarrow$ F8):**
   - dr. Maya melihat Kartu Temuan F5: *"Tagihan 2 unit stent DES, narasi bedah hanya pasang 1 unit (Selisih Rp10.000.000)"*.
   - dr. Maya mengklik kutipan teks: *"[Laporan Operasi — Hal 3]"*.
   - Pane Kanan seketika melompat otomatis (*smooth scroll*) ke halaman 3 laporan bedah, dan baris kalimat asli tersorot kuning menyala (*verbatim highlight pulse*).
4. **Langkah 4 — Penentuan Keputusan & Dispute Drafting (F9):**
   - dr. Maya melihat rekomendasi Agent: `REKOMENDASI: PENDING — MINTA KLARIFIKASI ALKES & DOWNCODE KOMPLIKASI`.
   - dr. Maya menekan tombol `Pending — Minta Dokumen Tambahan`.
   - Muncul modal konfirmasi yang sudah otomatis memuat **Draf Surat Klarifikasi Resmi ke RS** lengkap dengan kutipan pasal Permenkes 3/2023 dan temuan diskrepansi.
   - dr. Maya menambahkan catatan verifikator dan menekan *"Konfirmasi Keputusan"*.
5. **Langkah 5 — Penutupan Siklus (Closed-Loop Return):**
   - Keputusan tersimpan ke dalam tabel log permanen (*Append-Only Audit Trail* di `/claims/audit-trail`).
   - Sistem mengarahkan dr. Maya kembali ke Dashboard `/claims/triage`.
   - Status klaim #CLM-2026-089 kini berubah dari `PERLU_TINJAUAN` menjadi `PENDING_KLARIFIKASI_RS`, dan nominal inefisiensi berhasil diamankan.

---

## 3. Rincian Jalur 2: Ingestion & Investigation Pipeline (Background & Seeded Engine)

Jalur ini menangani proses konversi berkas mentah menjadi dossier bukti siap telaah.

### A. Strategi Demo Hackathon: Zero-Latency Pre-seeding
Di panggung hackathon, membiarkan juri menunggu proses LLM selama 45–60 detik per berkas sangat berisiko (rentan latensi jaringan dan batas waktu presentasi yang sempit).
- **Strategi Utama:** Sistem telah memiliki **Seed Data (5–10 kasus sintetis)** yang telah dianalisis sebelumnya dan tersimpan di database lokal. Saat aplikasi dibuka, dashboard `/claims/triage` langsung terisi dan siap diklik tanpa *loading*.
- **Fitur Live Upload (F1):** Tetap tersedia sebagai demonstrasi fungsionalitas sistem. Pengguna dapat mengunggah berkas klaim baru `.json`, melihat indikator proses validasi UU PDP, dan melihat klaim tersebut masuk ke dalam pipeline antrean.

### B. Penyelesaian Tantangan Deteksi Note Cloning (F6)
- **Problem:** Plagiarisme catatan medis (*note cloning*) tidak bisa dideteksi jika hanya ada 1 klaim tunggal, karena membutuhkan data pembanding.
- **Solusi Topologi:** Di database seed, telah ditanam **1 kasus historis donor** (misal: *Pasien #CLM-2026-077 rawat inap 2 hari sebelumnya oleh DPJP yang sama*).
- **Saat Klaim Uji (Pasien #CLM-2026-089) dianalisis:**
  1. Modul F6 mengekstrak embedding semantik dan hash n-gram dari teks resume medis.
  2. Modul F6 memindai tabel korpus RS di database.
  3. Ditemukan skor kemiripan 94% dengan kasus donor.
  4. F6 menghasilkan temuan komparatif *side-by-side diff* yang siap ditampilkan di F8 (`/claims/CLM-2026-089/dossier`).

### C. Alur Anti-Halusinasi Verbatim (F7)
- Setiap kali Agent (F4 atau F5) mengusulkan kutipan bukti:
  1. Modul F7 mengambil string kutipan tersebut.
  2. Mencari posisi indeks karakter tepat (`startIndex`, `endIndex`) di dalam teks dokumen asli.
  3. Jika string cocok 100%: Koordinat karakter disimpan bersama temuan.
  4. Jika tidak cocok (halusinasi/parafrase): Kutipan ditolak, mencegah data palsu masuk ke UI.

---

## 4. Rincian Jalur 3: Scientific Benchmark Track (Halaman Pembuktian Juri)

Jalur ini dirancang khusus untuk memenangkan **Dimensi 4 (Efektivitas & Dampak)** dan **Dimensi 3 (Kualitas Teknologi)** di hadapan juri teknis dan juri klinis.

### Skenario Penggunaan Jalur Benchmark:
1. **Navigasi Khusus:** Akses ke halaman `/benchmark/evaluation-suite`.
2. **Koleksi Dataset:** Sistem memuat **30–50 kasus klaim sintetis terstandar** dengan label kebenaran (*ground truth*):
   - 10 Kasus Upcoding Tertanam (Komplikasi palsu tanpa lab).
   - 10 Kasus Inflated Bills & Cloning Tertanam (Selisih alkes & duplikasi SOAP).
   - 10 Kasus Bersih (Klaim wajar & valid).
   - 10 Kasus Pengganggu (*Distractor* / Salah Koding Tidak Sengaja).
3. **Eksekusi 1-Klik:** Pengguna/Juri menekan tombol *"Jalankan Uji Benchmark"*.
4. **Output Pembuktian:** Sistem menampilkan kartu metrik terukur:
   - **Recall Kasus Anomali:** $\ge 85\%$ (Membuktikan ketajaman deteksi).
   - **False Positive Rate:** $\le 15\%$ (Membuktikan sistem tidak serampangan menuduh kasus salah koding wajar).
   - **Verbatim Grounding Reliability:** $100\%$ (Membuktikan nol halusinasi).
   - **Kecepatan Analisis Rata-Rata:** $< 45$ detik/kasus.
   - **Grafik Komparasi:** Membandingkan kinerja Agent vs Baseline Rule Sederhana.

---

## 5. Prinsip Ketahanan Sistem & Penanganan Kegagalan (System Resilience & Fallbacks)

Untuk menjamin ketersediaan sistem (*high availability*) dan keandalan operasional:

| Potensi Kegagalan Teknis | Titik Terjadi | Mekanisme Fallback Otomatis |
|---|---|---|
| **API LLM Lambat / Timeout (> 30s)** | Modul Investigasi F4/F5 | Sistem otomatis melakukan *fallback* ke hasil filter aturan deterministik (F3) dan menyajikan status investigasi parsial tanpa membuat antrean macet. |
| **Koneksi Jaringan Eksternal Terputus** | Panggilan Model Cloud | Sistem menyediakan opsi eksekusi model lokal terisolasi (*air-gapped / local inference*) atau membaca hasil dari *state store* lokal. |
| **Pemeriksaan UU PDP Mendeteksi Data Riil** | Pintu Masuk F1 | Berkas seketika dibatalkan secara atomik; sistem tidak menyimpan residu data di disk maupun memori, dan mengembalikan kode status penolakan kepatuhan regulasi. |

---

## Kesimpulan Kesiapan Menuju Dokumen 4 (Technical Design)

Dengan pemetaan pada **Dokumen 3b** ini:
1. **Jalur Utama (Closed-Loop Golden Path)** sudah terkunci: Verifikator masuk dari antrean (`/claims/triage`), menelaah bukti dengan sorotan 1-klik (`/claims/:id/dossier`), mengambil keputusan, dan merekam jejak audit (`/claims/audit-trail`).
2. **Ketergantungan data (seperti Note Cloning & Pre-seeding)** sudah diselesaikan lewat strategi basis data seed korpus RS.
3. **Developer kini memiliki cetak biru yang utuh**: siap masuk ke perancangan arsitektur modul, skema database, kontrak API, dan schema fungsi AI di **Dokumen 4**.
