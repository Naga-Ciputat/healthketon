# Checklist & Panduan Pengumpulan Proyek (to-submit.md)
## Healthkathon 2026: Detect Smarter, Protect JKN

> **Tenggat Waktu Submisi:** **1 November 2026 (23.59 WIB)**  
> **Kanal Pengumpulan:** Form Pengumpulan Dashboard Resmi Healthkathon 2026  
> **Target Tahapan:** Dari 145 tim lolos seleksi proposal -> Disaring menjadi **20 Tim Finalis** (*coaching 1-on-1*) -> Dipilih **5 Tim Terbaik** ke panggung **Demo Day (21 November 2026)**.

---

## 1. Daftar Berkas & Tautan yang Wajib Disubmit di Dashboard

Pada formulir pengumpulan dashboard, pastikan item-item berikut sudah siap dan valid:

| No | Komponen Submisi | Format / Persyaratan | Status Kesiapan |
|---|---|---|:---:|
| 1 | **Tautan Video Presentasi & Demo** | URL YouTube dengan visibilitas **"Unlisted"** (bukan *Private* terkunci akun), durasi **maksimal 10 menit**. | [ ] Wajib |
| 2 | **Tautan Live Prototype / Web App** | URL aplikasi web fungsional yang dapat dibuka langsung oleh dewan juri tanpa kendala instalasi lokal (misal deploy di Vercel / Cloud). | [ ] Wajib |
| 3 | **Tautan Repositori Kode Sumber** | URL repositori (GitHub / GitLab). Pastikan *clean code*, tidak memuat kredensial/API secrets, serta memiliki panduan instalasi `README.md`. | [ ] Sangat Disarankan |
| 4 | **Identitas & Metadata Tim** | Nama Solusi, Nama Tim, ID Tim, Kategori Lomba & Sub-Kategori Fokus, serta Kontak Ketua Tim (Nama & Email). | [ ] Wajib |
| 5 | **File Slide Presentasi (Bila Diminta Upload)** | Berkas presentasi dalam format PDF (maks. 10 MB). Seluruh slide instruksi/petunjuk bawaan template wajib telah dihapus. | [ ] Opsional / Siaga |

---

## 2. Struktur Wajib 7 Konten Video (Total Durasi: Maksimal 10 Menit)

Video wajib direkam menggunakan format presentasi (disarankan **Zoom Meeting** dengan *screen sharing* slide/aplikasi dan kamera wajah pemapar aktif):

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ ALOKASI WAKTU MAKSIMAL 10 MENIT                                                                 │
├──────────────┬────────────┬─────────────────────────────────────────────────────────────────────┤
│ Durasi       │ Waktu      │ Komponen Materi & Fokus Isi                                         │
├──────────────┼────────────┼─────────────────────────────────────────────────────────────────────┤
│ 0.5 menit    │ 00:00–00:30│ 1. Perkenalan Tim (Foto seluruh anggota, peran spesifik, keahlian)   │
│ 1.0 menit    │ 00:30–01:30│ 2. Judul Ide, Nilai Utama (1 kalimat), Deskripsi & 2-3 Tujuan       │
│ 1.5 menit    │ 01:30–03:00│ 3. Latar Belakang, Urgensi Masalah & 3 Indikator Dampak Terukur    │
│ 1.5 menit    │ 03:00–04:30│ 4. Alur Proses Aplikasi (Input -> Analisis AI -> Output) & Modul BEA│
│ 3.0 menit    │ 04:30–07:30│ 5. Demo Langsung Prototype Berjalan (Live working software)         │
│ 1.5 menit    │ 07:30–09:00│ 6. Penjelasan 3–4 Fitur Utama & Penyelesaian Masalahnya             │
│ 1.0 menit    │ 09:00–10:00│ 7. Slide Tambahan (Arsitektur/Etika AI) + Tautan Demo & Penutup     │
└──────────────┴────────────┴─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Rincian Materi per Slide & Skrip Presentasi

