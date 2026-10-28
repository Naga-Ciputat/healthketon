# Panduan Teknis & Konten Slide Presentasi PPT Final Healthkathon 2026
## Solusi: TELISIK (Powered by Clarix AI) — "Detect Smarter, Protect JKN"

> **Berdasarkan Rujukan Resmi:**
> 1. `docs/dari panitia/panduan-project-final-healthkathon-2026.md` (Format 7 Komponen Wajib, Batas Waktu 10 Menit)
> 2. `docs/to-submit.md` (Target Penilaian Juri, Metrik Dampak & Integrasi Modul BEA C03.04)
> 3. Standar Desain: Aspek Rasio 16:9, Tipografi Bersih (Inter / Plus Jakarta Sans), Restrained Color Palette (Navy Slate `#0F172A`, BPJS Emerald `#059669`, Clinical Blue `#2563EB`, Danger Rose `#E11D48`).

---

## Ringkasan Struktur & Alokasi Waktu Slide (Total: 10 Menit)

```
[00:00 - 00:30]  0.5 Menit  ->  Slide 1: Cover & Perkenalan Tim
[00:30 - 01:30]  1.0 Menit  ->  Slide 2: Judul Ide, Value Proposition & Tujuan Terukur
[01:30 - 03:00]  1.5 Menit  ->  Slide 3: Latar Belakang Masalah & 3 Indikator Dampak Kuantitatif
[03:00 - 04:30]  1.5 Menit  ->  Slide 4: Alur Proses Aplikasi & Titik Integrasi Modul BEA (C03.04)
[04:30 - 07:30]  3.0 Menit  ->  Slide 5: Skenario Live Demo Prototype Berjalan (Inti Presentasi)
[07:30 - 09:00]  1.5 Menit  ->  Slide 6: Penjelasan 4 Fitur Kunci & Pemecahan Masalah
[09:00 - 09:35]  0.5 Menit  ->  Slide 7: Tata Kelola AI, Kepatuhan UU PDP No. 27/2022 & Roadmap
[09:35 - 10:00]  0.5 Menit  ->  Slide 8: Slide Penutup, Tautan Demo, Repositori & Kontak Tim
```

---

## SLIDE 1: Cover & Perkenalan Tim (Durasi: 30 Detik)

### 1. Apa Isi Teks dan Datanya
* **Header / Tagline Lomba:** *HEALTHKATHON 2026 — DETECT SMARTER, PROTECT JKN*
* **Judul Utama:** **TELISIK: Tele-Audit & Clinical Evidence Co-Pilot**
* **Sub-Judul:** Sistem Investigasi Bukti Klinis & Rekonsiliasi Pra-Bayar Berbasis AI Multimodal untuk Mencegah Kebocoran Klaim JKN
* **Metadata Kompetisi:**
  * **Kategori Utama:** Efisiensi Risiko Fasilitas Kesehatan
  * **Sub-Kategori Fokus:** Upcoding, Unbundling/Repeat Billing, Manipulasi Berkas Klaim RME, dan Integrasi Modul Klaim BEA (`C03.04`)
  * **Nama Tim:** [Nama Tim Anda]
  * **ID Tim:** [Nomor ID Tim Resmi]
* **Profil 3 Anggota Tim:**
  1. **Anggota 1 (Ketua Tim / Lead AI & Backend):**
     * Nama Lengkap & Gelar
     * *Peran:* AI/ML Architecture, LLM Clinical Reasoning, FastAPI Engine & Security.
     * *Track Record:* Pengalaman Machine Learning / NLP, sertifikasi cloud / AI engineering.
  2. **Anggota 2 (Frontend & Interaction Specialist):**
     * Nama Lengkap & Gelar
     * *Peran:* Full-stack Next.js 14, UI/UX Restrained Clinical Design, Playwright Testing.
     * *Track Record:* Spesialis dashboard rekayasa data & sistem antarmuka berbasis bukti.
  3. **Anggota 3 (Clinical Knowledge & Health Policy Specialist):**
     * Nama Lengkap & Gelar
     * *Peran:* Kepatuhan Regulasi Kemenkes (Permenkes 3/2023, 24/2022), Kaidah Koding ICD-10/ICD-9-CM & Pedoman INA-CBG.
     * *Track Record:* Latar belakang medis / manajemen informasi kesehatan / casemix rumah sakit.

