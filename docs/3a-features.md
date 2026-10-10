# 3a — Spesifikasi Fitur Konkret (Feature Breakdown)

**Tema Hackathon:** Detect Smarter, Protect JKN  
**Kategori:** Efisiensi Risiko Fasilitas Kesehatan (Kategori 3.1)  
**Sub-kategori:** Upcoding & Unbundling serta Inflated Bills & Cloning  
**Tujuan Dokumen:** Menjadi jembatan konkret antara Dokumen 3 (Lean PRD) dan Dokumen 4 (Technical Design), menjabarkan secara presisi apa yang dibangun pada sisi Frontend (UI/UX) dan Backend/AI untuk setiap fitur.

---

## Ringkasan Arsitektur Antarmuka & Layanan

Aplikasi tersusun atas struktur rute semantik yang mengikuti siklus kerja verifikator:
1. **Layar 1 — Triage & Queue Dashboard (`/claims/triage`):** *(redirect dari root `/`)* Tampilan daftar antrean klaim terurut risiko, ringkasan metrik efisiensi dana JKN, dan portal upload paket klaim sintetis.
2. **Layar 2 — Interactive Evidence Dossier (`/claims/:id/dossier`):** Tampilan kerja utama (*Workspace*) verifikator dengan tata letak **Dual-Pane**:
   - **Pane Kiri (50%):** Dossier Bukti Klinis (Kartu temuan, kalkulasi selisih rupiah, rekomendasi Agent, dan Action Bar).
   - **Pane Kanan (50%):** Document Viewer Cerdas (PDF/RME Viewer dengan fitur *auto-scroll* dan *verbatim text highlighting* saat kutipan diklik).
3. **Layar 3 — Audit Trail & Keputusan Resmi (`/claims/audit-trail`):** Repositori append-only seluruh keputusan verifikator dan surat klarifikasi resmi ke RS.
4. **Layar 4 — Scientific Benchmark Suite (`/benchmark/evaluation-suite`):** Halaman eksekusi batch evaluasi 30–50 kasus sintetis untuk pembuktian ke juri.

---

## Rincian Spesifikasi Per Fitur (P0)

---

### F1: Intake & Privacy Guard (UU PDP Gatekeeper)

#### 1. Purpose
Menerima paket berkas klaim digital (JSON data klaim + dokumen rekam medis teks/PDF), memvalidasi kelengkapan skema, dan secara ketat memblokir/menolak dokumen yang memuat data pribadi riil (NIK 16 digit valid, nama warga asli) guna mematuhi UU No. 27/2022 (UU PDP) dan regulasi Healthkathon.

#### 2. Frontend (FE)
- **Halaman / Komponen:**
  - `ModalUploadClaim` di Layar Dashboard (`/claims/triage`).
  - Komponen *Dropzone* (menerima bundle `.json` atau zip berkas klaim sintetis).
  - Progress bar status: *"Memvalidasi Skema..."* $\rightarrow$ *"Pemeriksaan Kepatuhan UU PDP..."* $\rightarrow$ *"Selesai"*.
- **Aksi Interaksi Pengguna:**
  - Pengguna melakukan *drag-and-drop* file paket klaim sintetis.
  - Jika lolos: Muncul notifikasi sukses (*toast*) dan antrean otomatis diperbarui.
  - Jika gagal (E1/E2): Tampil modal peringatan berwarna merah terang: *"Peringatan UU PDP: Dokumen terdeteksi memuat data riil. Harap gunakan data sintetis."*

#### 3. Backend / AI (BE/AI)
- **Data yang Diolah/Disimpan:**
  - Input: Payload klaim (metadata pasien anonim, kode diagnosis primer/sekunder, daftar tindakan, kuitansi alkes/obat, teks resume medis, teks laporan operasi, teks lab/radiologi).
  - Output: Objek `ClaimRecord` tervalidasi dengan status awal `INGESTED`, yang kemudian otomatis memicu antrean analisis investigasi (F3 $\rightarrow$ F4/F5/F6 $\rightarrow$ F7) hingga berstatus `ANALYZED`.