### Slide 1: Perkenalan Tim (Target: 30 Detik)
* **Elemen Visual:** Nama Tim, ID Tim, Kategori Lomba.
* **Profil Anggota:**
  * Foto formal seluruh anggota tim (tampil jelas).
  * Nama lengkap dan peran:
    * *Lead AI / ML Engineer:* Bertanggung jawab pada model inferensi, deteksi anomali, dan evaluasi.
    * *Frontend / Full-stack Engineer:* Bertanggung jawab pada antarmuka web, integrasi API, dan rekayasa pengalaman pengguna.
    * *Clinical / Healthcare Domain Specialist:* Bertanggung jawab pada kepatuhan regulasi klaim BPJS Kesehatan, kaidah koding ICD-10/ICD-9-CM, dan validasi data.
  * Ringkasan keahlian relevan yang jujur dan dapat diverifikasi.

### Slide 2: Judul Ide, Deskripsi, dan Tujuan (Target: 60 Detik)
* **Nama Solusi:** **Clarix AI** (atau **TELISIK: Tele-Audit & Clinical Evidence Co-Pilot**)
* **Satu Kalimat Nilai Utama (*Value Proposition*):**
  > *"Solusi ini membantu Verifikator Klaim BPJS Kesehatan dan Tim Kendali Mutu Faskes agar proses verifikasi klaim RME menjadi 10× lebih cepat, transparan, dan akurat dalam mendeteksi anomali penagihan tanpa menghilangkan kendali manusia."*
* **Kategori & Sub-Kategori:**
  * *Kategori Utama:* Efisiensi Risiko Fasilitas Kesehatan
  * *Sub-Kategori Fokus:* Upcoding, Phantom/Repeat Billing, Manipulasi Berkas Klaim RME, dan Integrasi Modul Klaim BEA (`C03.04`).
* **Deskripsi Singkat:** Sistem *AI Decision Support Co-Pilot* yang menganalisis rekam medis elektronik terstruktur dan resume medis tidak terstruktur secara multimodal untuk mencocokkan tindakan klinis dengan kode diagnosis klaim secara otomatis.
* **Tujuan Terukur (3 Butir):**
  1. Memangkas waktu telaah berkas klaim kompleks dari rata-rata 25 menit menjadi di bawah 3 menit per berkas.
  2. Meningkatkan presisi deteksi anomali klaim (upcoding/unbundling) hingga $\ge 92\%$ dengan tingkat *false positive* $< 5\%$.
  3. Menyediakan rekam jejak audit (*audit trail*) dan penjelasan sitasi bukti klinis (*explainable AI*) yang 100% dapat dipertanggungjawabkan secara hukum medis.

### Slide 3: Latar Belakang dan Dampak (Target: 90 Detik)
* **Persoalan Spesifik (Data Riil BPJS Kesehatan 2026):**
  * Selisih defisit klaim pembiayaan jaminan kesehatan nasional: **Pendapatan iuran Rp118 Triliun vs Klaim layanan Rp132 Triliun** (kesenjangan Rp14 Triliun).
  * Beban operasional 3.221 FKRTL mitra dengan jutaan lembar klaim bulanan di mana verifikator mengalami kelelahan kognitif (*cognitive fatigue*).
* **3 Indikator Dampak Terukur (Sebelum vs Sesudah):**
  * **Indikator 1 (Kecepatan Verifikasi):** Dari rata-rata **20–25 menit/klaim** berkurang menjadi **2–3 menit/klaim** (efisiensi waktu hingga 88%).
  * **Indikator 2 (Deteksi Anomali Berkas):** Peningkatan deteksi ketidaksesuaian klaim terselubung dari baseline konvensional **~60%** menjadi **$\ge 93\%$** dengan sitasi halaman rekam medis otomatis.
  * **Indikator 3 (Audit Trail & Akurasi):** **100% keputusan tercatat dalam log audit immutable**, mengeliminasi dispute antara Faskes dan BPJS Kesehatan hingga 75%.

