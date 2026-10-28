# Panduan Teknis & Konten Slide Presentasi PPT Final Healthkathon 2026
## Solusi: TELISIK (Powered by Clarix AI) — "Detect Smarter, Protect JKN"

> **Berdasarkan Rujukan Resmi:**
> 1. `docs/dari panitia/panduan-project-final-healthkathon-2026.md` (Format 7 Komponen Wajib, Batas Waktu 10 Menit)
> 2. `docs/to-submit.md` (Target Penilaian Juri, Metrik Dampak & Integrasi Modul BEA C03.04)
> 3. **Pilar Utama Inovasi:** **Agentic AI Architecture** (Autonomous Multi-Step Clinical Reasoning, Tool Calling, Screen-Context Ingestion, Bounded Agency Human-in-the-Loop)
> 4. Standar Desain: Aspek Rasio 16:9, Tipografi Bersih (Inter / Plus Jakarta Sans), Restrained Color Palette (Navy Slate `#0F172A`, BPJS Emerald `#059669`, Clinical Blue `#2563EB`, Danger Rose `#E11D48`).

---

## Ringkasan Struktur & Alokasi Waktu Slide (Total: 10 Menit)

```
[00:00 - 00:30]  0.5 Menit  ->  Slide 1: Cover & Perkenalan Tim (Highlight: Agentic AI Focus)
[00:30 - 01:30]  1.0 Menit  ->  Slide 2: Judul Ide, Value Proposition & Tujuan Terukur Agentic AI
[01:30 - 03:00]  1.5 Menit  ->  Slide 3: Masalah Finansial JKN & Mengapa Solusi Pasif Gagal vs Agentic AI
[03:00 - 04:30]  1.5 Menit  ->  Slide 4: Arsitektur Agentic AI Workflow & Titik Integrasi Modul BEA (C03.04)
[04:30 - 07:30]  3.0 Menit  ->  Slide 5: Skenario Live Demo Working Software (Agent In Action)
[07:30 - 09:00]  1.5 Menit  ->  Slide 6: Penjelasan 4 Fitur Kunci Berbasis Agentic Architecture
[09:00 - 09:35]  0.5 Menit  ->  Slide 7: Tata Kelola Agentic AI (Bounded Agency, UU PDP & Roadmap)
[09:35 - 10:00]  0.5 Menit  ->  Slide 8: Slide Penutup, Tautan Demo, Repositori & Kontak Tim
```

---

## SLIDE 1: Cover & Perkenalan Tim (Durasi: 30 Detik)

### 1. Apa Isi Teks dan Datanya
* **Header / Tagline Lomba:** *HEALTHKATHON 2026 — DETECT SMARTER, PROTECT JKN*
* **Judul Utama:** **TELISIK: Tele-Audit & Clinical Evidence Co-Pilot**
* **Sub-Judul Hero:** **Sistem Agentic AI Investigasi Bukti Klinis & Rekonsiliasi Pra-Bayar untuk Mencegah Kebocoran Klaim JKN**
* **Metadata Kompetisi:**
  * **Kategori Utama:** Efisiensi Risiko Fasilitas Kesehatan
  * **Sub-Kategori Fokus:** Upcoding, Unbundling/Repeat Billing, Manipulasi Berkas Klaim RME, dan Integrasi Modul Klaim BEA (`C03.04`)
  * **Nama Tim:** [Nama Tim Anda]
  * **ID Tim:** [Nomor ID Tim Resmi]
* **Profil 3 Anggota Tim:**
  1. **Anggota 1 (Ketua Tim / Lead Agentic AI & Backend):**
     * Nama Lengkap & Gelar
     * *Peran:* Agentic Workflow Architecture, Multi-Step LLM Reasoning, Tool Invocation & Security.
     * *Track Record:* Pengalaman riset Agentic AI / LLM orchestration, sertifikasi cloud / AI engineering.
  2. **Anggota 2 (Frontend & Interaction Specialist):**
     * Nama Lengkap & Gelar
     * *Peran:* Full-stack Next.js 14, Live Screen Context Pipeline, Restrained Clinical UI.
     * *Track Record:* Spesialis dashboard rekayasa data medis & interaksi manusia-agen (*human-agent collaboration*).
  3. **Anggota 3 (Clinical Knowledge & Health Policy Specialist):**
     * Nama Lengkap & Gelar
     * *Peran:* Domain Knowledge Engineering (Permenkes 3/2023, Permenkes 24/2022, PNPK Sepsis) & Kaidah INA-CBG.
     * *Track Record:* Latar belakang medis / manajemen informasi kesehatan / casemix rumah sakit.