- **Aksi & Orkestrasi AI:**
  - **Regex & Heuristic Sanitizer (Non-LLM):** Pengecekan cepat pola NIK 16 digit Indonesia, nomor kartu BPJS asli, dan nomor telepon riil.
  - Pengecekan skema tipe data wajib (Zod schema validation).
- **Layer yang Terlibat:**
  - `Intake Controller` $\rightarrow$ `Privacy Guard Service` $\rightarrow$ `Claim Repository`.

---

### F2: Priority Queue & Triage Dashboard

#### 2. Purpose
Mengubah kebiasaan verifikator memeriksa klaim secara kronologis acak menjadi **antrean prioritas berbasis risiko klinis & rupiah**, sehingga potensi kebocoran dana terbesar langsung tertangani di awal hari kerja.

#### 2. Frontend (FE)
- **Halaman / Komponen:**
  - `DashboardView` (`/claims/triage`).
  - `MetricHeader`: Menampilkan 3 kartu ringkasan: Total Klaim Menunggu, Estimasi Potensi Inefisiensi Terdeteksi (Rp), dan Klaim Lolos Cepat (*Fast-Tracked*).
  - `ClaimTable`: Tabel antrean klaim dengan kolom:
    * ID Klaim & Rumah Sakit.
    * Diagnosis Utama (Kode ICD-10 & Nama).
    * Total Tagihan (Rp).
    * Status Klaim: `PERLU_TINJAUAN`, `PENDING_KLARIFIKASI_RS`, `DOWNCODE_DIUSULKAN`, `DISETUJUI`.
    * Badge Risiko: *Tinggi (Merah)*, *Sedang (Kuning)*, *Rendah/Bersih (Hijau)*.
    * Tag Modus Terindikasi: `Upcoding`, `Inflated Alkes`, `Note Cloning`.
    * Estimasi Selisih Biaya (Rp).
    * Tombol *"Buka Dossier Bukti"*.
- **Aksi Interaksi Pengguna:**
  - Filter berdasarkan Rumah Sakit, Status Klaim, Jenis Modus, atau Rentang Selisih Tarif.
  - Klik baris tabel / tombol membuka Layar Dossier (`/claims/:id/dossier`).

#### 3. Backend / AI (BE/AI)
- **Data yang Diolah/Disimpan:**
  - Mengambil daftar klaim berstatus `ANALYZED` maupun yang sudah memiliki keputusan verifikator (`PENDING_REVIEW`, dll.).
  - Mengurutkan klaim yang belum diputuskan menggunakan formula:  
    $$\text{Priority Score} = w_1 \times \text{Confidence Risk} + w_2 \times \text{Delta Rupiah Tagihan}$$
- **Aksi & Orkestrasi AI:**
  - Agregasi data hasil kalkulasi dari modul F3, F4, F5, F6. Tidak ada panggilan LLM baru di tahap rendering tabel (menggunakan cache/database hasil telaah).
- **Layer yang Terlibat:**
  - `Triage Service` $\rightarrow$ `Query Cache` $\rightarrow$ `Database`.

---

### F3: Deterministic Fast-Filter Engine

#### 1. Purpose
Melakukan penyaringan anomali koding dasar dengan komputasi sangat murah ($<50$ ms) sebelum memanggil AI, seperti ketidakcocokan demografis (usia/jenis kelamin) dan aturan baku pemecahan paket klaim (*unbundling*).

#### 2. Frontend (FE)
- **Halaman / Komponen:**
  - Muncul di dalam `EvidenceDossierView` sebagai Kartu Temuan bertipe `RULE-BASED ANOMALY` (ikon petir).
  - Menampilkan nama aturan resmi, misal: *Aturan INA-CBG: Prosedur A dilarang ditagihkan terpisah dari Prosedur B (Permenkes 3/2023)*.
