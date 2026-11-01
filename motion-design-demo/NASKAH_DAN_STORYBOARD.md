# Naskah & Storyboard Video Demo: Skill "Motion Design"

**Judul Video**: *Mastering Motion Design: Dari UI Kaku Menjadi Interaksi Berjiwa*  
**Durasi Total**: Tepat 180 Detik (3 Menit 00 Detik)  
**Workspace Path**: `motion-design-demo/`  
**Sumber Rujukan Skill**: `.agents/skills/motion-design/` (LottieFiles motion design principles)  
**Teknologi Produksi**:
- **Generative Visuals**: Antigravity Native Image Generator (`image-generator` subagent)
- **Voiceover TTS**: Gemini TTS Engine (`gemini-2.5-flash-preview-tts` / `gemini-3.8-flash-tts`, Prebuilt Voice: `Puck`, 24kHz Mono WAV)
- **Screen & Motion Engine**: Recordly MCP / Custom CSS-Spring Motion Timeline

---

## Ikhtisar & Struktur Narasi (3 Menit)

Video ini disusun dalam 7 babak terstruktur yang memandu audiens dari masalah mendasar antarmuka digital hingga eksekusi teknis tingkat lanjut:

```
[00:00 - 00:25] Scene 1: Prolog & Krisis Antarmuka Digital (Hook)
[00:25 - 00:55] Scene 2: Tiga Pilar Gerak: Timing, Easing, & Koreografi
[00:55 - 01:25] Scene 3: Empat Arketipe Kepribadian Motion (Productive vs Expressive)
[01:25 - 01:55] Scene 4: 12 Prinsip Disney untuk Rekayasa Frontend Modern
[01:55 - 02:25] Scene 5: Anatomi Siklus State: Idle, Feedback, Sukses, & Error
[02:25 - 02:45] Scene 6: Performa Ekstrem (60 FPS) & Aksesibilitas
[02:45 - 03:00] Scene 7: Penutup & Masa Depan UI Berbasis Motion
```

---

## Storyboard & Rincian Adegan Detail

### Scene 1: Prolog & Krisis Antarmuka Digital (00:00 - 00:25 / Durasi: 25s)
- **Tujuan**: Menangkap atensi dengan kontras tajam antara UI statis yang membosankan dan animasi yang terlalu berisik.
- **Visual On-Screen**:
  - Layar terbagi dua (*split-screen dynamic*):
    - **Sisi Kiri**: Antarmuka abu-abu statis yang patah-patah saat diklik, tanpa transisi, teks berkedip kasar.
    - **Sisi Kanan**: Antarmuka futuristik gelap dengan aliran gelombang partikel kinetik yang memandu kursor pengguna dengan mulus.
  - Teks Tipografi Minimalis: *"UI Tanpa Gerak Itu Kaku. Gerakan Tanpa Arah Itu Mengganggu."*
- **Brief Gambar Generatif (Image Generator)**:
  - `cinematic split screen view of digital interface, left half shows cold dull static wireframes with jarring boxy cuts, right half shows ultra-sleek luminous fluid dark-mode dashboard with soft ambient glow, glowing cyan and violet data lines, 8k resolution, minimalist architectural lighting`.
  - Target Simpan: `motion-design-demo/assets/scene1_split_contrast.png`
- **Motion Spec**:
  - Entrance: Fade & subtle scale (`1.02` to `1.0`, duration `400ms`, `cubic-bezier(0.16, 1, 0.3, 1)`).
- **Naskah Narasi Voiceover (Gemini TTS)**:
  > *"Pernahkah Anda menggunakan aplikasi yang terasa kaku seperti kertas fotokopi? Atau sebaliknya, antarmuka yang penuh animasi lambat dan melompat-lompat hingga membuat pusing? Di era rekayasa perangkat lunak modern, motion bukan sekadar dekorasi kosmetik. Motion adalah bahasa visual yang menerjemahkan niat sistem ke dalam pemahaman manusia secara instan dan tanpa kata-kata."*
- **Audio & SFX**:
  - Suara ambient synth low-pass pelan, disusul suara "glitch/snap" kaku di kiri dan transisi "whoosh" lembut berfrekuensi hangat di kanan.

---

