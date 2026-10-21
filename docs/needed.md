Dokumen 1 — Research Brief

Buat sebelum menentukan fitur atau stack.

Isinya:

- Problem dan target user
- Bukti bahwa problem benar-benar ada
- Solusi atau kompetitor yang sudah tersedia
- Kelemahan solusi saat ini
- Relevansi dengan tema hackathon dan rubric penilaian
- Asumsi yang belum terbukti dan risiko terbesar

Gate: tim sepakat problem mana yang layak diselesaikan.

Dokumen 2 — Concept Brief

Ini yang mencegah tim mengembangkan produk yang arahnya tidak jelas.

Isinya:

- Problem statement
- Persona atau target user utama
- Value proposition
- Solusi yang dipilih dan alternatif yang ditolak
- Satu skenario penggunaan utama
- Definisi sukses dan keunggulan produk

Gate: semua anggota bisa menjelaskan produk dalam satu kalimat yang sama.

Dokumen 3 — Lean PRD

PRD adalah kontrak antara product decision dan implementasi.

Isinya:

- Tujuan dan non-goals
- Fitur P0 (wajib), P1 (jika sempat), P2 (diabaikan)
- User stories
- Acceptance criteria yang bisa dites
- User flow dan error states
- Constraint hackathon dan batasan MVP

Gate: setiap fitur P0 punya perilaku yang jelas dan bisa diverifikasi.

Dokumen 3a — Spesifikasi Fitur Konkret (Feature Breakdown)

Jembatan penjelas antara kebutuhan produk tingkat tinggi (PRD) dengan perancangan teknis modul.

Isinya:

- Pembagian konkret tiap fitur P0 ke dalam dua sudut pandang:
  - Frontend: Komponen UI spesifik, tata letak, event/interaksi pengguna, dan perubahan state visual.
  - Backend / Logic: Data input/output, logika bisnis/AI yang dieksekusi, service layer yang terlibat, dan aturan validasi.
- Edge cases dan penanganan kegagalan spesifik per fitur.
- Matriks Keterlacakan (Traceability Matrix): Pemetaan hubungan antara kode fitur, komponen UI, dan modul backend/layanan terkait.

Gate: Developer Frontend dan Backend tahu persis apa yang harus dibangun per fitur tanpa multitafsir.

Dokumen 3b — Alur End-to-End & Jalur Produk (End-to-End Workflows & Tracks)

Mencegah fitur-fitur terbangun secara terisolasi tanpa alur operasional yang utuh dan kohesif.

Isinya:

- Topologi jalur produk (misal: Jalur Operasional Utama/Golden Path, Jalur Background/Ingestion Pipeline, dan Jalur Evaluasi/Demo/Benchmark).
- Struktur hierarki rute semantik (URL routing map) yang mencerminkan siklus hidup alur kerja pengguna.
- Alur Tertutup (Closed-Loop Sequence) langkah-demi-langkah dari titik masuk awal (entry point), telaah/interaksi, pengambilan keputusan, hingga rekonsiliasi state akhir.
- Strategi penanganan latensi, pre-seeding/caching, dan mekanisme fallback otomatis saat dependensi eksternal/layanan lambat atau gagal.

Gate: Seluruh alur perjalanan pengguna utama (golden path) terhubung dari awal hingga akhir tanpa ada fitur yang menggantung atau terputus.

Dokumen 4 — Technical Design

Isinya:

- Arsitektur dan tanggung jawab setiap modul
- Database schema dan relasi
- API contracts serta format request/response
- AI model/API, input-output, dan batasan penggunaannya
- Authentication, secrets, error handling
- Integrasi layanan eksternal dan fallback
- Keputusan teknologi beserta alasannya

Gate: implementasi bisa dimulai tanpa agent menebak kontrak antarmodul.

Dokumen 5 — UI Flow + Task Plan

Isinya:

- Screen map dan urutan interaksi
- Loading, empty, success, dan error states
- Task yang bisa dikerjakan paralel
- Dependency antartask
- Definition of Done
- PIC tiap task

Gate: tim tahu apa yang dikerjakan, siapa yang mengerjakan, dan bagaimana hasilnya diperiksa.