- **Aksi Interaksi Pengguna:**
  - Badge peringatan deterministik dapat di-*collapse/expand* untuk melihat rujukan pasal.

#### 3. Backend / AI (BE/AI)
- **Data yang Diolah/Disimpan:**
  - Input: Kode ICD-10, ICD-9-CM, Gender, Usia Pasien.
  - Database Aturan: Matriks kode tindakan yang dilarang di-unbundle (*unbundling pair table*) dan batas demografi ICD.
- **Aksi & Orkestrasi AI:**
  - Evaluasi logika deterministik murni (aturan `if-else` berbasis tabel kamus).
  - Menghasilkan daftar flag `DeterministicFlag[]`.
- **Layer yang Terlibat:**
  - `Rule Engine Service` $\rightarrow$ `INA-CBG Reference Dictionary`.

---

### F4: Agentic Clinical Cross-Examiner (Upcoding & Unbundling)

#### 1. Purpose
Mendeteksi apakah diagnosis keparahan tinggi (*Severity Level II/III*) dan prosedur mahal yang ditagihkan faskes benar-benar didukung oleh bukti medis objektif di dalam narasi resume medis, catatan perkembangan terintegrasi (CPPT), hasil lab, dan radiologi.

#### 2. Frontend (FE)
- **Halaman / Komponen:**
  - Komponen `EvidenceCard` bertema *Upcoding / Clinical Discrepancy*:
    * Header: *"Indikasi Upcoding: Sepsis Berat (A41.9)"*.
    * Status Bobot Bukti: Badge `Kontradiksi Klinis (Merah)` atau `Kurang Bukti Penunjang (Kuning)`.
    * Narasi Diskrepansi: Ringkasan 2–3 kalimat yang menjelaskan mengapa diagnosis tidak sesuai.
    * Kutipan Bukti (Interaktif): Blok teks dengan tanda kutip, nomor dokumen, dan halaman.
    * Regulasi Rujukan: Tautan ringkas ke *PNPK Kemenkes No. HK.01.07/2020*.
- **Aksi Interaksi Pengguna:**
  - Klik pada teks kutipan: Memancarkan event `SELECT_CITATION` ke Document Viewer di pane kanan.

#### 3. Backend / AI (BE/AI)
- **Data yang Diolah/Disimpan:**
  - Input: Teks resume medis, hasil lab, TTV, kode diagnosa sekunder komplikasi.
  - Output: Objek `ClinicalFinding` (klaim kode, kriteria yang dilanggar, kutipan bukti verbatim, tingkat keyakinan 0.0–1.0, penjelasan alternatif non-fraud).
- **Aksi & Orkestrasi AI (Agent Loop):**
  1. Agent menerima klaim komplikasi berbiaya tinggi.
  2. Agent memanggil `tool_lookup_pnpk_icd(code)` $\rightarrow$ mengambil kriteria inklusi/eksklusi klinis resmi Kemenkes.
  3. Agent memanggil `tool_query_clinical_doc(section="LAB", query="marker infeksi")` dan `(section="TTV", query="tekanan darah & inotropik")`.
  4. Agent melakukan penalaran: Membandingkan kriteria resmi vs temuan faktual rekam medis.
  5. Agent memutuskan status korelasi (*Supported / Insufficient / Contradictory*).
- **Layer yang Terlibat:**
  - `Agent Orchestrator` $\rightarrow$ `LLM Reasoning Engine` $\rightarrow$ `Tool Registry (PNPK, Doc Extractor)`.

---

### F5: Operative vs Billing Alkes Cross-Checker (Inflated Bills)

#### 1. Purpose
Mendeteksi penggelembungan tagihan alat kesehatan mahal (ring jantung/stent, implan ortopedi/plat, mesh, lensa tanam/IOL) dengan cara mencocokkan jumlah unit dan spesifikasi pada lembar kuitansi penagihan dengan narasi tindakan yang tertulis di laporan operasi riil.