### 2. Pakai Visualisasi Apa
* **Badge Kategori & Teknologi:** Dua kotak padat ber-radius 4px:
  * `Kategori 1: Efisiensi Risiko Faskes` (Emerald solid `#ECFDF5`, border `#A7F3D0`)
  * `Core Innovation: Agentic AI System` (Blue solid `#EFF6FF`, border `#BFDBFE`)
* **Profile Card Grid:** 3 kartu berjejer horizontal dengan foto formal, nama tebal, pill peran teknis, dan keahlian spesifik.

### 3. Layoutnya Gimana
* **Tata Letak:** *Split 2 Bagian (Vertical Balance)*:
  * **Bagian Atas (42% tinggi slide):** Logo BPJS Kesehatan (kiri atas), Logo TELISIK + 2 badge kategori, Judul Utama ukuran `40pt Bold`, sub-judul `16pt Regular`, dan ID Tim.
  * **Bagian Bawah (58% tinggi slide):** 3 Card Kolom Simetris berdampingan (lebar masing-masing ~30% slide, celah 20px) memuat foto formal anggota (lingkaran / rounded squircle 80x80px) dan biodata ringkas.

### 4. Ada Ilustrasi / Icon Apa
* **Logo BPJS Kesehatan** di sudut kiri atas.
* **Logo TELISIK** (ikon perisai audit medis emerald & biru).
* **Icon Lucide:**
  * `Bot` / `Cpu` (Emerald/Biru) di samping judul sub-kategori untuk menandai kapabilitas Agentic AI.
  * `BrainCircuit` pada kartu Lead AI.
  * `Layout` / `Layers` pada kartu Frontend Engineer.
  * `Stethoscope` / `FileSpreadsheet` pada kartu Clinical Specialist.

---

## SLIDE 2: Judul Ide, Deskripsi, dan Tujuan Terukur (Durasi: 60 Detik)

### 1. Apa Isi Teks dan Datanya
* **Headline:** *"Mengapa Harus Agentic AI?"*
* **Satu Kalimat Nilai Utama (Value Proposition):**
  > **"TELISIK mentransformasi verifikasi klaim BPJS Kesehatan melalui arsitektur Agentic AI: agen klinis otonom berpenalaran multi-tahap (multi-step reasoning) yang menginvestigasi bukti rekam medis, memvalidasi kaidah koding, dan mengkalkulasi selisih tarif secara mandiri tanpa menghilangkan kendali mutlak verifikator manusia."**
* **Deskripsi Singkat Sistem (4 Menu Operasional Utama di Aplikasi):**
  * Platform *Agentic Decision Support System* yang dioperasikan melalui **4 Menu Operasional Terintegrasi** pada antarmuka aplikasi TELISIK:
    1. **Triage & Antrean Klaim (`/claims/triage`):** Screening otonom dan klasifikasi prioritas risiko berkas FPK masuk, terhubung langsung ke **Ruang Telaah Dossier Bukti Klinis** (`/claims/[id]/dossier`) dengan Smart Document Viewer 4 tab & Kalkulator Selisih Tarif INA-CBG.
    2. **Audit Trail & Arsip (`/claims/audit-trail`):** Repositori log putusan append-only dengan kepatuhan UU PDP (masking NIK/No. Kartu), matriks Heatmap Rekonsiliasi 28 Hari, dan penerbitan Berita Acara resmi.
    3. **Uji Kasus Benchmark (`/benchmark`):** Suite evaluasi ilmiah untuk membuktikan performa AI kepada dewan juri dan auditor teknis (Recall $\ge 85\%$, Toleransi FPR $\le 15\%$, Grounding Verbatim 100%, dan Confusion Matrix).
    4. **Clarix AI Studio (`/clarix-ai`):** Konsol investigasi forensik makro lintas faskes untuk analisis tren fraud dan simulasi regulasi, didampingi **Floating Clarix Copilot (`Ctrl + K`)** untuk telaah mikro dengan context-awareness layar aktif.
