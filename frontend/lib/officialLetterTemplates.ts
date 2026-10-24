/**
 * Generator dan Template Naskah Dinas Resmi BPJS Kesehatan
 * Sesuai Standar Tata Naskah Mediko-Legal Permenkes No. 3/2023 dan Permenkes No. 16/2019
 */

export interface OfficialLetterData {
  letterType: "PENDING_KLARIFIKASI_RS" | "DOWNCODE_DIUSULKAN" | "ESKALASI_PK_JKN" | "DISETUJUI";
  letterNumber: string;
  claimId: string;
  hospitalName: string;
  verifierName: string;
  verifierRole?: string;
  timestamp: string;
  finalTariff: number;
  savedDeltaRupiah: number;
  notes?: string;
  rawContent?: string;
}

export interface StructuredOfficialLetter {
  header: {
    institution: string;
    branch: string;
    division: string;
    address: string;
  };
  metadata: {
    letterTypeTitle: string;
    letterNumber: string;
    date: string;
    nature: "SEGERA / RAHASIA INTERNAL" | "PENTING / SEGERA" | "BIASA";
    attachments: string;
    subject: string;
    recipient: string;
    recipientAddress: string;
  };
  claimSummary: {
    claimId: string;
    hospitalName: string;
    claimedTariff?: number;
    finalTariff: number;
    savedDeltaRupiah: number;
    verifierName: string;
    verifierRole: string;
  };
  paragraphs: string[];
  pointsTitle?: string;
  points: { title: string; desc: string }[];
  conclusion: string;
  legalBasis: string[];
  signatory: {
    cityAndDate: string;
    position: string;
    name: string;
    nip: string;
    digitalSignatureId: string;
  };
  fullTextPlain: string;
}