#### 2. Frontend (FE)
- **Halaman / Komponen:**
  - Komponen `EvidenceCard` bertema *Alkes & Billing Discrepancy*:
    * Header: *"Indikasi Inflated Bills: Stent Jantung Koroner (DES)"*.
    * Tabel Komparasi Mini:
      - Unit Ditagihkan di Kuitansi: **2 Unit** (Rp20.000.000).
      - Unit Tercatat di Laporan Operasi: **1 Unit** (Rp10.000.000).
      - Selisih Biaya Tidak Sah: **-Rp10.000.000**.
    * Kutipan Bukti Laporan Operasi: *"Dilakukan pemasangan 1 unit stent LAD; cabang LCx batal dipasang..."*.
- **Aksi Interaksi Pengguna:**
  - Klik kutipan laporan operasi $\rightarrow$ Pane kanan langsung membuka dokumen laporan bedah dan menyorot paragraf pemasangan implan.

#### 3. Backend / AI (BE/AI)
- **Data yang Diolah/Disimpan:**
  - Input: Daftar item kuitansi billing alkes & teks dokumen `Laporan_Operasi.pdf`.
  - Output: Objek `DeviceDiscrepancy` (nama alkes, qty tagih, qty tindakan riil, selisih tarif Rp, kutipan laporan operasi).
- **Aksi & Orkestrasi AI:**
  1. Agent membedah kuitansi untuk mengidentifikasi alkes khusus/implan bernilai tinggi.
  2. Agent memanggil `tool_query_clinical_doc(section="LAPORAN_OPERASI")`.
  3. LLM mengekstrak entitas tindakan: berapa alkes yang berhasil diimplan, apakah ada pembatalan/kegagalan pemasangan di meja operasi.
  4. Agent memanggil `tool_calc_tariff_delta(claimed_qty, actual_qty, unit_price)` untuk menghasilkan angka rupiah pasti.
- **Layer yang Terlibat:**
  - `Agent Orchestrator` $\rightarrow$ `Clinical Document Parser` $\rightarrow$ `Tariff Calculator Tool`.

---

### F6: Semantic Note-Cloning Detector

#### 1. Purpose
Mendeteksi indikasi rekam medis rekayasa/duplikasi dengan memindai kesamaan semantik dan n-gram teks catatan klinis antar-pasien di rumah sakit yang sama dalam rentang 30 hari terakhir (*copy-paste SOAP notes*).

#### 2. Frontend (FE)
- **Halaman / Komponen:**
  - Komponen `EvidenceCard` bertema *Integrasi Rekam Medis (Note Cloning)*:
    * Header: *"Peringatan Duplikasi Catatan Medis (94% Match)"*.
    * Komponen *Diff Viewer*: Menampilkan teks pasien saat ini bersanding (*side-by-side*) dengan teks pasien pembanding (ID Pasien disamarkan).
    * Informasi Kasus Pembanding: *Identik dengan Pasien #CLM-2026-077 (Dirawat 2 hari sebelumnya oleh DPJP yang sama)*.
- **Aksi Interaksi Pengguna:**
  - Tombol *Toggle Side-by-Side Diff*: Memperlihatkan kata-kata yang persis sama (warna merah/hijau).