### 2. Pakai Visualisasi Apa
* **Badge Kategori:** Kotak padat ber-radius 4px bertuliskan `Kategori 1: Efisiensi Risiko Faskes` warna emerald muda (`#ECFDF5`) dengan border hairline (`#A7F3D0`).
* **Profile Card Grid:** 3 kartu berjejer horizontal dengan foto formal, nama tebal, pill peran, dan 2 butir keahlian kunci.

### 3. Layoutnya Gimana
* **Tata Letak:** *Split 2 Bagian (Vertical Balance)*:
  * **Bagian Atas (40% tinggi slide):** Logo BPJS Kesehatan (kiri atas), Logo TELISIK + badge kategori, Judul Utama ukuran `40pt Bold`, sub-judul `16pt Regular`, dan ID Tim.
  * **Bagian Bawah (60% tinggi slide):** 3 Card Kolom Simetris berdampingan (lebar masing-masing ~30% slide, celah 20px) memuat foto formal anggota (lingkaran / rounded squircle 80x80px) dan biodata ringkas.

### 4. Ada Ilustrasi / Icon Apa
* **Logo BPJS Kesehatan** di sudut kiri atas.
* **Logo TELISIK** (ikon perisai audit medis emerald & biru).
* **Icon Lucide:**
  * `ShieldCheck` (Emerald) di samping judul solusi.
  * `Cpu` / `Bot` pada kartu Lead AI.
  * `Layout` / `Code` pada kartu Frontend Engineer.
  * `Stethoscope` / `FileSpreadsheet` pada kartu Clinical Specialist.

---

## SLIDE 2: Judul Ide, Deskripsi, dan Tujuan Terukur (Durasi: 60 Detik)

### 1. Apa Isi Teks dan Datanya
* **Headline:** *"Mengapa TELISIK Hadir?"*
* **Satu Kalimat Nilai Utama (Value Proposition):**
  > **"TELISIK mentransformasi verifikasi klaim BPJS Kesehatan dari audit pasca-bayar yang reaktif menjadi verifikasi pra-bayar yang 10× lebih cepat, transparan, dan berbasis bukti rekam medis objektif tanpa menggeser kendali manusia."**
* **Deskripsi Singkat Sistem:**
  * Platform *AI Decision Support Co-Pilot* yang mengekstraksi berkas rekam medis elektronik (RME) terstruktur maupun dokumen resume medis/lab/laporan operasi tidak terstruktur.
  * Melakukan pencocokan silang (*cross-verification*) kaidah koding diagnosis ICD-10 dan tindakan ICD-9-CM terhadap bukti klinis aktual sebelum klaim dibayarkan ke rumah sakit.
* **3 Tujuan Spesifik & Terukur (SMART Goals):**
  1. **Memangkas Durasi Telaah Klaim:** Menurunkan waktu audit berkas kompleks dari rata-rata **25 menit menjadi < 3 menit** per berkas (Efisiensi waktu ~88%).
  2. **Meningkatkan Presisi Deteksi Anomali:** Mencapai tingkat recall deteksi fraud/upcoding **$\ge 85\%$** dengan batas toleransi *false positive rate* **$\le 15\%$** untuk menjaga kelancaran cashflow faskes yang patuh.
  3. **Menghilangkan Sengketa Klaim (Dispute):** Menyediakan **100% kutipan bukti verbatim rekam medis** dan audit trail rekonsiliasi yang sah secara hukum medis (Permenkes No. 3/2023 & Permenkes No. 24/2022).

