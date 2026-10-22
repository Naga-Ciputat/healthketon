# 3a — Spesifikasi Fitur Konkret (Feature Breakdown)

**Tema Hackathon:** Detect Smarter, Protect JKN  
**Kategori:** Efisiensi Risiko Fasilitas Kesehatan (Kategori 3.1)  
**Sub-kategori:** Upcoding & Unbundling, Inflated Bills & Cloning, serta Tata Kelola Integritas Klaim RME  
**Tujuan Dokumen:** Menjadi jembatan operasional antara Dokumen 3 (Lean PRD) dan Dokumen 4 (Technical Design). Menjabarkan secara terukur apa yang dibangun pada sisi Frontend (UI/UX yang fungsional dan terbebas dari dekorasi artifisial) serta Backend/Logic/AI untuk setiap fitur P0.

---

## Ringkasan Arsitektur Antarmuka & Layanan

Aplikasi tersusun atas struktur rute semantik yang mengikuti siklus kerja verifikator klaim BPJS Kesehatan:

1. **Layar 1 — Triage & Queue Dashboard (`/claims/triage`):** *(redirect dari root `/`)*  
   Antrean berkas klaim terprioritaskan berdasarkan risiko inefisiensi klinis dan potensi selisih tarif, ringkasan metrik operasional terkalibrasi, serta intake pengunggahan berkas klaim digital.
2. **Layar 2 — Interactive Evidence Dossier (`/claims/:id/dossier`):**  
   Ruang kerja utama (*Workspace*) verifikator dengan tata letak **Dual-Pane** yang ergonomis:
   - **Pane Kiri (50%):** Dossier Bukti Klinis (Status otentikasi dokumen RME-TTE, kartu temuan diskrepansi, kalkulasi selisih tarif pasti, penjelasan alternatif non-fraud, dan Action Bar keputusan).
   - **Pane Kanan (50%):** Smart Document Viewer (Penampil dokumen rekam medis dengan fitur sinkronisasi tab, *smooth auto-scroll*, dan penyorotan teks verbatim tanpa efek glow/pendar).
3. **Layar 3 — Audit Trail & Repositori Keputusan (`/claims/audit-trail`):**  
   Log permanen (*append-only*) yang merekam seluruh putusan verifikator, kepatuhan penyamaran data (UU PDP No. 27/2022), serta arsip draf surat klarifikasi resmi ke faskes.
4. **Layar 4 — Scientific Benchmark Suite (`/benchmark/evaluation-suite`):**  
   Modul pengujian batch 30–50 kasus sintetis berlabel untuk mengevaluasi recall deteksi anomali, laju *false positive*, dan grounding keaslian kutipan.

---

## Rincian Spesifikasi Per Fitur (P0)

---

### F1: Intake, Privacy Guard & Keabsahan Dokumen RME-TTE

#### 1. Purpose
Menerima paket berkas klaim digital rumah sakit (metadata klaim, resume medis terstruktur, CPPT, laporan operasi, lab, radiologi, kuitansi alkes), memvalidasi kelengkapan skema, memastikan sanitasi data pribadi (PII masking) secara otomatis di pipeline backend, serta memverifikasi integritas dokumen rekam medis elektronik (Permenkes 24/2022).

#### 2. Frontend (FE)
- **Komponen UI:**
  - `ModalUploadClaim` di `/claims/triage` (area dropzone bersih bergaris batas 1px netral untuk paket bundle `.json` atau zip berkas klaim).
  - Status pemrosesan bertahap sederhana dalam banner progres tenang: *Validasi Skema $\rightarrow$ Sanitasi PII $\rightarrow$ Pengecekan Integritas Berkas*.
  - Header Dossier yang Bersih: Menampilkan metadata klaim faktual (No SEP, Pasien, Tanggal Layanan, RS Pengaju, Kelas Rawat) menggunakan tipografi Plus Jakarta Sans dengan `tabular-nums` pada nomor referensi. **Bebas dari strip jargon teatrikal** (tidak menggunakan ornamen banner "BSrE-BSSN Terverifikasi" atau badge "UU PDP Valid").
- **Interaksi Pengguna:**
  - Pengguna mengunggah berkas. Jika terdeteksi berkas tanpa sanitasi PII atau skema korup, sistem menampilkan pesan peringatan terukur dalam banner alert netral berbatas 1px. Jika berkas valid, klaim otomatis masuk ke antrean triage.