### Scene 2: Tiga Pilar Gerak: Timing, Easing, & Koreografi (00:25 - 00:55 / Durasi: 30s)
- **Tujuan**: Menjelaskan parameter ilmiah di balik gerakan yang natural (Fisika & Persepsi Otak).
- **Visual On-Screen**:
  - Tiga prisma kaca 3D isometrik muncul berurutan dari atas ke bawah:
    1. **Timing Card**: Stopwatch digital menunjukkan rentang emas 100ms (persepsi instan), 200ms–300ms (sweet spot micro-interaction), hingga 500ms (transisi layar penuh).
    2. **Easing Card**: Kurva grafik fisika interaktif yang membedakan garis lurus (linear/robotik) dengan kurva *cubic-bezier* berpijak inersia gravitasi.
    3. **Choreography Card**: Rangkaian komponen bertingkat yang masuk membentuk efek gelombang air (*staggered wave* 30ms–50ms).
- **Brief Gambar Generatif (Image Generator)**:
  - `three glowing floating isometric crystal cards displaying physics of digital motion, one shows stopwatch clockwork, second shows glowing cubic-bezier physics curve, third shows harmonized cascading cards, dark obsidian laboratory atmosphere, deep emerald and electric violet illumination, 8k octane render`.
  - Target Simpan: `motion-design-demo/assets/scene2_three_pillars.png`
- **Motion Spec**:
  - Stagger entrance: `50ms` offset per kartu.
  - Duration per card: `320ms`, easing: `cubic-bezier(0.2, 0.0, 0, 1.0)`.
- **Naskah Narasi Voiceover (Gemini TTS)**:
  > *"Skill Motion Design berpijak pada tiga pilar fundamental: Timing, Easing, dan Koreografi. Timing menghormati batas kognitif manusia: perubahan di bawah seratus milidetik terasa instan, sementara durasi dua ratus hingga tiga ratus milidetik adalah titik emas untuk navigasi. Easing memberi bobot fisik nyata, memastikan elemen melambat secara wajar saat berhenti. Dan koreografi menyelaraskan banyak elemen agar mata pengguna diarahkan pada hal yang paling penting."*
- **Audio & SFX**:
  - Tiga denting nada melodis ringan (C - E - G) mengiringi kemunculan masing-masing pilar.

---

### Scene 3: Empat Arketipe Kepribadian Motion (00:55 - 01:25 / Durasi: 30s)
- **Tujuan**: Memperlihatkan bahwa gaya gerakan harus sesuai dengan fungsi produk (Domain Matching).
- **Visual On-Screen**:
  - Tampilan kuadran interaktif yang memperagakan 4 arketipe:
    1. **Productive**: Dashboard analitik/medis (seperti modul klaim RS Telisik). Gerak super cepat, minim osilasi, mengutamakan efisiensi (150ms-200ms).
    2. **Expressive**: Tombol selebrasi dan interaksi sosial dengan pantulan pegas kenyal (*spring physics*, damping 0.75).
    3. **Elegant**: Tipografi editorial dan galeri mewah dengan perlambatan halus panjang (400ms-600ms).
    4. **Playful**: Kartu bergaya game dengan efek *squash & stretch* elastis.
- **Brief Gambar Generatif (Image Generator)**:
  - `four distinct digital interface screens arranged in a grid, showing motion personalities: crisp analytical enterprise medical dashboard, bouncy playful social widget, elegant high-fashion editorial showcase, and vibrant gamified card, sleek futuristic presentation, 8k render`.
  - Target Simpan: `motion-design-demo/assets/scene3_archetypes.png`
- **Motion Spec**:
  - Kuadran Productive: `duration: 160ms, ease: ease-out`.
  - Kuadran Expressive: `spring({ stiffness: 350, damping: 18 })`.
- **Naskah Narasi Voiceover (Gemini TTS)**:
  > *"Tidak ada satu formula gerak untuk semua aplikasi. Skill ini menyediakan empat arketipe kepribadian: Gaya Productive sangat ideal untuk aplikasi enterprise dan analisis data medis yang membutuhkan kecepatan tanpa gangguan. Gaya Expressive memberikan kegembiraan melalui fisika pegas yang memuaskan. Sementara gaya Elegant menghadirkan kemewahan tempo tenang, dan Playful menyuntikkan energi jenaka pada interaksi kasual."*
- **Audio & SFX**:
  - Suara snap presisi untuk Productive, pantulan karet halus untuk Expressive, desiran sutra untuk Elegant, dan pop gelembung untuk Playful.

---

### Scene 4: 12 Prinsip Disney untuk Rekayasa Frontend Modern (01:25 - 01:55 / Durasi: 30s)
- **Tujuan**: Menjelaskan jembatan antara seni animasi klasik dan implementasi kode CSS / Framer Motion.
- **Visual On-Screen**:
  - Simulasi kode komponen berdampingan dengan render visual:
    - **Anticipation**: Tombol sedikit memadat ke dalam sebelum melesat memicu aksi (*scale 0.96 -> 1.05*).
    - **Squash & Stretch**: Kartu melar lembut searah pergeseran kursor (*momentum drag*).
    - **Follow Through & Secondary Action**: Saat modal terbuka, bayangan di latar belakang menyusul melebar sepersekian detik kemudian.