export function generateStructuredOfficialLetter(data: OfficialLetterData): StructuredOfficialLetter {
  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const claimedEstimate = (data.finalTariff || 0) + (data.savedDeltaRupiah || 0);

  if (data.letterType === "ESKALASI_PK_JKN") {
    const letterNumber = data.letterNumber || `ESK-PKJKN/2026/10-${data.claimId.replace(/\D/g, "") || "091"}`;
    const paragraphs = [
      `Berdasarkan hasil penapisan sistem deteksi dini terpadu dan penelaahan mendalam terhadap berkas penagihan klaim ${data.claimId} dari ${data.hospitalName}, disampaikan bahwa berkas ini terindikasi memuat pola penyimpangan yang memerlukan audit investigasi komprehensif lanjutan.`,
      `Pola anomali yang ditemukan mencakup indikasi duplikasi redaksional rekam medis (Note Cloning) antar-pasien dengan tingkat kemiripan semantik tinggi terhadap catatan historis faskes, serta ketidaksesuaian lembar pemakaian alkes dengan laporan tindakan bedah.`,
    ];
    const points = [
      {
        title: "Modus Indikasi Anomali",
        desc: "Duplikasi narasi klinis secara harfiah pada lembar Catatan Perkembangan Pasien Terintegrasi (CPPT) dengan tingkat kemiripan semantik > 90% terhadap berkas donor historis faskes.",
      },
      {
        title: "Urgensi Mediko-Legal",
        desc: "Tindakan pembedahan dan peresepan obat eskalatif tidak didukung parameter tanda-tanda vital objektif yang memadai pada jam-jam kritis pemantauan intensif.",
      },
      {
        title: "Mitigasi Pembiayaan Dana JKN",
        desc: `Pencegahan potensi kerugian pembiayaan JKN sebesar ${formatRupiah(data.savedDeltaRupiah)} dari total tagihan diajukan ${formatRupiah(claimedEstimate)}.`,
      },
    ];
    const conclusion =
      "Sehubungan dengan hal tersebut, seluruh berkas klaim terlampir dialihkan dan dilimpahkan penanganannya kepada Tim Pencegahan Kecurangan JKN (PK-JKN) untuk pemeriksaan faktual lapangan sesuai prosedur operasional standar.";

    const fullTextPlain = `NOTA DINAS ESKALASI DUGAAN ANOMALI KE TIM PK-JKN (RAHASIA INTERNAL)
Nomor: ${letterNumber}
Tanggal: ${data.timestamp}
Sifat: RAHASIA INTERNAL / SEGERA
Lampiran: 1 (Satu) Berkas Telaah Semantik & Bukti RME
Perihal: Pelimpahan Berkas Klaim Terindikasi Penyimpangan Berulang

Kepada Yth.
Ketua Tim Pencegahan Kecurangan JKN (PK-JKN) Kantor Cabang Utama
di Tempat

Dengan hormat,
${paragraphs.join("\n\n")}

Rincian Temuan Telaah Medis:
1. ${points[0].title}: ${points[0].desc}
2. ${points[1].title}: ${points[1].desc}
3. ${points[2].title}: ${points[2].desc}

${conclusion}

Dasar Regulasi:
- Permenkes No. 16 Tahun 2019 tentang Pencegahan dan Penanganan Kecurangan (Fraud) Program JKN
- Panduan Tata Kelola Verifikasi Klaim BPJS Kesehatan

Verifikator Medis Pelapor,
${data.verifierName}
${data.verifierRole || "Dewan Pertimbangan Klinis BPJS"}`;

    return {
      header: {
        institution: "BADAN PENYELENGGARA JAMINAN SOSIAL KESEHATAN",
        branch: "KANTOR CABANG UTAMA JAKARTA SELATAN",
        division: "Kedeputian Wilayah Pengawasan Verifikasi Klaim & Anti-Fraud",
        address: "Jl. Raya Pasar Minggu No. 17, Jakarta Selatan · Telp: (021) 7919-8000 · e-verifikasi@bpjs-kesehatan.go.id",
      },
      metadata: {
        letterTypeTitle: "NOTA DINAS ESKALASI DUGAAN ANOMALI MEDIS (RAHASIA INTERNAL)",
        letterNumber,
        date: data.timestamp,
        nature: "SEGERA / RAHASIA INTERNAL",
        attachments: "1 (Satu) Berkas Analisis Semantik & Bukti RME",
        subject: `Pelimpahan Berkas Klaim Terindikasi Penyimpangan (${data.claimId})`,
        recipient: "Ketua Tim Pencegahan Kecurangan JKN (PK-JKN) KCU",
        recipientAddress: "Kantor Cabang Utama BPJS Kesehatan",
      },
      claimSummary: {
        claimId: data.claimId,
        hospitalName: data.hospitalName,
        claimedTariff: claimedEstimate,
        finalTariff: data.finalTariff,
        savedDeltaRupiah: data.savedDeltaRupiah,
        verifierName: data.verifierName,
        verifierRole: data.verifierRole || "Dewan Pertimbangan Klinis",
      },
      paragraphs,
      pointsTitle: "Pokok Temuan Fakta Mediko-Legal",
      points,
      conclusion,
      legalBasis: [
        "Permenkes No. 16 Tahun 2019 tentang Pencegahan dan Penanganan Kecurangan (Fraud) serta Pengenaan Sanksi Administratif dalam Penyelenggaraan Jaminan Kesehatan.",
        "Undang-Undang No. 24 Tahun 2011 tentang Badan Penyelenggara Jaminan Sosial.",
        "Prosedur Kerja Standar Operasional Penanganan Kasus Khusus Verifikasi FKRTL.",
      ],
      signatory: {
        cityAndDate: `Jakarta, ${data.timestamp.split(",")[0] || "23 Oktober 2026"}`,
        position: data.verifierRole || "Dewan Pertimbangan Klinis BPJS",
        name: data.verifierName,
        nip: "NIP: 198403152010121002",
        digitalSignatureId: `TTE-BPJS-PKJKN-${data.claimId}-SHA256`,
      },
      fullTextPlain,
    };
  }

  if (data.letterType === "DOWNCODE_DIUSULKAN") {
    const letterNumber = data.letterNumber || `BA-BPJS/2026/DOWNCODE/${data.claimId}`;
    const paragraphs = [
      `Sehubungan dengan hasil penelaahan bukti klinis dan kaidah koding INA-CBG terhadap berkas klaim ${data.claimId} atas nama pasien di ${data.hospitalName}, bersama ini diterbitkan Berita Acara Rekonsiliasi Tarif sebagai tindak lanjut verifikasi pra-bayar.`,
      "Berdasarkan penelaahan rekam medis dan data penunjang, diagnosis sekunder tingkat keparahan tinggi (Severity Level II/III) yang diajukan tidak memenuhi kriteria klinis objektif Permenkes No. 3 Tahun 2023, sehingga disepakati penyesuaian kode ke tingkat keparahan yang mencerminkan kondisi klinis riil.",
    ];
    const points = [
      {
        title: "Penyesuaian Kode INA-CBG",
        desc: `Pengalihan kode tingkat keparahan dari pengajuan faskes ke tingkat keparahan rujukan wajar yang didukung dokumentasi klinis terverifikasi.`,
      },
      {
        title: "Rekonsiliasi Tarif Pembiayaan",
        desc: `Tarif awal pengajuan RS: ${formatRupiah(claimedEstimate)} disesuaikan menjadi tarif wajar: ${formatRupiah(data.finalTariff)}.`,
      },
      {
        title: "Efisiensi Penyelamatan Dana JKN",
        desc: `Koreksi efisiensi pembiayaan yang disepakati adalah sebesar ${formatRupiah(data.savedDeltaRupiah)}.`,
      },
    ];
    const conclusion =
      "Berita Acara ini mengikat sebagai dasar pembukuan rekonsiliasi klaim antara BPJS Kesehatan dengan Fasilitas Kesehatan rujukan.";

    const fullTextPlain = `BERITA ACARA REKONSILIASI PENYESUAIAN KODE TINGKAT KEPARAHAN (DOWNCODE)
Nomor: ${letterNumber}
Tanggal: ${data.timestamp}
Sifat: BIASA
Lampiran: 1 (Satu) Lembar Ringkasan Rekonsiliasi Tarif
Perihal: Rekonsiliasi Penyesuaian Kode Diagnosis dan Tarif Berkas ${data.claimId}

Kepada Yth.
Komite Medik & Tim Kendali Mutu Kendali Biaya (TKMKB) ${data.hospitalName}
di Tempat

Dengan hormat,
${paragraphs.join("\n\n")}

Rincian Rekonsiliasi:
1. ${points[0].title}: ${points[0].desc}
2. ${points[1].title}: ${points[1].desc}
3. ${points[2].title}: ${points[2].desc}

${conclusion}

Dasar Regulasi:
- Permenkes No. 3 Tahun 2023 Bab VII tentang Standar Tarif Pelayanan Kesehatan JKN
- Kaidah Koding ICD-10 dan ICD-9-CM INA-CBG

Verifikator Medis BPJS Kesehatan,
${data.verifierName}
${data.verifierRole || "Verifikator Utama BPJS"}`;

    return {
      header: {
        institution: "BADAN PENYELENGGARA JAMINAN SOSIAL KESEHATAN",
        branch: "KANTOR CABANG UTAMA JAKARTA SELATAN",
        division: "Bidang Manajemen Manfaat & Jaminan Pelayanan Rujukan",
        address: "Jl. Raya Pasar Minggu No. 17, Jakarta Selatan · Telp: (021) 7919-8000 · e-verifikasi@bpjs-kesehatan.go.id",
      },
      metadata: {
        letterTypeTitle: "BERITA ACARA REKONSILIASI PENYESUAIAN KODE TINGKAT KEPARAHAN",
        letterNumber,
        date: data.timestamp,
        nature: "BIASA",
        attachments: "1 (Satu) Lembar Lembar Verifikasi Koding",
        subject: `Penyesuaian Kode INA-CBG & Rekonsiliasi Tarif (${data.claimId})`,
        recipient: `Komite Medik & TKMKB ${data.hospitalName}`,
        recipientAddress: "Fasilitas Kesehatan Rujukan Tingkat Lanjut (FKRTL)",
      },
      claimSummary: {
        claimId: data.claimId,
        hospitalName: data.hospitalName,
        claimedTariff: claimedEstimate,
        finalTariff: data.finalTariff,
        savedDeltaRupiah: data.savedDeltaRupiah,
        verifierName: data.verifierName,
        verifierRole: data.verifierRole || "Verifikator Utama BPJS",
      },
      paragraphs,
      pointsTitle: "Rincian Penyesuaian Tarif & Bukti Koding",
      points,
      conclusion,
      legalBasis: [
        "Permenkes No. 3 Tahun 2023 tentang Standar Tarif Pelayanan Kesehatan dalam Penyelenggaraan Program Jaminan Kesehatan.",
        "Kaidah Koding Morbiditas dan Tindakan Medis (ICD-10 dan ICD-9-CM) Kementerian Kesehatan Republik Indonesia.",
        "Berita Acara Kesepakatan Bersama Rekonsiliasi Pelayanan Faskes JKN.",
      ],
      signatory: {
        cityAndDate: `Jakarta, ${data.timestamp.split(",")[0] || "23 Oktober 2026"}`,
        position: data.verifierRole || "Verifikator Utama BPJS Kesehatan",
        name: data.verifierName,
        nip: "NIP: 198804122014022001",
        digitalSignatureId: `TTE-BPJS-DOWNCODE-${data.claimId}-VALID`,
      },
      fullTextPlain,
    };
  }

  if (data.letterType === "DISETUJUI") {
    const letterNumber = data.letterNumber || `BA-BPJS/2026/${data.claimId}/ACC`;
    const paragraphs = [
      `Telah dilakukan verifikasi mediko-legal dan administratif terhadap berkas penagihan klaim ${data.claimId} yang diajukan oleh ${data.hospitalName}.`,
      "Berdasarkan penelaahan silang rekam medis elektronik, catatan tindakan bedah, hasil pemeriksaan laboratorium penunjang, serta kuitansi resmi, seluruh elemen penagihan tervalidasi 100% lengkap tanpa diskrepansi dan bersesuaian dengan kaidah koding serta standar tarif yang berlaku.",
    ];
    const points = [
      {
        title: "Kesesuaian Diagnosis Utama & Tindakan",
        desc: "Kriteria klinis tercatat lengkap dan koheren antara resume medis DPJP dan bukti pemeriksaan penunjang diagnostik.",
      },
      {
        title: "Ketiadaan Unbundling / Upcoding",
        desc: "Tidak ditemukan duplikasi tindakan atau pemisahan tagihan yang bertentangan dengan kaidah paket INA-CBG.",
      },
      {
        title: "Status Realisasi Pembayaran",
        desc: `Klaim disetujui penuh sebesar ${formatRupiah(data.finalTariff)} dan diteruskan ke modul keuangan In-Monica untuk proses pencairan dana faskes.`,
      },
    ];
    const conclusion =
      "Demikian Berita Acara Persetujuan ini diterbitkan untuk dipergunakan dalam proses rekonsiliasi dan realisasi pencairan dana jaminan kesehatan.";

    const fullTextPlain = `BERITA ACARA PERSETUJUAN REALISASI PEMBAYARAN KLAIM JKN
Nomor: ${letterNumber}
Tanggal: ${data.timestamp}
Sifat: BIASA
Lampiran: -
Perihal: Persetujuan Pembayaran Klaim Pelayanan Pasien (${data.claimId})

Kepada Yth.
Direktur & Bagian Keuangan ${data.hospitalName}
di Tempat

Dengan hormat,
${paragraphs.join("\n\n")}

Ringkasan Hasil Verifikasi:
1. ${points[0].title}: ${points[0].desc}
2. ${points[1].title}: ${points[1].desc}
3. ${points[2].title}: ${points[2].desc}

${conclusion}

Verifikator Medis BPJS Kesehatan,
${data.verifierName}
${data.verifierRole || "Kaidah Koding & Verifikasi"}`;

    return {
      header: {
        institution: "BADAN PENYELENGGARA JAMINAN SOSIAL KESEHATAN",
        branch: "KANTOR CABANG UTAMA JAKARTA SELATAN",
        division: "Bidang Manajemen Manfaat & Penjaminan Pelayanan Faskes",
        address: "Jl. Raya Pasar Minggu No. 17, Jakarta Selatan · Telp: (021) 7919-8000 · e-verifikasi@bpjs-kesehatan.go.id",
      },
      metadata: {
        letterTypeTitle: "BERITA ACARA PERSETUJUAN REALISASI PEMBAYARAN KLAIM JKN",
        letterNumber,
        date: data.timestamp,
        nature: "BIASA",
        attachments: "-",
        subject: `Persetujuan Realisasi Pembayaran Klaim (${data.claimId})`,
        recipient: `Direktur & Bagian Keuangan ${data.hospitalName}`,
        recipientAddress: "Fasilitas Kesehatan Rujukan Tingkat Lanjut (FKRTL)",
      },
      claimSummary: {
        claimId: data.claimId,
        hospitalName: data.hospitalName,
        claimedTariff: data.finalTariff,
        finalTariff: data.finalTariff,
        savedDeltaRupiah: 0,
        verifierName: data.verifierName,
        verifierRole: data.verifierRole || "Kaidah Koding & Verifikasi",
      },
      paragraphs,
      pointsTitle: "Ketetapan Validasi Medis & Administrasi",
      points,
      conclusion,
      legalBasis: [
        "Panduan Teknis Verifikasi Klaim Fasilitas Kesehatan Rujukan Tingkat Lanjut BPJS Kesehatan.",
        "Kaidah INA-CBG Permenkes No. 3 Tahun 2023.",
      ],
      signatory: {
        cityAndDate: `Jakarta, ${data.timestamp.split(",")[0] || "23 Oktober 2026"}`,
        position: data.verifierRole || "Kaidah Koding & Verifikasi BPJS",
        name: data.verifierName,
        nip: "NIP: 198804122014022001",
        digitalSignatureId: `TTE-BPJS-APPROVED-${data.claimId}-VALID`,
      },
      fullTextPlain,
    };
  }

  // Default: PENDING_KLARIFIKASI_RS
  const letterNumber = data.letterNumber || `440/BPJS-KCU/KLARIF/X/2026`;
  const paragraphs = [
    `Sehubungan dengan proses verifikasi pra-bayar pembiayaan JKN periode Oktober 2026, bersama surat ini kami sampaikan hasil penelaahan bukti klinis atas berkas tagihan ${data.claimId} dari ${data.hospitalName}.`,
    "Berdasarkan penelaahan silang antara kuitansi farmasi/depo operasi dengan lembar Laporan Operasi dan Resume Medis, ditemukan diskrepansi penagihan yang memerlukan klarifikasi tertulis dan kelengkapan bukti pendukung dari pihak rumah sakit.",
  ];
  const points = [
    {
      title: "Ketidaksesuaian Billing Alat Kesehatan Implan",
      desc: "Tercatat penagihan kuitansi alat implan stent yang tidak bersesuaian dengan narasi tindakan pada Laporan Operasi Bedah. Berdasarkan Permenkes No. 3 Tahun 2023 Pasal 24, penagihan alkes wajib mencerminkan pemakaian riil tindakan.",
    },
    {
      title: "Kriteria Klinis Komplikasi Berat",
      desc: "Penagihan diagnosa sekunder komplikasi berat tidak didukung oleh hasil pemeriksaan objektif laboratorium atau penanda biomarker infeksi pada lembar CPPT.",
    },
    {
      title: "Batas Waktu Tanggapan Faskes",
      desc: "Mohon menyampaikan surat tanggapan resmi dan berkas pendukung selambat-lambatnya dalam waktu 3 x 24 jam kerja sejak surat ini diterima.",
    },
  ];
  const conclusion =
    "Sebelum diterimanya klarifikasi dan kelengkapan berkas tersebut di atas, realisasi pembayaran atas klaim ini ditangguhkan sementara demi menjaga tertib administrasi dan akuntabilitas pembiayaan jaminan kesehatan.";

  const fullTextPlain = `SURAT PERMINTAAN KLARIFIKASI DAN BUKTI PENDUKUNG KLAIM JKN
Nomor: ${letterNumber}
Tanggal: ${data.timestamp}
Sifat: PENTING / SEGERA
Lampiran: 1 (Satu) Berkas Telaah Diskrepansi Medis
Perihal: Permintaan Klarifikasi Bukti Klinis atas Pengajuan Berkas Klaim ${data.claimId}

Kepada Yth.
Direktur ${data.hospitalName} (Up. Komite Medik & Tim Casemix)
di Tempat

Dengan hormat,
${paragraphs.join("\n\n")}

Pokok Diskrepansi Klinis:
1. ${points[0].title}: ${points[0].desc}
2. ${points[1].title}: ${points[1].desc}
3. ${points[2].title}: ${points[2].desc}

${conclusion}

Dasar Regulasi:
- Permenkes No. 3 Tahun 2023 Pasal 24 tentang Penagihan Klaim Khusus Obat dan Alat Kesehatan
- Panduan Tata Kelola Verifikasi Berkas Klaim BPJS Kesehatan

Verifikator Medis BPJS Kesehatan,
${data.verifierName}
${data.verifierRole || "Verifikator Utama BPJS"}`;

  return {
    header: {
      institution: "BADAN PENYELENGGARA JAMINAN SOSIAL KESEHATAN",
      branch: "KANTOR CABANG UTAMA JAKARTA SELATAN",
      division: "Bidang Manajemen Manfaat & Jaminan Pelayanan Rujukan",
      address: "Jl. Raya Pasar Minggu No. 17, Jakarta Selatan · Telp: (021) 7919-8000 · e-verifikasi@bpjs-kesehatan.go.id",
    },
    metadata: {
      letterTypeTitle: "SURAT PERMINTAAN KLARIFIKASI RESMI DAN BUKTI PENDUKUNG KLAIM JKN",
      letterNumber,
      date: data.timestamp,
      nature: "PENTING / SEGERA",
      attachments: "1 (Satu) Berkas Lembar Temuan Diskrepansi",
      subject: `Permintaan Klarifikasi Berkas Penagihan Klaim (${data.claimId})`,
      recipient: `Direktur ${data.hospitalName} (Up. Komite Medik & TKMKB)`,
      recipientAddress: "Fasilitas Kesehatan Rujukan Tingkat Lanjut (FKRTL)",
    },
    claimSummary: {
      claimId: data.claimId,
      hospitalName: data.hospitalName,
      claimedTariff: claimedEstimate,
      finalTariff: data.finalTariff,
      savedDeltaRupiah: data.savedDeltaRupiah,
      verifierName: data.verifierName,
      verifierRole: data.verifierRole || "Verifikator Utama BPJS",
    },
    paragraphs,
    pointsTitle: "Pokok Klarifikasi Mediko-Legal",
    points,
    conclusion,
    legalBasis: [
      "Permenkes No. 3 Tahun 2023 Pasal 24 tentang Ketentuan Penagihan Klaim Khusus Alat Kesehatan Implan.",
      "Petunjuk Pelaksanaan Verifikasi Klaim FKRTL BPJS Kesehatan.",
      "Kaidah Koding Morbiditas dan Tindakan Medis ICD-10 & ICD-9-CM.",
    ],
    signatory: {
      cityAndDate: `Jakarta, ${data.timestamp.split(",")[0] || "23 Oktober 2026"}`,
      position: data.verifierRole || "Verifikator Utama BPJS Kesehatan",
      name: data.verifierName,
      nip: "NIP: 198804122014022001",
      digitalSignatureId: `TTE-BPJS-KLARIF-${data.claimId}-VALID`,
    },
    fullTextPlain,
  };
}