#### 3. Backend / AI (BE/AI)
- **Data yang Diolah:**
  - Input: Payload klaim RME (metadata SEP, teks dokumen klinis, billing alkes/obat, hash dokumen, metadata sertifikat TTE).
  - Output: Objek `ClaimRecord` berstatus `INGESTED`, siap diproses oleh engine investigasi.
- **Logika & Servis:**
  - *Heuristic Privacy Guard (Non-LLM):* Regex deteksi format NIK 16 digit aktif dan penyamaran otomatis (*pseudonymization*) sebelum teks diteruskan ke modul pemrosesan bahasa.
  - *Cryptographic Signature Validator:* Pengecekan integritas hash SHA-256 dan masa berlaku sertifikat digital penandatangan.
- **Layer yang Terlibat:**
  - `IntakeController` $\rightarrow$ `PrivacyGuardService` $\rightarrow$ `DocumentIntegrityService` $\rightarrow$ `ClaimRepository`.

---

### F2: Priority Queue & Triage Dashboard

#### 1. Purpose
Mengubah proses verifikasi manual acak menjadi **antrean kerja terprioritaskan** berdasarkan probabilitas risiko klinis, indikasi kunjungan berulang (readmisi $\le 30$ hari), dan besaran selisih tarif klaim terhadap standar INA-CBG.

#### 2. Frontend (FE)
- **Komponen UI:**
  - `MetricHeader`: Menampilkan 3 kartu ringkasan berbasis terminologi operasional tenang, bergaris batas 1px netral, menggunakan tipografi Plus Jakarta Sans dengan `tabular-nums` untuk angka rupiah/kasus (tanpa titik bulat status, tanpa teks eyebrow ornamental, dan tanpa kartu ber-shadow tebal):
    * *Antrean Telaah:* Total klaim menunggu dengan rincian kasus prioritas tinggi.
    * *Potensi Koreksi Tagihan:* Akumulasi nominal rupiah selisih tarif yang perlu ditinjau verifikator.
    * *Klaim Lolos Cepat (Fast-Track):* Jumlah dan persentase klaim bersih berisiko rendah yang dapat diproses instan.
  - `ClaimTable`: Tabel antrean bergaya Attio (bersih, rapat, batas 1px halus, padding terukur):
    * Kolom: Nomor SEP, rumah sakit, diagnosis primer, kode INA-CBG, tag indikasi (*Upcoding, Inflated Bills, Note Cloning, Readmisi 30 Hari*), potensi selisih tarif, dan tombol aksi telaah dossier.
    * **Aturan Diferensiasi Status & Tipe:** Status dan tingkat risiko tidak menggunakan warna-warni pelangi (rainbow badges) atau dot bulat (`●`). Diferensiasi dilakukan melalui **kombinasi ikon fungsional yang presisi** (misal `AlertTriangle`, `Clock`, `CheckCircle2`) dan teks ringkas di dalam kontainer persegi panjang bersudut terkontrol (`rounded-[4px]`).
    * **Disiplin Warna BPJS:** Palet didominasi oleh BPJS Green (`emerald-600/700`) sebagai warna aksi utama dan BPJS Blue (`blue-600/700`) untuk elemen informasional/navigasi. Warna amber atau merah secara ketat hanya dipakai untuk anomali klinis riil atau peringatan mendesak.
- **Interaksi Pengguna:**
  - Penyaringan antrean berdasarkan faskes, tingkat risiko (*Tinggi, Sedang, Rendah*), status telaah, dan kategori anomali. Klik baris klaim mengarahkan verifikator ke `/claims/:id/dossier`.

#### 3. Backend / AI (BE/AI)
- **Data yang Diolah:**
  - Menghitung skor prioritas antrean menggunakan formula komposit:
    $$\text{Priority Score} = w_1 \times \text{Confidence Anomali} + w_2 \times \text{Potensi Koreksi Rupiah} + w_3 \times \text{Faktor Readmisi}$$
  - Data disajikan langsung dari indeks cache hasil telaah F3–F6 tanpa latensi pemanggilan model baru saat rendering tabel.
- **Layer yang Terlibat:**
  - `TriageService` $\rightarrow$ `QueryCache` $\rightarrow$ `Database`.

---

### F3: Deterministic Fast-Filter Engine