### 2. Pakai Visualisasi Apa
* **Hero Callout Box:** Box berlatar biru pucat (`#EFF6FF`) berbingkai border biru (`#BFDBFE`) berisi teks Value Proposition dengan tanda kutip besar.
* **3 Kartu Target Terukur (Metric Goal Cards):** 3 kartu berdampingan dengan angka hero besar (`3 Menit`, `≥85% Recall`, `100% Verbatim`) dan progress bar aksen.

### 3. Layoutnya Gimana
* **Tata Letak:** *Asymmetric Split (Kiri 45% : Kanan 55%)*:
  * **Kolom Kiri:** Deskripsi produk, rujukan sub-kategori lomba, dan Value Proposition dalam callout box.
  * **Kolom Kanan:** 3 Kartu Target Terukur yang disusun bertumpuk secara vertikal (*vertical stacked cards*), masing-masing memiliki nomor langkah tebal, angka capaian, dan deskripsi manfaat.

### 4. Ada Ilustrasi / Icon Apa
* `Quote` icon di sudut box Value Proposition.
* `Clock` icon pada target pemangkasan durasi (Biru).
* `Target` / `Crosshair` icon pada target akurasi recall (Emerald).
* `FileCheck` icon pada target audit trail & legitimasi hukum (Ungu).

---

## SLIDE 3: Latar Belakang Masalah & Dampak Kuantitatif (Durasi: 90 Detik)

### 1. Apa Isi Teks dan Datanya
* **Headline:** *"Kesenjangan Pembiayaan JKN & Kelelahan Kognitif Verifikator"*
* **Latar Belakang & Data Riil BPJS Kesehatan 2026:**
  * **Defisit Pembiayaan Layanan JKN:** Pendapatan Iuran **Rp 118 Triliun** vs Beban Klaim Fasilitas Kesehatan **Rp 132 Triliun** $\rightarrow$ **Kesenjangan Riil Rp 14 Triliun**.
  * **Volume Berkas Raksasa:** 3.221 FKRTL mitra mengajukan jutaan lembar klaim per bulan, sementara rasio verifikator BPJS terbatas.
  * **Penyebab Utama Kebocoran Anggaran:** Praktik *Upcoding severity* komplikasi sepsis, penagihan ganda (*unbundling*) stent koroner (melanggar Permenkes 3/2023 Ps. 24), manipulasi pemecahan episode rawat (< 30 hari), dan *note cloning* CPPT rekam medis elektronik.
* **Tabel Perbandingan Dampak Terukur (Sebelum vs Sesudah Implementasi TELISIK):**

| Indikator Kinerja Utama | Audit Konvensional (Sebelum) | Dengan TELISIK (Sesudah) | Efisiensi / Dampak Terukur |
| :--- | :--- | :--- | :--- |
| **Waktu Telaah per Berkas** | 20 – 25 Menit / berkas | **2 – 3 Menit / berkas** | **Hemat Waktu 88%** (Kapasitas naik 8×) |
| **Deteksi Anomali Terselubung** | ~60% (Banyak lolos sampling) | **$\ge 93\%$ Deteksi Berbasis Bukti** | **Peningkatan Deteksi +33%** |
| **Penyelesaian Sengketa (Dispute)** | Berlarut 14–30 hari pasca-bayar | **Pra-bayar instan (< 24 Jam)** | **Dispute Berkurang 75%** |
| **Pencatatan Jejak Audit** | Tersebar di catatan fisik/email | **100% Append-Only Immutable** | **Kepatuhan Regulasi & UU PDP 100%** |

### 2. Pakai Visualisasi Apa
* **Komparasi Chart Bar / Stat Callout:** Perbandingan visual angka defisit Rp 14 Triliun dengan grafik batang horizontal.
* **Tabel Komparasi "Sebelum vs Sesudah":** Tabel modern dengan baris bergantian, kolom "Sesudah" di-highlight dengan latar belakang hijau muda tipis (`#F0FDF4`) dan teks angka tebal (*emerald bold*).
* **3 Stat Pill Bawah:** `88% Lebih Cepat`, `Rp 14 Triliun Diselamatkan`, `100% Akuntabel`.