* **3 Tujuan Spesifik & Terukur (SMART Goals):**
  1. **Memangkas Durasi Telaah:** Dari rata-rata **25 menit menjadi < 3 menit** per berkas (Efisiensi 88%) karena agen mengumpulkan bukti dan mengkalkulasi selisih secara otomatis.
  2. **Presisi Deteksi Anomali $\ge 85\%$ (Toleransi FPR $\le 15\%$):** Agen mengeliminasi lolosnya upcoding terselubung tanpa mengorbankan faskes yang patuh.
  3. **100% Legally Defensible & Zero Hallucination:** Setiap rekomendasi putusan agen terikat (*tool-grounded*) pada kutipan teks rekam medis asli dan pasal regulasi resmi.

### 2. Pakai Visualisasi Apa
* **Hero Callout Box:** Box berlatar biru pucat (`#EFF6FF`) berbingkai border biru (`#BFDBFE`) berisi teks Value Proposition dengan tanda kutip besar.
* **Diagram Konsep "Agentic Tool Calling":** Ilustrasi alir Agen Pusat yang secara otonom mengontrol 4 tools deterministik.
* **3 Kartu Target Terukur (Metric Goal Cards):** 3 kartu berdampingan dengan angka hero besar (`< 3 Menit`, `≥85% Recall`, `100% Verbatim Grounding`).

### 3. Layoutnya Gimana
* **Tata Letak:** *Asymmetric Split (Kiri 45% : Kanan 55%)*:
  * **Kolom Kiri:** Value Proposition dalam callout box tebal dan penjelasan arsitektur *Agent + Tools* (mengapa melampaui AI generatif biasa).
  * **Kolom Kanan:** 3 Kartu Target Terukur yang disusun bertumpuk secara vertikal (*vertical stacked cards*), masing-masing memiliki nomor langkah tebal, angka capaian, dan deskripsi manfaat.

### 4. Ada Ilustrasi / Icon Apa
* `Quote` icon di sudut box Value Proposition.
* `Wrench` / `Cpu` icon pada penjelasan *Tool-Calling Agent*.
* `Clock` icon pada target pemangkasan durasi (Biru).
* `Target` / `Crosshair` icon pada target akurasi recall (Emerald).
* `ShieldCheck` icon pada target grounding 100% (Ungu).

---

## SLIDE 3: Latar Belakang Masalah & Dampak Kuantitatif (Durasi: 90 Detik)

### 1. Apa Isi Teks dan Datanya
* **Headline:** *"Kesenjangan Pembiayaan JKN & Mengapa Solusi Konvensional Gagal"*
* **Latar Belakang & Data Riil BPJS Kesehatan 2026:**
  * **Defisit Pembiayaan Layanan JKN:** Pendapatan Iuran **Rp 118 Triliun** vs Beban Klaim Fasilitas Kesehatan **Rp 132 Triliun** $\rightarrow$ **Kesenjangan Riil Rp 14 Triliun**.
  * **Kelemahan Solusi Konvensional:**
    * *Rule-Based Kaku (If-Else):* Gagal menangkap manipulasi terselubung dalam narasi bebas dokter (*unstructured clinical notes*).
    * *Chatbot / LLM Biasa:* Rawan halusinasi, tidak memiliki akses data tarif resmi, dan tidak dapat dipertanggungjawabkan secara hukum medis.
    * *Audit Pasca-Bayar:* Memicu sengketa berkepanjangan dan pengembalian dana yang merusak hubungan kemitraan dengan 3.221 RS.
* **Tabel Komparasi Paradigma (Audit Konvensional vs AI Pasif vs Agentic AI TELISIK):**

