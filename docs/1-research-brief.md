# 1 — Research Brief

**Tema Hackathon:** Detect Smarter, Protect JKN  
**Kategori Terpilih:** Efisiensi Risiko Fasilitas Kesehatan (Kategori 3.1)  
**Sub-kategori Fokus:** Upcoding & Unbundling, Inflated Bills & Cloning  
**Status Gate:** Menunggu Review & Kesepakatan Tim  

---

## 1. Problem dan Target User

### 1.1 Problem Statement
BPJS Kesehatan memproses lebih dari 2 juta transaksi pelayanan kesehatan per hari di seluruh Indonesia. Pada Fasilitas Kesehatan Rujukan Tingkat Lanjut (FKRTL / Rumah Sakit), pembayaran dilakukan dengan sistem paket berbasis casemix (INA-CBG). Di titik ini, terjadi risiko inefisiensi dan kebocoran dana amanah JKN yang bersumber dari dua pola manipulasi berkas yang saling berkaitan:

1. **Manipulasi Level Koding & Tagihan (Upcoding & Unbundling):**
   - **Upcoding:** Diagnosis utama atau diagnosis sekunder/komplikasi dinaikkan secara tidak sah ke kode ICD-10/ICD-9-CM yang lebih kompleks agar menghasilkan kelompok tarif INA-CBG yang jauh lebih mahal (misalnya kasus infeksi saluran pernapasan biasa dikodekan sebagai Pneumonia Berat, atau tindakan operasi minor dikodekan sebagai operasi mayor/khusus).
   - **Unbundling (Fragmentasi):** Prosedur atau episode pelayanan yang seharusnya tercakup dalam satu kesatuan paket tarif dipecah menjadi beberapa klaim atau kunjungan terpisah guna melipatgandakan total penggantian klaim.

2. **Manipulasi Bukti Klinis & Komponen Biaya (Inflated Bills & Cloning):**
   - **Cloning (Duplikasi Rekam Medis):** Seiring masifnya Rekam Medis Elektronik (RME), muncul fenomena *copy-paste* catatan klinis (catatan perkembangan SOAP, laporan tindakan, atau resume medis) dari pasien lain atau dari riwayat lama tanpa pemeriksaan fisik riil. Berkas terlihat lengkap secara administratif, namun substansi klinisnya palsu.
   - **Inflated Bills (Penggelembungan Alkes & Obat):** Biaya alat kesehatan khusus (seperti ring jantung/stent, implan ortopedi, kasa/mesh, lensa tanam) atau obat kemoterapi/antibiotik mahal ditagihkan ke BPJS dalam jumlah atau spesifikasi lebih tinggi daripada yang sebenarnya terdokumentasikan pada laporan operasi riil dan lembar pemberian obat perawat.

**Akar Masalah Operasional:**  
Bukti dari anomali-anomali di atas tidak tersimpan dalam bentuk angka tabular sederhana, melainkan **tersebar di dokumen teks tidak terstruktur** (catatan dokter, laporan operasi, lembar observasi keperawatan, hasil lab/radiologi). Verifikator BPJS dituntut memeriksa ribuan berkas dengan alokasi waktu hanya hitungan menit per pasien. Akibatnya, verifikator mengalami kelelahan kognitif (*cognitive fatigue*), pemeriksaan menjadi tidak konsisten, dan klaim anomali tetap lolos terbayar.

---

### 1.2 Target User

| Profil Pengguna | Peran & Tanggung Jawab | Kebutuhan & Titik Sakit (*Pain Points*) |
|---|---|---|
| **Pengguna Utama: Verifikator Klaim BPJS Kesehatan (Kantor Cabang / Wilayah)** | Memeriksa berkas klaim rumah sakit secara pra-bayar sebelum pembayaran ditransfer ke faskes. | - Beban volume berkas sangat tinggi (ratusan hingga ribuan berkas/hari).<br>- Menghadapi dokumen teks RME yang tebal dan kompleks.<br>- Rentan melewatkan inkonsistensi antara laporan operasi vs tagihan alkes, serta diagnosis vs bukti penunjang.<br>- Membutuhkan rujukan pasal/regulasi koding instan saat menolak klaim agar tidak memicu sengketa berkepanjangan. |
| **Pengguna Sekunder: Tim PK-JKN & Auditor Medis (BPJS & Kemenkes)** | Melakukan audit sampling pasca-bayar (*post-audit*) dan investigasi faskes terindikasi fraud. | - Membutuhkan rekonstruksi berkas dan *audit trail* yang runut untuk membuktikan unsur kesengajaan.<br>- Membutuhkan deteksi kesamaan semantik lintas pasien (menemukan pola *cloning* massal di satu RS). |