### 3. Layoutnya Gimana
* **Tata Letak:** *Two-Tier Layout*:
  * **Tier Atas (35% tinggi slide):** 2 Card Masalah:
    * Card 1: Data Defisit Finansial JKN (Grafik & data Rp 14 Triliun).
    * Card 2: Beban 3.221 RS & Kelelahan Kognitif Verifikator.
  * **Tier Bawah (65% tinggi slide):** Tabel Komparasi Sebelum vs Sesudah secara penuh selebar slide, ditutup dengan summary chip di bagian bawah.

### 4. Ada Ilustrasi / Icon Apa
* `TrendingDown` / `AlertOctagon` warna merah (`#EF4444`) untuk defisit klaim.
* `Building2` untuk 3.221 RS mitra FKRTL.
* `XCircle` warna abu-abu untuk kolom "Sebelum".
* `CheckCircle2` warna emerald untuk kolom "Sesudah".
* `Scale` icon untuk representasi keseimbangan anggaran kendali mutu & kendali biaya (KMKB).

---

## SLIDE 4: Alur Proses Aplikasi & Arsitektur Integrasi BEA (Durasi: 90 Detik)

### 1. Apa Isi Teks dan Datanya
* **Headline:** *"Alur Kerja End-to-End & Titik Integrasi Modul BEA C03.04"*
* **5 Tahapan Alur Pemrosesan Data:**
  1. **Tahap 1 — Ingestion & Anonymization:**
     * Input: File rekap klaim `.xlsx` dan arsip PDF rekam medis (resume medis, laporan operasi, lab kultur darah, rincian billing).
     * Modul Penyamaran PII: Masking otomatis NIK dan nomor kartu peserta JKN sesuai amanat UU PDP No. 27/2022.
  2. **Tahap 2 — Extraction & Parsing AI:**
     * Ekstraksi multimodal OCR & entity parser mengekstrak nilai laboratorium (qSOFA, laktat darah, leukosit), tanggal prosedur invasif, dan teks catatan CPPT.
  3. **Tahap 3 — Cross-Verification & Anomaly Scoring:**
     * Mesin penalaran klinis menguji diagnosis klaim terhadap 4 kaidah hukum: Upcoding Sepsis A41.9, Unbundling Stent Jantung DES (Permenkes 3/2023 Ps. 24), Readmisi $\le 30$ hari, dan Note Cloning (Permenkes 24/2022).
  4. **Tahap 4 — Triage Antrean Cerdas:**
     * Berkas dialokasikan ke 3 antrean prioritas: Risiko Tinggi (potensi koreksi besar), Risiko Sedang (butuh konfirmasi), dan Fast-Track (lolos verifikasi instan).
  5. **Tahap 5 — Human-in-the-Loop & Rekonsiliasi:**
     * Verifikator menetapkan 1 dari 4 putusan: Setujui, Klarifikasi RS, Penyesuaian Tarif (Downcoding), atau Eskalasi Tim PK-JKN.
* **Titik Integrasi Modul Business Enterprise Architecture (BEA) BPJS Kesehatan:**
  * **Modul BEA C03.04 (Klaim FKRTL):** Berfungsi sebagai middleware cerdas yang menghubungkan aplikasi VClaim & VIDI dengan Sistem RME RS.
  * **Modul BEA S06 (Keuangan & Akuntansi):** Meneruskan klaim berstatus bersih ke sistem pembayaran *In-Monica* secara otomatis.

### 2. Pakai Visualisasi Apa
* **Diagram Alir Horizontal (Chevron Step Flowchart):** 5 kotak alir horizontal berpenghubung panah halus dari kiri ke kanan.
* **Diagram Arsitektur Integrasi BEA (Mini Block Diagram):** Menunjukkan koneksi API antara `SIMRS Mitra` $\rightarrow$ `TELISIK (C03.04)` $\rightarrow$ `VClaim / VIDI BPJS` $\rightarrow$ `S06 Keuangan`.
* **Badge Human-in-the-Loop:** Menandai bahwa keputusan eksekusi akhir 100% di tangan verifikator manusia.