| Parameter | Audit Manual / Rule-Based | LLM Pasif / Chatbot | Agentic AI TELISIK (Solusi) |
| :--- | :--- | :--- | :--- |
| **Kecepatan Telaah** | 20 – 25 Menit / klaim | 10 – 15 Menit (copy-paste prompt) | **< 3 Menit / klaim (Otonom)** |
| **Penalaran Klinis** | Tidak ada (hanya cocokkan kode) | Generatif (Beresiko halusinasi) | **Multi-Step Reasoning + Tool Grounded** |
| **Deteksi Anomali Terselubung** | ~60% (Sering lolos sampling) | ~70% (Inkonsisten) | **$\ge 93\%$ Berbasis Bukti Nyata** |
| **Kalkulasi Selisih Finansial** | Dihitung manual verifikator | Tidak bisa menghitung akurat | **Otomatis via INA-CBG Engine** |
| **Penyelesaian Dispute** | 14 – 30 Hari Pasca-Bayar | Tidak ada bukti legal | **Pra-Bayar Instan (< 24 Jam)** |

### 2. Pakai Visualisasi Apa
* **Komparasi Chart Bar / Stat Callout:** Perbandingan visual angka defisit Rp 14 Triliun dengan grafik batang horizontal.
* **Tabel Perbandingan 3 Paradigma:** Menunjukkan keunggulan mutlak *Agentic AI* di kolom ketiga dengan latar belakang hijau muda tipis (`#F0FDF4`) dan teks angka tebal (*emerald bold*).
* **3 Stat Pill Bawah:** `88% Lebih Cepat`, `Rp 14 Triliun Diselamatkan`, `100% Anti-Halusinasi`.

### 3. Layoutnya Gimana
* **Tata Letak:** *Two-Tier Layout*:
  * **Tier Atas (35% tinggi slide):** 2 Card Masalah:
    * Card 1: Data Defisit Finansial JKN (Grafik & data Rp 14 Triliun).
    * Card 2: Mengapa *Rule-Based* & *LLM Biasa* Tidak Cukup untuk Klaim Medis Kompleks.
  * **Tier Bawah (65% tinggi slide):** Tabel Perbandingan Paradigma 3 Kolom secara penuh selebar slide.

### 4. Ada Ilustrasi / Icon Apa
* `TrendingDown` / `AlertOctagon` warna merah (`#EF4444`) untuk defisit klaim.
* `XCircle` warna abu-abu untuk rule-based.
* `AlertTriangle` warna kuning untuk LLM pasif.
* `CheckCircle2` warna emerald untuk Agentic AI TELISIK.
* `Scale` icon untuk representasi kendali mutu & kendali biaya (KMKB).

---

## SLIDE 4: Arsitektur Agentic AI Workflow & Integrasi BEA (Durasi: 90 Detik)

### 1. Apa Isi Teks dan Datanya
* **Headline:** *"Arsitektur Agentic AI: Siklus Otonom Persepsi, Penalaran, dan Eksekusi"*
* **5 Tahapan Siklus Agentic AI TELISIK:**
  1. **Perception (Multimodal Ingestion & Masking):**
     * Agen menerima berkas FPK (`.xlsx`) dan rekam medis digital (PDF resume medis, laporan operasi, lab kultur darah, billing).
     * Modul penyamaran PII otomatis menyamarkan identitas pasien (UU PDP No. 27/2022).
  2. **Multi-Step Reasoning (Penalaran Klinis Berjenjang):**
     * Agen membedah klaim menjadi hipotesis audit: *Apakah kriteria sepsis terpenuhi? Apakah stent ditagihkan ganda? Apakah ada readmisi < 30 hari?*
  3. **Deterministic Tool Invocation (Pemanggilan Alat Bantu):**
     * Agen memanggil *Tariff Calculator Tool* untuk menghitung selisih rupiah penyesuaian tarif INA-CBG.
     * Agen memanggil *Regulation Knowledge Tool* untuk mengonfirmasi pasal Permenkes 3/2023 & Permenkes 24/2022.
  4. **Self-Reflection & Verbatim Grounding:**
     * Agen memeriksa silang hasil temuan dengan kutipan dokumen asli (mengunci nomor halaman dan teks verbatim bukti).
  5. **Bounded Agency & Action Formulation:**
     * Agen memformulasikan 4 opsi rekomendasi putusan dan menyusun draf Berita Acara Rekonsiliasi untuk dieksekusi oleh verifikator (*Human-in-the-Loop*).