### Slide 4: Alur Proses Aplikasi & Titik Integrasi BEA (Target: 90 Detik)
* **Alur 5 Langkah:**
  1. **Input:** Unggah berkas klaim RME (resume medis, lab, operasi, resep) dalam format FHIR JSON / PDF / gambar hasil pindaian.
  2. **Proses:** Ekstraksi data, OCR, tokenisasi entitas klinis, dan anonymizer penyamaran PII (selaras UU PDP).
  3. **Analisis AI:** *Cross-Verification Engine* (mencocokkan diagnosis primer/sekunder ICD-10 dengan prosedur ICD-9-CM dan bukti teks resume dokter) + *Anomaly Classifier*.
  4. **Output:** Triage risiko klaim (*High Risk / Review Needed / Auto-Approved Candidate*), kartu ringkasan anomali, dan penanda sitasi berkas klinis berdampingan (*side-by-side evidence viewer*).
  5. **Tindak Lanjut (*Human-in-the-Loop*):** Verifikator meninjau bukti sitasi -> Memilih tindakan (Setujui, Tolak, atau Minta Konfirmasi RS) -> Rekonsiliasi log tersimpan.
* **Pemetaan Arsitektur BEA:** Terintegrasi pada modul **Klaim C03.04** (menghubungkan VClaim, VIDI, dan sistem rekam medis elektronik RS) serta meneruskan status bersih ke **Keuangan S06** (In-Monica).

### Slide 5: Demo Aplikasi / Prototype (Target: 3 Menit) — *Inti Penilaian*
Tampilkan aplikasi berjalan secara nyata (*screen recording* / *live demo*):
* **Skenario 1 (Triage & Monitoring Klaim):** Menampilkan halaman dashboard antrean klaim terprioritaskan berdasarkan tingkat risiko anomali biaya dan kecurigaan klinis.
* **Skenario 2 (Telaah Berkas Dossier & Verifikasi Bukti):** Membuka klaim mencurigakan (misal: klaim bedah dengan dugaan *upcoding* tingkat keparahan), menunjukkan bagaimana AI menandai baris teks dalam resume medis dan memperlihatkan rujukan regulasi BPJS terkait.
* **Skenario 3 (Pengambilan Keputusan & Audit Trail):** Verifikator memberikan catatan justifikasi, menyetujui/menolak penyesuaian tarif klaim, dan memeriksa mutasi status di timeline audit trail.
* **Skenario 4 (Benchmark & Uji Akurasi):** Memperlihatkan metrik performa model, matriks kebingungan (*confusion matrix*), serta latensi proses per dokumen.

### Slide 6: Penjelasan 4 Fitur Kunci (Target: 90 Detik)
1. **Intelligent Claim Triage Matrix:** Pengelompokan berkas klaim otomatis berbasis tingkat risiko anomali untuk memprioritaskan telaah berkas berisiko tinggi terlebih dahulu.
2. **Dual-Pane Clinical Evidence Dossier:** Penjajaran berkas rekam medis elektronik di sisi kiri dan analisis AI di sisi kanan dengan penyorot otomatis (*bounding box / text highlight*) pada bukti medis pendukung.
3. **Immutable Audit Trail & Dispute Resolver:** Log kronologis seluruh keputusan verifikator dan argumen model AI untuk mencegah sengketa verifikasi pascaklaim.
4. **Automated Cross-Code Verification:** Mesin pemverifikasi silang kesesuaian antara diagnosis ICD-10, tindakan bedah ICD-9-CM, hasil laboratorium, dan tarif INA-CBG.

### Slide 7: Slide Tambahan & Penutup (Target: 60 Detik)
* **Tata Kelola & Kepatuhan Etika AI (UU PDP No. 27/2022 & 4 Cek AI BPJS):**
  * *Data Aman:* Tidak mengirimkan data pasien riil ke model AI publik; memanfaatkan arsitektur inferensi lokal terisolasi dengan data sintetis/sandbox.
  * *Human-in-the-Loop:* AI hanya merekomendasikan, verifikator manusia memegang kewenangan mutlak persetujuan akhir.
  * *Model Explainable:* Setiap bendera anomali wajib disertai sitasi teks berkas rujukan.