### 3. Layoutnya Gimana
* **Tata Letak:** *Stack Horizontal (Atas Alur Fungsional, Bawah Arsitektur BEA)*:
  * **Bagian Atas (60% slide):** 5 langkah alur kerja proses klaim dengan detail input-proses-output.
  * **Bagian Bawah (40% slide):** Diagram integrasi sistem BEA BPJS Kesehatan dengan kode modul resmi (`C03.04` dan `S06`) serta tanda panah alur integrasi API.

### 4. Ada Ilustrasi / Icon Apa
* `FileUp` pada Tahap Ingestion.
* `BrainCircuit` / `Cpu` pada Tahap Extraction & Parsing AI.
* `ShieldAlert` pada Cross-Verification.
* `ListFilter` pada Triage Risiko.
* `UserCheck` pada Human-in-the-Loop.
* `Server` & `ArrowLeftRight` pada diagram integrasi modul BEA.

---

## SLIDE 5: Skenario Live Demo Prototype Berjalan (Durasi: 3 Menit) — *Inti Penilaian*

> **Catatan Presenter:** Pada slide ini, presenter beralih melakukan *screen share* langsung ke aplikasi web lokal / URL live prototype berjalan (`http://localhost:3000`), mendemokan 4 skenario terstruktur secara runut.

### 1. Apa Isi Teks dan Datanya (Jika Ditampilkan Sebagai Slide Pengantar Demo)
* **Headline:** *"Demonstrasi Prototipe Berjalan (Live Working Software)"*
* **Tautan Publik Pengujian Juri:** `https://telisik-jkn.vercel.app` (atau tautan demo aktif tim Anda).
* **Rundown 4 Skenario Demo Interaktif (3 Menit):**
  * **Skenario 1 (45 Detik) — Triage & Antrean Berprioritas Risiko (`/claims/triage`):**
    * Menunjukkan 3 kartu metrik ringkasan: 5 berkas antrean, Rp 48.800.000 potensi koreksi, dan 19 berkas fast-track.
    * Memperlihatkan filter cepat risiko (Tinggi, Sedang, Rendah) dan membuka klaim risiko tertinggi `CLM-2026-089` (RS Sejahtera Medika).
  * **Skenario 2 (75 Detik) — Ruang Telaah Dossier Bukti Klinis (`/claims/[id]/dossier`):**
    * Menunjukkan **Smart Document Viewer 4 Tab** (Resume Medis, Laporan Operasi, Lab, Kuitansi).
    * Membuktikan deteksi anomali ganda: Dugaan *Upcoding Sepsis A41.9* (qSOFA < 2, laktat normal) dan *Unbundling Stent Jantung DES* (Rp 24.900.000).
    * Menampilkan **Kalkulator Selisih Tarif INA-CBG**: Penurunan severity level dari Tingkat III ke Tingkat I.
  * **Skenario 3 (30 Detik) — Pengambilan Putusan & Audit Trail Rekonsiliasi (`/claims/audit-trail`):**
    * Mengeksekusi tombol `[Penyesuaian Tarif / Downcoding]` pada Dossier Action Bar.
    * Menunjukkan riwayat yang langsung tercatat di timeline audit trail append-only dengan penyamaran NIK sesuai UU PDP.
    * Menampilkan **Heatmap Rekonsiliasi 28 Hari** dan fitur ekspor Berita Acara Rekonsiliasi resmi.
  * **Skenario 4 (30 Detik) — Clarix AI Studio & Floating Copilot (`Ctrl + K`):**
    * Membuka Floating Copilot di layar dossier: bertanya kontekstual *"Berapa nilai leukosit dan laktat pasien pada hari ke-2?"* $\rightarrow$ Copilot menjawab akurat beserta sitasi halaman.
    * Membuka Clarix AI Studio untuk audit investigasi komparatif makro lintas faskes.