* **Titik Integrasi Modul Business Enterprise Architecture (BEA) BPJS Kesehatan:**
  * **Modul BEA C03.04 (Klaim FKRTL):** Bertindak sebagai *agentic gateway* yang menyinkronkan data VClaim, VIDI, dan RME rumah sakit.
  * **Modul BEA S06 (Keuangan & Akuntansi):** Meneruskan klaim berstatus lolos/bersih langsung ke modul pembayaran *In-Monica*.

### 2. Pakai Visualisasi Apa
* **Diagram Arsitektur Agentic Loop (Perception $\rightarrow$ Reasoning $\rightarrow$ Tool Invocation $\rightarrow$ Action Proposal):** Diagram melingkar modern dengan panah berputar yang memperlihatkan siklus kerja agen klinis.
* **Diagram Arsitektur Integrasi BEA (Mini Block Diagram):** Menunjukkan koneksi API antara `SIMRS Mitra` $\rightarrow$ `TELISIK Agentic Engine (C03.04)` $\rightarrow$ `VClaim / VIDI BPJS` $\rightarrow$ `S06 Keuangan`.
* **Badge Bounded Agency:** Menegaskan bahwa agen tidak mengeksekusi transfer uang tanpa otorisasi manusia.

### 3. Layoutnya Gimana
* **Tata Letak:** *Stack Horizontal (Atas Alur Agentic Loop, Bawah Arsitektur BEA)*:
  * **Bagian Atas (60% slide):** Diagram 5 tahap arsitektur kerja Agentic AI dengan rincian pemanggilan tools.
  * **Bagian Bawah (40% slide):** Diagram integrasi sistem BEA BPJS Kesehatan dengan kode modul resmi (`C03.04` dan `S06`) serta tanda panah alur integrasi API.

### 4. Ada Ilustrasi / Icon Apa
* `Eye` pada Perception.
* `Brain` pada Multi-Step Reasoning.
* `Wrench` pada Tool Invocation.
* `FileSearch` pada Verbatim Grounding.
* `UserCheck` pada Bounded Agency (Human-in-the-Loop).
* `Server` & `ArrowLeftRight` pada diagram modul BEA.

---

## SLIDE 5: Skenario Live Demo Working Software (Durasi: 3 Menit) — *Inti Penilaian*

> **Catatan Presenter:** Pada slide ini, presenter beralih melakukan *screen share* langsung ke aplikasi web lokal / URL live prototype berjalan (`http://localhost:3000`), mendemokan **Agentic AI In Action** secara langsung.

