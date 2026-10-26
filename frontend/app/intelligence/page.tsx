"use client";

import React, { useState } from "react";
import { ClarixSidebar } from "@/components/widgets/ClarixSidebar";
import { TopHeader } from "@/components/widgets/TopHeader";
import {
  Sparkles,
  Bot,
  Send,
  CornerDownLeft,
  Scale,
  Building2,
  FileText,
  TrendingUp,
  Copy,
  Clock,
  Download,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function IntelligenceStudioPage() {
  const [selectedScenario, setSelectedScenario] = useState("sepsis-upcoding");
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-pro");
  const [inputQuery, setInputQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [messages, setMessages] = useState<StudioMessage[]>([
    {
      id: "initial-1",
      sender: "copilot",
      title: "Clarix AI Studio Diaktifkan — Mode Investigasi Makro",
      text: "Selamat datang di **Clarix AI Studio**. Di sini Anda dapat melakukan analisis forensik lintas-faskes, membedah korelasi klaim antar-pasien, melakukan uji komparasi regulasi Permenkes No. 3/2023, serta mensimulasikan dampak efisiensi beban dana JKN secara makro.",
      timestamp: "10:30 WIB",
      legalClause: "Permenkes No. 3/2023 Lampiran II (Pedoman INA-CBG & Standar Tarif JKN)",
      recommendation: "Pilih skenario investigasi cepat di bilah kiri atau masukkan pertanyaan kustom untuk memulai analisis.",
    },
  ]);

  const scenarios = [
    {
      id: "sepsis-upcoding",
      title: "Audit Upcoding Sepsis Lintas-RS",
      desc: "Menelusuri klaim dengan komplikasi A41.9 yang tidak didukung bukti lab prokalsitonin.",
      icon: TrendingUp,
      prompt: "Bandingkan rasio klaim sepsis (A41.9) di RS Sejahtera Medika vs RS Medika Nusantara. Berapa persen yang tidak didukung bukti lab objektif?",
    },
    {
      id: "stent-unbundling",
      title: "Investigasi Alkes Stent & Angiografi",
      desc: "Mendeteksi selisih fisik stent dan penagihan terpisah paket kateterisasi.",
      icon: FileText,
      prompt: "Tampilkan faskes dengan frekuensi diskrepansi alkes stent tertinggi dan analisis potensi pelanggaran unbundling sesuai Permenkes 3/2023 Pasal 24.",
    },
    {
      id: "readmission-audit",
      title: "Pola Readmisi Terencana <= 30 Hari",
      desc: "Memindai pola pemecahan episode rawat inap terencana oleh DPJP yang sama.",
      icon: Clock,
      prompt: "Analisis potensi fragmentasi episode rawat inap pada pasien kardiologi yang kembali dirawat dalam kurun waktu 15–20 hari pasca pulang.",
    },
    {
      id: "note-cloning",
      title: "Deteksi Kloning Rekam Medis (94%+)",
      desc: "Pelacakan kesamaan semantik teks SOAP antar-pasien untuk membuktikan plagiarisme rekam medis.",
      icon: Copy,
      prompt: "Tampilkan dokter spesialis dengan indeks kemiripan catatan medis tertinggi (>90%) dan daftar nomor rekam medis yang terindikasi diduplikasi.",
    },
  ];

  const handleSelectScenario = (sc: typeof scenarios[0]) => {
    setSelectedScenario(sc.id);
    handleSend(sc.prompt);
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

    // Simulate multi-step deep reasoning
    await new Promise((resolve) => setTimeout(resolve, 800));

    let responseMsg: StudioMessage;

    if (query.toLowerCase().includes("sepsis")) {
      responseMsg = {
        id: `cop-${Date.now()}`,
        sender: "copilot",
        title: "Hasil Investigasi Makro: Anomali Diagnosis Sepsis (A41.9) Periode Q3-Q4 2026",
        text: `Berdasarkan sintesis data 120 klaim kardiovaskular pada faskes mitra cabang:\n\n• **RS Sejahtera Medika:** Ditemukan **18 dari 22 klaim sepsis (81,8%)** tidak memiliki bukti biomarker prokalsitonin (>0.5 ng/mL) dan leukosit normal, namun ditagihkan dengan kode INA-CBG severity level 3.\n• **RS Medika Nusantara:** Hanya 2 dari 15 klaim sepsis (13,3%) yang tidak memenuhi kriteria lab.\n\nHal ini mengindikasikan **pola upcoding sistemik** pada RS Sejahtera Medika untuk memaksimalkan margin klaim paket kardiologi.`,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
        tableData: [
          { Faskes: "RS Sejahtera Medika", "Klaim Sepsis": "22 Kasus", "Tanpa Bukti Lab": "18 Kasus (81.8%)", "Potensi Koreksi": "Rp 324.000.000" },
          { Faskes: "RS Medika Nusantara", "Klaim Sepsis": "15 Kasus", "Tanpa Bukti Lab": "2 Kasus (13.3%)", "Potensi Koreksi": "Rp 36.000.000" },
          { Faskes: "RSUD Pratama Sehat", "Klaim Sepsis": "11 Kasus", "Tanpa Bukti Lab": "1 Kasus (9.1%)", "Potensi Koreksi": "Rp 18.000.000" },
        ],
        legalClause: "PMK No. 3/2023 Bab VII Pedoman Tarif INA-CBG & PNPK Tata Laksana Sepsis Dewasa Kemenkes RI No. HK.01.07/MENKES/2020",
        recommendation: "Terbitkan Surat Peringatan Resmi Nomor 440/BPJS-KCU/X/2026 dan jadwalkan Audit Investigatif Forensik Rekam Medis ke RS Sejahtera Medika.",
      };
    } else if (query.toLowerCase().includes("stent") || query.toLowerCase().includes("alkes")) {
      responseMsg = {
        id: `cop-${Date.now()}`,
        sender: "copilot",
        title: "Analisis Diskrepansi Alkes & Klausul Unbundling Kateterisasi",
        text: `Ditemukan pola penggelembungan alkes dan penagihan ganda tindakan diagnostik:\n\n1. **Ketidaksesuaian Fisik Stent:** Tercatat selisih akumulasi 5 unit stent DES yang ditagihkan di kuitansi namun tercatat batal/retur di laporan operasi (Nilai selisih: Rp 50.000.000).\n2. **Pelanggaran Unbundling Prosedur:** Penagihan tambahan prosedur angiografi koroner (Rp 4.500.000/kasus) yang seharusnya masuk dalam paket PTCA.`,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
        tableData: [
          { Item: "Stent DES Retur Tapi Ditagih", "Jumlah Kasus": "5 Berkas", "Nilai Selisih": "Rp 50.000.000", Regulasi: "PMK 3/2023 Ps. 24" },
          { Item: "Unbundling Angiografi Terpisah", "Jumlah Kasus": "12 Berkas", "Nilai Selisih": "Rp 54.000.000", Regulasi: "PMK 3/2023 Lamp. II" },
        ],
        legalClause: "Permenkes No. 3 Tahun 2023 Pasal 24 (Verifikasi Alkes Riil) & Lampiran II (Larangan Unbundling)",
        recommendation: "Lakukan rekonsiliasi pemotongan tagihan otomatis sebesar Rp 104.000.000 pada pencairan klaim bulan berjalan.",
      };
    } else {
      responseMsg = {
        id: `cop-${Date.now()}`,
        sender: "copilot",
        title: "Hasil Sintesis Penelusuran Regulasi & Rekam Medis",
        text: `Clarix AI telah menganalisis parameter yang Anda ajukan dengan memadukan basis data Permenkes No. 3/2023, standar koding ICD-10/ICD-9-CM, serta korpus rekam medis aktif.\n\nSistem merekomendasikan verifikator untuk mengedepankan pembuktian berbasis verbatim teks rekam medis guna menjamin hasil audit berkekuatan hukum tetap.`,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
        legalClause: "UU No. 24 Tahun 2011 tentang BPJS & Permenkes No. 3 Tahun 2023",
        recommendation: "Gunakan menu Triage dan Ruang Telaah untuk meninjau berkas individual yang terkait.",
      };
    }

    setMessages((prev) => [...prev, responseMsg]);
    setIsProcessing(false);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-100">
      <TopHeader
        title="Clarix AI Studio"
        subtitle="Pusat Investigasi Makro & Analisis Regulasi JKN"
          rightActions={
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">Model Aktif:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-[4px] px-2 py-1 font-medium text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra-Fast)</option>
                <option value="groq-llama-3.3-70b">Groq LLaMA 3.3 70B (High-Throughput)</option>
              </select>
            </div>
          }
        />

        {/* 3-Column Studio Workspace */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left Panel: Skenario Investigasi Cepat */}
          <div className="w-80 border-r border-slate-200 bg-white flex flex-col overflow-hidden">
            <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-semibold text-slate-900">
                  Modul Investigasi Cepat
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">4 Presets</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {scenarios.map((sc) => {
                const Icon = sc.icon;
                const isSelected = selectedScenario === sc.id;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => handleSelectScenario(sc)}
                    className={cn(
                      "w-full text-left p-3 rounded-[6px] border transition-all space-y-1 group cursor-pointer",
                      isSelected
                        ? "bg-blue-50/70 border-blue-300 shadow-2xs"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-[4px] flex items-center justify-center flex-shrink-0 text-xs",
                          isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 leading-snug">
                        {sc.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed pl-8">
                      {sc.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Faskes Filter Summary */}
            <div className="p-3.5 border-t border-slate-200 bg-slate-50/60 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Cakupan Faskes:</span>
                <span className="font-semibold text-slate-800">4 RS Mitra Cabang</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Klaim Tervalidasi:</span>
                <span className="font-semibold text-slate-800 tabular-nums">48 Berkas RME</span>
              </div>
            </div>
          </div>

          {/* Center Panel: Interactive Chat & Forensic Canvas */}
          <div className="flex-1 flex flex-col bg-slate-50/40 overflow-hidden">
            {/* Messages Canvas */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((m) => {
                const isUser = m.sender === "user";
                if (isUser) {
                  return (
                    <div key={m.id} className="flex justify-end">
                      <div className="max-w-xl bg-blue-600 text-white p-3.5 rounded-[6px] rounded-br-xs shadow-2xs text-xs leading-relaxed font-normal">
                        {m.text}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={m.id} className="max-w-3xl space-y-3">
                    <div className="bg-white border border-slate-200 rounded-[6px] p-4 shadow-2xs space-y-3">
                      {m.title && (
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                          <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                          <h4 className="text-xs font-bold text-slate-900">{m.title}</h4>
                          <span className="text-[10px] text-slate-400 font-mono ml-auto">{m.timestamp}</span>
                        </div>
                      )}

                      <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                        {m.text}
                      </div>

                      {/* Forensic Table Output if Available */}
                      {m.tableData && m.tableData.length > 0 && (
                        <div className="border border-slate-200 rounded-[4px] overflow-hidden">
                          <table className="w-full text-left text-[11px] border-collapse">
                            <thead>
                              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold">
                                {Object.keys(m.tableData[0]).map((col, idx) => (
                                  <th key={idx} className="p-2 border-r border-slate-200 last:border-r-0">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {m.tableData.map((row, rIdx) => (
                                <tr key={rIdx} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
                                  {Object.values(row).map((val, cIdx) => (
                                    <td key={cIdx} className="p-2 border-r border-slate-100 last:border-r-0 text-slate-800 tabular-nums">
                                      {val}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Legal & Regulatory Badge */}
                      {m.legalClause && (
                        <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-[4px] text-[11px] text-amber-900 flex items-start gap-2">
                          <Scale className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold block text-amber-950">Landasan Hukum:</span>
                            <span className="text-amber-800">{m.legalClause}</span>
                          </div>
                        </div>
                      )}

                      {/* Executive Recommendation */}
                      {m.recommendation && (
                        <div className="p-2.5 bg-blue-50/60 border border-blue-200/80 rounded-[4px] text-[11px] text-blue-950 flex items-start gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-700 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold block text-blue-950">Rekomendasi Tindakan BPJS:</span>
                            <span className="text-blue-800">{m.recommendation}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isProcessing && (
                <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 p-3 rounded-[6px] border border-blue-200 animate-pulse w-fit">
                  <Bot className="w-4 h-4 animate-spin" />
                  <span>Clarix AI sedang menjalankan penalaran makro lintas-faskes...</span>
                </div>
              )}
            </div>

            {/* Bottom Input Area */}
            <div className="p-4 bg-white border-t border-slate-200 flex-shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ketik instruksi audit makro (misal: 'Bandingkan rasio unbundling stent kardiologi antar RS')..."
                  className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-[4px] focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isProcessing}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-[4px] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Kirim</span>
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Panel: Regulatory & Fraud Knowledge Explorer */}
          <div className="w-80 border-l border-slate-200 bg-white flex flex-col overflow-hidden">
            <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <Scale className="w-3.5 h-3.5 text-slate-700" />
              <span className="text-xs font-semibold text-slate-900">
                Pusat Regulasi & Aturan Koding
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              <div className="p-3 rounded-[4px] border border-slate-200 bg-slate-50/50 space-y-1.5">
                <span className="font-semibold text-slate-800 text-[11.5px] block">
                  Permenkes No. 3 Tahun 2023
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Standar Tarif Pelayanan Kesehatan dalam Penyelenggaraan Program Jaminan Kesehatan Nasional (INA-CBG & Kapitasi).
                </p>
                <div className="pt-1 text-[10.5px] text-blue-700 font-semibold space-y-0.5">
                  <div>• Pasal 24: Verifikasi Riil Alkes Implan</div>
                  <div>• Pasal 28: Klausul Readmisi ≤ 30 Hari</div>
                  <div>• Lampiran II: Larangan Unbundling Koding</div>
                </div>
              </div>

              <div className="p-3 rounded-[4px] border border-slate-200 bg-slate-50/50 space-y-1.5">
                <span className="font-semibold text-slate-800 text-[11.5px] block">
                  Permenkes No. 24 Tahun 2022
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Tata Kelola Integritas Rekam Medis Elektronik (RME). Melarang duplikasi teks SOAP fiktif tanpa pemeriksaan fisik riil.
                </p>
              </div>

              <div className="p-3 rounded-[4px] border border-slate-200 bg-slate-50/50 space-y-1.5">
                <span className="font-semibold text-slate-800 text-[11.5px] block">
                  PNPK Sepsis Kemenkes 2020
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Kriteria penegakan diagnosis Sepsis (A41.9): wajib terdapat bukti infeksi, leukositosis/leukopenia, prokalsitonin {">"} 0.5 ng/mL, dan disfungsi organ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