---

## 2. Bukti Bahwa Problem Benar-benar Ada

### 2.1 Bukti Resmi Hukum & Temuan Penegak Hukum
1. **Audit Tim Gabungan PK-JKN (KPK, Kemenkes, BPKP, BPJS - Juli 2024):**
   - Hasil audit sampel klaim di 6 RS di 3 provinsi mengungkap 3 RS swasta terindikasi fraud sistematis dengan estimasi kerugian negara mencapai **Rp35 miliar**.
   - KPK mengidentifikasi **8 modus kecurangan**, dengan **manipulasi diagnosis (upcoding)** dan **tindakan fiktif berbasis rekam medis rekayasa (cloning/phantom)** sebagai modus dengan nilai rupiah terbesar.
   - Modus spesifik yang ditemukan di lapangan: penagihan tindakan yang tidak didukung rekam medis yang sah (misal: operasi katarak 1 mata diklaim 2 mata, terapi fisik tanpa rekam medis pendukung).
2. **Pengakuan Regulasi Formal (Permenkes No. 16 Tahun 2019):**
   - Pasal 5 ayat (1) Permenkes 16/2019 secara eksplisit mengklasifikasikan:
     - *Upcoding* (huruf a)
     - *Cloning* / penjiplakan klaim pasien lain (huruf b)
     - *Inflated bills* obat & alkes (huruf d)
     - *Unbundling* (huruf e)
     - *Manipulasi data rekam medis* (huruf i)  
     sebagai bentuk kecurangan (*fraud*) pelayanan kesehatan rujukan tingkat lanjut yang dapat dikenai sanksi administratif hingga pidana.

### 2.2 Regulasi Pembiayaan & Insentif Finansial
- **Permenkes No. 3 Tahun 2023 (Standar Tarif Pelayanan Kesehatan JKN):**  
  Struktur tarif INA-CBG membagi penyakit ke dalam tingkat keparahan (*Severity Level* I, II, dan III). Penambahan diagnosis sekunder komplikasi semu (upcoding) dapat menaikkan selisih tarif dari jutaan hingga puluhan juta rupiah per kasus. Hal ini menciptakan insentif finansial yang kuat bagi oknum faskes untuk memanipulasi koding.

### 2.3 Realitas Transisi RME & Fenomena *Note Cloning*
- Berdasarkan **Permenkes No. 24 Tahun 2022** tentang Rekam Medis dan kebijakan integrasi SATUSEHAT, fasilitas kesehatan diwajibkan menerapkan RME.
- Berbagai studi manajemen rekam medis (Kajian UGM 2022, Jurnal Manajemen Pelayanan Kesehatan) menemukan bahwa kemudahan digital justru melahirkan fenomena baru: staf medis menduplikasi (*copy-paste*) riwayat klinis lama untuk memenuhi syarat klaim tanpa melakukan verifikasi fisik ulang (*templated cloning*).

---

## 3. Solusi atau Kompetitor yang Sudah Tersedia

Saat ini BPJS Kesehatan dan ekosistem JKN telah memiliki beberapa instrumen pengendalian klaim:

1. **VEDIKA (Verifikasi Digital Klaim) BPJS Kesehatan:**
   - Platform portal web tempat RS mengunggah berkas digital (PDF/RME) pengajuan klaim.
   - Menyediakan antarmuka bagi verifikator untuk melihat dokumen dan memberi status setuju/pending/dispute.
2. **DEFRADA (Deteksi Potensi Fraud dengan Analisa Data Klaim):**
   - Sistem analitik internal BPJS Kesehatan berbasis algoritma machine learning (Random Forest, XGBoost, Neural Networks).
   - Bekerja menganalisis anomali statistik dari data tabular klaim (misal: persentase persalinan sectio caesarea abnormal di suatu faskes, lonjakan klaim diagnosis tertentu dibanding rata-rata regional).