- **Brief Gambar Generatif (Image Generator)**:
  - `visual metaphor blending classic animation sheets with modern web code, glowing lines of CSS transform and framer-motion keyframes seamlessly transforming into floating dynamic UI cards, clean studio lighting, high tech aesthetic, 8k render`.
  - Target Simpan: `motion-design-demo/assets/scene4_disney_principles.png`
- **Motion Spec**:
  - Press scale: `scale(0.97)`, release spring bounce `scale(1.0)`.
  - Secondary shadow lag: `delay: 60ms`.
- **Naskah Narasi Voiceover (Gemini TTS)**:
  > *"Prinsip animasi legendaris Disney yang berusia hampir satu abad kini diadaptasi langsung ke dalam kode web. Konsep 'Anticipation' mengajarkan tombol untuk sedikit menekan ke dalam sebelum bereaksi, memberi kepastian pada jari pengguna. 'Follow Through' dan 'Secondary Action' memastikan elemen pendukung bereaksi terhadap elemen utama. Hasilnya adalah antarmuka yang terasa organik, intuitif, dan responsif terhadap sentuhan manusia."*
- **Audio & SFX**:
  - Efek suara klik mekanikal halus dengan pantulan resonansi yang memuaskan saat simulasi tombol ditekan.

---

### Scene 5: Anatomi Siklus State: Idle, Feedback, Sukses, & Error (01:55 - 02:25 / Durasi: 30s)
- **Tujuan**: Membedah transisi mikro pada komponen riil (State Transition Lifecycle).
- **Visual On-Screen**:
  - Siklus penuh satu aksi formulir:
    1. **Hover**: Elevasi bayangan naik halus (0 -> 8px).
    2. **Click & Loading**: Tombol menyusut menjadi pill spinner sirkular yang berputar tanpa getaran layout (*no layout shift*).
    3. **Success State**: Tombol melebar kembali dengan warna hijau zamrud, menampilkan ikon centang yang digambar dinamis (*SVG draw path*).
    4. **Error Alternative**: Getaran horizontal halus 3 siklus (*shake animation* 12px) jika validasi gagal, segera memusatkan fokus ke input yang keliru.
- **Motion Spec**:
  - Morphing container: `240ms cubic-bezier(0.4, 0, 0.2, 1)`.
  - Checkmark draw: `duration: 280ms ease-out`.
  - Error shake: `400ms @keyframes shake { 0%,100%: 0; 25%: -8px; 75%: 8px }`.
- **Naskah Narasi Voiceover (Gemini TTS)**:
  > *"Mari bedah anatomi siklus state pada komponen formulir. Ketika pengguna menekan tombol simpan, tombol tidak sekadar memuat teks baru, melainkan bermutasi mulus menjadi indikator proses. Jika verifikasi berhasil, tombol bertransformasi menjadi tanda sukses dengan goresan centang yang hidup. Bila terjadi galat, getaran lateral yang halus memberi tahu pengguna tanpa perlu memunculkan pesan peringatan yang berlebihan."*
- **Audio & SFX**:
  - Suara loop spinner lembut, disusul suara "ding" harmonis untuk sukses, atau "double buzz" teredam untuk skenario error.

---

### Scene 6: Performa Ekstrem (60 FPS) & Aksesibilitas (02:25 - 02:45 / Durasi: 20s)
- **Tujuan**: Menggarisbawahi komitmen teknis terhadap performa GPU dan inklusivitas pengguna.
- **Visual On-Screen**:
  - Panel Chrome DevTools Performance Overlay menunjukkan grafik hijau stabil 60 FPS / 120 FPS tanpa frame drop.
  - Ilustrasi aturan emas: hanya menggerakkan `transform` dan `opacity`, menghindari pemicu *layout reflow* pada `width`, `height`, atau `margin`.
  - Toggle simulasi `prefers-reduced-motion`: transisi fisik otomatis berganti menjadi fade lembut instan demi kenyamanan pengguna dengan sensitivitas vestibular.
- **Brief Gambar Generatif (Image Generator)**:
  - `futuristic diagnostic monitor showing high performance 60fps framerate graphs, green telemetry waves, clean code diagrams showing GPU accelerated layers, accessibility wheelchair icon glowing subtly, minimalist enterprise tech visual, 8k resolution`.
  - Target Simpan: `motion-design-demo/assets/scene6_performance_a11y.png`