#### 1. Purpose
Melakukan penyaringan anomali koding dan administrasi dasar secara instan ($<50$ ms) menggunakan aturan deterministik sebelum memanggil model AI, termasuk aturan demografi, kaidah larangan pemecahan paket (*unbundling*), serta deteksi readmisi cepat.

#### 2. Frontend (FE)
- **Komponen UI:**
  - Ditampilkan di dalam Dossier sebagai Kartu Temuan Administratif bertipe `ATURAN BAKU (DETERMINISTIK)` dengan batas visual 1px bersih.
  - Memuat nama kaidah resmi (misal: *Larangan Penagihan Terpisah Paket Prosedur, Permenkes 3/2023*) serta indikasi jika pasien memiliki riwayat rawat inap di faskes yang sama dalam kurun waktu $\le 30$ hari dengan kelompok diagnosis serupa.
- **Interaksi Pengguna:**
  - Kartu dapat diperluas (*expand*) untuk membaca pasal regulasi dan histori kunjungan terkait.

#### 3. Backend / AI (BE/AI)
- **Data yang Diolah:**
  - Input: Kode ICD-10, ICD-9-CM, jenis kelamin, usia, tanggal masuk/pulang, dan riwayat kunjungan pasien (`PSTV01`).
  - Kamus Aturan: Matriks pasangan kode terlarang di-unbundle (*unbundling pair registry*) dan batasan interval klaim berulang.
- **Logika & Servis:**
  - Evaluasi logika deterministik murni berbasis tabel referensi; menghasilkan array `DeterministicFlag[]`.
- **Layer yang Terlibat:**
  - `RuleEngineService` $\rightarrow$ `INACBGReferenceDictionary` $\rightarrow$ `PatientHistoryIndex`.

---

### F4: Agentic Clinical Cross-Examiner (Upcoding & Severity Jump)

#### 1. Purpose
Menganalisis apakah diagnosis komplikasi sekunder berbiaya tinggi (*Severity Level II/III*, seperti gagal ginjal `N185`, hipertensi komplikasi `I119`, atau gagal jantung `I500`) yang menaikkan tarif INA-CBG secara signifikan (terbukti naik rata-rata +74% hingga +214% pada data riil) didukung secara sah oleh catatan klinis CPPT, hasil laboratorium, dan tanda-tanda vital.

#### 2. Frontend (FE)
- **Komponen UI:**
  - `EvidenceCard` bertema *Ketidaksesuaian Klinis (Upcoding)*:
    * Judul: Kode diagnosis dan nama komplikasi yang ditinjau.
    * Status Bukti Medis: Label status terukur (`Kontradiksi Klinis` atau `Data Penunjang Tidak Ditemukan`).
    * Ringkasan Analisis: 2–3 kalimat objektif yang menjelaskan ketidaksesuaian antara kode klaim dengan kondisi riil pasien.
    * Kutipan Bukti Terverifikasi: Blok kutipan harfiah beserta rujukan nomor halaman dan nama dokumen.
    * Rujukan Klausul Koding: Teks referensi ke Permenkes No. 3/2023 Bab VII Pedoman Tarif INA-CBG dan PNPK Kemenkes.
- **Interaksi Pengguna:**
  - Klik pada teks kutipan bukti otomatis memicu sinkronisasi ke Document Viewer di pane kanan, menggulir layar, dan menyorot baris teks sumber.

#### 3. Backend / AI (BE/AI)
- **Data yang Diolah:**
  - Input: Narasi resume medis, lembar CPPT dokter/perawat, hasil laboratorium, tanda vital, dan kode komplikasi sekunder.
  - Output: Objek `ClinicalFinding` (kode klaim, kriteria inklusi yang tidak terpenuhi, kutipan teks verbatim, skor keyakinan, dan estimasi selisih tarif jika diturunkan ke Level I/II).
- **Alur Orkestrasi Agent:**
  1. Agent mendeteksi klaim rawat inap dengan severity level tinggi.
  2. Agent memanggil `tool_lookup_pnpk_icd(code)` untuk mengambil kriteria diagnostik resmi Kemenkes.
  3. Agent memanggil `tool_query_clinical_doc(section, query)` untuk menelusuri bukti penunjang (lab marker, hemodinamik, terapi obat).
  4. Agent membandingkan kriteria vs bukti riil dan menyimpulkan status korelasi bukti secara objektif.
- **Layer yang Terlibat:**
  - `AgentOrchestrator` $\rightarrow$ `ClinicalReasoningEngine` $\rightarrow$ `ToolRegistry (PNPK, ClinicalDocParser)`.