3. **E-Klaim INA-CBG (Kemenkes):**
   - Software grouper resmi dari Kementerian Kesehatan untuk mengonversi kode ICD-10 dan ICD-9-CM menjadi tarif klaim INA-CBG berdasarkan aturan grouping.
4. **Audit Medis & Tim Pencegahan Kecurangan RS / TKMKB:**
   - Audit berkala berbasis peninjauan sampel rekam medis fisik/digital secara manual oleh dokter ahli.

---

## 4. Kelemahan Solusi Saat Ini

Meskipun sistem di atas sudah beroperasi, kebocoran dana dan sengketa klaim tetap terjadi karena celah-celah mendasar berikut:

| Solusi Saat Ini | Cara Kerja | Titik Kelemahan Kritis (*Gaps*) |
|---|---|---|
| **VEDIKA** | Pipa transmisi berkas digital | **Pasif & Tanpa Kecerdasan Analisis:** VEDIKA hanya bertindak sebagai "folder digital". Sistem tidak membaca isi teks rekam medis; verifikator tetap harus membaca manual ratusan halaman PDF. |
| **DEFRADA** | Deteksi anomali pada data tabular terstruktur | **Buta Teks Klinis (*Blind to Clinical Narratives*):** DEFRADA hanya melihat angka agregat. DEFRADA tidak bisa memeriksa apakah tulisan tangan/laporan operasi dokter mendukung pemasangan alat yang ditagih, atau apakah hasil lab leukosit mendukung diagnosis sepsis. |
| **Output DEFRADA (*Black-Box Flagging*)** | Menghasilkan skor risiko/bendera merah | **Tidak Memberikan Rantai Bukti:** Sistem hanya menandai *"Klaim ini berisiko tinggi"*, tanpa menjelaskan *di kalimat rekam medis mana* letak ketidaksesuaiannya atau aturan koding apa yang dilanggar. |
| **Deteksi *Cloning* yang Nihil** | Tidak ada modul plagiarisme klinis | Sistem klaim saat ini tidak membandingkan kemiripan semantik antar-berkas rekam medis pasien yang berbeda di satu rumah sakit. Catatan hasil *copy-paste* lolos tanpa hambatan selama format terisi lengkap. |
| **Verifikasi Alkes/Obat Terpisah** | Lembar tagihan dan laporan tindakan diperiksa terpisah | Verifikator sering kali hanya mencocokkan jumlah kuitansi farmasi dengan form klaim, tanpa melakukan *cross-check* mendalam ke narasi laporan pembedahan/anestesi (*Inflated Bills* lolos). |
| **Audit Manual** | Manusia memeriksa sampel berkas | **Hanya Menjangkau 1–5% Sampel:** Audit mendalam hanya dilakukan pasca-bayar pada sebagian kecil berkas saat dana JKN sudah terlanjur dicairkan ke RS. |

---

## 5. Relevansi dengan Tema Hackathon dan Rubrik Penilaian

Analisis kesesuaian masalah ini dengan **6 Dimensi Penilaian Healthkathon 2026**:

1. **Relevansi Permasalahan (Dimensi 1):**  
   Menyasar episentrum kebocoran dana JKN. Masalah *Upcoding, Unbundling, Inflated Bills, dan Cloning* di FKRTL adalah perhatian utama KPK, BPKP, dan Direksi BPJS Kesehatan.
2. **Kreativitas & Inovasi (Dimensi 2):**  
   Menggeser paradigma verifikasi dari sekadar anomali statistik angka (model tabular lama) menuju **penalaran bukti klinis mendalam (*clinical evidence reasoning*)** yang menghubungkan teks rekam medis dengan regulasi pembiayaan.
3. **Kualitas Teknologi (Dimensi 3):**  
   Penggunaan AI sangat terjustifikasi (*tepat guna, bukan sekadar label*). Masalah ini menuntut pemahaman bahasa alami medis, ekstraksi data multimodal, *cross-referencing* multi-dokumen, dan penalaran aturan deterministik.
