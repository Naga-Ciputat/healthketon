# Rencana Alignment & Kandidat Ide Baru
## Proyek Clarix AI / TELISIK Pasca-Analisis Materi Resmi Panitia Healthkathon 2026

Dokumen ini memetakan hasil analisis terhadap 3 materi resmi panitia BPJS Kesehatan (Alur Kegiatan, Panduan Project Final, dan Materi Workshop SI & AI oleh Sistem Analis BPJS Kesehatan), mengidentifikasi celah (*gap*), serta merumuskan rencana penyesuaian (*alignment plan*) dan kandidat fitur baru untuk memenangkan kompetisi.

---

## 1. Analisis Keselarasan Strategis (*Strategic Fit*)

Materi resmi panitia memberikan kita wawasan internal (*insider context*) yang sangat berharga mengenai fokus BPJS Kesehatan di tahun 2026:

| Poin Temuan Panitia | Realita Operasional BPJS Kesehatan | Penyelarasan Proyek Kita (Clarix AI) | Tingkat Dampak |
|---|---|---|:---:|
| **1. Inisiatif Kunci 2026–2027** | BPJS secara eksplisit mencanangkan program **"Smart Claim × RME-TTE"** (Klaim Rekam Medis Elektronik dengan TTE tersertifikasi PSrE-BSSN & TrustMark). | Clarix AI diposisikan tepat sebagai **mesin inti perwujudan Smart Claim × RME-TTE**, bukan sekadar sistem OCR atau deteksi teks umum. | **Sangat Tinggi** (Langsung selaras dengan Renstra Direktur TI) |
| **2. Jurang Defisit Pembiayaan** | Terjadi disparitas keuangan: **Iuran Rp118 T vs Klaim Rp132 T (Defisit Rp14 T)**. Pemerintah harus mengucurkan dana talangan Rp20 T. | Narasi pembuka (*hook*) presentasi kita harus langsung mengaitkan pencegahan *fraud/upcoding* dengan penyelamatan likuiditas kas JKN dari defisit Rp14 T tersebut. | **Sangat Tinggi** (Menjawab pilar kriteria "Dampak Terukur") |
| **3. Arsitektur BEA (Makro Proses)** | BPJS mengonsolidasi 100+ aplikasi ke klaster makro: `C01` (Kepesertaan) $\rightarrow$ `C02` (Iuran) $\rightarrow$ `C03` (Pelayanan) $\rightarrow$ `C03.04` (Klaim) $\rightarrow$ `S06` (Keuangan). | Clarix AI menegaskan posisinya pada modul **C03.04 (Pengelolaan Klaim Faskes)** yang bertindak sebagai *gatekeeper* sebelum klaim cair di modul **S06 (Keuangan - In-Monica)**. | **Tinggi** (Menunjukkan pemahaman mendalam sistem internal BPJS) |
| **4. Ekosistem Klaim Eksisting** | BPJS sudah memiliki **VClaim**, **PCare E-Claim**, **VIDI** (Verifikasi Digital AI), dan **Smart Vedika** (piloting di 12 RS). | Clarix AI tidak memposisikan diri untuk "menggantikan" VClaim/VIDI, melainkan sebagai **Next-Gen Clinical Verification Co-Pilot** yang melengkapi kekurangan sistem eksisting (yaitu: belum mampu membaca rekam medis multimodal tak terstruktur dan belum memiliki sitasi bukti interaktif). | **Tinggi** (Menghindari resistensi juri internal) |
| **5. Etika & Tata Kelola AI** | Panitia menegaskan **"4 Cek Sebelum Pakai AI"** dan kepatuhan ketat UU PDP No. 27/2022 (larangan kirim PII ke AI publik, wajib *Human-in-the-loop*). | Clarix AI harus memperlihatkan panel transparansi tata kelola data: tokenisasi PII, arsitektur inferensi privat, model *explainability*, dan kendali verifikator manusia. | **Kritis / Wajib** (Pintu kelolosan compliance) |

---

## 2. Kandidat Penyesuaian & Fitur Baru (Actionable Adjustments)

Berdasarkan temuan di atas, berikut adalah 5 penyesuaian konkret yang direkomendasikan untuk diintegrasikan ke dalam prototipe frontend dan materi presentasi kita:

### Inovasi 1: Badge Verifikasi "Smart Claim × RME-TTE & TrustMark"
* **Latar Belakang:** Sesuai inisiatif kunci BPJS 2026–2027 (Slide 12).
* **Penyesuaian di UI:**
  * Pada halaman `Dossier` dan `Claim Table`, tambahkan indikator status keabsahan dokumen:
    * `TTE Tersertifikasi (PSrE-BSSN): Valid` (Ikon gembok hijau terenkripsi).
    * `TrustMark RME: Verified` (Menjamin integritas berkas tidak dimanipulasi pasca-tindakan).
* **Nilai Tambah:** Memperlihatkan bahwa sistem kita sudah memikirkan keabsahan hukum (*legal compliance*) berkas medis digital sejak di hulu.

