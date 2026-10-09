# Research Brief — Healthkathon 2026

**Tema:** Detect Smarter, Protect JKN
**Kategori:** 3.1 Efisiensi Risiko Fasilitas Kesehatan
**Sub-kategori fokus (usulan):** **Upcoding & Unbundling** (termasuk manipulasi diagnosis)
**Pendekatan:** Agentic AI sebagai "asisten investigator" untuk verifikator BPJS
**Status dokumen:** Riset awal per 9 Okt 2026, sebelum menentukan fitur dan stack

> **Cara membaca label bukti**
> - ✅ **Resmi/primer:** pernyataan pejabat atau lembaga yang dikutip media kredibel
> - ⚠️ **Sekunder/lama:** dikutip dari jurnal, skripsi, atau blog; angkanya perlu diverifikasi ke sumber asli sebelum masuk slide
> - ❓ **Belum terverifikasi:** klaim yang saya temukan tapi belum bisa dipastikan

---

## 0. Ringkasan Eksekutif

1. **Masalahnya nyata dan diakui resmi.** KPK, Kemenkes, BPKP, dan BPJS membentuk tim gabungan (PK-JKN) karena fraud klaim faskes terbukti ada. Tiga RS sudah dibawa ke penindakan dengan indikasi kerugian sekitar Rp35 miliar, dan KPK menduga praktiknya lebih luas.
2. **Dua modus terbesar menurut KPK adalah phantom billing dan manipulasi diagnosis.** Manipulasi diagnosis berdekatan langsung dengan upcoding. Untuk upcoding, tanda-tandanya tersebar di beberapa dokumen sekaligus, dan itu cocok untuk agent yang menalar lintas sumber.
3. **BPJS sudah punya sistem (VEDIKA, DEFRADA, AI untuk verifikasi klaim).** Jadi pembeda kita bukan "deteksi fraud pakai AI", melainkan **cara kerja agent yang menghasilkan rantai bukti yang bisa diaudit dan ditinjau manusia**.
4. **Risiko terbesar:** tidak ada data berlabel fraud yang bisa kita pakai secara legal, sehingga klaim akurasi hanya bisa dibuktikan pada data sintetis. Rancang proposal agar jujur soal ini (lihat bagian 6).

---

## 1. Problem dan Target User

### Problem statement (draf)
Verifikator dan auditor BPJS harus memeriksa jutaan klaim INA-CBG. Pola upcoding dan unbundling baru terlihat bila beberapa hal dibandingkan sekaligus: kode diagnosis, tindakan, hasil penunjang, obat, lama rawat, dan riwayat klaim. Pemeriksaan ini mahal, tergantung kemampuan masing-masing verifikator, dan hasilnya sering tidak konsisten. Akibatnya klaim yang janggal lolos dibayar atau baru ketahuan saat audit pasca-bayar.