---

### F5: Operative vs Billing Alkes Cross-Checker (Inflated Bills)

#### 1. Purpose
Mendeteksi ketidaksesuaian penagihan alat kesehatan dan implan berbiaya mahal (ring jantung/stent, implan ortopedi/plat, mesh bedah, lensa intraokular) dengan mencocokkan jumlah unit dan spesifikasi pada kuitansi rincian biaya terhadap narasi tindakan pembedahan riil pada laporan operasi.

#### 2. Frontend (FE)
- **Komponen UI:**
  - `EvidenceCard` bertema *Diskrepansi Alat Kesehatan*:
    * Header: Nama alat kesehatan dan kode tagihan terkait.
    * Tabel Rekonsiliasi Singkat: Unit ditagihkan di kuitansi vs Unit terverifikasi pada laporan operasi vs Selisih rupiah tidak sah.
    * Kutipan Laporan Operasi: Teks kutipan dokter bedah yang mendokumentasikan jumlah implan terpasang atau pembatalan tindakan di meja operasi.
- **Interaksi Pengguna:**
  - Klik kutipan laporan operasi langsung membuka tab *Laporan Operasi* di pane kanan dan menyorot paragraf prosedur implan.

#### 3. Backend / AI (BE/AI)
- **Data yang Diolah:**
  - Input: Rincian item billing farmasi/alkes dan teks dokumen laporan bedah (`Laporan_Operasi.pdf`).
  - Output: Objek `DeviceDiscrepancy` (item name, billed qty, operative verified qty, selisih rupiah pasti, kutipan kalimat bedah).
- **Logika & Servis:**
  - Ekstraksi entitas tindakan bedah menggunakan model bahasa terarah + kalkulasi selisih nominal deterministik (`tool_calc_tariff_delta`). Nilai rupiah dihitung dengan formula matematika pasti, bukan perkiraan model.
- **Layer yang Terlibat:**
  - `AgentOrchestrator` $\rightarrow$ `OperativeDocParser` $\rightarrow$ `TariffCalculationService`.

---

### F6: Semantic Note-Cloning Detector

#### 1. Purpose
Mendeteksi indikasi fabrikasi atau duplikasi berkas rekam medis dengan membandingkan kesamaan semantik dan kemiripan teks catatan perkembangan pasien saat ini terhadap riwayat pasien lain di rumah sakit yang sama dalam rentang 30 hari terakhir.

#### 2. Frontend (FE)
- **Komponen UI:**
  - `EvidenceCard` bertema *Integritas Rekam Medis (Duplikasi Catatan)*:
    * Header: Persentase kesamaan teks (misal: *Tingkat Kemiripan Catatan Medis: 94%*).
    * Keterangan Komparasi: Menyebutkan kesamaan terhadap berkas donor dari DPJP yang sama tanpa membuka identitas pribadi pasien pembanding.
    * Tombol Komparasi: Membuka modal `DiffViewerModal` yang menampilkan teks berdampingan dengan penandaan kata-kata identik.
- **Interaksi Pengguna:**
  - Verifikator meninjau teks perbandingan berdampingan untuk menilai apakah kesamaan disebabkan oleh *templated copy-paste* yang tidak mencerminkan kondisi faktual pasien.

#### 3. Backend / AI (BE/AI)
- **Data yang Diolah:**
  - Input: Representasi vektor (*dense embedding*) dan n-gram dari teks resume medis/CPPT.
  - Korpus Pembanding: Tabel `hospital_corpus` berisi catatan klinis tersamar dari rumah sakit yang sama dalam jendela waktu 30 hari.
  - Output: Skor kemiripan (0–100%), ID berkas pembanding, dan segmen teks terduplikasi.
- **Logika & Servis:**
  - Skrining cepat MinHash Jaccard N-gram diikuti verifikasi Cosine Similarity embedding. Ambang batas peringatan dipatok pada $\ge 85\%$.
- **Layer yang Terlibat:**
  - `CorpusVectorService` $\rightarrow$ `SimilarityEngine` $\rightarrow$ `AgentOrchestrator`.

---

### F7: Anti-Hallucination Verbatim Verifier (Grounding Engine)

#### 1. Purpose
Memastikan setiap kalimat kutipan bukti yang disajikan dalam dossier dan surat klarifikasi benar-benar eksis $100\%$ secara harfiah (*exact verbatim substring*) pada dokumen rekam medis sumber, menjamin sistem bebas halusinasi sebelum data ditampilkan ke verifikator.