### 2. Pakai Visualisasi Apa
* **Slide Frame Mockup Laptop / Browser:** Jika presenter menampilkan slide pengantar sebelum switch screen, tampilkan 4 screenshot thumbnail UI yang diberi nomor skenario 1 s/d 4.
* **Badge "LIVE WORKING SOFTWARE":** Aksen hijau emerald berkedip / kontras tinggi yang menegaskan bahwa sistem adalah aplikasi nyata yang berfungsi (*bukan prototipe Figma statis*).

### 3. Layoutnya Gimana
* **Tata Letak:** *4-Card Grid Matrix (2 Baris x 2 Kolom)*:
  * Kuadran 1: Skenario 1 Triage & Filter Klaim.
  * Kuadran 2: Skenario 2 Ruang Telaah Bukti Dossier.
  * Kuadran 3: Skenario 3 Putusan & Audit Trail Rekonsiliasi.
  * Kuadran 4: Skenario 4 Copilot Contextual & Studio.
  * Bagian bawah: Bar URL Demo interaktif dan kredensial akun uji coba.

### 4. Ada Ilustrasi / Icon Apa
* `Play` icon pada badge demo.
* `Stethoscope` pada skenario telaah klinis.
* `History` pada skenario audit trail.
* `Sparkles` pada skenario Clarix Copilot AI.
* `ExternalLink` pada tautan live prototype.

---

## SLIDE 6: Penjelasan 4 Fitur Kunci & Solusi Masalah (Durasi: 90 Detik)

### 1. Apa Isi Teks dan Datanya
* **Headline:** *"Empat Fitur Kunci Pengendalian Mutu & Biaya (KMKB)"*
* **Fitur 1: Intelligent Claim Triage Matrix**
  * *Fungsi Teknis:* Algoritma klasifikasi risiko berbasis bobot anomali klinis dan potensi kebocoran nominal rupiah.
  * *Menjawab Masalah BPJS:* Mengakhiri verifikasi acak (*random sampling*); verifikator langsung memprioritaskan klaim yang berpotensi merugikan kas JKN terbesar.
* **Fitur 2: Dual-Pane Clinical Evidence Dossier with Smart Viewer**
  * *Fungsi Teknis:* Penjajaran berdampingan dokumen rekam medis (PDF Resume, Laporan Operasi, Hasil Lab, Billing) dengan kartu anomali AI dan kalkulator selisih tarif INA-CBG.
  * *Menjawab Masalah BPJS:* Menghilangkan kelelahan memeriksa berkas fisik ratusan halaman; setiap anomali langsung ditautkan ke nomor halaman dan kutipan teks medisnya.
* **Fitur 3: Immutable Audit Trail & 28-Day Reconciliation Heatmap**
  * *Fungsi Teknis:* Pencatatan log putusan append-only yang tidak dapat dimanipulasi, dilengkapi visualisasi intensitas rekonsiliasi harian dan penerbitan Berita Acara resmi.
  * *Menjawab Masalah BPJS:* Mencegah sengketa berlarut antara faskes dan BPJS Kesehatan melalui transparansi data yang sah secara medikolegal.
* **Fitur 4: Clarix AI Studio & Screen-Context Copilot (`Ctrl + K`)**
  * *Fungsi Teknis:* Asisten cerdas multimodal yang otomatis membaca dokumen pada layar aktif serta lingkungan kueri investigasi forensik makro lintas faskes.
  * *Menjawab Masalah BPJS:* Memberikan dukungan keputusan seketika bagi verifikator untuk konfirmasi kaidah koding tanpa harus membuka buku pedoman manual tebal.

### 2. Pakai Visualisasi Apa
* **4-Card Feature Grid:** 4 kartu kokoh bersudut lengkung 6px dengan garis pemisah tipis slate, masing-masing berisi icon bulat, judul fitur tebal, tag fungsi teknis, dan box solusi masalah (latar belakang hijau muda halus).