### 1. Apa Isi Teks dan Datanya (Jika Ditampilkan Sebagai Slide Pengantar Demo)
* **Headline:** *"Demonstrasi Agentic AI Bekerja (Live Working Software)"*
* **Tautan Publik Pengujian Juri:** `https://telisik-jkn.vercel.app` (atau tautan demo aktif tim Anda).
* **Rundown 4 Skenario Demo Interaktif (3 Menit):**
  * **Skenario 1 (45 Detik) — Autonomous Triage & Priority Scoring (`/claims/triage`):**
    * Tunjukkan bagaimana agen mengelompokkan 5 berkas antrean, mendeteksi potensi koreksi **Rp 48.800.000**, dan memisahkan 19 berkas fast-track.
    * Pilih klaim prioritas risiko tertinggi `CLM-2026-089` (RS Sejahtera Medika).
  * **Skenario 2 (75 Detik) — Ruang Telaah Dossier: Agen Memanggil Tools Bukti Klinis (`/claims/[id]/dossier`):**
    * Tunjukkan bagaimana agen otomatis menautkan bukti rekam medis:
      * *Upcoding Sepsis A41.9:* Agen menemukan skor qSOFA < 2 dan kultur darah negatif pada Tab Lab $\rightarrow$ severity di-downcode dari Tingkat III ke I.
      * *Unbundling Stent Jantung DES:* Agen mendeteksi tagihan implan terpisah pada Tab Billing $\rightarrow$ merujuk Permenkes 3/2023 Ps. 24.
    * Tunjukkan **Kalkulator Selisih Tarif INA-CBG** yang dioperasikan secara presisi oleh agen (selisih Rp 24.900.000).
  * **Skenario 3 (30 Detik) — Action Proposal & Rekonsiliasi Otomatis (`/claims/audit-trail`):**
    * Eksekusi tombol `[Penyesuaian Tarif / Downcoding]` pada Dossier Action Bar.
    * Tunjukkan agen menyusun draf surat resmi berita acara dan mencatat log append-only dengan penyamaran NIK sesuai UU PDP.
    * Tampilkan **Heatmap Rekonsiliasi 28 Hari** untuk monitoring kinerja faskes.
  * **Skenario 4 (30 Detik) — Context-Aware Copilot (`Ctrl + K`) & Macro Forensic Studio (`/clarix-ai`):**
    * Buka Copilot di layar dossier: uji **Live Screen Context Ingestion** dengan pertanyaan *"Berapa nilai laktat pada hari ke-2 dan apa implikasinya terhadap koding sepsis?"* $\rightarrow$ Copilot menjawab instan dengan grounding sitasi halaman.
    * Buka Clarix AI Studio untuk investigasi anomali makro lintas seluruh RS mitra.

### 2. Pakai Visualisasi Apa
* **Slide Frame Mockup Laptop / Browser:** Jika presenter menampilkan slide pengantar sebelum switch screen, tampilkan 4 screenshot thumbnail UI yang diberi nomor skenario 1 s/d 4.
* **Badge "AGENTIC SYSTEM IN ACTION":** Aksen hijau emerald berkedip yang menegaskan bahwa sistem adalah aplikasi otonom nyata yang berfungsi (*bukan prototipe Figma statis*).

### 3. Layoutnya Gimana
* **Tata Letak:** *4-Card Grid Matrix (2 Baris x 2 Kolom)*:
  * Kuadran 1: Skenario 1 Triage & Klasifikasi Risiko Otonom.
  * Kuadran 2: Skenario 2 Investigasi Bukti & Tool Kalkulator Tarif.
  * Kuadran 3: Skenario 3 Formulir Aksi Putusan & Audit Trail.
  * Kuadran 4: Skenario 4 Context-Aware Copilot & Forensic Studio.
  * Bagian bawah: Bar URL Demo interaktif dan kredensial akun uji coba.

### 4. Ada Ilustrasi / Icon Apa
* `Play` icon pada badge demo.
* `Stethoscope` pada skenario telaah klinis.
* `Calculator` pada skenario kalkulator tarif.
* `Sparkles` / `Bot` pada skenario Clarix Copilot AI.
* `ExternalLink` pada tautan live prototype.

---

## SLIDE 6: Penjelasan 4 Fitur Kunci Sesuai Menu Operasional Aplikasi (Durasi: 90 Detik)

### 1. Apa Isi Teks dan Datanya
* **Headline:** *"Empat Modul Operasional Pengendali Mutu & Biaya (KMKB)"*
* **Fitur 1: Triage & Antrean Klaim (dengan Ruang Telaah Dossier Bukti Klinis)**
  * *Peran di Aplikasi:* Mengelompokkan klaim FPK berdasarkan tingkat risiko anomali secara otonom, lalu membuka **Ruang Telaah Dossier** dengan Smart Document Viewer 4 tab (Resume, Laporan Operasi, Lab, Billing) dan Kalkulator Selisih Tarif INA-CBG.
  * *Menjawab Masalah BPJS:* Mengakhiri verifikasi acak (*random sampling*); verifikator langsung memprioritaskan klaim yang berpotensi merugikan kas JKN terbesar dan memvalidasi bukti klinis dalam hitungan detik.