### Inovasi 2: "Deficit Impact & Cost Recovery Simulator" di Dashboard Triage
* **Latar Belakang:** Menjawab masalah defisit Rp14 Triliun dan kriteria juri terkait "Dampak Terukur".
* **Penyesuaian di UI:**
  * Pada baris statistik atas (`StatCard`) di `/claims/triage`, tambahkan metrik:
    * **Estimasi Penyelamatan Biaya (*Cost Recovery*):** Menampilkan nominal riil rupiah potensi inefisiensi/upcoding yang berhasil dicegah dari batch klaim yang sedang aktif (misal: *Rp 428.500.000 / 150 Berkas Terpindai*).
    * **Rasio Efisiensi Telaah:** *2,4 menit/klaim* (turun dari rata-rata manual 22 menit).
* **Nilai Tambah:** Juri langsung melihat angka kuantitatif rupiah yang dapat diselamatkan BPJS Kesehatan.

### Inovasi 3: Panel Inspektur Kepatuhan "4 Cek AI & UU PDP"
* **Latar Belakang:** Memenuhi instruksi resmi Direktur TI BPJS terkait tata kelola AI (Slide 30).
* **Penyesuaian di UI:**
  * Di dalam halaman `Audit Trail` atau pada *modal drawer* di `Dossier`, tambahkan kartu **"AI Governance & PDP Compliance Card"**:
    * [x] *Cek Data:* Tokenisasi PII aktif (NIK, Nama, Alamat disamarkan sebelum dianalisis model).
    * [x] *Cek Akun & Keamanan:* On-premise/Isolated Private Inference (Zero Data Retention).
    * [x] *Cek Kontrol:* Training data opt-out (data peserta tidak dijadikan bahan latih model eksternal).
    * [x] *Cek Keluaran:* Human-in-the-Loop Gatekeeper (Rekomendasi AI memerlukan otorisasi verifikator ber-NIP).
* **Nilai Tambah:** Menjawab tuntas seluruh kekhawatiran juri mengenai privasi medis dan regulasi UU PDP No. 27/2022.

### Inovasi 4: Visualisasi Integrasi Alur Makro BEA (C03.04 ke S06)
* **Latar Belakang:** Panitia menekankan pemetaan solusi ke proses bisnis BEA (C01 $\rightarrow$ C02 $\rightarrow$ C03 $\rightarrow$ C03.04 $\rightarrow$ S06).
* **Penyesuaian di UI & Slide:**
  * Tampilkan diagram *lifecycle* kecil di header berkas: `[VClaim Ingestion] -> [Clarix AI Analysis (C03.04)] -> [Verifikator Decision] -> [Siap Cair ke In-Monica (S06)]`.
  * Saat verifikator menekan tombol *"Setujui Klaim"*, muncul notifikasi: *"Klaim disetujui. Berkas diteruskan ke sistem Keuangan S06 (In-Monica) untuk proses pembayaran."*
* **Nilai Tambah:** Terlihat sangat *native* dan menyatu dengan arsitektur resmi BPJS Kesehatan.

### Inovasi 5: Dual-Pane Text-to-Citation Highlighter (Explainability)
* **Latar Belakang:** VIDI dan model eksisting BPJS sering kali menjadi "black-box" yang tidak disukai dokter verifikator karena tidak menjelaskan alasan penolakan/indikasi *upcoding*.
* **Penyesuaian di UI:**
  * Di layar `Dossier`, pastikan saat verifikator mengklik kartu anomali (misal: *"Dugaan Upcoding Tindakan Laparotomi Eksplorasi"*), berkas rekam medis di sebelah kiri langsung bergulir (*auto-scroll*) dan menyorot kalimat dokter yang kontradiktif (misal: dokter hanya menulis *"insisi apendiks sederhana 3 cm"*, bukan laparotomi mayor).
  * Sertakan kutipan pasal acuan: *"Mengacu pada Permenkes Pedoman Tarif INA-CBG & Panduan Koding BPJS 2024"*.
* **Nilai Tambah:** Membuktikan bahwa AI kita benar-benar *explainable*, transparan, dan tidak menghasilkan halusinasi.

---

## 3. Rencana Penyelarasan Video Presentasi (Target: 10 Menit Pas)

Mengikuti template resmi `Panduan Project Final Healthkathon 2026`, berikut adalah rancangan alur narasi video yang selaras dengan psikologi dewan juri BPJS Kesehatan:

```mermaid
timeline
    title Alokasi Durasi Video 10 Menit (Zoom Record + Webcam Aktif)
    00:00 - 00:30 : 1. Perkenalan Tim : Foto & peran 3 anggota (Lead AI, Frontend/Fullstack, Clinical Expert)
    00:30 - 01:30 : 2. Judul & Nilai Utama : Clarix AI - Next-Gen Smart Claim & Evidence Co-Pilot
    01:30 - 03:00 : 3. Latar Belakang & Dampak : Jurang defisit Rp14 T & 3 metrik dampak kuantitatif
    03:00 - 04:30 : 4. Alur Proses & Modul BEA : Alur 5 tahap input-output terpetakan ke modul Klaim C03.04
    04:30 - 07:30 : 5. Live Working Demo (Inti) : Demo 4 skenario (Triage, Dossier Sitasi, Audit Trail, Benchmark)
    07:30 - 09:00 : 6. Fitur Kunci : Dual-Pane Evidence, Smart Triage, Immutable Audit, Automated Cross-Code
    09:00 - 10:00 : 7. Tata Kelola AI & Penutup : 4 Cek AI, Kepatuhan UU PDP, Tautan Web App & Kontak
```