- **Motion Spec**:
  - GPU Composite: `will-change: transform`.
  - A11y fallback: `@media (prefers-reduced-motion: reduce) { animation-duration: 0.01ms }`.
- **Naskah Narasi Voiceover (Gemini TTS)**:
  > *"Keindahan visual tidak boleh mengorbankan performa. Skill motion-design mengunci aturan ketat: animasi hanya menggunakan akselerasi GPU lewat transform dan opacity, menjamin kestabilan enam puluh frame per detik tanpa membebani baterai. Dan yang terpenting, dukungan penuh bagi prefers-reduced-motion memastikan pengalaman tetap ramah dan nyaman bagi seluruh lapisan pengguna."*
- **Audio & SFX**:
  - Suara frekuensi murni stabil yang melambangkan kestabilan refresh rate 60 FPS.

---

### Scene 7: Penutup & Masa Depan UI Berbasis Motion (02:45 - 03:00 / Durasi: 15s)
- **Tujuan**: Memberikan konklusi yang berkesan dan inspiratif (Call to Action).
- **Visual On-Screen**:
  - Logo LottieFiles Motion Design dan ikon Antigravity bersatu di tengah orbit partikel cahaya modern.
  - Teks Penutup Bercahaya: *"Build Intentional Interfaces. Motion with Purpose."*
  - Badge: `Installed in .agents/skills/motion-design`.
- **Brief Gambar Generatif (Image Generator)**:
  - `magnificent central glowing holographic orb surrounded by graceful orbital rings of light, dark obsidian minimalist stage, soft cinematic bokeh, inspiring closing shot for a modern design system documentary, 8k render, masterpiece`.
  - Target Simpan: `motion-design-demo/assets/scene7_outro.png`
- **Motion Spec**:
  - Logo reveal: `scale(0.9) -> scale(1.0)`, `duration: 450ms`, `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Naskah Narasi Voiceover (Gemini TTS)**:
  > *"Dengan skill motion-design yang kini aktif di workspace Anda, agen AI dapat merancang antarmuka yang tidak hanya cerdas dan fungsional, tetapi juga terasa hidup dan berjiwa. Mari bangun pengalaman digital masa depan yang berbobot, terarah, dan bermakna."*
- **Audio & SFX**:
  - Chord penutup piano elektrik kontemporer dengan reverb megah yang memudar lembut (*fade out*).

---

## Tabel Parameter Produksi Audio Gemini TTS (Durasi Pas 3 Menit)

| Scene | Timecode | Durasi Target | Karakter Teks | Estimasi Kata | Target File Output |
|---|---|---|---|---|---|
| **Scene 1** | `00:00 - 00:25` | 25 detik | 340 kar | ~50 kata | `motion-design-demo/audio/scene_1.wav` |
| **Scene 2** | `00:25 - 00:55` | 30 detik | 420 kar | ~65 kata | `motion-design-demo/audio/scene_2.wav` |
| **Scene 3** | `00:55 - 01:25` | 30 detik | 415 kar | ~62 kata | `motion-design-demo/audio/scene_3.wav` |
| **Scene 4** | `01:25 - 01:55` | 30 detik | 430 kar | ~64 kata | `motion-design-demo/audio/scene_4.wav` |
| **Scene 5** | `01:55 - 02:25` | 30 detik | 410 kar | ~63 kata | `motion-design-demo/audio/scene_5.wav` |
| **Scene 6** | `02:25 - 02:45` | 20 detik | 310 kar | ~48 kata | `motion-design-demo/audio/scene_6.wav` |
| **Scene 7** | `02:45 - 03:00` | 15 detik | 225 kar | ~35 kata | `motion-design-demo/audio/scene_7.wav` |
| **TOTAL** | `00:00 - 03:00` | **180 detik (3:00)** | **2.550 kar** | **~387 kata** | **7 File Audio WAV** |

---

## Rencana Eksekusi Teknis Otomatis
1. **Sintesis Audio Gemini TTS**: Menjalankan script Python generator suara untuk memproduksi `scene_1.wav` sampai `scene_7.wav` secara paralel/sekuensial.
2. **Generasi Gambar Generatif**: Memanggil native subagent `image-generator` untuk memproduksi visual Scene 1, 2, 3, 4, 6, dan 7.
3. **Player / Interactive Motion Video Demo**: Membangun presentation reel web standalone responsif (HTML5 Canvas + Web Audio API + Motion Timeline) di `motion-design-demo/player/index.html` yang memutar video demo 3 menit dengan sinkronisasi teks, kurva animasi real-time, visual gambar, dan suara narator.