#### 2. Frontend (FE)
- **Komponen UI:**
  - Label status keabsahan kutipan di setiap blok bukti: Teks mikro ringkas `Kutipan Terverifikasi (Hal. X, Paragraf Y)` dipadukan dengan ikon `CheckCheck` (12px) di dalam kontainer persegi panjang bersudut 3px (`rounded-[3px]`), bergaris batas 1px netral tanpa efek pendar glow, dot bulat, atau badge tebal.
- **Interaksi Pengguna:**
  - Menjamin verifikator dapat mempercayai kutipan tanpa perlu meragukan keaslian sumber teks.

#### 3. Backend / AI (BE/AI)
- **Data yang Diolah:**
  - Input: Teks kutipan kandidat (`quote_candidate`) dan naskah lengkap dokumen sumber.
  - Output: Status validasi (`is_valid`), offset karakter (`start_char`, `end_char`), dan nomor halaman.
- **Logika & Servis:**
  - Algoritma pencarian string deterministik (*Exact Substring Matching*). Jika teks gagal dicocokkan pada naskah asli, kutipan ditolak secara otomatis dan diinstruksikan ulang atau dibatalkan dari dossier temuan.
- **Layer yang Terlibat:**
  - `VerbatimGroundingService` $\rightarrow$ `DocumentIndex`.

---

### F8: Interactive Evidence Dossier & 1-Click Document Viewer

#### 1. Purpose
Menyediakan lingkungan kerja (*workspace*) terpadu dua panel (*Dual-Pane*) yang memungkinkan verifikator memeriksa rekam medis digital puluhan halaman, menelaah temuan diskrepansi, dan memvalidasi dasar regulasi hanya dalam hitungan detik per berkas.

#### 2. Frontend (FE)
- **Komponen UI (`/claims/:id/dossier`):**
  - **Pane Kiri (Dossier Temuan):**
    * Ringkasan klaim: No SEP, kelas faskes, kode INA-CBG, tarif diajukan vs tarif hasil verifikasi (angka berformat `tabular-nums`).
    * Daftar kartu temuan terstruktur (F3, F4, F5, F6) lengkap dengan kutipan dan rujukan regulasi. Permukaan kartu solid netral bergaris batas 1px halus, tanpa glowing shadow atau aksen garis samping sepihak.
    * Bagian Penjelasan Alternatif (*Alternative Explanations*): Ruang telaah netral yang mencatat kemungkinan salah koding administratif non-fraud atau kelengkapan berkas yang tertinggal.
  - **Pane Kanan (Smart Document Viewer):**
    * Tab dokumen rekam medis: `Resume Medis`, `Laporan Operasi`, `CPPT Keperawatan`, `Hasil Lab & Radiologi`, `Rincian Biaya`. State aktif tab menggunakan kontras permukaan (surface contrast) dan tipografi tebal, **sama sekali tanpa garis aksen dekoratif sepihak (`no border-bottom/left 3px`)**.
    * Penampil teks dokumen digital dengan koordinat sorotan (*highlight box*) statis berlatar amber lembut (`bg-amber-100/80` dengan teks berkontras tinggi), **tanpa efek pendar neon (no glow)** dan **tanpa animasi denyut (strictly no pulse animation)**.
- **Interaksi Pengguna:**
  - Klik pada kartu temuan atau tombol kutipan di pane kiri seketika mengaktifkan tab dokumen terkait di pane kanan, menggulir layar secara mulus (*smooth auto-scroll*), dan menyorot teks bukti secara statis.

#### 3. Backend / AI (BE/AI)
- **Data yang Diolah:**
  - Menggabungkan payload `DossierDetailResponse` berisi metadata klaim, daftar temuan berkoordinat teks, dan teks dokumen lengkap.
- **Layer yang Terlibat:**
  - `DossierAssemblyService` $\rightarrow$ `ClaimRESTController`.

---

### F9: Action Recommendation, Dispute Drafter & Append-Only Audit Trail

#### 1. Purpose
Memfasilitasi pengambilan keputusan akhir oleh verifikator (*Human-in-the-Loop*), menyusun draf surat permintaan klarifikasi resmi berbasis bukti dan pasal regulasi, serta mencatat seluruh riwayat penelaahan ke dalam log permanen yang tidak dapat diubah (*immutable audit trail*) guna mendukung akuntabilitas hukum.