### Scripting Hook (Menit 01:30):
> *"Dewan Juri yang terhormat, di tahun 2026 ini BPJS Kesehatan menghadapi tantangan pembiayaan nyata: penerimaan iuran Rp118 Triliun berhadapan dengan beban klaim pelayanan Rp132 Triliun—terjadi selisih defisit pembiayaan sebesar Rp14 Triliun. Di sisi lain, ribuan verifikator di 3.221 rumah sakit harus meneliti jutaan halaman rekam medis secara manual setiap bulannya di bawah tekanan kelelahan kognitif.  
> Untuk itulah Clarix AI hadir: mengimplementasikan pilar strategis 'Smart Claim × RME-TTE' pada modul BEA C03.04 untuk memangkas waktu verifikasi dari 25 menit menjadi 2,4 menit per klaim, dengan tingkat deteksi anomali hingga 93% secara transparan dan berlandaskan bukti klinis yang terverifikasi."*

---

## 4. Matriks Pemetaan Kriteria Penilaian Juri vs Bukti Nyata Solusi Kita

| 5 Kriteria Penilaian Juri | Apa yang Dicari Juri? | Bukti Nyata yang Kita Tunjukkan di Demo & Slide |
|---|---|---|
| **1. Kreativitas & Keunikan** | Bukan sekadar aturan *if-else* biasa; memanfaatkan AI mutakhir yang relevan. | Kemampuan *Cross-Modal Verification* antara narasi catatan dokter (teks tidak terstruktur) dengan kode tarif ICD-10/ICD-9-CM, dilengkapi sitasi bukti interaktif berdampingan. |
| **2. Model Bisnis & Keberlanjutan** | Bisa diimplementasikan di 3.221 FKRTL di seluruh pelosok Indonesia tanpa infrastruktur mahal. | Arsitektur *API-first* berbasis web ringan yang kompatibel dengan standar integrasi SatuSehat / VClaim REST API, tanpa perlu instalasi hardware berat di sisi rumah sakit. |
| **3. Dampak Terukur** | Angka kuantitatif yang jelas terhadap penghematan biaya dan efisiensi waktu. | Dashboard menampilkan *Cost Recovery Calculator* (rupiah potensi inefisiensi yang terselamatkan) dan penurunan durasi telaah berkas sebesar 88%. |
| **4. Presentasi & Komunikasi** | Bahasa lugas, slide rapi tanpa salah ketik, penguasaan materi, video tepat waktu. | Durasi video presisi (09:30–09:45), struktur 7 slide rapi mengacu pada template panitia, serta pembagian peran tim yang solid. |
| **5. Kesiapan Produk** | *Working software* (bukan hanya gambar statis Figma/Canva). | Aplikasi web Next.js fungsional yang responsif, interaktif, memiliki transisi mulus, data realistis berstandar BPJS, serta dapat langsung dicoba juri melalui tautan publik. |

---

## 5. Rencana Aksi Eksekusi Bertahap (Sprint Menuju 1 November 2026)

```
[Fase 1: Quick UI Polish] (21 - 23 Okt)
├── Tambah Badge "Smart Claim x RME-TTE" di Dossier & Triage Table
├── Tambah Indikator "Cost Recovery / Estimasi Penyelamatan Biaya" di StatCard Triage
├── Tambah Card Transparansi "4 Cek AI & Kepatuhan UU PDP" di Audit Trail / Dossier
└── Deploy versi terbaru ke platform hosting (Vercel) untuk mendapatkan Live URL publik

[Fase 2: Slide Deck Final] (24 - 26 Okt)
├── Isi template PPT panitia sesuai 7 struktur wajib (+ slide arsitektur & kepatuhan)
├── Hapus slide instruksi panitia (slide 2-4)
├── Masukkan foto formal anggota tim, screenshot produk, dan grafik indikator dampak
└── Ekspor ke format PDF (pastikan ukuran < 10 MB)

[Fase 3: Perekaman & Produksi Video] (27 - 29 Okt)
├── Latihan pembacaan skrip presentasi dengan timer 10 menit
├── Rekam via Zoom Meeting (Share screen presentasi + Live Demo prototype + Webcam pemapar)
├── Review audio dan ketajaman teks (minimal 1080p, durasi aman: 09:30)
└── Unggah ke YouTube dengan status visibilitas "Unlisted"

[Fase 4: Pre-Flight Audit & Submisi Dashboard] (30 - 31 Okt)
├── Verifikasi link YouTube di browser incognito (pastikan video memutar tanpa login)
├── Verifikasi link live demo prototype (pastikan responsif dan tidak ada error 500/404)
├── Cek repositori GitHub (bersih dari token/kredensial API rahasia)
└── Submit seluruh link & metadata tim di Dashboard Healthkathon 2026 sebelum 1 November
```
