# Naskah & Storyboard Video Demo: Skill "Motion Design"

**Judul**: *Mastering Motion Design: Dari UI Kaku Menjadi Interaksi Berjiwa*  
**Durasi Total**: ~100 Detik (1 Menit 40 Detik)  
**Target Output**: Video Demo Edukatif & Showcase Interaktif  
**Teknologi & Aset**:
- **Skill**: `.agents/skills/motion-design` (LottieFiles motion principles: Timing, Easing, Choreography, Disney 12 Principles)
- **Voiceover TTS**: Gemini TTS API (`gemini-2.5-flash-preview-tts`, Voice: `Puck`, 24kHz Mono WAV)
- **Visual Assets**: Native Antigravity Image Generator + Web UI Components
- **Perekaman/Video Tooling**: Recordly / Automated Motion Timeline

---

## Ringkasan Konsep & Filosofi Gerak
Video ini mendemonstrasikan bagaimana skill `motion-design` mengubah UI standar menjadi antarmuka yang responsif, terarah, dan memiliki kepribadian (motion personality). Gerakan tidak sekadar pemanis kosmetik (*anti-lebay*), melainkan media komunikasi status dan hierarki perhatian.

---

## Rincian Adegan (Scene-by-Scene Storyboard)

### Scene 1: Prolog & Masalah (00:00 - 00:18)
- **Tujuan**: Menangkap atensi audiens (Hook) dan menunjukkan kontras antara UI statis/kaku vs UI dengan sentuhan motion terukur.
- **Visual**:
  - Split screen: Sisi kiri menampilkan antarmuka kaku (elemen muncul mendadak tanpa transisi, pop up kasar). Sisi kanan menampilkan visual fluid kinetik modern bernuansa enterprise futuristik.
  - Teks On-Screen: *"UI Tanpa Motion Itu Bisu. Motion Berlebihan Itu Bising."*
- **Generative Image Brief (Native Image Generator)**:
  - *Prompt*: `A minimalist high-tech UI dashboard split in half, dark mode aesthetic, Left side shows glitchy static wireframes with harsh angles, Right side shows luminous elegant fluid waves of light connecting glowing cards, cinematic lighting, 8k resolution, clean typography, hyper-detailed UI vectors`.
- **Motion Spec**:
  - Archetype: *Contrast Demonstration*
  - Transisi: Entrance fade-in dengan easing `cubic-bezier(0.16, 1, 0.3, 1)` (350ms).
- **Narasi Voiceover (Gemini TTS)**:
  > *"Banyak antarmuka web terasa kaku seperti kertas fotokopi, atau justru sebaliknya: penuh animasi lebay yang membuat pusing pengguna. Inilah alasan kita butuh Motion Design. Gerakan bukan sekadar hiasan kosmetik, melainkan jembatan komunikasi antara logika sistem dan persepsi manusia."*
- **Audio & SFX**:
  - Ambience synth pembuka yang subtle, disusul suara klik keyboard lembut dan audio sweep halus saat transisi.

---

### Scene 2: Tiga Pilar Utama Motion (00:18 - 00:40)
- **Tujuan**: Membedah fondasi skill motion-design (Timing, Easing, Choreography).
- **Visual**:
  - Tiga kartu interaktif muncul berurutan (Staggered Entrance).
  - Kartu 1: **Timing** (Diagram stop watch dengan batas reaksi manusia 100ms - 300ms).
  - Kartu 2: **Easing** (Kurva fisika cubic-bezier dinamis yang memvisualisasikan gaya gesek dan inersia).
  - Kartu 3: **Choreography** (Aliran gelombang gerak antar elemen dari titik fokus primer ke sekunder).
- **Generative Image Brief (Native Image Generator)**:
  - *Prompt*: `Three glowing isometric glass prisms representing Physics of Motion: Time, Gravity/Easing curves, and Orchestrated Wave choreography, sleek dark obsidian background, turquoise and violet neon accents, ultra-refined scientific SaaS aesthetic, octane render`.
- **Motion Spec**:
  - Durasi kartu: 280ms
  - Easing: `cubic-bezier(0.2, 0.0, 0, 1.0)` (Natural Deceleration)
  - Stagger delay: 50ms per kartu.
- **Narasi Voiceover (Gemini TTS)**:
  > *"Skill motion-design berpijak pada tiga pilar utama: Timing, Easing, dan Koreografi. Timing mengatur seberapa cepat otak memproses perubahan, idealnya antara seratus hingga tiga ratus milidetik. Easing memberi bobot gravitasi agar gerakan tidak terasa robotik. Dan koreografi mengarahkan mata pengguna mengalir secara alami, bukan serentak membuat bingung."*
- **Audio & SFX**:
  - 3 nada ritmis naik lembut seiring munculnya masing-masing kartu.

---

### Scene 3: Motion Personality Archetypes (00:40 - 01:05)
- **Tujuan**: Menunjukkan bahwa karakter animasi disesuaikan dengan domain produk.
- **Visual**:
  - Komparasi dua kepribadian gerakan:
    - **Productive**: Tampilan dashboard enterprise/kesehatan (seperti Telisik Dispute Resolver). Gerakan sangat cepat (150ms-200ms), efisien, snappy, tanpa distorsi berlebih.
    - **Expressive**: Tampilan interaksi interaktif dengan pantulan pegas (spring damping 0.75, subtle squash & stretch) yang ramah dan memuaskan.