#### 3. Backend / AI (BE/AI)
- **Data yang Diolah/Disimpan:**
  - Input: Embedding vektor teks dan hash n-gram dari resume medis pasien saat ini.
  - Korpus: Tabel database `hospital_corpus` berisi resume medis ter-anonimisasi dari rumah sakit yang sama (telah di-seed dengan kasus historis seperti Pasien #CLM-2026-077).
  - Output: Skor kesamaan semantik (0–100%), ID klaim donor duplikasi, dan teks segmen yang identik.
- **Aksi & Orkestrasi AI:**
  - Algoritma: Kombinasi **MinHash / Jaccard N-gram Similarity** (cepat) dan **Cosine Similarity Dense Embedding** (semantik).
  - Jika skor $> 85\%$, Agent memicu pembuatan temuan `NOTE_CLONING_DETECTED`.
- **Layer yang Terlibat:**
  - `Corpus Vector Service` $\rightarrow$ `Similarity Engine` $\rightarrow$ `Agent Orchestrator`.

---

### F7: Anti-Hallucination Verbatim Verifier (Grounding Engine)

#### 1. Purpose
Menjadi benteng pertahanan integritas bukti. Memastikan bahwa setiap kutipan teks yang dicantumkan dalam dossier benar-benar eksis $100\%$ secara harfiah (*verbatim substring*) pada dokumen rekam medis asli, mencegah halusinasi AI sampai ke mata verifikator.

#### 2. Frontend (FE)
- **Halaman / Komponen:**
  - Badge pada setiap kutipan: `100% Verbatim Verified` (ikon centang hijau terverifikasi).
  - Indikator lokasi sumber: `[Laporan Operasi — Hal 3, Paragraf 2]`.
- **Aksi Interaksi Pengguna:**
  - Hover pada badge menampilkan tooltip: *"Kutipan ini telah dicocokkan 100% secara otomatis dengan dokumen asli."*

#### 3. Backend / AI (BE/AI)
- **Data yang Diolah/Disimpan:**
  - Input: String kutipan yang dihasilkan LLM (`quote_candidate`) dan raw text dokumen sumber (`source_document_text`).
  - Output: Boolean `is_valid`, nomor halaman, dan offset karakter awal/akhir (`start_char`, `end_char`).
- **Aksi & Orkestrasi AI:**
  - Pencarian string deterministik (*Exact Substring Match* / *Fuzzy Match Threshold > 98%* untuk toleransi spasi/karakter newline).
  - Jika tidak ditemukan dalam dokumen: Agent secara otomatis menolak kutipan tersebut. Agent diinstruksikan ulang (*retry 1x*) untuk mengambil kutipan persis, atau temuan dibatalkan jika gagal.
- **Layer yang Terlibat:**
  - `Verbatim Grounding Service` $\rightarrow$ `Document Offsets Index`.

---

### F8: Interactive Evidence Dossier & 1-Click Document Viewer

#### 1. Purpose
Menyajikan seluruh temuan Agent secara ergonomis dan dapat diaudit dalam hitungan detik melalui antarmuka *Dual-Pane* terintegrasi.

#### 2. Frontend (FE)
- **Halaman / Komponen:**
  - `WorkspaceView` (`/claims/:id/dossier`):
    * **Pane Kiri (Dossier Panel):**
      - Header Kasus: No Klaim, Nama RS, Diagnosa INA-CBG, Tarif Klaim vs Rekomendasi Tarif Adil.
      - Daftar Kartu Temuan (F3, F4, F5, F6) yang tersusun rapi.
      - Bagian Penjelasan Alternatif (*Alternative Non-Fraud Hypotheses*): Menuliskan jika ada kemungkinan salah ketik atau data belum lengkap.
    * **Pane Kanan (Smart Document Viewer):**
      - Tabs Dokumen: `Resume Medis`, `Laporan Operasi`, `Hasil Lab/Penunjang`, `Billing Farmasi`.
      - Penampil Dokumen dengan fitur *Highlight Box* dinamis berbasis koordinat `(start_char, end_char)`.
- **Aksi Interaksi Pengguna:**
  - Klik kartu bukti atau tombol *"Lihat di Dokumen"* di pane kiri $\rightarrow$ Pane kanan otomatis beralih ke tab dokumen yang relevan, melakukan *smooth scroll* ke posisi teks, dan memberikan efek sorot (*highlight pulse* warna kuning).
  - Verifikator dapat memperbesar (*zoom*), mencari teks (*Ctrl+F*), dan membaca konteks sebelum/sesudah kutipan.

#### 3. Backend / AI (BE/AI)
- **Data yang Diolah/Disimpan:**
  - Menyajikan payload lengkap `DossierDetailResponse` yang menggabungkan metadata klaim, daftar temuan berkoordinat (*bounding box / character offsets*), dan teks dokumen lengkap.
- **Aksi & Orkestrasi AI:**
  - Menghitung koordinat posisi kutipan di dokumen digital untuk dikonsumsi komponen penampil FE.
- **Layer yang Terlibat:**
  - `Dossier Assembly Service` $\rightarrow$ `REST API Controller`.

---

### F9: Action Recommendation, Dispute Drafter & Append-Only Audit Trail

#### 1. Purpose
Memfasilitasi pengambilan keputusan akhir oleh verifikator (*Human-in-the-Loop*), mengotomatisasi pembuatan draf surat klarifikasi resmi ke RS, dan merekam seluruh keputusan ke dalam log audit permanen yang tidak dapat diubah (*immutable audit trail*) serta menyediakan repositori riwayat audit.

#### 2. Frontend (FE)
- **Halaman / Komponen:**
  - **Di Workspace (`/claims/:id/dossier`):**
    * `ActionBar` (Fixed di bagian bawah Pane Kiri):
      - Rekomendasi Agent Banner: *"Rekomendasi: PENDING — Minta Klarifikasi Jumlah Alkes & Downcode Sepsis"* (Tingkat Keyakinan: 92%).
      - 4 Tombol Aksi: `Setujui (Approve)`, `Pending — Minta Dokumen`, `Usulkan Downcode`, `Eskalasi ke Tim PK-JKN`.
    * `ModalActionConfirmation`:
      - Field Catatan Verifikator (Wajib diisi jika Pending/Downcode/Eskalasi).
      - Preview Draf Surat Klarifikasi Resmi ke RS: Memuat format surat formal BPJS, nomor klaim, rincian temuan diskrepansi, dan kutipan dokumen yang diminta.
  - **Di Halaman Repositori Audit (`/claims/audit-trail`):**
    * `AuditTrailView`: Tabel arsip seluruh riwayat verifikasi: Waktu Keputusan, ID Klaim, RS, Verifikator, Status Tindakan, dan Tombol *"Lihat Surat Klarifikasi Resmi"*.
- **Aksi Interaksi Pengguna:**
  - Verifikator memilih salah satu tombol aksi di `ActionBar`.
  - Verifikator mengedit teks draf surat klarifikasi lalu menekan *"Konfirmasi Keputusan"*.
  - Dialog sukses muncul, mengarahkan verifikator kembali ke `/claims/triage` (status klaim berubah menjadi `PENDING_KLARIFIKASI_RS`).
  - Verifikator atau auditor dapat membuka `/claims/audit-trail` kapan saja untuk mereview arsip keputusan dan surat klarifikasi.

#### 3. Backend / AI (BE/AI)
- **Data yang Diolah/Disimpan:**
  - Tabel `AuditTrail`: `id`, `claim_id`, `verifier_id` (dr. Maya), `action` (APPROVE/PENDING/DOWNCODE/ESCALATE), `verifier_notes`, `official_letter_draft`, `findings_snapshot_json`, `timestamp`.
  - Log bersifat **Append-Only** (tidak ada API `UPDATE` atau `DELETE`).
- **Aksi & Orkestrasi AI:**
  - **Draft Letter Generator:** Template terstruktur berbasis aturan yang menggabungkan temuan terverifikasi dan dasar pasal Permenkes 3/2023 & Permenkes 16/2019 secara otomatis tanpa halusinasi.
- **Layer yang Terlibat:**
  - `Decision Controller` $\rightarrow$ `Letter Generator Service` $\rightarrow$ `Audit Trail Logger (Append-Only Store)`.

---

### F10: Synthetic Evaluation & Benchmark Runner

#### 1. Purpose
Menyediakan modul pengujian terukur (*benchmarking suite*) yang dapat dijalankan langsung oleh pengembang atau didemonstrasikan di depan juri, untuk membuktikan akurasi deteksi anomali, laju *false positive*, dan kepatuhan *zero-hallucination* pada 30–50 dataset sintetis.

#### 2. Frontend (FE)
- **Halaman / Komponen:**
  - Halaman Khusus Evaluasi (`/benchmark/evaluation-suite`):
    * Tombol *"Jalankan Uji Benchmark (30 Kasus Sintetis)"*.
    * Tabel Hasil Evaluasi Realtime: Progress bar pengujian kasus 1 s/d 30.
    * Kartu Metrik Akhir:
      - Recall Kasus Anomali (Target $\ge 85\%$).
      - False Positive Rate pada Kasus Wajar/Salah Koding Ringan (Target $\le 15\%$).
      - Verbatim Grounding Rate (Target $100\%$).
      - Rata-rata Waktu Telaah per Kasus (Target $< 60$ detik).
    * Perbandingan dengan Baseline Aturan Sederhana (*Bar Chart*).
- **Aksi Interaksi Pengguna:**
  - Klik tombol *"Jalankan Benchmark"*, melihat animasi evaluasi batch, dan mendownload ringkasan JSON/Markdown laporan evaluasi.

#### 3. Backend / AI (BE/AI)
- **Data yang Diolah/Disimpan:**
  - Input: Korpus 30–50 kasus sintetis dengan label *ground truth* (kasus upcoding sengaja, kasus inflated bills sengaja, kasus cloning, kasus salah koding ringan wajar, dan kasus klaim bersih).
  - Output: Laporan evaluasi komparatif (`benchmark_results.json`).
- **Aksi & Orkestrasi AI:**
  - Menjalankan alur lengkap F1 hingga F7 secara batch untuk setiap kasus sintetis.
  - Menghitung matriks konfusi (True Positive, False Positive, True Negative, False Negative).
- **Layer yang Terlibat:**
  - `Benchmark Runner Service` $\rightarrow$ `Batch Agent Executor` $\rightarrow$ `Metrics Calculator`.

---

## Matriks Hubungan Antar Fitur (Traceability Matrix)

| Kode Fitur | Nama Fitur | Komponen UI Utama | Modul Backend / AI Utama | Sifat Layanan |
|---|---|---|---|---|
| **F1** | Intake & Privacy Guard | `ModalUploadClaim` | `PrivacyGuardService` | Deterministik / Regex |
| **F2** | Priority Triage Queue | `DashboardView` | `TriageService` | Query / Cache |
| **F3** | Deterministic Fast Filter | `EvidenceCard (Rule)` | `RuleEngineService` | Deterministik / Kamus |
| **F4** | Clinical Cross-Examiner | `EvidenceCard (Upcode)` | `AgentOrchestrator` + Tools | Agentic LLM Loop |
| **F5** | Alkes Cross-Checker | `EvidenceCard (Alkes)` | `AgentOrchestrator` + Tariff Tool | Agentic LLM + Kalkulator |
| **F6** | Note Cloning Detector | `DiffViewerModal` | `SimilarityEngine` | Vektor / N-Gram |
| **F7** | Verbatim Verifier | `VerbatimBadge` | `GroundingService` | String Substring Match |
| **F8** | Dual-Pane Dossier Viewer | `WorkspaceView` | `DossierAssemblyService` | Render & Document Sync |
| **F9** | Action Bar & Audit Trail | `ActionBar`, `ConfirmModal` | `DecisionService` + Audit Logger | Append-Only Database |
| **F10** | Benchmark Runner | `BenchmarkView` | `BenchmarkRunnerService` | Batch Evaluator |

---

## Status Gate: Kesiapan Menuju Dokumen 4 (Technical Design)
Dengan spesifikasi di atas:
- Developer Frontend sudah tahu pasti: komponen apa yang dibuat, tata letak layarnya (Dual-Pane), dan interaksi klik kutipan menuju highlight dokumen.
- Developer Backend/AI sudah tahu pasti: data apa yang disimpan, algoritma apa yang dipanggil (Regex, Rule, Agent Tool Registry, Embedding, Substring), dan kapan LLM dipanggil vs kapan deterministik murni bekerja.
