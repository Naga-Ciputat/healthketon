# Concept Brief — Healthkathon 2026

**Tema:** Detect Smarter, Protect JKN **Kategori:** 3.1 Efisiensi Risiko Fasilitas Kesehatan **Sub-kategori fokus:** Upcoding & Unbundling (termasuk manipulasi diagnosis) **Nama kerja solusi:** *Claim Investigator Agent* (nama final menyusul) **Status:** Draf konsep per 9 Okt 2026, berbasis Research Brief. Belum divalidasi lewat wawancara pengguna.

---

## 1. Problem Statement

Verifikator dan auditor BPJS Kesehatan harus memeriksa klaim INA-CBG dalam volume sangat besar. BPJS mencatat lebih dari 2 juta transaksi layanan per hari, sehingga pemeriksaan manual menyeluruh tidak mungkin dilakukan.

Pola upcoding dan unbundling baru terlihat jika beberapa hal dibandingkan sekaligus: kode diagnosis, tindakan, hasil penunjang, obat, lama rawat, dan riwayat klaim. Pemeriksaan lintas dokumen ini mahal, bergantung pada kemampuan masing-masing verifikator, dan hasilnya tidak selalu konsisten. Akibatnya klaim yang janggal bisa lolos dibayar, atau baru ketahuan saat audit pasca-bayar.

**Mengapa mendesak (bukti resmi):**

- KPK, Kemenkes, BPKP, dan BPJS membentuk tim PK-JKN. Audit sampel di 6 RS pada 3 provinsi menemukan 3 RS terindikasi fraud dengan indikasi kerugian sekitar Rp35 miliar.
- KPK menyebut delapan modus, dua terbesar adalah phantom billing dan manipulasi diagnosis. Manipulasi diagnosis beririsan langsung dengan upcoding. KPK menduga praktik serupa terjadi di banyak faskes lain.
- BPJS mengendalikan inefisiensi sekitar Rp866,8 miliar saat verifikasi dan Rp397,9 miliar pasca-verifikasi (data audit Nov 2023).
- BPJS sendiri memperingatkan risiko fraud meningkat seiring digitalisasi.

**Nuansa yang harus dijaga:** upcoding tidak selalu fraud. Penyebabnya bisa salah koding yang tidak disengaja atau aturan koding yang membingungkan. Masalah ini dibingkai sebagai **efisiensi dan integritas klaim**, bukan tuduhan terhadap faskes.

> **Catatan angka:** Rp6,8 triliun (2025), Rp20 triliun (ekstrapolasi KPK 10%), dan rasio upcoding ±50% / unbundling ±25% (data 2016) berlabel ⚠️ di Research Brief. Verifikasi sumber asli sebelum masuk slide, atau tampilkan dengan label estimasi.

---

## 2. Persona / Target User Utama

**Pengguna utama: Verifikator klaim BPJS (kantor cabang/regional)**

| Aspek | Deskripsi |
| --- | --- |
| **Pekerjaan sehari-hari** | Memeriksa klaim INA-CBG dari RS, memutuskan lolos, pending, atau dieskalasi |
| **Kebutuhan utama** | Tahu klaim mana yang layak diperiksa lebih dulu, dan **mengapa**, dengan alasan yang bisa dipertanggungjawabkan |
| **Pain point** | Banyak dokumen harus dibuka dan dibandingkan manual; keputusan antar verifikator bisa berbeda; waktu terbatas; temuan sulit didokumentasikan untuk eskalasi |
| **Yang dibutuhkan dari alat** | Ringkasan kasus dengan bukti yang bisa dicek sendiri, bukan sekadar skor atau flag |
| **Yang tidak diinginkan** | Alat yang memutuskan sendiri, atau alert tanpa penjelasan |

**Pengguna sekunder:** Tim Anti-Fraud/PK-JKN dan auditor medis (butuh dokumen bukti yang rapi untuk eskalasi).

**Sengaja tidak dilayani di versi ini:** tim casemix/koder RS. Melayani BPJS dan RS sekaligus akan mengaburkan fokus dan menimbulkan konflik kepentingan.

---

## 3. Value Proposition

**Satu kalimat:**

> Mengubah tumpukan klaim menjadi antrean prioritas berisi *dossier* kasus lengkap dengan kutipan bukti, sehingga verifikator memutuskan lebih cepat, lebih konsisten, dan tetap memegang keputusan akhir.