4. **Efektivitas & Dampak (Dimensi 4):**  
   Menyediakan dampak langsung terukur: mempercepat durasi telaah klaim verifikator, memangkas sengketa klaim (*dispute*), dan mencegah kerugian klaim salah bayar pada fase pra-bayar.
5. **Kesiapan & Skalabilitas (Dimensi 5):**  
   Dapat diuji menggunakan berkas rekam medis sintetis yang terstandar (mengacu pada format RME Permenkes 24/2022) dan aturan koding publik (ICD-10, ICD-9-CM, Permenkes 3/2023).
6. **Keamanan, Privasi & Tata Kelola (Dimensi 6):**  
   Mengedepankan prinsip *Human-in-the-Loop*. Sistem dirancang bukan sebagai hakim pemotong klaim otomatis, melainkan asisten penelaah bukti yang transparan dan dapat diaudit, dengan kepatuhan penuh terhadap UU Perlindungan Data Pribadi (UU PDP).

---

## 6. Asumsi yang Belum Terbukti dan Risiko Terbesar

### 6.1 Asumsi yang Perlu Diuji Lebih Lanjut
1. **Asumsi Aksesibilitas Teks RME:**  
   Diasumsikan sebagian besar rumah sakit kelas A/B/C telah mengunggah resume medis dan laporan tindakan dalam format digital teks atau PDF berbasis teks (bukan hasil scan foto miring/kabur dengan tulisan tangan dokter yang tidak terbaca).
2. **Asumsi Batasan Variasi Praktik Klinis:**  
   Diasumsikan perbedaan antara *salah koding tidak disengaja* (*coding error* akibat ketidaktahuan), *variasi pendekatan medis DPJP*, dan *fraud yang disengaja* dapat dipetakan secara objektif melalui ada/tidaknya bukti klinis penunjang di berkas rekam medis.

### 6.2 Risiko Terbesar & Rencana Mitigasi

| No | Risiko Kritis | Dampak | Rencana Mitigasi Sejak Desain Masalah |
|---|---|---|---|
| **R1** | **Risiko Halusinasi & Tuduhan Palsu (*False Accusation*)** | RS menolak hasil verifikasi; merusak hubungan BPJS dan faskes mitra. | Hasil telaah **tidak boleh mengeluarkan vonis fraud**, melainkan *"Indikasi Diskrepansi / Ketidaksesuaian Berkas"*. Setiap indikasi **wajib menyertakan kutipan langsung (*verbatim quote*)** dari dokumen rekam medis serta pasal regulasi rujukan. |
| **R2** | **Kepatuhan UU PDP (Data Medis Sensitif)** | Pelanggaran kerahasiaan data kesehatan peserta JKN. | Dalam riset dan purwarupa, **100% menggunakan data rekam medis sintetis/anonim**. Tidak menggunakan data riil peserta JKN tanpa izin resmi. |
| **R3** | **Kompleksitas Regulasi Koding yang Dinamis** | Aturan koding INA-CBG dan PNPK terus diperbarui oleh Kemenkes. | Sumber regulasi harus dipisahkan sebagai basis pengetahuan modular (*knowledge base*) yang dapat diperbarui secara independen tanpa mengubah logika penalaran inti. |

---

## 7. Gate Check Dokumen 1

> **Kriteria Gate:** Seluruh anggota tim sepakat mengenai lingkup masalah dan batasannya sebelum merancang konsep produk.

- [x] Kategori utama terkunci: **Efisiensi Risiko Fasilitas Kesehatan (Kategori 3.1)**
- [x] Sub-kategori fokus terkunci: **Upcoding & Unbundling** dan **Inflated Bills & Cloning**
- [x] Target pengguna terkunci: **Verifikator Klaim BPJS Kesehatan (Utama)** & **Tim PK-JKN/Auditor Medis (Sekunder)**
- [x] Masalah murni berakar pada ketidakmampuan sistem saat ini membaca & mencocokkan dokumen teks rekam medis dengan kode klaim serta tagihan alkes/obat.
- [x] Dokumen tidak mengandung rancangan fitur produk, mockup UI, arsitektur agent, atau penentuan tech stack (disimpan untuk Dokumen 2–4).
