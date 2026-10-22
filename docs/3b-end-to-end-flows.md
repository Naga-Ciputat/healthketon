# 3b — Alur End-to-End & Jalur Produk (End-to-End Workflows & Tracks)

**Tema Hackathon:** Detect Smarter, Protect JKN  
**Kategori:** Efisiensi Risiko Fasilitas Kesehatan (Kategori 3.1)  
**Dokumen Pendukung:** [`docs/3-lean-prd.md`](file:///d:/Projects/Web%20Shi/healthkaton/docs/3-lean-prd.md), [`docs/3a-features.md`](file:///d:/Projects/Web%20Shi/healthkaton/docs/3a-features.md)  
**Tujuan Dokumen:** Memetakan topologi keterhubungan 10 fitur ke dalam jalur operasional tertutup (*Closed-Loop Golden Path*), alur *pipeline ingest* dengan kepatuhan TTE & privasi, serta jalur evaluasi ilmiah, sehingga alur produk berjalan mulus dan terbebas dari fitur terisolasi.

---

## 1. Topologi Arsitektur 3 Jalur (Three-Track System Topology)

Sistem dibagi menjadi **3 Jalur Terpisah dengan Tanggung Jawab Khusus**:

```mermaid
flowchart TD
    subgraph Track_2 [Track 2: Ingestion & Investigation Pipeline (Background / Seeded)]
        F1[F1: Upload Intake, UU PDP Check & Verifikasi TTE] --> F3[F3: Deterministic Fast Filter & Cek Readmisi]
        F3 --> AgentLoop[Agentic Multi-Tool Loop: F4 Upcoding + F5 Alkes + F6 Cloning]
        AgentLoop --> F7[F7: Verbatim Grounding Check]
        F7 --> DB[(Database Klaim & Hasil Analisis)]
    end

    subgraph Track_1 [Track 1: The Operational Golden Path (Closed-Loop Utama)]
        DB --> F2[F2: Triage Queue Dashboard]
        F2 -->|1. Pilih Klaim Prioritas| F8[F8: Dual-Pane Evidence Dossier]
        F8 -->|2. Klik Kutipan Bukti| F8_High[Highlight Teks Verbatim di Rekam Medis]
        F8_High -->|3. Ambil Tindakan| F9[F9: Action Bar & Draf Klarifikasi]
        F9 -->|4. Simpan Keputusan| F9_Audit[(Append-Only Audit Trail)]
        F9_Audit -->|5a. Status Siap Bayar| S06[(Modul Keuangan In-Monica)]
        F9_Audit -->|5b. Status Pending/Klarifikasi| F2
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
| **1. Intake & Pemilahan Risiko** | `/claims/triage`<br>*(redirect dari `/`)* | Antrean prioritas berbasis risiko klinis & rupiah, kartu metrik operasional terkalibrasi, status TTE faskes, dan portal upload paket klaim. |
| **2. Investigasi & Telaah Bukti** | `/claims/:id/dossier` | Workspace interaktif Dual-Pane: kartu temuan bukti AI di kiri, penampil dokumen rekam medis dengan sinkronisasi teks verbatim di kanan. |
| **3. Tata Kelola & Jejak Audit** | `/claims/audit-trail` | Arsip riwayat keputusan append-only, log verifikator, rekam kepatuhan penyamaran data (UU PDP), dan repositori surat klarifikasi resmi. |
| **4. Pembuktian Ilmiah Juri** | `/benchmark/evaluation-suite` | Halaman eksekusi batch benchmark 30–50 kasus sintetis dengan metrik recall, FPR, dan zero-hallucination. |

---

## 2. Rincian Jalur 1: The Operational Golden Path (Jalur Utama Closed-Loop)

Jalur ini adalah **pengalaman utama pengguna (dr. Maya)** dan merupakan alur yang **berjalan mulus dari awal hingga akhir tanpa hambatan**:

$$\mathbf{/claims/triage \rightarrow /claims/:id/dossier \rightarrow (F4 + F5 + F6 + F7) \rightarrow F9 \rightarrow /claims/triage}$$

### Langkah demi Langkah Alur Tertutup (*Closed-Loop Sequence*):
1. **Langkah 1 — Triage Dashboard (F2):**
   - dr. Maya membuka dashboard di `/claims/triage` (atau `/`).
   - Memeriksa metrik operasional yang tenang: Antrean Telaah (24 kasus), Potensi Koreksi Tagihan (Rp 24.900.000 pada kasus prioritas), Klaim Lolos Cepat / Fast-Tracked (12 kasus bersih).
   - Memilih baris teratas: *Klaim #CLM-2026-089 — Pasien Bedah RS Sejahtera — Tagihan Rp 45.000.000 — Indikasi: Upcoding Komplikasi & Inflated Stent — TTE Valid*.
2. **Langkah 2 — Membuka Dual-Pane Workspace (F8):**
   - Antarmuka beralih ke `/claims/CLM-2026-089/dossier`.
   - **Header:** Menampilkan strip status otentikasi dokumen: *TTE dr. Hendra Sp.JP Terverifikasi (BSrE-BSSN) · Integritas Hash SHA-256 Valid*.
   - **Pane Kiri:** Menampilkan kartu-kartu temuan berbasis bukti yang dihasilkan oleh AI (F4, F5, F6) lengkap dengan kalkulasi selisih biaya dan dasar pasal regulasi koding.
   - **Pane Kanan:** Menampilkan dokumen asli (Laporan Operasi, Resume Medis, Hasil Lab, Billing).
3. **Langkah 3 — Verifikasi Bukti 1-Klik (F7 $\rightarrow$ F8):**
   - dr. Maya melihat Kartu Temuan F5: *"Tagihan 2 unit stent DES, narasi bedah hanya pasang 1 unit (Selisih Rp 10.000.000)"*.
   - dr. Maya mengklik kutipan teks: *"[Laporan Operasi — Hal 3]"*.
   - Pane Kanan seketika melompat otomatis (*smooth scroll*) ke halaman 3 laporan bedah, dan baris kalimat asli tersorot berlatar amber lembut (*verbatim highlight*).
4. **Langkah 4 — Penentuan Keputusan & Dispute Drafting (F9):**
   - dr. Maya melihat rekomendasi sistem: `Rekomendasi Telaah: Usulkan Penyesuaian Kode Severity / Minta Dokumen Pendukung`.
   - dr. Maya menekan tombol `Minta Konfirmasi RS` atau `Koreksi Kode (Downcode)`.
   - Muncul modal konfirmasi yang sudah otomatis memuat **Draf Surat Klarifikasi Resmi ke RS** lengkap dengan kutipan pasal Permenkes 3/2023 dan temuan diskrepansi faktual.
   - dr. Maya melengkapi catatan justifikasi verifikator dan menekan *"Konfirmasi Keputusan"*.
5. **Langkah 5 — Penutupan Siklus & Rekonsiliasi Status:**
   - Keputusan tersimpan ke dalam log permanen (*Append-Only Audit Trail* di `/claims/audit-trail`).
   - Jika klaim disetujui (`SETUJUI`), status klaim bertransisi menjadi `SIAP_BAYAR` untuk diteruskan ke proses realisasi pembayaran faskes (modul Keuangan / In-Monica).
   - Jika berstatus `PENDING_KLARIFIKASI_RS`, berkas berpindah ke antrean pantau sengketa, dan sistem mengarahkan dr. Maya kembali ke Dashboard `/claims/triage`.

---

## 3. Rincian Jalur 2: Ingestion & Investigation Pipeline (Background & Seeded Engine)

Jalur ini menangani proses konversi berkas mentah menjadi dossier bukti siap telaah.

### A. Strategi Demo: Zero-Latency Pre-seeding
- **Strategi Utama:** Sistem telah memiliki **Seed Data (berbasis 20 kasus riil data sampel BPJS 2024)** yang telah dianalisis sebelumnya dan tersimpan di database lokal. Saat aplikasi dibuka, dashboard `/claims/triage` langsung terisi dan siap diklik tanpa menunggu inferensi jaringan.
- **Fitur Live Upload (F1):** Tetap tersedia sebagai demonstrasi fungsionalitas sistem. Pengguna dapat mengunggah berkas klaim baru `.json`, melihat indikator proses validasi UU PDP dan verifikasi TTE, serta melihat klaim tersebut masuk ke dalam pipeline antrean.

### B. Penyelesaian Tantangan Deteksi Note Cloning (F6)
- **Solusi Topologi:** Di database seed, telah ditanam kasus historis donor dari DPJP yang sama pada jendela waktu 30 hari sebelumnya.
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

Jalur ini dirancang khusus untuk memenangkan dimensi evaluasi efektivitas dan kualitas teknologi di hadapan dewan juri:

1. **Navigasi Khusus:** Akses ke halaman `/benchmark/evaluation-suite`.
2. **Koleksi Dataset:** Sistem memuat **30–50 kasus klaim sintetis terstandar** dengan label kebenaran (*ground truth*):
   - Kasus Upcoding Tertanam (Komplikasi palsu tanpa bukti lab).
   - Kasus Inflated Bills & Cloning Tertanam (Selisih alkes & duplikasi catatan klinis).
   - Kasus Bersih (Klaim wajar & valid yang lolos cepat).
   - Kasus Pengganggu (*Distractor* / Salah Koding Tidak Sengaja).
3. **Eksekusi 1-Klik:** Pengguna/Juri menekan tombol *"Jalankan Uji Benchmark"*.
4. **Output Pembuktian:** Sistem menampilkan kartu metrik terukur:
   - **Recall Kasus Anomali:** $\ge 85\%$ (Membuktikan ketajaman deteksi).
   - **False Positive Rate:** $\le 15\%$ (Membuktikan sistem tidak serampangan menuduh kasus wajar).
   - **Verbatim Grounding Reliability:** $100\%$ (Membuktikan nol halusinasi).
   - **Kecepatan Analisis Rata-Rata:** $< 45$ detik/kasus.

---

## 5. Prinsip Ketahanan Sistem & Penanganan Kegagalan (System Resilience & Fallbacks)

| Potensi Kegagalan Teknis | Titik Terjadi | Mekanisme Fallback Otomatis |
|---|---|---|
| **API LLM Lambat / Timeout (> 30s)** | Modul Investigasi F4/F5 | Sistem otomatis melakukan *fallback* ke hasil filter aturan deterministik (F3) dan menyajikan status investigasi parsial tanpa membuat antrean macet. |
| **Koneksi Jaringan Eksternal Terputus** | Panggilan Model Cloud | Sistem menyediakan opsi eksekusi model lokal terisolasi (*air-gapped / local inference*) atau membaca hasil dari *state store* lokal. |
| **Pemeriksaan UU PDP Mendeteksi Data Riil** | Pintu Masuk F1 | Berkas seketika dibatalkan secara atomik; sistem tidak menyimpan residu data di disk maupun memori, dan mengembalikan kode status penolakan kepatuhan regulasi. |
| **Verifikasi TTE Digital Gagal / Rusak** | Validasi F1 | Dokumen ditandai dengan status `TTE Non-PSrE / Tidak Terverifikasi`, dan klaim dialihkan ke jalur verifikasi manual verifikator. |

---

## Kesimpulan Kesiapan Dokumen

Dengan pembaruan pada **Dokumen 3a** dan **Dokumen 3b**:
1. Seluruh alur kerja operasional telah diselaraskan dengan inisiatif *Smart Claim RME-TTE*, kepatuhan UU PDP, dan transisi ke modul pembayaran faskes.
2. Setiap fitur dirancang dengan pendekatan yang *restrained*, profesional, dan bebas dari ornamen visual buatan (*no AI slop*).
3. Dokumentasi kini menjadi acuan stabil sebelum tim melangkah ke implementasi kode frontend dan backend.