* **Fitur 2: Audit Trail & Arsip Rekonsiliasi**
  * *Peran di Aplikasi:* Pencatatan log putusan verifikator append-only (tidak dapat dimanipulasi) dengan penyamaran NIK/No. Kartu sesuai UU PDP, visualisasi Heatmap Rekonsiliasi 28 Hari, dan generator cetak Berita Acara resmi.
  * *Menjawab Masalah BPJS:* Mencegah sengketa berlarut antara faskes dan BPJS Kesehatan melalui transparansi rekam jejak yang sah secara medikolegal.
* **Fitur 3: Uji Kasus Benchmark & Evaluasi AI**
  * *Peran di Aplikasi:* Suite pengujian ilmiah transparan terhadap 45 berkas klaim sintetis klaster RS mitra untuk memvalidasi performa deteksi AI (Precision 94,1%, Recall $\ge 85\%$, FPR $\le 15\%$, dan Grounding Verbatim 100%).
  * *Menjawab Masalah BPJS:* Menjamin akuntabilitas dan objektivitas model AI di hadapan auditor teknis BPJS bahwa sistem anti-halusinasi dan tidak merugikan faskes yang patuh.
* **Fitur 4: Clarix AI Studio & Floating Copilot (`Ctrl + K`)**
  * *Peran di Aplikasi:* Konsol investigasi forensik makro untuk analisis tren fraud dan komparasi biaya antar-faskes di Studio, didampingi **Floating Copilot** yang membaca konteks layar aktif secara live untuk konsultasi regulasi seketika.
  * *Menjawab Masalah BPJS:* Membantu verifikator mengonfirmasi keraguan koding secara instan di meja kerja sekaligus memberi komando audit strategis bagi pimpinan cabang BPJS.

### 2. Pakai Visualisasi Apa
* **4-Card Feature Grid:** 4 kartu kokoh bersudut lengkung 6px dengan garis pemisah tipis slate, masing-masing berisi icon menu operasional asli aplikasi, judul modul tebal, rincian fungsionalitas, dan box solusi masalah (latar belakang hijau muda halus).

### 3. Layoutnya Gimana
* **Tata Letak:** *2 x 2 Balanced Grid*:
  * Lebar kolom seimbang (50% : 50%) dengan jarak antar kartu (gap 24px).
  * Setiap kartu memiliki struktur hierarki yang konsisten: Header Menu Operasional $\rightarrow$ Deskripsi Fungsi Aplikasi $\rightarrow$ Garis Hairline $\rightarrow$ Label *"Penyelesaian Masalah BPJS"*.

### 4. Ada Ilustrasi / Icon Apa (Sesuai Icon Menu Aplikasi)
* `Activity` / `Pulse` pada Fitur 1 (Triage & Antrean Klaim).
* `FileCheck2` pada Fitur 2 (Audit Trail & Arsip).
* `FlaskConical` pada Fitur 3 (Uji Kasus Benchmark).
* `Sparkles` / `Bot` pada Fitur 4 (Clarix AI Studio).

---

## SLIDE 7: Tata Kelola Agentic AI, Keamanan & Roadmap (Durasi: 35 Detik)

### 1. Apa Isi Teks dan Datanya
* **Headline:** *"Tata Kelola Agentic AI Bertanggung Jawab & Kesiapan Skalabilitas"*
* **3 Pilar Keamanan & Tata Kelola Agentic AI:**
  1. **Bounded Agency (Prinsip Human-in-the-Loop Mutlak):**
     * Agen dibatasi secara arsitektural hanya untuk *menganalisis, merekomendasikan, dan menyusun draf*.
     * Agen dilarang keras mengeksekusi pembayaran atau mutasi data faskes tanpa persetujuan tertulis verifikator manusia.
  2. **Deterministic Tool Grounding (Anti-Halusinasi):**
     * Seluruh kalkulasi tarif dan rujukan pasal diikat ke fungsi deterministik (bukan fabrikasi teks LLM).
     * Wajib 100% kutipan verbatim dari dokumen rekam medis yang diunggah.
  3. **Kepatuhan UU PDP No. 27/2022 & Zero Data Leakage:**
     * Masking data otomatis NIK dan nomor kartu peserta JKN.
     * Tidak mengirimkan data identitas pasien ke API pihak ketiga yang tidak tersertifikasi.