BPJS sendiri mencatat lebih dari 2 juta transaksi layanan per hari ([Bisnis, Des 2025](https://finansial.bisnis.com/read/20251210/215/1935707/bpjs-kesehatan-waspada-era-digital-picu-peningkatan-risiko-fraud-jkn)), sehingga pemeriksaan manual menyeluruh tidak mungkin.

### Definisi sub-kategori
| Istilah | Arti operasional |
|---|---|
| **Upcoding** | Diagnosis atau tindakan diubah ke kode yang tarif INA-CBG-nya lebih tinggi (contoh: ISPA dikodekan Pneumonia tanpa dukungan rontgen/lab) |
| **Unbundling / fragmentasi** | Satu paket layanan dipecah menjadi beberapa klaim atau episode agar total tagihan lebih besar |
| **Manipulasi diagnosis** | Diagnosis dibuat berbeda dari hasil pemeriksaan untuk mendapat klaim lebih tinggi. Ini beririsan kuat dengan upcoding |

### Target user (urut prioritas)
| User | Kebutuhan | Peran di produk |
|---|---|---|
| **Verifikator klaim BPJS (kantor cabang/regional)** | Mengurutkan klaim mana yang layak diperiksa dulu, dengan alasan yang bisa dipertanggungjawabkan | **Pengguna utama** |
| **Tim Anti-Fraud/PK-JKN & auditor medis** | Dokumen bukti rapi untuk eskalasi dan pemeriksaan lanjutan | Pengguna sekunder |
| **Tim casemix/koder RS** | Menangkap salah koding sebelum klaim dikirim (mengurangi pending dan clawback) | Opsional, bisa jadi nilai tambah |

**Catatan:** pilih satu pengguna utama (verifikator BPJS). Melayani BPJS dan RS sekaligus akan mengaburkan fokus dan memunculkan konflik kepentingan.

---

## 2. Bukti bahwa Problem Benar-benar Ada

### 2.1 Bukti kuat (resmi)
| Bukti | Sumber | Label |
|---|---|---|
| KPK bersama Kemenkes, BPKP, dan BPJS membentuk tim PK-JKN. Audit sampel klaim di 6 RS di 3 provinsi menemukan 3 RS (Jawa Tengah dan Sumatera Utara) terindikasi fraud, indikasi kerugian sekitar Rp35 miliar | [Bisnis](https://kabar24.bisnis.com/read/20240724/16/1785098/kpk-endus-klaim-fiktif-bpjs-kesehatan-nilainya-rp35-miliar), [Kemenkes](https://kemkes.go.id/eng/cegah-fraud-kemenkes-bentuk-tim-pencegahan) | ✅ |
| Di salah satu temuan, tagihan 4.341 kasus ternyata hanya sekitar 1.000 kasus yang ada di catatan medis | [Medcom](https://www.medcom.id/nasional/hukum/zNAQ5M3N-kpk-pelajari-kewenangannya-dalam-skandal-klaim-fiktif-bpjs-kesehatan) | ✅ |
| KPK menyebut ada **delapan modus**; dua terbesar adalah phantom billing dan manipulasi diagnosis. Enam lainnya: self-referral, upcoding, repeat billing, fragmentasi, suap/gratifikasi, iur biaya | [Bisnis](https://kabar24.bisnis.com/read/20240725/16/1785214/8-modus-klaim-fiktif-bpjs-kesehatan-yang-rugikan-negara-rp35-miliar) | ✅ |
| Modus lain yang disebut pihak BPJS: manipulasi diagnosis/tindakan, cloning klaim pasien lain, penggelembungan tagihan obat/alkes, pemecahan episode tanpa indikasi medis | [detikBali](https://www.detik.com/bali/hukum-dan-kriminal/d-7463870/kpk-ungkap-3-rs-akali-jumlah-klaim-bpjs-kesehatan) | ✅ |
| KPK menduga praktik serupa marak di banyak faskes lain, bukan hanya tiga RS tersebut | [Bisnis](https://kabar24.bisnis.com/read/20240724/16/1785153/kpk-duga-praktik-klaim-tagihan-fiktif-bpjs-terjadi-di-lebih-dari-dari-3-rs) | ✅ |
| Data BPJS: nilai inefisiensi yang dikendalikan sekitar Rp866,8 miliar saat verifikasi dan Rp397,9 miliar pasca-verifikasi (data audit Nov 2023) | [Bisnis](https://finansial.bisnis.com/read/20240724/215/1785147/kpk-bongkar-modus-fraud-klaim-bpjs-kesehatan-rp35-miliar) | ✅ |
| Dewas BPJS menilai sanksi terhadap faskes yang berbuat fraud masih lemah. BPJS Watch menyebut kecurangan berulang tiap tahun | [Bisnis](https://finansial.bisnis.com/read/20240726/215/1785631/rumah-sakit-rs-ajukan-klaim-fiktif-ke-bpjs-kesehatan-dewas-sanksinya-lemah), [Kontan](https://keuangan.kontan.co.id/news/bpjs-watch-sarankan-ada-upaya-hukum-terkait-temuan-fraud-di-klaim-bpjs-kesehatan) | ✅ (opini) |
| BPJS memperingatkan risiko fraud naik seiring digitalisasi; seluruh transaksi harian diproses sistem berbasis AI untuk mendeteksi anomali | [Bisnis](https://finansial.bisnis.com/read/20251210/215/1935707/bpjs-kesehatan-waspada-era-digital-picu-peningkatan-risiko-fraud-jkn) | ✅ |

### 2.2 Angka besar yang harus dipakai hati-hati
| Angka | Catatan | Label |
|---|---|---|
| **Rp6,8 triliun** fraud ditemukan, Jan–Okt 2025 | Dikutip Bisnis dari data BPJS. Belum jelas apakah ini nilai terkonfirmasi, nilai dugaan, atau yang berhasil dicegah. **Cek definisinya sebelum dipakai di slide** | ⚠️ ([Bisnis](https://finansial.bisnis.com/read/20251215/215/1936740/belajar-dari-malaysia-hingga-china-untuk-cegah-fraud-bpjs-kesehatan)) |
| **Rp20 triliun** kerugian akibat fraud layanan kesehatan | Ini **ekstrapolasi** KPK (asumsi 10%), bukan temuan terukur, dan mencakup layanan kesehatan secara umum | ⚠️ ([Bisnis](https://finansial.bisnis.com/read/20240923/215/1801509/menahan-beban-klaim-jaminan-kesehatan-di-bpjs-kesehatan-hasil-investasi-cukup)) |
| Potensi fraud layanan kesehatan **0,5%–15%** | Rentang pernyataan pejabat BPJS; lebarnya rentang menunjukkan besaran sebenarnya belum diketahui pasti | ⚠️ (Bisnis, Des 2025) |
| **175.774** potensi fraud klaim FKRTL, estimasi Rp440 miliar | Dikutip jurnal dari data KPK; tahun dan metode tidak jelas | ⚠️ ([jurnal](https://journal.univetbantara.ac.id/index.php/jmiak-rekammedis/article/view/7082/3627)) |
| **Upcoding ±50%, unbundling ±25%** dari nilai fraud layanan kesehatan | Dikutip jurnal dari data KPK **tahun 2016**. Sudah lama; cari sumber yang lebih baru | ⚠️ ([IJPHS](https://ijphs.iaescore.com/index.php/IJPHS/article/download/22952/13857), [Undip](https://repofeb.undip.ac.id/9278/3/5.%20T%20-%20Abstrak%20%28Indonesia%29%20-%20%2012030119410012.pdf)) |

### 2.3 Nuansa penting: upcoding belum tentu fraud
Kajian di jurnal UGM menegaskan upcoding tidak selalu fraud; harus ada unsur kesengajaan untuk mendapat keuntungan, dan penyebabnya bisa aturan koding yang membingungkan ([UGM](https://journal.ugm.ac.id/jkesvo/article/download/69056/33299)). Studi Undip juga menemukan red flag upcoding yang ditemukan BPJS kerap tidak ditindaklanjuti tegas ([Undip](https://repofeb.undip.ac.id/9278/3/5.%20T%20-%20Abstrak%20%28Indonesia%29%20-%20%2012030119410012.pdf)). **Implikasi untuk produk:** sistem harus menghasilkan "indikasi yang perlu ditinjau", bukan vonis fraud. Ini juga selaras dengan arahan rubrik untuk membingkai sebagai efisiensi dan integritas, bukan tuduhan.

### 2.4 Celah bukti yang masih perlu ditutup
- Belum ada angka terbaru yang memisahkan nilai **upcoding/unbundling** dari modus lain. Angka 2016 terlalu tua.
- Belum ada bukti langsung soal **berapa persen klaim yang lolos verifikasi** padahal janggal.
- Wawancara dengan verifikator, koder, atau auditor akan menjadi bukti paling kuat (lihat bagian 6).

---

## 3. Solusi dan Kompetitor yang Sudah Tersedia

### 3.1 Dalam negeri
| Solusi | Apa yang dilakukan | Catatan bukti |
|---|---|---|
| **VEDIKA** (Verifikasi Digital Klaim) | Aplikasi BPJS untuk verifikasi klaim RS rujukan secara daring di kantor BPJS; berjalan sejak 2018 menggantikan verifikasi manual | ✅ Banyak studi evaluasi ([UGM](https://journal.ugm.ac.id/jkki/article/download/88792/38551), [Unair](https://e-journal.unair.ac.id/JPHRECODE/article/view/19848)) |
| **DEFRADA** | Alat deteksi potensi fraud berbasis analisis data klaim INA-CBG, dikembangkan BPJS; pada 2017 menyumbang sekitar 25–30% dari total efisiensi | ⚠️ Makalah ISSA 2018 ([ISSA](https://iskm.issa.int/node/6052)). Belum tahu seberapa jauh berkembang sejak itu |
| **AI untuk verifikasi klaim (BPJS)** | BPJS menyatakan sedang mengembangkan AI untuk mempercepat verifikasi, mengurangi salah administrasi, dan deteksi dini fraud | ✅ Pernyataan resmi, tetapi rincian teknis tidak publik ([Bisnis, Sep 2025](https://finansial.bisnis.com/read/20250904/215/1908413/digitalisasi-jkn-bpjs-kesehatan-sabet-penghargaan-bergengsi)) |
| **"Intelligence Claim" / "SmartClaim JKN"** | Disebut sebagai program AI BPJS | ❓ Hanya dari blog vendor ([medminutes](https://medminutes.io/blog/ai-pendapatan-rumah-sakit-panduan-direktur/)); verifikasi ke sumber BPJS dulu |
| **Tim PK-JKN & Tim Anti-Fraud daerah** | Mekanisme kelembagaan: audit, penelusuran, sanksi | ✅ Kemenkes, KPK |
| **Sistem verifikasi digital internal RS** | Contoh: RSUD Margono Soekarjo (validasi elektronik anti-fraud) | ⚠️ Berita lama, level satu RS ([Antara](https://jateng.antaranews.com/berita/385066/rsud-margono-soekarjo-purwokerto-luncurkan-inovasi-pelayanan-bpjs-kesehatan)) |
| **Vendor SIMRS/validasi pra-kirim klaim** | Pemeriksaan kesesuaian diagnosa-tindakan sebelum klaim dikirim, sisi RS | ⚠️ Sumber blog vendor, sisi RS bukan BPJS |

### 3.2 Luar negeri (payer-side)
| Solusi | Apa yang dilakukan |
|---|---|
| **Shift Technology** (Payment Integrity) | AI untuk deteksi FWA, claims editing, audit rekam medis; mengklaim "agentic AI", skor dan prioritas alert dengan penjelasan, dan *human-in-the-loop by design* ([Shift](https://www.shift-technology.com/hubfs/Solution%20Data%20Sheets/Shift%20Payment%20Integrity%20(EN).pdf?hsLang=en)) |
| **Cotiviti, Optum, Alivia, Codoxo, dll.** | Platform payment integrity untuk asuransi kesehatan, terutama pasar AS ([CB Insights](https://www.cbinsights.com/esp/healthcare-&-life-sciences/health-insurance-&-rcm-tech/fraud,-waste,-&-abuse-(fwa)-detection-platforms)) |

**Catatan:** yang disebut di atas berasal dari materi pemasaran vendor, jadi klaim kemampuannya belum teruji independen. Vendor global dirancang untuk sistem pembayaran AS; kecocokan dengan INA-CBG dan regulasi JKN belum terbukti. Hanya itu yang bisa saya simpulkan dari sumber ini, bukan bahwa mereka *tidak mampu*.

---

## 4. Kelemahan Solusi Saat Ini

> Bagian ini paling mudah **overclaim**. Banyak bukti di bawah berasal dari studi lokal tahun 2019–2022 pada beberapa RS, bukan evaluasi sistem nasional saat ini. Perlakukan sebagai **hipotesis kelemahan**, lalu validasi lewat wawancara.

| Kelemahan | Bukti | Kekuatan bukti |
|---|---|---|
| **Hasil verifikasi tidak seragam antar verifikator** — persepsi verifikator berbeda-beda sehingga keputusan berbeda | Studi VEDIKA di RSUD Tarakan ([UGM](https://journal.ugm.ac.id/jkki/article/download/88792/38551)) | Sedang (satu lokasi, 2022) |
| **Klaim pending meningkat setelah VEDIKA** dan sering disebabkan faktor verifikator, aplikasi, atau kelengkapan dokumen | Studi yang sama | Sedang |
| **Masalah teknis aplikasi** (server down, hak kelas tidak muncul) | Studi VEDIKA Sidoarjo 2019 ([Unair](https://e-journal.unair.ac.id/JPHRECODE/article/view/19848)) | Lemah (2019) |
| **Red flag ada tetapi tindak lanjut tidak tegas**; fraud awareness BPJS dan RS rendah | Studi upcoding Semarang ([Undip](https://repofeb.undip.ac.id/9278/3/5.%20T%20-%20Abstrak%20%28Indonesia%29%20-%20%2012030119410012.pdf)) | Sedang (kualitatif) |
| **Kualitas verifikator dipersoalkan** — celah dimanfaatkan karena verifikasi kurang berkualitas | Pernyataan BPJS Watch ([Kontan](https://nasional.kontan.co.id/news/terus-terjadi-bpjs-watch-dorong-investigasi-kasus-phantom-billing-bpjs-kesehatan)) | Lemah (opini LSM) |
| **Sanksi dinilai lemah**, sehingga efek jera rendah | Dewas BPJS ([Bisnis](https://finansial.bisnis.com/read/20240726/215/1785631/rumah-sakit-rs-ajukan-klaim-fiktif-ke-bpjs-kesehatan-dewas-sanksinya-lemah)) | Sedang — tetapi ini di luar jangkauan produk teknologi |
| **Pendekatan deteksi cenderung mengeluarkan flag, bukan menjelaskan kasus** | **Tidak ada bukti langsung.** Ini hipotesis kami: kita belum tahu format output sistem BPJS | ❓ **Harus divalidasi** |
| **Fraud berpindah mengikuti digitalisasi** (semakin kompleks dan canggih) | Pernyataan Dirut BPJS, Des 2025 | Sedang |

### Celah peluang yang masuk akal (hipotesis)
1. Output "alert + skor" belum tentu cukup. Verifikator butuh **cerita kasus yang lengkap dengan bukti** (diagnosis ini tidak didukung lab X, tindakan Y tidak muncul di catatan, pola RS ini menyimpang dari RS sebanding).
2. Membaca **teks bebas rekam medis/resume** dan mencocokkannya dengan kode klaim adalah pekerjaan yang sulit dilakukan aturan atau model tabular biasa. Di sinilah LLM agent paling bernilai.
3. **Konsistensi**: agent bisa menerapkan checklist yang sama untuk semua klaim, sehingga mengurangi variasi antar verifikator.

---

## 5. Relevansi dengan Tema dan Rubrik Penilaian

### 5.1 Kecocokan dengan tema
- **"Detect Smarter":** deteksi lintas dokumen dengan penalaran, bukan sekadar threshold.
- **"Protect JKN":** melindungi dana jaminan sosial; BPJS sendiri menyebut dana iuran yang dikembalikan akibat fraud adalah kerugian negara ([Bisnis](https://finansial.bisnis.com/read/20240731/215/1786853/bpjs-kesehatan-ungkap-sanksi-rumah-sakit-yang-terbukti-lakukan-fraud)).
- **"Efisiensi Risiko":** fokus pada prioritas pemeriksaan sehingga sumber daya verifikator dipakai di klaim berisiko tinggi.

### 5.2 Pemetaan ke 6 dimensi rubrik
| Dimensi | Apa yang harus kita buktikan | Kekuatan posisi saat ini | Risiko |
|---|---|---|---|
| **1. Relevansi Permasalahan** | Masalah nyata, penting bagi BPJS | **Kuat** — ada pengakuan resmi KPK/Kemenkes/BPJS | Angka besar (Rp6,8T / Rp20T) rawan dipertanyakan; pakai dengan label |
| **2. Kreativitas & Inovasi** | Beda dari VEDIKA/DEFRADA/AI BPJS | **Belum terbukti** | Terbesar. Pembeda harus spesifik: rantai bukti, baca teks rekam medis, audit trail |
| **3. Kualitas Teknologi** | AI tepat guna, bukan label | **Potensial** — alur investigasi multi-langkah cocok untuk agent | Bila hasilnya hanya "LLM menilai klaim", dianggap label. Perlu komponen deterministik (aturan tarif, kode) + LLM untuk bagian yang memang butuh penalaran |
| **4. Efektivitas & Dampak** | Perbaikan terukur vs kondisi sekarang | **Lemah sampai ada eksperimen** | Tanpa data riil, hanya bisa ukur pada kasus sintetis; harus jujur |
| **5. Kesiapan & Skalabilitas** | Dari prototype ke produk | **Sedang** | Integrasi ke V-Claim/VEDIKA di luar kendali kita; tunjukkan jalur integrasi, jangan klaim sudah terintegrasi |
| **6. Keamanan & Tata Kelola** | UU PDP, bias, human-in-the-loop | **Bisa kuat sejak desain** | Agent membaca rekam medis = data kesehatan sensitif. Harus sintetis/anonim dan rancang batas akses agent |

### 5.3 Checklist komponen wajib panduan yang paling berisiko
- **Bagian 5 (kematangan):** kita harus jujur — kemungkinan level *Prototype* pada data sintetis.
- **Bagian 7 (dampak):** jangan menulis angka penghematan seolah terbukti; tulis sebagai estimasi dengan asumsi.
- **Bagian 8 (etika):** UU PDP **wajib** dibahas; data peserta riil dilarang tanpa izin resmi.

---

## 6. Asumsi yang Belum Terbukti dan Risiko Terbesar

### 6.1 Asumsi yang belum terbukti (urut dari yang paling berbahaya bila salah)

| # | Asumsi | Mengapa berbahaya bila salah | Cara cepat menguji |
|---|---|---|---|
| A1 | **Sistem BPJS saat ini belum menghasilkan penjelasan berbasis bukti yang cukup untuk verifikator** | Jika BPJS sudah punya, nilai pembeda kita runtuh | Wawancara 2–3 verifikator/koder/auditor; cari demo atau paparan publik sistem BPJS |
| A2 | **Rekam medis/resume dan data penunjang akan tersedia bagi verifikator dalam format yang bisa dibaca mesin** | Jika hanya PDF scan atau tak tersedia, agent tidak punya bahan | Tanya alur dokumen di VEDIKA (apa saja yang diunggah RS) |
| A3 | **Upcoding bisa dideteksi dari inkonsistensi dokumen** (bukan hanya dari statistik pola RS) | Jika pembeda ada di pola statistik, LLM agent kurang relevan | Uji pada 30–50 kasus sintetis yang dirancang pakar/koder, bandingkan dengan baseline aturan sederhana |
| A4 | **Data sintetis cukup realistis untuk membuktikan metode** | Ada risiko *circularity*: kita membuat kasus lalu mendeteksinya sendiri | Libatkan koder/dokter untuk membuat atau meninjau kasus; pisahkan pembuat kasus dan pembangun sistem |
| A5 | **Verifikator mau dan bisa memakai output agent dalam alur kerjanya** | Produk bagus tapi tidak dipakai | Uji mockup alur pada 1–2 pengguna nyata |
| A6 | **Kode, aturan tarif, dan pedoman klinis yang dibutuhkan tersedia publik** (ICD-10/ICD-9-CM, tarif INA-CBG per Permenkes 3/2023, PNPK/clinical pathway) | Tanpa itu, penalaran agent tidak punya landasan | Inventarisasi sumber publik dan lisensinya |
| A7 | **Sistem tarif tetap INA-CBG selama masa relevansi proposal** | Bila bergeser (misal ke iDRG), desain harus fleksibel | ❓ Perlu dicek ke sumber resmi; saya hanya menemukan indikasi dari blog |
| A8 | **Biaya dan latensi LLM wajar untuk skala klaim BPJS** | Juri skalabilitas akan bertanya | Rancang agent berlapis: filter murah dahulu, agent hanya untuk klaim yang lolos filter |

### 6.2 Risiko terbesar

**R1. Tidak ada kebenaran dasar (ground truth) yang legal.**
Kita dilarang memakai data peserta JKN riil tanpa izin. Maka akurasi hanya bisa diklaim pada data sintetis. *Mitigasi:* nyatakan terang-terangan; ukur apa yang bisa diukur (konsistensi alasan, kemampuan menemukan kasus yang ditanam pakar, perbandingan dengan baseline aturan), dan jangan menyajikan angka akurasi sebagai performa nyata.

**R2. Diferensiasi terhadap BPJS in-house dan vendor global.**
Kategori Faskes kemungkinan paling ramai, dan BPJS mengklaim sudah memakai AI. *Mitigasi:* tentukan satu pembeda yang bisa didemonstrasikan dalam 30 detik, misalnya: "agent menyusun *dossier* kasus dengan kutipan bukti per temuan dan tetap memberi ruang bagi verifikator untuk menolak".

**R3. Salah tuduh (false positive) terhadap faskes.**
Upcoding bisa disebabkan salah koding yang tidak disengaja. Alert yang keliru dapat merugikan RS dan menurunkan kepercayaan. *Mitigasi:* bahasa output "indikasi untuk ditinjau"; human-in-the-loop wajib; tampilkan tingkat keyakinan dan alasan alternatif yang tidak mencurigakan.

**R4. "AI sebagai label".**
Rubrik menilai penggunaan AI harus tepat guna. Jika semua dikerjakan LLM, juri akan curiga. *Mitigasi:* bagi tugas secara jelas — aturan deterministik untuk yang bisa diaturkan (pencocokan kode-tarif, lama rawat), LLM hanya untuk membaca teks klinis dan menyusun penjelasan.

**R5. Halusinasi dan keandalan agent pada data kesehatan.**
Agent yang mengarang bukti sangat berbahaya di konteks audit. *Mitigasi:* setiap temuan wajib menunjuk ke kutipan sumber; ada langkah verifikasi yang memeriksa bahwa kutipan benar-benar ada di dokumen.

**R6. Privasi dan UU PDP.**
Agent yang memproses teks rekam medis menyentuh data kesehatan, yang merupakan data pribadi sensitif. *Mitigasi:* data sintetis/anonim sepenuhnya; arsitektur dengan prinsip akses minimum, tanpa penyimpanan permanen, dan opsi model yang dijalankan di lingkungan tertutup untuk penerapan nyata.

### 6.3 Pertanyaan terbuka yang perlu diputuskan tim
1. Tenggat dan format penilaian (apakah ada demo langsung atau hanya PDF ≤20 slide)? Ini menentukan seberapa dalam prototype perlu dibangun.
2. Apakah tim punya akses ke orang domain (koder, dokter, verifikator)? Ini penentu apakah A1, A3, A4 bisa diuji.
3. Apakah **phantom billing/repeat billing** juga ingin dimasukkan sebagai sub-kategori pendukung? Panduan mengizinkan beberapa sub-kategori dalam satu kategori asalkan saling berkaitan.

---

## 7. Mengapa Upcoding & Unbundling yang Dipilih

| Sub-kategori | Skor kecocokan | Alasan |
|---|---|---|
| **Upcoding & Unbundling** ✅ | **Tertinggi** | Bukti ada dan beririsan dengan modus terbesar KPK (manipulasi diagnosis); tanda-tandanya tersebar di banyak dokumen sehingga cocok untuk penalaran multi-langkah; bisa disimulasikan dengan kode dan tarif yang publik; output natural berupa penjelasan yang ditinjau manusia |
| Phantom & Repeat Billing | Sedang | Salah satu dari dua modus yang paling sering dipakai menurut KPK, tetapi pembuktiannya sering butuh verifikasi eksternal (apakah pasien benar-benar ada, kunjungan lapangan) yang tidak bisa disimulasikan meyakinkan di hackathon; hanya ada sebagai sinyal pendukung (misal pola klaim berulang) |
| Prolonged Stay & Readmisi | Sedang-rendah | Sebagian besar bisa diselesaikan dengan aturan sederhana; nilai "agentic"-nya sulit dibuktikan |
| Inflated Bills & Cloning | Sedang | Cloning menarik (kemiripan teks klaim), tetapi lebih cocok dengan pendekatan kemiripan dokumen biasa daripada agent |
| Rujukan & Self-referral | Rendah | Butuh data jaringan rujukan dan konteks ketersediaan layanan yang sulit kita simulasikan |
| Manipulasi Obat & Alkes | Rendah | Butuh data dispensing riil di faskes yang tidak dimiliki payer |

**Kondisi yang membatalkan rekomendasi ini:** jika wawancara (A1) menunjukkan BPJS sudah memiliki dossier kasus berbasis bukti dan baca-teks rekam medis, atau jika (A2) menunjukkan dokumen klinis tidak pernah sampai ke verifikator dalam bentuk terbaca, maka pertimbangkan ulang sub-kategori atau sudut pandang pengguna (misal beralih ke validasi pra-kirim sisi RS, yang akan berpindah ke audiens berbeda).

---

## 8. Langkah Riset Berikutnya (sebelum menentukan fitur dan stack)

1. **Wawancara 2–3 orang domain** (koder RS, verifikator, atau auditor medis). Pertanyaan inti: apa yang membuat satu klaim "terasa janggal", dokumen apa yang dibuka, berapa lama per kasus, apa yang paling menyulitkan?
2. **Cari sumber primer untuk angka kunci**: definisi Rp6,8T, data upcoding/unbundling terbaru, dan laporan resmi BPJS tentang sistem deteksi saat ini.
3. **Inventarisasi data/pengetahuan publik**: ICD-10, ICD-9-CM, tarif INA-CBG (Permenkes 3/2023), PNPK/clinical pathway, dan regulasi anti-fraud (Permenkes 16/2019, Permenkes 26/2021 yang mengatur verifikasi). Cek juga status transisi ke iDRG.
4. **Rancang set kasus uji sintetis** (30–50) bersama orang domain, termasuk kasus **salah koding tidak sengaja** sebagai pengganggu agar false positive terukur.
5. Setelah A1–A4 ada jawaban, baru tentukan fitur dan stack.

---

## Daftar Sumber

- Bisnis.com — [Belajar dari Malaysia hingga China untuk Cegah Fraud BPJS Kesehatan (Des 2025)](https://finansial.bisnis.com/read/20251215/215/1936740/belajar-dari-malaysia-hingga-china-untuk-cegah-fraud-bpjs-kesehatan)
- Bisnis.com — [BPJS Kesehatan Waspada Era Digital Picu Peningkatan Risiko Fraud JKN (Des 2025)](https://finansial.bisnis.com/read/20251210/215/1935707/bpjs-kesehatan-waspada-era-digital-picu-peningkatan-risiko-fraud-jkn)
- Bisnis.com — [Digitalisasi JKN, BPJS Kesehatan Sabet Penghargaan (Sep 2025)](https://finansial.bisnis.com/read/20250904/215/1908413/digitalisasi-jkn-bpjs-kesehatan-sabet-penghargaan-bergengsi)
- Bisnis.com — [KPK Endus Klaim Fiktif, Rp35 Miliar (Jul 2024)](https://kabar24.bisnis.com/read/20240724/16/1785098/kpk-endus-klaim-fiktif-bpjs-kesehatan-nilainya-rp35-miliar)
- Bisnis.com — [8 Modus Klaim Fiktif BPJS Kesehatan (Jul 2024)](https://kabar24.bisnis.com/read/20240725/16/1785214/8-modus-klaim-fiktif-bpjs-kesehatan-yang-rugikan-negara-rp35-miliar)
- Bisnis.com — [KPK Duga Praktik Klaim Fiktif di Lebih dari 3 RS (Jul 2024)](https://kabar24.bisnis.com/read/20240724/16/1785153/kpk-duga-praktik-klaim-tagihan-fiktif-bpjs-terjadi-di-lebih-dari-dari-3-rs)
- Bisnis.com — [KPK Bongkar Modus Fraud Klaim, data pengendalian BPJS (Jul 2024)](https://finansial.bisnis.com/read/20240724/215/1785147/kpk-bongkar-modus-fraud-klaim-bpjs-kesehatan-rp35-miliar)
- Bisnis.com — [Dewas: Sanksinya Lemah (Jul 2024)](https://finansial.bisnis.com/read/20240726/215/1785631/rumah-sakit-rs-ajukan-klaim-fiktif-ke-bpjs-kesehatan-dewas-sanksinya-lemah)
- Bisnis.com — [Sanksi RS yang Terbukti Fraud (Jul 2024)](https://finansial.bisnis.com/read/20240731/215/1786853/bpjs-kesehatan-ungkap-sanksi-rumah-sakit-yang-terbukti-lakukan-fraud)
- Bisnis.com — [Menahan Beban Klaim, estimasi KPK Rp20 triliun (Sep 2024)](https://finansial.bisnis.com/read/20240923/215/1801509/menahan-beban-klaim-jaminan-kesehatan-di-bpjs-kesehatan-hasil-investasi-cukup)
- Kemenkes — [Cegah Fraud, Kemenkes Bentuk Tim Pencegahan](https://kemkes.go.id/eng/cegah-fraud-kemenkes-bentuk-tim-pencegahan)
- Medcom — [KPK pelajari kewenangannya dalam skandal klaim fiktif](https://www.medcom.id/nasional/hukum/zNAQ5M3N-kpk-pelajari-kewenangannya-dalam-skandal-klaim-fiktif-bpjs-kesehatan)
- detikBali — [KPK Ungkap 3 RS Akali Jumlah Klaim BPJS Kesehatan](https://www.detik.com/bali/hukum-dan-kriminal/d-7463870/kpk-ungkap-3-rs-akali-jumlah-klaim-bpjs-kesehatan)
- Kontan — [BPJS Watch Dorong Investigasi Phantom Billing](https://nasional.kontan.co.id/news/terus-terjadi-bpjs-watch-dorong-investigasi-kasus-phantom-billing-bpjs-kesehatan)
- Kontan — [BPJS Watch Sarankan Upaya Hukum](https://keuangan.kontan.co.id/news/bpjs-watch-sarankan-ada-upaya-hukum-terkait-temuan-fraud-di-klaim-bpjs-kesehatan)
- ISSA — [DEFRADA, makalah BPJS Kesehatan 2018](https://iskm.issa.int/node/6052)
- Jurnal — [Penerapan VEDIKA, RSUD Tarakan (UGM)](https://journal.ugm.ac.id/jkki/article/download/88792/38551)
- Jurnal — [VEDIKA RSUD Sidoarjo 2019 (Unair)](https://e-journal.unair.ac.id/JPHRECODE/article/view/19848)
- Jurnal — [Potensi Fraud JKN melalui Rekam Medis (UGM)](https://journal.ugm.ac.id/jkesvo/article/download/69056/33299)
- Tesis — [Sistem Pengendalian Internal dan Makna Fraud dalam Upcoding (Undip)](https://repofeb.undip.ac.id/9278/3/5.%20T%20-%20Abstrak%20%28Indonesia%29%20-%20%2012030119410012.pdf)
- Jurnal — [Potential fraud and its prevention (IJPHS)](https://ijphs.iaescore.com/index.php/IJPHS/article/download/22952/13857)
- Jurnal — [Analisis Strategi Manajemen Klaim (Univet Bantara, 2025)](https://journal.univetbantara.ac.id/index.php/jmiak-rekammedis/article/view/7082/3627)
- Shift Technology — [Payment Integrity data sheet](https://www.shift-technology.com/hubfs/Solution%20Data%20Sheets/Shift%20Payment%20Integrity%20(EN).pdf?hsLang=en)
- CB Insights — [FWA Detection Platforms](https://www.cbinsights.com/esp/healthcare-&-life-sciences/health-insurance-&-rcm-tech/fraud,-waste,-&-abuse-(fwa)-detection-platforms)
- Antara — [RSUD Margono Soekarjo, verifikasi digital antifraud](https://jateng.antaranews.com/berita/385066/rsud-margono-soekarjo-purwokerto-luncurkan-inovasi-pelayanan-bpjs-kesehatan)
- medminutes — [AI Pendapatan Rumah Sakit (blog vendor, ❓ tidak dipakai sebagai bukti utama)](https://medminutes.io/blog/ai-pendapatan-rumah-sakit-panduan-direktur/)
