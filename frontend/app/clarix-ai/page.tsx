"use client";

import React, { useState, useRef, useEffect } from "react";
import { TopHeader } from "@/components/widgets/TopHeader";
import {
  Sparkles,
  Send,
  CornerDownLeft,
  CornerDownRight,
  Scale,
  Building2,
  FileText,
  TrendingUp,
  Copy,
  Clock,
  Check,
  ShieldCheck,
  RotateCcw,
  Sliders,
  ShieldAlert,
  Bot,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { renderMarkdown } from "@/lib/markdownUtils";

interface StudioMessage {
  id: string;
  sender: "user" | "copilot";
  title?: string;
  text: string;
  timestamp: string;
  tableData?: Array<Record<string, string>>;
  legalClause?: string;
  recommendation?: string;
}

export default function ClarixAiStudioPage() {
  const [selectedModel, setSelectedModel] = useState("gemini-2.0-flash");
  const [inputQuery, setInputQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<StudioMessage[]>([
    {
      id: "initial-1",
      sender: "copilot",
      title: "Clarix AI Studio Aktif — Mode Investigasi Makro",
      text: "Selamat datang di **Clarix AI Studio**. Di sini Anda dapat menelusuri anomali penagihan faskes, membedah korelasi klaim lintas-pasien, melakukan uji komparasi regulasi **Permenkes No. 3/2023**, serta mensimulasikan dampak efisiensi beban dana JKN secara makro.\n\nPilih salah satu topik investigasi cepat di bawah atau ajukan pertanyaan spesifik terkait klaim dan kaidah koding.",
      timestamp: "09:00 WIB",
      legalClause: "Permenkes No. 3/2023 Lampiran II (Pedoman INA-CBG & Standar Tarif Pelayanan JKN)",
      recommendation: "Gunakan modul ini untuk audit makro lintas-faskes sebelum melakukan audit petik uji lapangan.",
    },
  ]);

  const quickScenarios = [
    {
      id: "sepsis-upcoding",
      label: "Audit Upcoding Sepsis A41.9",
      prompt: "Bandingkan rasio klaim sepsis (A41.9) di RS Sejahtera Medika vs RS Medika Nusantara. Berapa persen yang tidak didukung bukti lab objektif?",
      icon: TrendingUp,
    },
    {
      id: "stent-unbundling",
      label: "Investigasi Alkes Stent & Angiografi",
      prompt: "Tampilkan faskes dengan frekuensi diskrepansi alkes stent tertinggi dan analisis potensi pelanggaran unbundling sesuai Permenkes 3/2023 Pasal 24.",
      icon: FileText,
    },
    {
      id: "readmission-audit",
      label: "Pola Readmisi Terencana ≤ 30 Hari",
      prompt: "Analisis potensi fragmentasi episode rawat inap pada pasien kardiologi yang kembali dirawat dalam kurun waktu 15–20 hari pasca pulang.",
      icon: Clock,
    },
    {
      id: "note-cloning",
      label: "Deteksi Kloning Rekam Medis (94%+)",
      prompt: "Tampilkan dokter spesialis dengan indeks kemiripan catatan medis tertinggi (>90%) dan daftar nomor rekam medis yang terindikasi diduplikasi.",
      icon: Copy,
    },
  ];

  // Auto-scroll ke pesan terbawah saat ada pesan baru atau loading
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  // Focus input saat halaman dimuat
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: "copilot",
        title: "Percakapan Direset",
        text: "Riwayat investigasi telah dibersihkan. Silakan ajukan kueri analisis baru atau pilih skenario investigasi cepat di bawah.",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
      },
    ]);
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isProcessing) return;

    const userMsg: StudioMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsProcessing(true);

    // Simulasi waktu penalaran LLM multi-step
    await new Promise((resolve) => setTimeout(resolve, 850));

    const lowerQ = query.toLowerCase();
    let responseMsg: StudioMessage;

    if (lowerQ.includes("sepsis") || lowerQ.includes("a41.9")) {
      responseMsg = {
        id: `cop-${Date.now()}`,
        sender: "copilot",
        title: "Hasil Investigasi Makro: Anomali Diagnosis Sepsis (A41.9) Periode Q3-Q4 2026",
        text: `Berdasarkan sintesis data 120 klaim kardiovaskular pada faskes mitra cabang:\n\n• **RS Sejahtera Medika:** Ditemukan **18 dari 22 klaim sepsis (81,8%)** tidak memiliki bukti biomarker prokalsitonin (>0.5 ng/mL) dan leukosit normal, namun ditagihkan dengan kode INA-CBG severity level 3.\n• **RS Medika Nusantara:** Hanya 2 dari 15 klaim sepsis (13,3%) yang tidak memenuhi kriteria lab objektif.\n\nHal ini mengindikasikan **pola upcoding sistemik** pada RS Sejahtera Medika untuk memaksimalkan margin klaim paket kardiologi.`,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
        tableData: [
          { Faskes: "RS Sejahtera Medika", "Klaim Sepsis": "22 Kasus", "Tanpa Bukti Lab": "18 Kasus (81.8%)", "Potensi Koreksi": "Rp 324.000.000" },
          { Faskes: "RS Medika Nusantara", "Klaim Sepsis": "15 Kasus", "Tanpa Bukti Lab": "2 Kasus (13.3%)", "Potensi Koreksi": "Rp 36.000.000" },
          { Faskes: "RSUD Pratama Sehat", "Klaim Sepsis": "11 Kasus", "Tanpa Bukti Lab": "1 Kasus (9.1%)", "Potensi Koreksi": "Rp 18.000.000" },
        ],
        legalClause: "PMK No. 3/2023 Bab VII Pedoman Tarif INA-CBG & PNPK Tata Laksana Sepsis Dewasa Kemenkes RI No. HK.01.07/MENKES/2020",
        recommendation: "Terbitkan Surat Peringatan Resmi Nomor 440/BPJS-KCU/X/2026 dan jadwalkan Audit Investigatif Forensik Rekam Medis ke RS Sejahtera Medika.",
      };
    } else if (lowerQ.includes("stent") || lowerQ.includes("alkes") || lowerQ.includes("unbundling")) {
      responseMsg = {
        id: `cop-${Date.now()}`,
        sender: "copilot",
        title: "Analisis Diskrepansi Alkes & Klausul Unbundling Kateterisasi",
        text: `Ditemukan pola penggelembungan alkes dan penagihan ganda tindakan diagnostik:\n\n1. **Ketidaksesuaian Fisik Stent:** Tercatat selisih akumulasi 5 unit stent DES yang ditagihkan di kuitansi namun tercatat batal/retur di laporan operasi (Nilai selisih: Rp 50.000.000).\n2. **Pelanggaran Unbundling Prosedur:** Penagihan tambahan prosedur angiografi koroner (Rp 4.500.000/kasus) yang seharusnya masuk inklusif dalam paket PTCA.`,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
        tableData: [
          { Item: "Stent DES Retur Tapi Ditagih", "Jumlah Kasus": "5 Berkas", "Nilai Selisih": "Rp 50.000.000", Regulasi: "PMK 3/2023 Ps. 24" },
          { Item: "Unbundling Angiografi Terpisah", "Jumlah Kasus": "12 Berkas", "Nilai Selisih": "Rp 54.000.000", Regulasi: "PMK 3/2023 Lamp. II" },
        ],
        legalClause: "Permenkes No. 3 Tahun 2023 Pasal 24 (Verifikasi Alkes Riil) & Lampiran II (Larangan Unbundling Prosedur Inklusif)",
        recommendation: "Lakukan rekonsiliasi pemotongan tagihan otomatis sebesar Rp 104.000.000 pada Berita Acara Rekonsiliasi bulan berjalan.",
      };
    } else if (lowerQ.includes("readmisi") || lowerQ.includes("30 hari") || lowerQ.includes("fragmentasi")) {
      responseMsg = {
        id: `cop-${Date.now()}`,
        sender: "copilot",
        title: "Pola Fragmentasi Perawatan & Readmisi Berulang ≤ 30 Hari",
        text: `Terdeteksi **14 episode rawat inap kardiologi** yang mengalami readmisi terencana dalam rentang **14–21 hari** pasca pulang:\n\n• **DPJP Sama:** 11 dari 14 kasus ditangani oleh DPJP yang sama dengan diagnosis primer berulang (I20.0 / I21.0).\n• **Indikasi Fragmentasi:** Pasien dipulangkan sebelum hari rawat optimal tercapai, kemudian didaftarkan kembali dengan nomor SEP baru guna menagihkan dua paket INA-CBG terpisah.`,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
        tableData: [
          { DPJP: "dr. Hendra Sp.JP", "Kasus Readmisi": "7 Pasien", "Rata-rata Interval": "16 Hari", "Estimasi Biaya Ganda": "Rp 98.400.000" },
          { DPJP: "dr. Bambang Sp.B", "Kasus Readmisi": "4 Pasien", "Rata-rata Interval": "18 Hari", "Estimasi Biaya Ganda": "Rp 42.000.000" },
          { DPJP: "dr. Ratna Sp.PD", "Kasus Readmisi": "3 Pasien", "Rata-rata Interval": "22 Hari", "Estimasi Biaya Ganda": "Rp 21.600.000" },
        ],
        legalClause: "Permenkes No. 3 Tahun 2023 Pasal 17 tentang Ketentuan Readmisi Rawat Inap Berkelanjutan",
        recommendation: "Kombinasikan episode rawat yang terbukti terkait menjadi 1 klaim tunggal dan minta klarifikasi DPJP.",
      };
    } else if (lowerQ.includes("kloning") || lowerQ.includes("cloning") || lowerQ.includes("cppt") || lowerQ.includes("soap")) {
      responseMsg = {
        id: `cop-${Date.now()}`,
        sender: "copilot",
        title: "Audit Integritas RME: Deteksi Duplikasi Catatan Medis (Note Cloning)",
        text: `Melalui analisis embedding semantik teks CPPT (*NVIDIA NIM nv-embedqa-e5-v5*), ditemukan indikasi plagiarisme rekam medis antar-pasien:\n\n• **Tingkat Kemiripan:** 94% – 98% kesamaan teks narasi SOAP harfiah tanpa penyesuaian tanda vital objektif.\n• **Temuan Kritis:** Jam visite tercatat berurutan dalam selang 2 menit untuk 8 pasien rawat inap intensif.`,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
        tableData: [
          { "Nomor RME Pasien": "RM-2026-9041", "Berkas Sumber (Donor)": "RM-2026-8812", "Skor Kemiripan": "97.4%", "Status Temuan": "Duplikasi Total" },
          { "Nomor RME Pasien": "RM-2026-9042", "Berkas Sumber (Donor)": "RM-2026-8812", "Skor Kemiripan": "95.1%", "Status Temuan": "Duplikasi Redaksional" },
          { "Nomor RME Pasien": "RM-2026-9049", "Berkas Sumber (Donor)": "RM-2026-8790", "Skor Kemiripan": "94.8%", "Status Temuan": "Duplikasi Parsial" },
        ],
        legalClause: "Permenkes No. 24 Tahun 2022 tentang Rekam Medis & Permenkes No. 16 Tahun 2019 (Pencegahan Kecurangan JKN)",
        recommendation: "Eskalasikan ke Tim Pencegahan Kecurangan JKN (PK-JKN) Kantor Cabang untuk verifikasi faktual tanda tangan dokter.",
      };
    } else {
      responseMsg = {
        id: `cop-${Date.now()}`,
        sender: "copilot",
        title: "Hasil Sintesis Penelusuran Regulasi & Rekam Medis",
        text: `Clarix AI telah menganalisis parameter yang Anda ajukan dengan memadukan basis data **Permenkes No. 3/2023**, standar koding ICD-10 & ICD-9-CM, serta data klaim aktif pada cabang.\n\nSistem merekomendasikan verifikator untuk mengedepankan pembuktian berbasis kutipan verbatim rekam medis guna menjamin akuntabilitas mediko-legal yang kokoh saat penerbitan naskah dinas atau rekonsiliasi.`,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
        legalClause: "UU No. 24 Tahun 2011 tentang Badan Penyelenggara Jaminan Sosial & Permenkes No. 3 Tahun 2023",
        recommendation: "Gunakan menu Triage dan Ruang Telaah untuk meninjau berkas individual yang terkait dengan temuan ini.",
      };
    }

    setMessages((prev) => [...prev, responseMsg]);
    setIsProcessing(false);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-50/50">
      {/* Top Header */}
      <TopHeader
        title="Clarix AI Studio"
        subtitle="Investigasi Forensik & Regulasi JKN"
        rightActions={
          <div className="flex items-center gap-2">
            {/* Model Selector Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-[4px] px-2.5 py-1 text-xs shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium">Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer text-xs"
              >
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Multimodal & Grounding)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Clinical Reasoning)</option>
                <option value="groq-llama-3.3-70b">Groq LLaMA 3.3 70B (High-Throughput LPU)</option>
                <option value="nvidia-nim-embed">NVIDIA NIM (nv-embedqa-e5-v5)</option>
              </select>
            </div>

            {/* Reset Chat Button */}
            <button
              type="button"
              onClick={handleClearChat}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-[4px] transition-colors shadow-2xs cursor-pointer"
              title="Bersihkan riwayat percakapan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Sesi</span>
            </button>
          </div>
        }
      />

      {/* Main Single-Pane Chat Stream (Clean, Focused, Proper Chat) */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto w-full space-y-6">
          {messages.map((m) => {
            const isUser = m.sender === "user";

            if (isUser) {
              return (
                /* Proper User Chat Bubble: Aligned Right, Clean Deep Navy, Crisp Typography */
                <div key={m.id} className="flex justify-end items-start gap-2.5 group">
                  <div className="flex flex-col items-end max-w-[80%] sm:max-w-[70%]">
                    <div className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl rounded-tr-xs shadow-2xs text-[13px] leading-relaxed font-normal select-text">
                      {m.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1 tabular-nums font-mono">
                      {m.timestamp}
                    </span>
                  </div>
                  {/* User Avatar */}
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center justify-center text-xs font-semibold flex-shrink-0 shadow-2xs mt-0.5">
                    S
                  </div>
                </div>
              );
            }

            /* Proper Clarix AI Assistant Chat Bubble: Aligned Left, Clean Card, Full Markdown & Table Support */
            return (
              <div key={m.id} className="flex items-start gap-3 group">
                {/* Clarix AI Avatar */}
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center flex-shrink-0 p-1 mt-0.5">
                  <img
                    src="/images/clarix-ai-icon.png"
                    alt="Clarix AI"
                    className="w-5 h-5 object-contain"
                  />
                </div>

                {/* Assistant Response Bubble Card */}
                <div className="flex-1 bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-5 shadow-2xs space-y-3.5 text-[13px] text-slate-800 leading-relaxed max-w-3xl select-text">
                  {/* Bubble Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-xs text-slate-900 tracking-tight truncate">
                        {m.title || "Clarix AI Studio"}
                      </span>
                      <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-1.5 py-0.2 rounded-[3px] border border-blue-200 flex-shrink-0">
                        {selectedModel.includes("groq") ? "Groq LPU" : "Gemini AI"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-[10px] font-mono tabular-nums">{m.timestamp}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(m.id, m.text)}
                        className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        title="Salin isi jawaban"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Rendered Markdown Body */}
                  <div className="text-[13px] text-slate-800 leading-relaxed space-y-2">
                    {renderMarkdown(m.text)}
                  </div>

                  {/* Forensic Data Table if Provided */}
                  {m.tableData && m.tableData.length > 0 && (
                    <div className="mt-3 border border-slate-200 rounded-[6px] overflow-hidden shadow-2xs bg-white">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                              {Object.keys(m.tableData[0]).map((col, idx) => (
                                <th key={idx} className="px-3 py-2 border-r border-slate-200 last:border-r-0 whitespace-nowrap">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {m.tableData.map((row, rIdx) => (
                              <tr key={rIdx} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70 transition-colors">
                                {Object.values(row).map((val, cIdx) => (
                                  <td key={cIdx} className="px-3 py-2 border-r border-slate-100 last:border-r-0 text-slate-800 tabular-nums">
                                    {val}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Legal Clause Callout Box */}
                  {m.legalClause && (
                    <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-[6px] text-xs text-amber-950 flex items-start gap-2.5">
                      <Scale className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="font-semibold block text-amber-950 text-[11.5px]">
                          Landasan Hukum & Regulasi:
                        </span>
                        <span className="text-amber-800 text-[11.5px] leading-relaxed">
                          {m.legalClause}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Executive Action Recommendation Callout Box */}
                  {m.recommendation && (
                    <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-[6px] text-xs text-blue-950 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="font-semibold block text-blue-950 text-[11.5px]">
                          Rekomendasi Tindakan BPJS:
                        </span>
                        <span className="text-blue-800 text-[11.5px] leading-relaxed">
                          {m.recommendation}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* AI Thinking Animation */}
          {isProcessing && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center flex-shrink-0 p-1">
                <img
                  src="/images/clarix-ai-icon.png"
                  alt="Clarix AI"
                  className="w-5 h-5 object-contain animate-spin"
                />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-2xs flex items-center gap-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                </div>
                <span>Clarix AI sedang menelaah regulasi PMK 3/2023 & data klaim faskes...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Proper Modern Bottom Input Console */}
      <div className="border-t border-slate-200 bg-white/95 backdrop-blur-xs p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto w-full space-y-3">
          {/* Quick Prompt Suggestions Chips (The 4 Scenarios) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 flex-shrink-0">
              <Sparkles className="w-3 h-3 text-blue-600" />
              Saran Cepat:
            </span>
            {quickScenarios.map((sc) => {
              const Icon = sc.icon;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => handleSend(sc.prompt)}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200 hover:border-blue-300 rounded-full text-xs font-medium transition-all whitespace-nowrap shadow-2xs cursor-pointer flex-shrink-0 disabled:opacity-50"
                >
                  <Icon className="w-3 h-3 text-slate-500" />
                  <span>{sc.label}</span>
                </button>
              );
            })}
          </div>

          {/* Chat Input Omnibox */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all p-1.5 shadow-2xs"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Tanyakan analisis makro faskes, perbandingan tarif, atau regulasi PMK 3/2023..."
              disabled={isProcessing}
              className="flex-1 px-3 py-2 text-[13px] bg-transparent border-0 focus:outline-none text-slate-800 placeholder:text-slate-400 leading-normal"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isProcessing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
            >
              <span>Kirim</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Subtle Disclaimer Footer */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Clarix AI Studio — Ditenagai Gemini 2.0 & Groq LPU</span>
            <span>Kepatuhan PMK No. 3 Tahun 2023 & UU PDP No. 27/2022</span>
          </div>
        </div>
      </div>
    </div>
  );
}