| Untuk siapa | Nilai yang diterima |
| --- | --- |
| **Verifikator BPJS** | Hemat waktu per kasus; fokus pada klaim berisiko tinggi; checklist pemeriksaan yang sama untuk semua klaim |
| **Tim Anti-Fraud / auditor** | Dossier siap eskalasi dengan jejak audit (apa yang diperiksa, bukti apa, alasan apa) |
| **BPJS sebagai institusi** | Pengendalian inefisiensi lebih dini, variasi keputusan antar verifikator berkurang |
| **Faskes jujur** | Risiko salah tuduh berkurang karena output berbahasa "indikasi untuk ditinjau" dan menampilkan penjelasan alternatif yang tidak mencurigakan |

---

## 4. Solusi yang Dipilih dan Alternatif yang Ditolak

### 4.1 Solusi yang dipilih

**Agentic AI sebagai "asisten investigator" untuk verifikator.** Agent menerima klaim yang sudah lolos filter awal, lalu menjalankan alur investigasi berlapis:

1. **Filter murah (deterministik):** pencocokan kode diagnosis/tindakan dengan tarif INA-CBG, cek lama rawat, riwayat klaim dan pola episode.
2. **Penalaran lintas dokumen (LLM):** membaca teks bebas resume medis dan membandingkannya dengan kode klaim, hasil penunjang, dan obat.
3. **Verifikasi kutipan:** setiap temuan wajib menunjuk ke kutipan sumber, lalu dicek bahwa kutipan benar-benar ada di dokumen (anti-halusinasi).
4. **Dossier kasus:** ringkasan temuan, bukti per temuan, tingkat keyakinan, dan penjelasan alternatif.
5. **Keputusan manusia:** verifikator menerima, menolak, atau meminta pemeriksaan lanjut. Semua keputusan tercatat.

**Prinsip pembagian tugas:** aturan deterministik untuk yang bisa diaturkan; LLM hanya untuk membaca teks klinis dan menyusun penjelasan. Ini menjaga penggunaan AI tetap tepat guna, bukan sekadar label.

### 4.2 Alternatif yang ditolak

| Alternatif | Alasan ditolak |
| --- | --- |
| **Skoring anomali statistik saja** (pendekatan mirip deteksi berbasis pola) | Hanya menghasilkan flag/skor tanpa cerita kasus. Tidak membaca teks rekam medis. Area ini kemungkinan sudah ditangani sistem BPJS |
| **LLM tunggal yang "menilai" klaim lalu memberi skor** | Rawan halusinasi, tidak ada jejak bukti, dan mudah dinilai juri sebagai "AI sebagai label" |
| **Validasi pra-kirim di sisi RS (casemix/koder)** | Berpindah ke audiens berbeda dan menimbulkan konflik kepentingan dengan fokus BPJS. Disimpan sebagai pengembangan lanjutan |
| **Fokus phantom/repeat billing** | Pembuktian sering butuh verifikasi eksternal (pasien benar ada, kunjungan lapangan) yang tidak bisa disimulasikan meyakinkan. Hanya dipakai sebagai sinyal pendukung (pola klaim berulang) |
| **Keputusan otomatis (auto-reject/auto-pending)** | Risiko salah tuduh tinggi, bertentangan dengan prinsip human-in-the-loop dan UU PDP/etika yang dinilai juri |

---

## 5. Satu Skenario Penggunaan Utama

> **Catatan:** kasus di bawah adalah ilustrasi dengan data sintetis, bukan data peserta JKN riil.

**Tokoh:** Verifikator di kantor cabang BPJS. **Situasi:** awal hari kerja, ratusan klaim rawat inap masuk.

| Langkah | Yang terjadi |
| --- | --- |
| **1. Antrean prioritas** | Verifikator membuka antrean. Klaim urut berdasarkan indikasi risiko, bukan urutan masuk. Satu klaim teratas diberi label "indikasi upcoding diagnosis" |
| **2. Buka dossier** | Dossier menampilkan klaim rawat inap dengan diagnosis **Pneumonia**. Agent mencatat temuan dengan kutipan sumber: (a) resume medis hanya menyebut batuk-pilek dan demam ringan, (b) tidak ada hasil rontgen toraks maupun lab pendukung, (c) obat yang diberikan simptomatik, tanpa antibiotik, (d) lama rawat sangat singkat |
| **3. Pembanding** | Agent menunjukkan bahwa pola diagnosis serupa di RS tersebut menyimpang dari RS sebanding, serta riwayat klaim pasien |
| **4. Penjelasan alternatif** | Agent menulis bahwa kemungkinan lain adalah salah koding tidak disengaja atau dokumen penunjang belum terunggah. Tingkat keyakinan ditampilkan |
| **5. Verifikasi bukti** | Verifikator mengklik tiap kutipan dan langsung melihat posisi teks di dokumen asli |
| **6. Keputusan manusia** | Verifikator memilih: minta dokumen penunjang tambahan (pending), eskalasi ke tim anti-fraud, atau tolak temuan agent dengan alasan. Keputusan tercatat di jejak audit |