#### 2. Frontend (FE)
- **Komponen UI:**
  - **Di Workspace Dossier (`/claims/:id/dossier`):**
    * `DossierActionBar` (terletak tetap di bawah panel kiri):
      - Rekomendasi sistem yang tenang: *Rekomendasi Telaah: Usulkan Penyesuaian Kode Severity / Minta Dokumen Pendukung*.
      - 4 Tombol Keputusan: `Setujui Klaim`, `Minta Konfirmasi RS`, `Koreksi Kode (Downcode)`, `Eskalasi Audit Investigatif`. Tombol berbentuk persegi panjang terkontrol (`rounded-[4px]`), **tanpa bentuk pil (`no rounded-full`)**.
    * `ModalDisputeLetter`:
      - Kolom catatan justifikasi verifikator (wajib diisi bila status bukan persetujuan langsung).
      - Draf surat resmi format BPJS yang otomatis terisi nomor klaim, rincian temuan diskrepansi, dan kutipan kalimat rekam medis yang memerlukan klarifikasi.
  - **Di Halaman Jejak Audit (`/claims/audit-trail`):**
    * `AuditTrailTable`: Tabel rekaman kronologis: Stempel waktu, No SEP, Faskes, Nama Verifikator, Status Keputusan, dan Catatan Justifikasi. Seluruh kolom nomor referensi menggunakan `tabular-nums`. **Bebas dari chip ornamen buatan** (tidak memuat badge dekoratif seperti "UU PDP Valid").
- **Interaksi Pengguna:**
  - Verifikator memilih tindakan, meninjau/mengedit draf surat formal, lalu mengonfirmasi keputusan.
  - Jika klaim disetujui (`SETUJUI`), status klaim bertransisi menjadi `SIAP_BAYAR` (siap direkonsiliasi pada sistem pembayaran faskes / In-Monica).

#### 3. Backend / AI (BE/AI)
- **Data yang Diolah:**
  - Tabel `AuditTrailLog`: `id`, `claim_id`, `verifier_id`, `action_type`, `justification_notes`, `official_letter_content`, `evidence_snapshot_json`, `created_at`.
  - Bersifat **Append-Only** (hanya mendukung operasi `INSERT` dan `SELECT`, tanpa endpoint mutasi/penghapusan).
- **Logika & Servis:**
  - *Dispute Letter Assembler:* Penggabungan template korespondensi resmi dengan klausul regulasi Permenkes No. 3/2023 dan temuan bukti faktual.
- **Layer yang Terlibat:**
  - `DecisionController` $\rightarrow$ `LetterGeneratorService` $\rightarrow$ `AuditTrailRepository`.

---

### F10: Scientific Benchmark Runner & Model Evaluation

#### 1. Purpose
Menyediakan modul pengujian terukur yang menjalankan evaluasi batch terhadap 30–50 dataset kasus berlabel guna mengukur sensitivitas (*recall*), laju positif palsu (*false positive rate*), dan tingkat keandalan kutipan (*grounding accuracy*) secara transparan.

#### 2. Frontend (FE)
- **Komponen UI (`/benchmark/evaluation-suite`):**
  - Panel kontrol eksekusi benchmark batch dengan tombol solid BPJS Green ber-radius 4px.
  - Kartu metrik performa objektif (berbatas 1px netral, angka `tabular-nums` tanpa efek glow neon):
    * *Recall Kasus Anomali:* Target $\ge 85\%$.
    * *False Positive Rate (FPR):* Target $\le 15\%$ (menguji agar klaim wajar tidak salah ditandai).
    * *Verbatim Grounding Rate:* Target $100\%$ (nol halusinasi kutipan).
    * *Rata-rata Waktu Analisis:* Target $< 60$ detik/klaim.
  - Tabel hasil evaluasi per kasus lengkap dengan status label ground-truth vs prediksi model.
- **Interaksi Pengguna:**
  - Pengguna/juri dapat menekan tombol eksekusi evaluasi, memantau proses batch, dan mengekspor laporan ringkasan evaluasi.

#### 3. Backend / AI (BE/AI)
- **Data yang Diolah:**
  - Input: Kumpulan dataset sintetis terstandar dengan label *ground truth* (mencakup kasus upcoding, inflated bills, note cloning, salah koding ringan tanpa niat, dan klaim bersih).
  - Output: Laporan evaluasi komparatif (`benchmark_results.json`).