* **Tautan Penting:**
  * Tautan Live Prototype: `[https://...]`
  * Tautan Repositori GitHub: `[https://github.com/...]`
  * Kontak Tim: `[Nama Lengkap & Email Ketua Tim]`

---

## 4. Evaluasi Mandiri Terhadap 5 Kriteria Penilaian Juri

| Pilar Kriteria Juri | Bobot / Fokus | Strategi Pembuktian Tim Kita |
|---|---|---|
| **1. Kreativitas & Keunikan** | Inovasi AI melampaui aturan konvensional (*if-else rule*) | Menunjukkan kapabilitas penalaran kontekstual (*cross-modal verification*) antara narasi dokter yang bebas dengan kode tagihan numerik. |
| **2. Model Bisnis & Keberlanjutan** | Kemudahan adopsi dan skalabilitas di seluruh Indonesia | Arsitektur ringan berbasis web yang kompatibel dengan integrasi API VClaim/HFIS eksisting di 3.221 RS tanpa perlu perombakan server RS. |
| **3. Dampak Terukur** | Solutif terhadap defisit klaim dan pemangkasan durasi | Menampilkan perbandingan metrik eksplisit (waktu verifikasi turun 88%, potensi deteksi klaim anomali naik hingga 93%). |
| **4. Presentasi & Komunikasi** | Kejelasan narasi, artikulasi, dan penguasaan materi | Mengikuti batasan waktu 10 menit secara presisi, visual slide profesional, dan demo aplikasi yang mengalir lugas. |
| **5. Kesiapan Produk** | Kematangan perangkat lunak fungsional (*working code*) | Prototipe bukan sekadar gambar Figma statis, melainkan aplikasi web interaktif yang dapat diuji coba langsung oleh juri. |

---

## 5. Checklist Final Pra-Submisi (Pre-Flight Checklist)

Lakukan verifikasi silang pada seluruh daftar periksa berikut sebelum menekan tombol *Submit*:

- [ ] **1. Durasi Video Aman:** Durasi video tidak boleh lebih dari 10:00 (Rekomendasi aman: antara **09:15 s.d. 09:45**).
- [ ] **2. Visibilitas Video YouTube Tepat:** Setelan visibilitas adalah **"Unlisted"** (*Bukan Private*). Uji tautan di *Incognito Window / Browser lain* tanpa login untuk memastikan video bisa diputar.
- [ ] **3. Audio & Teks Tajam:** Suara vokal presenter terdengar jelas dan teks/angka pada layar demo terbaca jelas pada resolusi 1080p.
- [ ] **4. Demonstrasi Sistem Aktif:** Video mendemokan software berjalan langsung (*live UI interaction*), bukan hanya pemaparan slide presentasi.
- [ ] **5. Foto Seluruh Anggota Tampil:** Foto formal dan nama seluruh anggota tim tertera pada bagian awal video.
- [ ] **6. Slide Panduan Bawaan Panitia Dihapus:** Slide 2, 3, dan 4 pada template asli PPT panitia (yang bertuliskan *"hapus sebelum merekam"*) telah dibersihkan.
- [ ] **7. Tautan Prototype Publik Dapat Diakses:** Tautan live URL aplikasi dapat dibuka dengan lancar, cepat, dan tanpa error server.
- [ ] **8. Repositori Bersih dari Rahasia:** Repositori Git tidak memuat file `.env` yang berisi *API key*, *secret token*, atau data kredensial sensitif.
- [ ] **9. Batas Waktu Terpenuhi:** Berkas berhasil disubmit melalui dashboard resmi **sebelum tanggal 1 November 2026 pukul 23:59 WIB**.