* **Roadmap Implementasi Pasca-Healthkathon (Q4 2026 – Q2 2027):**
  * **Q4 2026 (Tahap 1):** Uji coba pilot di 10 RSUP Rujukan Nasional & integrasi modul VClaim Sandbox.
  * **Q1 2027 (Tahap 2):** Peluncuran fitur rekonsiliasi tripartit otomatis & ekspansi ke 100 RSUD Kelas B.
  * **Q2 2027 (Tahap 3):** Skalabilitas nasional mencakup 3.221 FKRTL dan integrasi modul pencegahan fraud primer di FKTP (Puskesmas/Klinik).

### 2. Pakai Visualisasi Apa
* **Split 2 Kolom:**
  * **Kolom Kiri:** 3 Kartu Keamanan Agentic (Bounded Agency, Deterministic Grounding, UU PDP Masking).
  * **Kolom Kanan:** Horizontal Timeline Roadmap dengan 3 fase kuartal (Q4 2026, Q1 2027, Q2 2027) berhiaskan milestone bullet point.

### 3. Layoutnya Gimana
* **Tata Letak:** *Split 50% : 50%*:
  * Kolom Kiri berfokus pada keselamatan sistem & regulasi hukum (*AI Safety & Governance*).
  * Kolom Kanan berfokus pada rencana adopsi nasional (*National Scaling Roadmap*).

### 4. Ada Ilustrasi / Icon Apa
* `ShieldCheck` (Emerald) untuk UU PDP & Bounded Agency.
* `Lock` (Biru) untuk Deterministic Grounding.
* `Milestone` / `Calendar` untuk Roadmap kuartal.
* `Check` pada pencapaian fase.

---

## SLIDE 8: Penutup, Tautan Demo & Informasi Kontak (Durasi: 25 Detik)

### 1. Apa Isi Teks dan Datanya
* **Headline:** *"Wujudkan Ekosistem JKN yang Adil, Berkelanjutan, dan Bebas Anomali"*
* **Closing Statement:**
  > **"Dengan kekuatan Agentic AI, TELISIK tidak hanya mendeteksi anomali lebih cerdas, namun melindungi martabat profesi medis, kelancaran kas faskes, dan keberlanjutan dana amanat jaminan kesehatan rakyat Indonesia."**
* **Akses Pengujian Juri (Call-to-Action):**
  * **Tautan Live Prototype:** `https://telisik-jkn.vercel.app` (Siap diuji tanpa instalasi lokal).
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

1. **Penegasan "Agentic AI" dalam Narasi Lisan:**
   * Jangan sebut aplikasi ini sekadar "machine learning biasa" atau "website dengan AI".
   * Tegaskan kepada juri bahwa inovasi tim adalah **Agentic AI**: *"Sistem kami menggunakan arsitektur agen otonom yang memecah masalah klinis, memanggil tools kalkulator tarif resmi, dan mengumpulkan bukti rekam medis secara mandiri sebelum verifikator manusia membuat putusan."*
2. **Peralihan ke Live Demo (Menit 04:30):**
   * Buka browser Next.js pada tab `http://localhost:3000/claims/triage` sebelum rekaman dimulai.
   * Transisi dari Slide 4 ke browser harus mulus tanpa mencari-cari jendela aplikasi.
3. **Penyebutan Istilah Resmi BPJS:**
   * Gunakan istilah baku: *FPK (Form Pengajuan Klaim), FKRTL, Kendali Mutu & Kendali Biaya (KMKB), INA-CBG, Severity Downcoding, Permenkes No. 3/2023 Pasal 24, Permenkes No. 24/2022, UU PDP No. 27/2022*.
4. **Disiplin Waktu Penutup:**
   * Selesaikan rekaman pada durasi antara **09:20 s.d. 09:45**. Jangan menyentuh batas 10:00:00 untuk menghindari diskualifikasi sistem.