**Hasil yang diharapkan:** verifikator mendapat keputusan yang bisa dipertanggungjawabkan tanpa membuka dan membandingkan dokumen satu per satu.

---

## 6. Definisi Sukses dan Keunggulan Produk

### 6.1 Definisi sukses

Karena data riil dilarang tanpa izin resmi, seluruh ukuran di bawah diukur pada **data sintetis** (target awal 30–50 kasus, dirancang atau ditinjau pakar domain, dengan pembuat kasus dipisah dari pembangun sistem). Angka target adalah hipotesis yang perlu disesuaikan setelah wawancara dan uji awal.

| Dimensi | Metrik | Cara mengukur |
| --- | --- | --- |
| **Efektivitas deteksi** | Persentase kasus yang ditanam pakar berhasil ditemukan; perbandingan dengan baseline aturan sederhana | Uji pada set kasus sintetis |
| **Presisi / salah tuduh** | Tingkat false positive pada kasus pengganggu (salah koding tidak sengaja) | Sertakan kasus pengganggu di set uji |
| **Keandalan bukti** | Persentase temuan dengan kutipan yang terverifikasi ada di dokumen sumber (target: tidak ada kutipan karangan) | Pengecekan otomatis + sampel manual |
| **Efisiensi** | Waktu menyusun gambaran satu kasus dengan dan tanpa agent | Simulasi alur pada 1–2 pengguna nyata |
| **Konsistensi** | Kesamaan keputusan antar penguji pada kasus yang sama dengan dan tanpa dossier | Uji mockup/prototype |
| **Tata kelola** | Setiap keputusan manusia tercatat; tidak ada data riil; arsitektur sesuai UU PDP | Review desain |

**Kejujuran klaim:** hasil pada data sintetis tidak disajikan sebagai performa nasional. Dampak finansial ditulis sebagai estimasi dengan asumsi yang disebutkan.

### 6.2 Keunggulan produk (pembeda dalam 30 detik)

1. **Dossier berbukti, bukan sekadar skor.** Setiap temuan menunjuk ke kutipan dokumen yang bisa dicek verifikator.
2. **Membaca teks bebas rekam medis** dan mencocokkannya dengan kode klaim, pekerjaan yang sulit bagi aturan atau model tabular biasa.
3. **Hibrida tepat guna:** aturan deterministik untuk yang pasti, LLM hanya untuk penalaran dan penjelasan; agent berlapis (filter murah dahulu) agar biaya dan latensi terkendali.
4. **Manusia tetap memutuskan:** bahasa output "indikasi untuk ditinjau", penjelasan alternatif, dan jejak audit.
5. **Konsisten:** checklist investigasi yang sama diterapkan ke semua klaim, mengurangi variasi antar verifikator.
6. **Aman sejak desain:** data sintetis/anonim, akses minimum, tanpa penyimpanan permanen, dan opsi model di lingkungan tertutup untuk penerapan nyata.

---

## 7. Asumsi Kritis yang Harus Divalidasi

| # | Asumsi | Bila salah |
| --- | --- | --- |
| A1 | Sistem BPJS saat ini belum menghasilkan penjelasan berbasis bukti yang cukup bagi verifikator | Nilai pembeda runtuh |
| A2 | Resume medis dan data penunjang tersedia bagi verifikator dalam format terbaca mesin | Agent tidak punya bahan |
| A3 | Upcoding dapat dideteksi dari inkonsistensi dokumen, bukan hanya pola statistik | LLM agent kurang relevan |
| A4 | Data sintetis cukup realistis untuk membuktikan metode | Risiko *circularity* |

**Langkah berikutnya:** wawancara 2–3 orang domain (verifikator, koder, atau auditor medis) untuk A1–A3, lalu rancang set kasus uji sintetis bersama pakar, sebelum menentukan fitur dan stack.

---

## Lampiran: Pemetaan ke Rubrik Penilaian

| Dimensi rubrik | Dijawab oleh bagian |
| --- | --- |
| Relevansi Permasalahan | 1, 2 |
| Kreativitas & Inovasi | 3, 4, 6.2 |
| Kualitas Teknologi | 4.1, 6.2 |
| Efektivitas & Dampak | 5, 6.1 |
| Kesiapan & Skalabilitas | 4.1 (agent berlapis), 7 |
| Keamanan & Tata Kelola | 4.2, 6.1, 6.2 |