- **Layer yang Terlibat:**
  - `BenchmarkRunnerService` $\rightarrow$ `BatchPipelineExecutor` $\rightarrow$ `MetricsCalculator`.

---

## Matriks Keterlacakan (Traceability Matrix)

| Kode Fitur | Nama Fitur | Komponen UI Utama | Modul Backend / AI | Sifat Logika | Kepatuhan Regulasi & Standar |
|---|---|---|---|---|---|
| **F1** | Intake, Privacy Guard & TTE | `ModalUploadClaim`, Header Metadata Bersih | `PrivacyGuardService`, `DocumentIntegrityService` | Deterministik / Kriptografis | UU PDP No. 27/2022, Permenkes 24/2022 |
| **F2** | Priority Triage Queue | `ClaimTable`, `MetricHeader` | `TriageService`, `QueryCache` | Algoritma Pembobotan / Cache | Alur Pra-Bayar BPJS |
| **F3** | Deterministic Fast Filter | `EvidenceCard (Aturan Baku)` | `RuleEngineService`, `PatientHistoryIndex` | Deterministik Kamus & Riwayat | Permenkes 3/2023, Jeda Readmisi 30 Hari |
| **F4** | Clinical Cross-Examiner | `EvidenceCard (Upcoding)` | `AgentOrchestrator`, `ToolRegistry` | Penalaran LLM Multi-Langkah | Standar Severity INA-CBG & PNPK |
| **F5** | Alkes Cross-Checker | `EvidenceCard (Alkes Discrepancy)` | `OperativeDocParser`, `TariffCalcService` | Ekstraksi Entitas + Kalkulator | Permenkes 3/2023 (Alkes Khusus) |
| **F6** | Note Cloning Detector | `DiffViewerModal` | `SimilarityEngine`, `CorpusVectorService` | N-Gram Jaccard & Dense Embedding | Permenkes 16/2019 (Integritas Rekam Medis) |
| **F7** | Verbatim Grounding Verifier | Label Status Kutipan Terverifikasi | `VerbatimGroundingService` | String Substring Exact Match | Prinsip Nol Halusinasi AI |
| **F8** | Dual-Pane Evidence Dossier | `WorkspaceView`, `SmartDocumentViewer` | `DossierAssemblyService` | Render & Sinkronisasi Dokumen | Human-in-the-Loop Ergonomics |
| **F9** | Action Bar & Audit Trail | `DossierActionBar`, `AuditTrailTable` | `DecisionService`, `AuditLogger` | Append-Only Database | Akuntabilitas Hukum & Transisi S06 |
| **F10** | Scientific Benchmark Suite | `BenchmarkView` | `BenchmarkRunnerService`, `MetricsCalculator` | Batch Pipeline Execution | Standar Evaluasi Ilmiah |

---

## Status Gate: Kesiapan Spesifikasi & Kepatuhan Anti-Slop
Dengan spesifikasi yang telah diperbarui di atas:
1. **Frontend:** Mematuhi secara ketat panduan `.agents/skills/ui-styling-and-design-guidelines.md` dan antislop core rules:
   - Menggunakan tipografi **Plus Jakarta Sans** dengan `tabular-nums` untuk semua angka dan kode identifikasi (tanpa font kaku/mono).
   - Palet warna berdisiplin tinggi: **BPJS Green (`emerald-600/700`)** dan **BPJS Blue (`blue-600/700`)**, dengan warna peringatan (amber/rose) terisolasi ketat hanya untuk diskrepansi dan urgensi faktual.
   - Diferensiasi status/tipe berbasis ikon fungsional dan teks ringkas dalam wadah persegi panjang (`rounded-[4px]`).
   - Terbebas total dari AI slop: *no circular dots, no pill buttons, no eyebrow text/kickers, no decorative side borders, no glowing effects, no pulsing highlights*.
   - Bebas dari jargon teatrikal kepatuhan palsu (*no fake BSrE-BSSN banner or decorative UU PDP chips*).
2. **Backend & AI:** Setiap alur logika terdefinisi secara presisi: kapan aturan deterministik bekerja, kapan verifikasi hash/TTE dieksekusi di pipeline backend, bagaimana agent memanggil kamus PNPK dan kalkulator tarif dengan formula matematika pasti, serta bagaimana jejak audit permanen tersimpan secara terstruktur.
