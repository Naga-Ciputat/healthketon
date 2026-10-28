"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Activity,
  FileCheck2,
  FlaskConical,
  Sparkles,
  ShieldAlert,
  Scale,
  Keyboard,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Layers,
  FileSpreadsheet,
  Cpu,
  Clock,
  Download,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Info,
} from "lucide-react";
import { TopHeader } from "@/components/widgets/TopHeader";
import { cn } from "@/lib/utils";

interface ChapterItem {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const CHAPTERS: ChapterItem[] = [
  {
    id: "ikhtisar",
    number: "01",
    title: "Ikhtisar & Filosofi Operasional",
    description: "Siklus verifikasi pra-bayar dan peran pengguna sistem.",
    icon: Layers,
  },
  {
    id: "triage",
    number: "02",
    title: "Modul Triage & Antrean Klaim",
    description: "Metrik antrean, filter risiko, dan unggah berkas FPK.",
    icon: Activity,
  },
  {
    id: "dossier",
    number: "03",
    title: "Ruang Telaah Dossier Bukti Klinis",
    description: "Smart Viewer, 4 pola anomali, dan Dossier Action Bar.",
    icon: Stethoscope,
  },
  {
    id: "audit-trail",
    number: "04",
    title: "Audit Trail & Repositori Rekonsiliasi",
    description: "Heatmap 28 hari, log append-only, dan UU PDP No. 27/2022.",
    icon: FileCheck2,
  },
  {
    id: "benchmark",
    number: "05",
    title: "Uji Kasus Benchmark & Evaluasi AI",
    description: "Metrik recall >= 85%, batas FPR <= 15%, dan Confusion Matrix.",
    icon: FlaskConical,
  },
  {
    id: "copilot-studio",
    number: "06",
    title: "Clarix AI Studio & Floating Copilot",
    description: "Perbedaan mikro vs makro dan context ingestion layar.",
    icon: Sparkles,
  },
  {
    id: "regulasi",
    number: "07",
    title: "Matriks Regulasi & Kaidah Koding",
    description: "Dasar hukum Permenkes 3/2023, 24/2022, dan PNPK Kemenkes.",
    icon: Scale,
  },
  {
    id: "shortcuts",
    number: "08",
    title: "Pintasan Keyboard & Panduan Cepat",
    description: "Daftar tombol pintas untuk efisiensi verifikator di meja kerja.",
    icon: Keyboard,
  },
];

export default function PanduanPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("ikhtisar");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return CHAPTERS;
    const q = searchQuery.toLowerCase();
    return CHAPTERS.filter(
      (ch) =>
        ch.title.toLowerCase().includes(q) ||
        ch.description.toLowerCase().includes(q) ||
        ch.number.includes(q)
    );
  }, [searchQuery]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50">
      {/* Top Header */}
      <TopHeader
        title="Panduan Operasional TELISIK"
        subtitle="Dokumentasi Tata Kelola Verifikasi Klaim JKN"
        badge={
          <span className="text-[10.5px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-[4px] border border-slate-200">
            Revisi 2.4 / Standar KMKB
          </span>
        }
        rightActions={
          <div className="flex items-center gap-2">
            <Link
              href="/claims/triage"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-[4px] transition-colors"
            >
              <span>Ke Antrean Klaim</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        }
      />

      {/* Main Container: 2-Column Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sticky Sidebar: Table of Contents & Search */}
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 select-none">
          {/* Search Box */}
          <div className="p-3.5 border-b border-slate-100">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari topik panduan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-[4px] text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex items-center justify-between mt-2 pt-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                Est. Waktu Baca: 12 Menit
              </span>
              <span className="font-medium text-slate-700">8 Bab</span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredChapters.map((ch) => {
              const Icon = ch.icon;
              const isActive = activeSection === ch.id;

              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => scrollToSection(ch.id)}
                  className={cn(
                    "w-full text-left px-2.5 py-2 rounded-[4px] border transition-colors flex items-start gap-2.5",
                    isActive
                      ? "bg-blue-50/80 border-blue-200 text-blue-900"
                      : "bg-transparent border-transparent hover:bg-slate-50 text-slate-700"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-[4px] flex items-center justify-center flex-shrink-0 text-[10.5px] font-bold border mt-0.5",
                      isActive
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    )}
                  >
                    {ch.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        "text-xs truncate font-medium",
                        isActive ? "text-blue-950 font-semibold" : "text-slate-800"
                      )}
                    >
                      {ch.title}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {ch.description}
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredChapters.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-500">
                Topik tidak ditemukan. Gunakan kata kunci lain.
              </div>
            )}
          </div>

          {/* Footer Card */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/60 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center justify-between font-medium text-slate-700">
              <span>Dasar Standar</span>
              <span className="text-emerald-700 font-semibold">BPJS KMKB</span>
            </div>
            <p className="text-[10.5px] text-slate-500 leading-relaxed">
              Diselaraskan dengan Kepmenkes PNPK dan Pedoman Koding INA-CBG Permenkes No. 3/2023.
            </p>
          </div>
        </aside>

        {/* Right Content Area: Detailed Guides */}
        <main className="flex-1 overflow-y-auto px-8 py-8 space-y-12 max-w-5xl">
          {/* Header Banner Section */}
          <div className="bg-white border border-slate-200 rounded-[6px] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-[4px]">
                  Buku Panduan Teknis
                </span>
                <span className="text-xs text-slate-500">
                  Terbitan Kedeputian Manajemen Pelayanan Rujukan BPJS Kesehatan
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono">TELISIK-MAN-2026</span>
            </div>

            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Panduan Operasional Verifikasi Klaim & Rekonsiliasi Medis TELISIK
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              TELISIK adalah sistem investigasi bukti klinis berbasis AI yang dirancang untuk mendukung
              tim verifikator BPJS Kesehatan dan Komite Medik Faskes dalam mengidentifikasi anomali penagihan,
              memitigasi potensi dispute klaim secara pra-bayar, dan menegakkan prinsip Kendali Mutu &
              Kendali Biaya (KMKB) secara objektif.
            </p>
          </div>

          {/* ========================================================================= */}
          {/* BAB 1: IKHTISAR & FILOSOFI OPERASIONAL */}
          {/* ========================================================================= */}
          <section id="ikhtisar" className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-blue-600 font-mono text-sm">01.</span>
                Ikhtisar & Filosofi Operasional TELISIK
              </h2>
              <span className="text-xs text-slate-500">Alur Verifikasi Pra-Bayar</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-[6px] p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                1.1 Siklus Verifikasi Klaim Pra-Bayar (End-to-End Workflow)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Berbeda dari audit pasca-bayar konvensional yang memicu sanksi pengembalian dana berkepanjangan,
                TELISIK beroperasi pada fase <strong>pra-bayar</strong> sesaat setelah berkas Form Pengajuan
                Klaim (FPK) diajukan oleh rumah sakit mitra.
              </p>

              {/* 5-Step Process Visual */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 pt-1">
                {[
                  {
                    step: "1",
                    title: "Unggah FPK",
                    desc: "File .xlsx klaim & PDF resume/lab diunggah ke sistem.",
                  },
                  {
                    step: "2",
                    title: "Screening AI",
                    desc: "Clarix memetakan diagnosis vs rekam medis secara verbatim.",
                  },
                  {
                    step: "3",
                    title: "Triage Risiko",
                    desc: "Klaim diklasifikasikan ke antrean Tinggi, Sedang, atau Rendah.",
                  },
                  {
                    step: "4",
                    title: "Telaah Dossier",
                    desc: "Verifikator memeriksa bukti dokumen & kalkulator tarif.",
                  },
                  {
                    step: "5",
                    title: "Putusan & Arsip",
                    desc: "Persetujuan, koreksi tarif, atau berita acara rekonsiliasi.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-[4px] space-y-1.5"
                  >
                    <div className="w-5 h-5 rounded-[4px] bg-slate-800 text-white flex items-center justify-center text-[10.5px] font-bold">
                      {item.step}
                    </div>
                    <div className="text-xs font-semibold text-slate-800">{item.title}</div>
                    <div className="text-[11px] text-slate-500 leading-snug">{item.desc}</div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  1.2 Diferensiasi Peran Pengguna (User Roles)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-white border border-slate-200 rounded-[4px] space-y-1.5">
                    <div className="text-xs font-semibold text-blue-800">
                      Verifikator Utama BPJS
                    </div>
                    <div className="text-[11px] text-slate-500">Contoh: dr. Siti Aminah</div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Memegang kewenangan penuh penetapan 4 putusan verifikasi pada Dossier Action Bar,
                      persetujuan Berita Acara Rekonsiliasi resmi, dan eskalasi ke Tim Anti-Fraud.
                    </p>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-[4px] space-y-1.5">
                    <div className="text-xs font-semibold text-emerald-800">
                      Dokter Penelaah Klinis
                    </div>
                    <div className="text-[11px] text-slate-500">Contoh: dr. Bambang Soedibyo, Sp.A</div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Fokus pada telaah keabsahan klinis: kriteria organ failure sepsis (qSOFA),
                      laporan operasi tindakan invasif kateterisasi jantung, dan catatan CPPT.
                    </p>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-[4px] space-y-1.5">
                    <div className="text-xs font-semibold text-amber-800">
                      Tim Rekonsiliasi Faskes
                    </div>
                    <div className="text-[11px] text-slate-500">Contoh: Ahmad Fauzi, S.Kep</div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Pihak casemix rumah sakit yang bertugas merespons lembar klarifikasi,
                      mengunggah bukti rekam medis susulan, dan menyepakati penyesuaian koding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* BAB 2: MODUL TRIAGE & ANTREAN KLAIM */}
          {/* ========================================================================= */}
          <section id="triage" className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-blue-600 font-mono text-sm">02.</span>
                Modul Triage & Antrean Klaim (`/claims/triage`)
              </h2>
              <span className="text-xs text-slate-500">Screening & Prioritisasi</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-[6px] p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                2.1 Membaca 3 Kartu Metrik Ringkasan di Atas Antrean
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-[4px] space-y-1">
                  <div className="text-[11px] text-slate-500 font-medium">Antrean Telaah Klaim</div>
                  <div className="text-base font-bold text-slate-900">5 Berkas Masuk</div>
                  <p className="text-[11px] text-slate-600">
                    Jumlah klaim berindikasi anomali klinis yang menunggu penelaahan manual verifikator.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-[4px] space-y-1">
                  <div className="text-[11px] text-slate-500 font-medium">Potensi Koreksi Tagihan</div>
                  <div className="text-base font-bold text-emerald-700">Rp 48.800.000</div>
                  <p className="text-[11px] text-slate-600">
                    Total selisih nominal tarif klaim RS vs tarif hasil rekomendasi kaidah koding.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-[4px] space-y-1">
                  <div className="text-[11px] text-slate-500 font-medium">Fast-Track Layak Bayar</div>
                  <div className="text-base font-bold text-blue-700">19 Berkas Terverifikasi</div>
                  <p className="text-[11px] text-slate-600">
                    Klaim tanpa anomali yang lolos verifikasi otomatis untuk mempercepat pencairan FPK.
                  </p>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  2.2 Filter Cepat & Pencarian Berkas
                </h3>
                <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-slate-800 min-w-36">Segmentasi Risiko:</span>
                    <span>
                      Gunakan tombol segmen <code>Semua Risiko</code>, <code>Tinggi</code>,{" "}
                      <code>Sedang</code>, atau <code>Rendah</code> untuk menyortir klaim berdasarkan
                      urgensi potensi kebocoran anggaran.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-slate-800 min-w-36">Filter Multi-Kriteria:</span>
                    <span>
                      Dapat difilter berdasarkan nama Faskes (RS Sejahtera Medika, RS Sentosa Kasih, dll.),
                      status telaah saat ini, dan jenis indikasi anomali klinis spesifik.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-slate-800 min-w-36">Membuka Ruang Telaah:</span>
                    <span>
                      Klik pada baris klaim mana pun atau tombol <code>Buka &gt;</code> di kolom Aksi
                      untuk masuk ke Ruang Telaah Dossier Bukti Klinis kasus tersebut.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  2.3 Prosedur Unggah Berkas FPK Baru (Tombol Hijau di Header)
                </h3>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-[4px] space-y-2 text-xs text-slate-600">
                  <p>
                    Klik tombol <strong>Unggah Berkas Klaim</strong> pada bilah kanan atas untuk membuka
                    modal transmisi data:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11.5px]">
                    <div className="bg-white p-2.5 border border-slate-200 rounded-[4px]">
                      <span className="font-semibold text-slate-800 block mb-1">
                        1. Berkas Rekapitulasi Klaim (.xlsx)
                      </span>
                      Memuat data nomor SEP, NIK, tanggal rawat, diagnosis primer & sekunder ICD-10, kode
                      prosedur ICD-9-CM, kode INA-CBG awal, dan nominal tagihan RS.
                    </div>
                    <div className="bg-white p-2.5 border border-slate-200 rounded-[4px]">
                      <span className="font-semibold text-slate-800 block mb-1">
                        2. Arsip Berkas Rekam Medis (PDF)
                      </span>
                      Menampung scan resume medis elektronik, laporan operasi/tindakan, hasil laboratorium
                      patologi klinik, dan rincian kuitansi billing per item.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* BAB 3: RUANG TELAAH DOSSIER BUKTI KLINIS */}
          {/* ========================================================================= */}
          <section id="dossier" className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-blue-600 font-mono text-sm">03.</span>
                Ruang Telaah Dossier Bukti Klinis (`/claims/[id]/dossier`)
              </h2>
              <span className="text-xs text-slate-500">Investigasi & Putusan</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-[6px] p-5 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  3.1 Tata Letak & Fungsi Smart Document Viewer
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Di sebelah kiri halaman dossier, terdapat <strong>Smart Document Viewer</strong> dengan
                  tab dokumen resmi rumah sakit:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[4px]">
                    <span className="font-semibold text-slate-800 block">Tab 1: Resume Medis</span>
                    <span className="text-[11px] text-slate-500">Ringkasan masuk & keluar pasien.</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[4px]">
                    <span className="font-semibold text-slate-800 block">Tab 2: Laporan Operasi</span>
                    <span className="text-[11px] text-slate-500">Catatan rinci tindakan invasif.</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[4px]">
                    <span className="font-semibold text-slate-800 block">Tab 3: Hasil Lab</span>
                    <span className="text-[11px] text-slate-500">Kultur darah, laktat, patologi.</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[4px]">
                    <span className="font-semibold text-slate-800 block">Tab 4: Kuitansi Billing</span>
                    <span className="text-[11px] text-slate-500">Itemisasi obat & alkes penagihan.</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  3.2 Deteksi 4 Pola Anomali Klinis Utama
                </h3>
                <div className="space-y-3">
                  {/* Anomaly 1 */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-[4px] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-800">
                        1. Upcoding Komplikasi Sepsis (ICD-10: A41.9)
                      </span>
                      <span className="text-[10.5px] font-mono px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-[4px]">
                        Severity Inflated: III -&gt; I
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>Indikasi Temuan:</strong> Koding sepsis dicantumkan sebagai diagnosis sekunder
                      yang meningkatkan severity level grup CBG ke Tingkat III (Mayor). Namun rekam medis
                      menunjukkan skor qSOFA &lt; 2, asam laktat normal (&lt; 2 mmol/L), dan hasil kultur darah
                      negatif/tidak pernah diperiksa.
                    </p>
                    <div className="text-[11px] text-slate-500">
                      Rujukan: PNPK Sepsis Dewasa No. HK.01.07/MENKES/2020 & Kaidah ICD-10 Bab I.
                    </div>
                  </div>

                  {/* Anomaly 2 */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-[4px] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-800">
                        2. Unbundling Alkes Stent Jantung DES
                      </span>
                      <span className="text-[10.5px] font-mono px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-[4px]">
                        Tagihan Ganda Alkes
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>Indikasi Temuan:</strong> Penagihan terpisah untuk Drug-Eluting Stent (DES) pada
                      kuitansi tambahan, padahal prosedur kateterisasi dan angioplasti koroner telah dipaketkan
                      dalam satu tarif komprehensif paket INA-CBG.
                    </p>
                    <div className="text-[11px] text-slate-500">
                      Rujukan: Permenkes No. 3 Tahun 2023 Pasal 24 (Inklusi Alkes Implan).
                    </div>
                  </div>

                  {/* Anomaly 3 */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-[4px] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-800">
                        3. Pemecahan Episode Readmisi &le; 30 Hari
                      </span>
                      <span className="text-[10.5px] font-mono px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-[4px]">
                        Episode Churning
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>Indikasi Temuan:</strong> Pasien dipulangkan dari rawat inap lalu didaftarkan
                      kembali dalam selang waktu kurang dari 30 hari kalender dengan kelompok diagnosis primer
                      yang sama tanpa jeda stabilitas klinis yang memadai.
                    </p>
                    <div className="text-[11px] text-slate-500">
                      Rujukan: Permenkes No. 3 Tahun 2023 Lampiran II (Ketentuan Satu Episode Perawatan).
                    </div>
                  </div>

                  {/* Anomaly 4 */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-[4px] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-800">
                        4. Duplikasi Catatan Medis (Note Cloning CPPT)
                      </span>
                      <span className="text-[10.5px] font-mono px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-[4px]">
                        Integritas RME Terkompromi
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>Indikasi Temuan:</strong> Catatan Perkembangan Pasien Terintegrasi (CPPT) pada
                      hari rawat ke-2, ke-3, dan ke-4 identik secara karakter (copy-paste verbatim) tanpa adanya
                      pemeriksaan fisik atau evaluasi instruksi terapi harian yang sebenarnya.
                    </p>
                    <div className="text-[11px] text-slate-500">
                      Rujukan: Permenkes No. 24 Tahun 2022 Pasal 25 (Autentisitas & Integritas Rekam Medis).
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  3.3 Pengambilan Putusan pada Dossier Action Bar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white border border-slate-200 rounded-[4px] space-y-1">
                    <span className="font-semibold text-emerald-800 block">
                      A. [Setujui Klaim Layak Bayar]
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Gunakan putusan ini jika seluruh bukti dokumen pendukung valid, koding memenuhi kaidah,
                      dan tidak ditemukan anomali penagihan. Status klaim berubah menjadi disetujui.
                    </p>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-[4px] space-y-1">
                    <span className="font-semibold text-amber-800 block">
                      B. [Kirim Klarifikasi ke RS]
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Menerbitkan lembar klarifikasi resmi kepada komite medik rumah sakit untuk meminta
                      bukti resume tambahan atau hasil pemeriksaan penunjang dalam batas waktu 3x24 jam.
                    </p>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-[4px] space-y-1">
                    <span className="font-semibold text-blue-800 block">
                      C. [Penyesuaian Tarif / Downcoding]
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Mengoreksi kode INA-CBG ke tingkat severity yang sesuai bukti klinis (misal: Tingkat III
                      menjadi Tingkat I). Selisih nominal langsung tercatat sebagai penghematan anggaran JKN.
                    </p>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-[4px] space-y-1">
                    <span className="font-semibold text-rose-800 block">
                      D. [Eskalasi Tim PK-JKN]
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Meneruskan berkas kepada Tim Pencegahan Kecurangan JKN Kantor Cabang apabila
                      terdapat indikasi kecurangan terstruktur, pemalsuan tanda tangan, atau phantom billing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* BAB 4: AUDIT TRAIL & REPOSITORI REKONSILIASI */}
          {/* ========================================================================= */}
          <section id="audit-trail" className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-blue-600 font-mono text-sm">04.</span>
                Audit Trail & Repositori Rekonsiliasi (`/claims/audit-trail`)
              </h2>
              <span className="text-xs text-slate-500">Transparansi & Rekapitulasi</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-[6px] p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                4.1 Membaca Matriks Heatmap Rekonsiliasi 28 Hari
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Matriks Heatmap menampilkan grid 4 pekan x 7 hari yang merepresentasikan intensitas
                putusan telaah verifikator. Warna yang lebih pekat menandakan volume klaim terselesaikan
                atau frekuensi sengketa tarif yang lebih tinggi pada hari tersebut.
              </p>

              <div className="pt-1 space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  4.2 Log Append-Only & Kepatuhan UU PDP No. 27/2022
                </h3>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-[4px] space-y-2 text-xs text-slate-600">
                  <p>
                    Setiap aksi verifikasi disimpan secara <strong>append-only</strong> (tidak dapat diedit
                    atau dihapus) untuk memastikan integritas audit internal BPJS Kesehatan dan BPK.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-[11.5px] font-medium text-slate-800">
                      Prinsip Penyamaran Data (Data Masking):
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Sesuai Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27/2022 Pasal 35 & 39),
                    identitas pasien pada riwayat audit disamarkan secara otomatis (contoh:{" "}
                    <code>3175**********01</code> dan <code>Tn. B****** S******</code>) guna mencegah
                    eksposur data medis sensitif ke publik.
                  </p>
                </div>
              </div>

              <div className="pt-1 space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  4.3 Penerbitan Berita Acara Rekonsiliasi Resmi
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Gunakan tombol <strong>Cetak / Unduh Berita Acara</strong> pada halaman audit trail
                  untuk mengekspor dokumen rekonsiliasi bertanda tangan digital dalam format PDF resmi
                  sebagai lampiran penagihan FPK final.
                </p>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* BAB 5: UJI KASUS BENCHMARK & EVALUASI AI */}
          {/* ========================================================================= */}
          <section id="benchmark" className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-blue-600 font-mono text-sm">05.</span>
                Uji Kasus Benchmark & Evaluasi AI (`/benchmark`)
              </h2>
              <span className="text-xs text-slate-500">Validasi Reliabilitas Model</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-[6px] p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                5.1 Target KPI Ilmiah Mesin Penalaran TELISIK
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sebelum model analitik diterapkan pada data pengajuan klaim faskes secara langsung,
                sistem secara berkala dievaluasi terhadap ground truth dataset yang telah divalidasi oleh
                panel dokter spesialis BPJS:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-[4px] space-y-1">
                  <div className="text-[11px] text-slate-500 font-medium">Recall Deteksi Anomali</div>
                  <div className="text-base font-bold text-blue-700">&ge; 85% Target Operasional</div>
                  <p className="text-[11px] text-slate-600">
                    Memastikan seluruh upcoding dan unbundling faktual tertangkap tanpa ada kebocoran klaim.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-[4px] space-y-1">
                  <div className="text-[11px] text-slate-500 font-medium">Toleransi False Positive</div>
                  <div className="text-base font-bold text-emerald-700">&le; 15% Batas Maksimum</div>
                  <p className="text-[11px] text-slate-600">
                    Mencegah klaim sah faskes dituduh anomali secara keliru yang dapat menghambat cashflow RS.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-[4px] space-y-1">
                  <div className="text-[11px] text-slate-500 font-medium">Grounding Verbatim</div>
                  <div className="text-base font-bold text-purple-700">100% Bukti Terdokumentasi</div>
                  <p className="text-[11px] text-slate-600">
                    Setiap indikasi wajib menyertakan kutipan eksak nomor halaman dan teks rekam medis asli.
                  </p>
                </div>
              </div>

              <div className="pt-1 space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  5.2 Interpretasi Confusion Matrix
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pada tab Evaluasi Suite, verifikator dapat meninjau matriks 2x2 yang mengklasifikasikan
                  akurasi prediksi sistem terhadap keputusan audit riil dokter spesialis rujukan.
                </p>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* BAB 6: CLARIX AI STUDIO & FLOATING COPILOT */}
          {/* ========================================================================= */}
          <section id="copilot-studio" className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-blue-600 font-mono text-sm">06.</span>
                Clarix AI Studio & Floating Copilot (`/clarix-ai` & `Ctrl+K`)
              </h2>
              <span className="text-xs text-slate-500">Investigasi Mikro vs Makro</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-[6px] p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-[4px] space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">
                      Floating Copilot (Telaah Mikro Berkelanjutan)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dapat dibuka kapan saja dari pojok kanan bawah atau dengan menekan tombol pintas{" "}
                    <code>Ctrl + K</code>.
                  </p>
                  <ul className="text-[11px] text-slate-500 space-y-1 list-disc pl-4">
                    <li>Secara otomatis menyerap data berkas yang sedang Anda buka di layar.</li>
                    <li>
                      Tanyakan hal spesifik seperti: <em>&quot;Berapa nilai laktat pada hari ke-2 di berkas ini?&quot;</em>
                    </li>
                    <li>Mendukung verifikasi cepat tanpa perlu berpindah halaman kerja.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-[4px] space-y-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">
                      Clarix AI Studio (Investigasi Makro & Forensik)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Halaman khusus penyelidikan komparatif lintas faskes pada menu bilah kiri{" "}
                    <code>/clarix-ai</code>.
                  </p>
                  <ul className="text-[11px] text-slate-500 space-y-1 list-disc pl-4">
                    <li>Melakukan analisis tren frekuensi sengketa koding antar rumah sakit mitra.</li>
                    <li>Simulasi dampak keuangan jika kaidah koding tertentu diperketat.</li>
                    <li>
                      Riwayat percakapan privat per akun verifikator yang tersimpan otomatis di perangkat lokal.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* BAB 7: MATRIKS REGULASI & KAIDAH KODING JKN */}
          {/* ========================================================================= */}
          <section id="regulasi" className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-blue-600 font-mono text-sm">07.</span>
                Matriks Regulasi & Kaidah Koding JKN
              </h2>
              <span className="text-xs text-slate-500">Dasar Hukum Penolakan & Koreksi</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-[6px] overflow-hidden border-slate-200">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-800">
                  Tabel Rujukan Resmi Regulasi Verifikasi Klaim BPJS Kesehatan
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                      <th className="py-2.5 px-3.5">Regulasi Terkait</th>
                      <th className="py-2.5 px-3.5">Pasal / Butir</th>
                      <th className="py-2.5 px-3.5">Ketentuan Medis / Administratif</th>
                      <th className="py-2.5 px-3.5">Aksi Verifikator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3.5 font-semibold text-slate-900">
                        Permenkes No. 3 Tahun 2023
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-[11px]">Pasal 24</td>
                      <td className="py-2.5 px-3.5 text-[11.5px] leading-relaxed">
                        Alkes implan (stent jantung, plate screw, mesh) telah termasuk dalam tarif paket
                        INA-CBG dan dilarang ditagihkan terpisah.
                      </td>
                      <td className="py-2.5 px-3.5">
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-[4px] font-medium text-[11px]">
                          Koreksi Unbundling
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3.5 font-semibold text-slate-900">
                        Permenkes No. 3 Tahun 2023
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-[11px]">Lampiran II</td>
                      <td className="py-2.5 px-3.5 text-[11.5px] leading-relaxed">
                        Pasien rawat inap yang kembali masuk dalam jangka waktu &le; 30 hari dengan episode
                        penyakit sama dihitung sebagai satu kesatuan episode.
                      </td>
                      <td className="py-2.5 px-3.5">
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-[4px] font-medium text-[11px]">
                          Gabung Episode Klaim
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3.5 font-semibold text-slate-900">
                        Permenkes No. 24 Tahun 2022
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-[11px]">Pasal 25</td>
                      <td className="py-2.5 px-3.5 text-[11.5px] leading-relaxed">
                        Kewajiban autentisitas dan integritas rekam medis elektronik. Praktik copy-paste (note
                        cloning) tanpa asesmen baru dikategorikan pelanggaran etik & administratif.
                      </td>
                      <td className="py-2.5 px-3.5">
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 rounded-[4px] font-medium text-[11px]">
                          Klarifikasi CPPT RS
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3.5 font-semibold text-slate-900">PNPK Sepsis 2020</td>
                      <td className="py-2.5 px-3.5 font-mono text-[11px]">
                        HK.01.07/MENKES/2020
                      </td>
                      <td className="py-2.5 px-3.5 text-[11.5px] leading-relaxed">
                        Penegakan diagnosis sepsis mensyaratkan bukti disfungsi organ (peningkatan skor SOFA
                        &ge; 2 atau qSOFA &ge; 2) disertai infeksi terbukti.
                      </td>
                      <td className="py-2.5 px-3.5">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-[4px] font-medium text-[11px]">
                          Downcoding Tingkat I
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3.5 font-semibold text-slate-900">
                        UU No. 27 Tahun 2022
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-[11px]">Pasal 35 & 39</td>
                      <td className="py-2.5 px-3.5 text-[11.5px] leading-relaxed">
                        Data kesehatan perseorangan merupakan data pribadi spesifik yang wajib dilindungi
                        melalui enkripsi dan penyamaran (masking) identitas.
                      </td>
                      <td className="py-2.5 px-3.5">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-[4px] font-medium text-[11px]">
                          Masking NIK / No. Kartu
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* BAB 8: PINTASAN KEYBOARD & PANDUAN CEPAT */}
          {/* ========================================================================= */}
          <section id="shortcuts" className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-blue-600 font-mono text-sm">08.</span>
                Pintasan Keyboard & Panduan Cepat (Cheatsheet)
              </h2>
              <span className="text-xs text-slate-500">Efisiensi Meja Verifikator</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-[6px] p-5 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Gunakan kombinasi tombol keyboard berikut untuk mempercepat telaah dokumen berkas tanpa
                harus berulang kali menggeser kursor mouse:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  {
                    key: "Ctrl + K",
                    desc: "Buka / Tutup Floating Clarix Copilot di layar mana pun.",
                  },
                  {
                    key: "Alt + 1",
                    desc: "Buka langsung Tab Resume Medis PDF di Smart Document Viewer.",
                  },
                  {
                    key: "Alt + 2",
                    desc: "Buka Tab Laporan Operasi / Catatan Tindakan Bedah.",
                  },
                  {
                    key: "Alt + 3",
                    desc: "Buka Tab Hasil Pemeriksaan Laboratorium & Patologi.",
                  },
                  {
                    key: "Alt + 4",
                    desc: "Buka Tab Rincian Kuitansi Billing Itemisasi Penagihan RS.",
                  },
                  {
                    key: "Esc",
                    desc: "Tutup drawer riwayat readmisi atau modal surat berita acara.",
                  },
                ].map((sc) => (
                  <div
                    key={sc.key}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-[4px] flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="text-slate-800 font-medium">{sc.desc}</div>
                    </div>
                    <kbd className="px-2 py-1 bg-white border border-slate-300 rounded-[4px] font-mono text-[11px] font-bold text-slate-800 shadow-2xs">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>

              {/* Bottom Quick Action Box */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  Perlu bantuan konsultasi kaidah koding atau penelaahan berkas sengketa kompleks?
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/clarix-ai"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-[4px] transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Buka Clarix AI Studio</span>
                  </Link>
                  <Link
                    href="/claims/triage"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-[4px] transition-colors"
                  >
                    <span>Mulai Verifikasi Klaim</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