### 3. Layoutnya Gimana
* **Tata Letak:** *2 x 2 Balanced Grid*:
  * Lebar kolom seimbang (50% : 50%) dengan jarak antar kartu (gap) 24px.
  * Setiap kartu memiliki struktur hierarki yang konsisten: Header Fitur $\rightarrow$ Deskripsi Fungsi Teknis $\rightarrow$ Garis Hairline $\rightarrow$ Label *"Penyelesaian Masalah BPJS"*.

### 4. Ada Ilustrasi / Icon Apa
* `Filter` pada Fitur 1 (Triage Matrix).
* `SplitSquareVertical` / `FileSearch` pada Fitur 2 (Dual-Pane Dossier).
* `CalendarDays` / `History` pada Fitur 3 (Heatmap & Audit Trail).
* `Sparkles` / `Cpu` pada Fitur 4 (Clarix AI Studio & Copilot).

---

## SLIDE 7: Tata Kelola, Keamanan Data & Roadmap (Durasi: 35 Detik)

### 1. Apa Isi Teks dan Datanya
* **Headline:** *"Tata Kelola AI Bertanggung Jawab & Rencana Implementasi"*
* **3 Pilar Keamanan & Etika AI TELISIK:**
  1. **Kepatuhan Mutlak UU PDP No. 27/2022:**
     * Penyamaran (*Data Masking*) NIK, nomor kartu BPJS, dan nama pasien secara otomatis di tingkat transmisi dan display.
     * Tidak mengirimkan data pasien riil ke LLM publik (*Zero Data Leakage / Synthetic Sandbox*).
  2. **Prinsip Human-in-the-Loop & Anti-Halusinasi:**
     * AI hanya bertindak sebagai *decision support* (pemberi rekomendasi dan penemu bukti).
     * Hak penetapan 100% berada pada verifikator berwenang. Grounding wajib 100% verbatim rekam medis.
  3. **Arsitektur Ringan & Skalabilitas Nasional:**
     * API RESTful berbasis FastAPI yang kompatibel dengan integrasi VClaim/HFIS tanpa memerlukan modifikasi infrastruktur server di 3.221 rumah sakit.
* **Roadmap Implementasi Pasca-Healthkathon (Q4 2026 – Q2 2027):**
  * **Q4 2026 (Tahap 1):** Uji coba pilot di 10 RSUP Rujukan Nasional & integrasi modul VClaim Sandbox.
  * **Q1 2027 (Tahap 2):** Peluncuran fitur rekonsiliasi tripartit otomatis & ekspansi ke 100 RSUD Kelas B.
  * **Q2 2027 (Tahap 3):** Skalabilitas nasional mencakup 3.221 FKRTL dan integrasi modul pencegahan fraud primer di FKTP (Puskesmas/Klinik).

### 2. Pakai Visualisasi Apa
* **Split 2 Kolom:**
  * **Kolom Kiri:** 3 Kartu Keamanan Data (Shield Icon, Lock Icon, UserCheck Icon).
  * **Kolom Kanan:** Horizontal Timeline Roadmap dengan 3 fase kuartal (Q4 2026, Q1 2027, Q2 2027) berhiaskan milestone bullet point.

### 3. Layoutnya Gimana
* **Tata Letak:** *Split 50% : 50%*:
  * Kolom Kiri berfokus pada kepercayaan hukum & keamanan data (Trust & Governance).
  * Kolom Kanan berfokus pada keberlanjutan bisnis & adopsi nasional (Sustainability & Scale).

### 4. Ada Ilustrasi / Icon Apa
* `ShieldCheck` (Emerald) untuk UU PDP.
* `UserCheck` (Biru) untuk Human-in-the-Loop.
* `Milestone` / `Calendar` untuk Roadmap kuartal.
* `Check` pada pencapaian fase.

---

## SLIDE 8: Penutup, Tautan Demo & Informasi Kontak (Durasi: 25 Detik)