- **Motion Spec**:
  - Productive: `duration: 180ms, ease: ease-out`
  - Expressive: `spring: { stiffness: 300, damping: 20 }`
- **Narasi Voiceover (Gemini TTS)**:
  > *"Setiap aplikasi punya kepribadian gerak yang unik. Untuk platform data intensif dan klinis seperti sistem audit klaim rumah sakit, kita menerapkan arketipe Productive: cepat, presisi, dan fungsional. Sedangkan untuk interaksi konsumen atau selebrasi tugas selesai, kita dapat memanfaatkan arketipe Expressive dengan fisika pegas yang menyenangkan."*
- **Audio & SFX**:
  - Suara snap mikro tajam untuk gaya Productive, dan suara plop / tactile bounce lembut untuk Expressive.

---

### Scene 4: Showcase Live Component & Micro-Interactions (01:05 - 01:30)
- **Tujuan**: Memperlihatkan implementasi nyata: State Feedback (Loading -> Success -> Error) dan Staggered List.
- **Visual**:
  - Komponen Tombol dan Kartu Verifikasi Sengketa Berita Acara:
    1. Tombol ditekan: State berubah ke loading spinner yang berputar mulus.
    2. Transisi sukses: Tombol melebar halus menjadi status 'LAYAK DENGAN KOREKSI' dengan centang animasi follow-through.
    3. Daftar berkas sengketa muncul mengalir ke bawah dengan efek stagger 35ms tanpa ada jeda yang membosankan.
- **Motion Spec**:
  - Button state morph: 240ms `cubic-bezier(0.4, 0, 0.2, 1)`
  - Checkmark draw path: 300ms `ease-out`
  - List item entrance: `slide-in-from-top-3 fade-in`, stagger 35ms.
- **Narasi Voiceover (Gemini TTS)**:
  > *"Mari lihat penerapannya pada komponen nyata. Saat status verifikasi berkas disepakati, tombol bermutasi mulus menjadi konfirmasi sukses tanpa reload layar. Elemen daftar klaim masuk secara bertahap dalam hitungan milidetik. Inilah prinsip Disney 'Follow Through' dan 'Secondary Action' yang dihidupkan dalam antarmuka web modern."*
- **Audio & SFX**:
  - Whoosh halus saat kartu bergeser, diakhiri dengan audio chime keberhasilan berfrekuensi sejuk.

---

### Scene 5: Penutup & Call to Action (01:30 - 01:45)
- **Tujuan**: Mengunci pesan dan menyimpulkan nilai skill.
- **Visual**:
  - Logo LottieFiles & Skill Motion Design bersanding dengan visual arsitektur kode frontend (Next.js, Tailwind, Framer Motion/CSS).
  - Tipografi penutup: *"Build Intentional Interfaces. Motion with Purpose."*
- **Generative Image Brief (Native Image Generator)**:
  - *Prompt*: `A magnificent futuristic holographic emblem of motion physics, glowing orbs orbiting a sleek digital cube, dark elegant obsidian glass pedestal, pristine lighting, 8k render, minimalist cinematic composition`.
- **Narasi Voiceover (Gemini TTS)**:
  > *"Dengan skill motion-design terpasang di workspace ini, agen AI kini mampu merancang dan mengeksekusi gerakan antarmuka yang presisi, elegan, dan bermakna. Waktunya membangun UI yang tidak sekadar berfungsi, tapi terasa hidup."*
- **Audio & SFX**:
  - Outro chord ambient menenangkan, fade out lembut.

---

## Tabel Parameter Produksi Audio & Voiceover (Gemini TTS)

| Bagian | Durasi Est. | Karakter Teks | Target File Audio | Suara Model |
|--------|-------------|---------------|-------------------|-------------|
| **Scene 1** | ~18s | 290 kar | `demo-video/audio/scene_1.wav` | `Puck` (`gemini-2.5-flash-preview-tts`) |
| **Scene 2** | ~22s | 360 kar | `demo-video/audio/scene_2.wav` | `Puck` (`gemini-2.5-flash-preview-tts`) |
| **Scene 3** | ~25s | 350 kar | `demo-video/audio/scene_3.wav` | `Puck` (`gemini-2.5-flash-preview-tts`) |
| **Scene 4** | ~25s | 340 kar | `demo-video/audio/scene_4.wav` | `Puck` (`gemini-2.5-flash-preview-tts`) |
| **Scene 5** | ~15s | 230 kar | `demo-video/audio/scene_5.wav` | `Puck` (`gemini-2.5-flash-preview-tts`) |

---

## Langkah Eksekusi Selanjutnya
1. **Verifikasi Naskah & Review User**: Memastikan alur naskah, tone of voice, dan urutan adegan sudah sesuai ekspektasi.
2. **Generasi Aset Visual Generatif**: Memanggil native subagent `image-generator` untuk memproduksi visual latar/konsep Scene 1, Scene 2, dan Scene 5.
3. **Sintesis Speech Gemini TTS**: Menjalankan generator audio berbasis `backend/venv/Scripts/python.exe` dengan model `gemini-2.5-flash-preview-tts` untuk memproduksi kelima file `.wav`.
4. **Perakitan Demo Video Player / Recordly Video Timeline**: Mengintegrasikan visual, teks dinamis dengan motion curve, dan audio narration menjadi satu demo video utuh.