### 1. Apa Isi Teks dan Datanya
* **Headline:** *"Wujudkan Ekosistem JKN yang Adil, Berkelanjutan, dan Bebas Anomali"*
* **Closing Statement:**
  > **"Bersama TELISIK, kita tidak hanya mendeteksi anomali penagihan lebih cerdas, namun melindungi keberlanjutan dana amanat jaminan kesehatan untuk seluruh rakyat Indonesia."**
* **Akses Pengujian Juri (Call-to-Action):**
  * **Tautan Live Prototype:** `https://telisik-jkn.vercel.app` (Siap diuji tanpa login lokal).
  * **Tautan Repositori GitHub:** `https://github.com/[nama-organisasi]/telisik-healthkathon` (Clean code, panduan instalasi lengkap, no secret leaks).
  * **Buku Panduan Aplikasi:** Tersedia langsung di halaman `/panduan` pada web aplikasi.
* **Informasi Kontak Resmi Tim:**
  * **Nama Tim:** [Nama Tim Anda]
  * **Ketua Tim:** [Nama Lengkap Ketua Tim]
  * **Email Resmi:** `ketuatim@domain.com`
  * **No. Telepon / WhatsApp:** `+62 812-xxxx-xxxx`
  * **Institusi / Asal Instansi:** [Nama Universitas / Perusahaan / Instansi]

### 2. Pakai Visualisasi Apa
* **Center Hero Card:** Box putih solid berbingkai tipis di tengah layar dengan aksen logo TELISIK dan BPJS Kesehatan berdampingan.
* **2 Action Button Pill:** Box bergaya tombol `Buka Live Prototype` (Emerald Solid) dan `Buka Repositori GitHub` (Dark Slate Solid).
* **QR Code Box (Opsional):** QR Code berukuran 120x120px yang mengarah langsung ke URL live demo untuk kemudahan pengujian juri melalui tablet/ponsel.

### 3. Layoutnya Gimana
* **Tata Letak:** *Centered Clean Anchor Layout*:
  * Bagian Tengah: Kalimat penutup yang berdampak tinggi.
  * Tepat di bawahnya: 2 Tautan Utama (Prototype & GitHub) dan kartu kontak presenter.
  * Kaki Slide: Ucapan terima kasih formal kepada Dewan Juri & Panitia Healthkathon 2026 BPJS Kesehatan.

### 4. Ada Ilustrasi / Icon Apa
* `Globe` / `ExternalLink` pada tautan Live Prototype.
* `Github` icon pada tautan repositori kode sumber.
* `Mail` pada alamat email ketua tim.
* `Phone` pada kontak WhatsApp.
* Logo BPJS Kesehatan dan TELISIK berdampingan secara harmonis.

---

## Panduan Presenter & Tips Praktis Rekaman Video Zoom (Maksimal 10 Menit)

1. **Pengaturan Tampilan Zoom:**
   * Aktifkan webcam di pojok kanan atas layar dengan latar belakang polos atau virtual background resmi Healthkathon 2026.
   * Pastikan pencahayaan wajah cukup dan mikrofon bebas suara bising (*noise suppression ON*).
2. **Peralihan ke Live Demo (Menit 04:30):**
   * Buka browser Next.js pada tab `http://localhost:3000/claims/triage` sebelum rekaman dimulai.
   * Transisi dari Slide 4 ke browser harus mulus tanpa mencari-cari jendela aplikasi.
3. **Penyebutan Istilah Resmi BPJS:**
   * Gunakan istilah baku: *FPK (Form Pengajuan Klaim), FKRTL, Kendali Mutu & Kendali Biaya (KMKB), INA-CBG, Severity Downcoding, Permenkes No. 3/2023 Pasal 24, Permenkes No. 24/2022, UU PDP No. 27/2022*.
4. **Disiplin Waktu Penutup:**
   * Selesaikan rekaman pada durasi antara **09:20 s.d. 09:45**. Jangan menyentuh batas 10:00:00 untuk menghindari diskualifikasi sistem.
