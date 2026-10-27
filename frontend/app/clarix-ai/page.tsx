"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { TopHeader } from "@/components/widgets/TopHeader";
import {
  CornerDownLeft,
  CornerDownRight,
  Scale,
  Copy,
  Check,
  ShieldCheck,
  RotateCcw,
  History,
  Plus,
  ArrowLeft,
  Trash2,
  Search,
  MessageSquare,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { renderMarkdown } from "@/lib/markdownUtils";
import { useUser, UserProfile } from "@/lib/userContext";

export interface StudioMessage {
  id: string;
  sender: "user" | "copilot";
  title?: string;
  text: string;
  timestamp: string;
  tableData?: Array<Record<string, string>>;
  legalClause?: string;
  recommendation?: string;
  followUps?: string[];
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  previewText: string;
  messages: StudioMessage[];
}

const STORAGE_PREFIX = "telisik_clarix_sessions_";

// Mock data generator for initial seed per user
function getInitialSeedSessions(user: UserProfile): ChatSession[] {
  if (user.id === "usr-budi") {
    return [
      {
        id: "sess-budi-1",
        userId: "usr-budi",
        title: "Evaluasi Frekuensi Kunjungan Hemodialisa Rawat Jalan",
        category: "Rawat Jalan",
        createdAt: "2026-10-27T11:20:00.000Z",
        updatedAt: "2026-10-27T11:25:00.000Z",
        previewText: "Penelaahan frekuensi tindakan hemodialisa 2x per minggu sesuai PPK Nefrologi Kemenkes...",
        messages: [
          {
            id: "budi-msg-2",
            sender: "user",
            text: "Evaluasi kepatuhan jadwal hemodialisa rawat jalan di RS Mitra Sehat bulan ini.",
            timestamp: "11:22 WIB",
          },
          {
            id: "budi-msg-3",
            sender: "copilot",
            title: "Hasil Evaluasi Kepatuhan Hemodialisa RS Mitra Sehat",
            text: `Berdasarkan sampling 45 berkas klaim hemodialisis pada RS Mitra Sehat:\n\n• **Tingkat Kepatuhan:** 93.3% berkas terverifikasi sesuai jadwal DPJP.\n• **Temuan Minor:** Ditemukan 3 berkas dengan klaim tambahan eritropoietin (EPO) tanpa bukti hasil lab hemoglobin $\le 10\\text{ g/dL}$ terbaru.`,
            timestamp: "11:25 WIB",
            tableData: [
              { Parameter: "Total Klaim HD", "Nilai / Jumlah": "45 Berkas", Status: "Tervalidasi" },
              { Parameter: "Tanpa Lab Hb Terbaru", "Nilai / Jumlah": "3 Berkas", Status: "Potensi Pending" },
              { Parameter: "Potensi Koreksi", "Nilai / Jumlah": "Rp 4.250.000", Status: "Siap Rekonsiliasi" },
            ],
            legalClause: "Keputusan Menkes RI No. HK.01.07/MENKES/1128/2022 tentang Panduan Tata Laksana Gagal Ginjal Tahap Akhir",
            recommendation: "Konfirmasi lampiran hasil laboratorium hematologi rutin sebelum menyetujui klaim tambahan EPO.",
            followUps: [
              "Cek aturan PMK 3/2023 untuk klaim tambahan EPO",
              "Bandingkan rasio klaim HD RS Mitra Sehat vs RSUD",
            ],
          },
        ],
      },
    ];
  }

  if (user.id === "usr-hendra") {
    return [
      {
        id: "sess-hendra-1",
        userId: "usr-hendra",
        title: "Investigasi Plagiarisme CPPT Lintas DPJP",
        category: "Note Cloning",
        createdAt: "2026-10-25T16:45:00.000Z",
        updatedAt: "2026-10-25T16:50:00.000Z",
        previewText: "Analisis embedding membuktikan 94%-98% kemiripan teks SOAP rekam medis...",
        messages: [
          {
            id: "hendra-msg-1",
            sender: "user",
            text: "Deteksi catatan medis yang terindikasi diduplikasi (note cloning) di RS Sejahtera Medika.",
            timestamp: "16:45 WIB",
          },
          {
            id: "hendra-msg-2",
            sender: "copilot",
            title: "Laporan Tim PK-JKN: Deteksi Duplikasi CPPT Forensik",
            text: `Analisis embedding membuktikan adanya replikasi narasi SOAP identik antar-pasien kardiologi yang ditandatangani dalam selang waktu $< 3$ menit.`,
            timestamp: "16:50 WIB",
            tableData: [
              { "Pasien A": "RM-2026-9041", "Pasien B": "RM-2026-8812", "Skor Kemiripan": "97.4%", Keterangan: "Duplikasi Total" },
              { "Pasien C": "RM-2026-9042", "Pasien B": "RM-2026-8812", "Skor Kemiripan": "95.1%", Keterangan: "Duplikasi Parsial" },
            ],
            legalClause: "Permenkes No. 24 Tahun 2022 tentang Rekam Medis Elektronik",
            recommendation: "Jadwalkan klarifikasi langsung dengan DPJP terkait pada agenda telaah tim pencegahan kecurangan.",
            followUps: [
              "Lihat rincian 8 rekam medis dengan jam visite bersamaan",
              "Klausul sanksi PMK 16/2019 terkait plagiarisme CPPT",
            ],
          },
        ],
      },
    ];
  }

  // Default for dr. Siti Aminah
  return [
    {
      id: "sess-siti-1",
      userId: "usr-siti",
      title: "Audit Upcoding Sepsis A41.9 RS Sejahtera Medika",
      category: "Upcoding Sepsis",
      createdAt: "2026-10-27T09:00:00.000Z",
      updatedAt: "2026-10-27T09:15:00.000Z",
      previewText: "Ditemukan 18 dari 22 klaim sepsis (81,8%) tidak memiliki bukti biomarker prokalsitonin...",
      messages: [
        {
          id: "siti-user-1",
          sender: "user",
          text: "Bandingkan rasio klaim sepsis (A41.9) di RS Sejahtera Medika vs RS Medika Nusantara. Berapa persen yang tidak didukung bukti lab objektif?",
          timestamp: "09:12 WIB",
        },
        {
          id: "siti-copilot-1",
          sender: "copilot",
          title: "Hasil Investigasi Makro: Anomali Diagnosis Sepsis (A41.9) Periode Q3-Q4 2026",
          text: `Berdasarkan sintesis data 120 klaim kardiovaskular pada faskes mitra cabang:\n\n• **RS Sejahtera Medika:** Ditemukan **18 dari 22 klaim sepsis (81,8%)** tidak memiliki bukti biomarker prokalsitonin (>0.5 ng/mL) dan leukosit normal, namun ditagihkan dengan kode INA-CBG severity level 3.\n• **RS Medika Nusantara:** Hanya 2 dari 15 klaim sepsis (13,3%) yang tidak memenuhi kriteria lab objektif.\n\nHal ini mengindikasikan **pola upcoding sistemik** pada RS Sejahtera Medika untuk memaksimalkan margin klaim paket kardiologi.`,
          timestamp: "09:15 WIB",
          tableData: [
            { Faskes: "RS Sejahtera Medika", "Klaim Sepsis": "22 Kasus", "Tanpa Bukti Lab": "18 Kasus (81.8%)", "Potensi Koreksi": "Rp 324.000.000" },
            { Faskes: "RS Medika Nusantara", "Klaim Sepsis": "15 Kasus", "Tanpa Bukti Lab": "2 Kasus (13.3%)", "Potensi Koreksi": "Rp 36.000.000" },
            { Faskes: "RSUD Pratama Sehat", "Klaim Sepsis": "11 Kasus", "Tanpa Bukti Lab": "1 Kasus (9.1%)", "Potensi Koreksi": "Rp 18.000.000" },
          ],
          legalClause: "PMK No. 3/2023 Bab VII Pedoman Tarif INA-CBG & PNPK Tata Laksana Sepsis Dewasa Kemenkes RI No. HK.01.07/MENKES/2020",
          recommendation: "Terbitkan Surat Peringatan Resmi Nomor 440/BPJS-KCU/X/2026 dan jadwalkan Audit Investigatif Forensik Rekam Medis ke RS Sejahtera Medika.",
          followUps: [
            "Berapa potensi koreksi tarif jika seluruh 18 klaim sepsis didowncode?",
            "Cek Regulasi PMK 3/2023 Bab VII Pedoman Sepsis",
            "Bandingkan dengan data audit RSUD Pratama Sehat",
          ],
        },
      ],
    },
    {
      id: "sess-siti-2",
      userId: "usr-siti",
      title: "Investigasi Alkes Stent DES & Angiografi Koroner",
      category: "Alkes Implan",
      createdAt: "2026-10-26T14:30:00.000Z",
      updatedAt: "2026-10-26T14:35:00.000Z",
      previewText: "Tercatat selisih akumulasi 5 unit stent DES yang ditagihkan di kuitansi namun tercatat batal/retur...",
      messages: [
        {
          id: "siti-stent-1",
          sender: "user",
          text: "Tampilkan faskes dengan frekuensi diskrepansi alkes stent tertinggi dan analisis potensi pelanggaran unbundling sesuai Permenkes 3/2023 Pasal 24.",
          timestamp: "14:30 WIB",
        },
        {
          id: "siti-stent-2",
          sender: "copilot",
          title: "Analisis Diskrepansi Alkes & Klausul Unbundling Kateterisasi",
          text: `Ditemukan pola penggelembungan alkes dan penagihan ganda tindakan diagnostik:\n\n1. **Ketidaksesuaian Fisik Stent:** Tercatat selisih akumulasi 5 unit stent DES yang ditagihkan di kuitansi namun tercatat batal/retur di laporan operasi (Nilai selisih: Rp 50.000.000).\n2. **Pelanggaran Unbundling Prosedur:** Penagihan tambahan prosedur angiografi koroner (Rp 4.500.000/kasus) yang seharusnya masuk inklusif dalam paket PTCA.`,
          timestamp: "14:35 WIB",
          tableData: [
            { Item: "Stent DES Retur Tapi Ditagih", "Jumlah Kasus": "5 Berkas", "Nilai Selisih": "Rp 50.000.000", Regulasi: "PMK 3/2023 Ps. 24" },
            { Item: "Unbundling Angiografi Terpisah", "Jumlah Kasus": "12 Berkas", "Nilai Selisih": "Rp 54.000.000", Regulasi: "PMK 3/2023 Lamp. II" },
          ],
          legalClause: "Permenkes No. 3 Tahun 2023 Pasal 24 (Verifikasi Alkes Riil) & Lampiran II (Larangan Unbundling Prosedur Inklusif)",
          recommendation: "Lakukan rekonsiliasi pemotongan tagihan otomatis sebesar Rp 104.000.000 pada Berita Acara Rekonsiliasi bulan berjalan.",
          followUps: [
            "Dasar hukum larangan klaim terpisah angiografi dan PCI",
            "Rincian Berita Acara Rekonsiliasi pemotongan tagihan",
          ],
        },
      ],
    },
  ];
}

export default function ClarixAiStudioPage() {
  const { currentUser, switchUser, availableUsers } = useUser();

  // Active view: "chat" (bubble conversation) or "history" (list list chat)
  const [activeView, setActiveView] = useState<"chat" | "history">("chat");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [inputQuery, setInputQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load and isolate sessions strictly for the current user
  useEffect(() => {
    try {
      const storageKey = `${STORAGE_PREFIX}${currentUser.id}`;
      const savedRaw = localStorage.getItem(storageKey);

      let userSessions: ChatSession[] = [];
      if (savedRaw) {
        try {
          const parsed = JSON.parse(savedRaw);
          // Hard security guard: ONLY retain sessions strictly owned by currentUser.id
          if (Array.isArray(parsed)) {
            userSessions = parsed.filter((s) => s.userId === currentUser.id);
          }
        } catch {
          userSessions = [];
        }
      }

      // If no sessions exist for this user in localStorage, seed initial sessions
      if (userSessions.length === 0) {
        userSessions = getInitialSeedSessions(currentUser);
        localStorage.setItem(storageKey, JSON.stringify(userSessions));
      }

      setSessions(userSessions);
      if (userSessions.length > 0) {
        setActiveSessionId(userSessions[0].id);
      } else {
        setActiveSessionId("");
      }
    } catch {
      // Fallback
      const seeds = getInitialSeedSessions(currentUser);
      setSessions(seeds);
      setActiveSessionId(seeds[0]?.id || "");
    }
  }, [currentUser.id]);

  // Persist sessions whenever they change for this specific user
  const saveSessionsForUser = useCallback(
    (newSessions: ChatSession[]) => {
      // Security enforcement: discard any session that doesn't match currentUser.id
      const strictlyFiltered = newSessions.filter((s) => s.userId === currentUser.id);
      setSessions(strictlyFiltered);
      try {
        const storageKey = `${STORAGE_PREFIX}${currentUser.id}`;
        localStorage.setItem(storageKey, JSON.stringify(strictlyFiltered));
      } catch {
        // Ignore storage errors
      }
    },
    [currentUser.id]
  );

  // Current active session
  const activeSession = useMemo(() => {
    return sessions.find((s) => s.id === activeSessionId) || sessions[0] || null;
  }, [sessions, activeSessionId]);

  const messages = useMemo(() => {
    return activeSession?.messages || [];
  }, [activeSession]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (activeView === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isProcessing, activeView]);

  // Focus input when entering chat view
  useEffect(() => {
    if (activeView === "chat") {
      inputRef.current?.focus();
    }
  }, [activeView]);

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Start a fresh, clean chat session for the current user
  const handleStartNewChat = () => {
    const newSessionId = `sess-${currentUser.id}-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      userId: currentUser.id,
      title: "Sesi Investigasi Baru",
      category: "Konsultasi Umum",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      previewText: "Mulai percakapan baru...",
      messages: [],
    };

    const updated = [newSession, ...sessions];
    saveSessionsForUser(updated);
    setActiveSessionId(newSessionId);
    setActiveView("chat");
  };

  // Switch to a selected session from the history list
  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setActiveView("chat");
  };

  // Delete a session from history
  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== sessionId);
    saveSessionsForUser(updated);
    if (activeSessionId === sessionId) {
      if (updated.length > 0) {
        setActiveSessionId(updated[0].id);
      } else {
        handleStartNewChat();
      }
    }
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

    // Prepare updated messages for active session
    const currentMsgs = activeSession?.messages || [];
    const withUser = [...currentMsgs, userMsg];

    // Auto title if session is titled default
    const currentTitle = activeSession?.title || "Sesi Investigasi Baru";
    const newTitle =
      currentTitle === "Sesi Investigasi Baru" || currentTitle.startsWith("Percakapan Direset")
        ? query.length > 45
          ? query.slice(0, 45) + "..."
          : query
        : currentTitle;

    // Determine category
    let derivedCategory = activeSession?.category || "Investigasi";
    const lowerQ = query.toLowerCase();
    if (lowerQ.includes("sepsis")) derivedCategory = "Upcoding Sepsis";
    else if (lowerQ.includes("stent") || lowerQ.includes("alkes")) derivedCategory = "Alkes Implan";
    else if (lowerQ.includes("readmisi")) derivedCategory = "Readmisi <= 30 Hari";
    else if (lowerQ.includes("kloning") || lowerQ.includes("soap")) derivedCategory = "Kloning RME";

    // Optimistically update
    const updatedSessionUser: ChatSession = {
      ...(activeSession || {
        id: `sess-${currentUser.id}-${Date.now()}`,
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
      }),
      id: activeSession?.id || `sess-${currentUser.id}-${Date.now()}`,
      userId: currentUser.id,
      title: newTitle,
      category: derivedCategory,
      updatedAt: new Date().toISOString(),
      previewText: query,
      messages: withUser,
    };

    const newSessionsList = sessions.map((s) =>
      s.id === updatedSessionUser.id ? updatedSessionUser : s
    );
    if (!sessions.some((s) => s.id === updatedSessionUser.id)) {
      newSessionsList.unshift(updatedSessionUser);
    }
    saveSessionsForUser(newSessionsList);

    setInputQuery("");
    setIsProcessing(true);

    let responseMsg: StudioMessage | null = null;

    // 1. Try Live Inference via Backend API (Gemini Flash)
    try {
      const res = await fetch("http://localhost:8000/api/v1/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          pathname: "/clarix-ai",
          screenContext: {
            pathname: "/clarix-ai",
            activeUser: currentUser,
            visibleMetrics: {
              potentialSavings: "Rp 142.500.000",
              examinedClaims: "24 Klaim Diperiksa Bulan Ini",
            },
            topic: derivedCategory,
            modelName: "Gemini 2.5 Flash",
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.answerMarkdown) {
          responseMsg = {
            id: `cop-${Date.now()}`,
            sender: "copilot",
            title: `Hasil Analisis Forensik — ${derivedCategory}`,
            text: data.answerMarkdown,
            timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
            legalClause: "Permenkes No. 3 Tahun 2023 & Regulasi BPJS Kesehatan",
            recommendation: "Gunakan data ini sebagai acuan mediko-legal saat menerbitkan berita acara rekonsiliasi.",
            followUps: [
              "Cek rincian regulasi PMK 3/2023",
              "Bandingkan tren klaim faskes mitra bulan berjalan",
            ],
          };
        }
      }
    } catch (err) {
      console.warn("[ClarixStudio] Backend API unreachable, falling back to local scenario handler:", err);
    }

    // 2. Local Fallback with Context Grounding
    if (!responseMsg) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (lowerQ.includes("siapa") && (lowerQ.includes("akun") || lowerQ.includes("verifikator") || lowerQ.includes("login") || lowerQ.includes("saya"))) {
        responseMsg = {
          id: `cop-${Date.now()}`,
          sender: "copilot",
          title: "Informasi Akun Verifikator Aktif",
          text: `Akun verifikator yang sedang aktif di sesi layar studio Anda saat ini adalah **${currentUser.name}** (${currentUser.role}).`,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
          legalClause: "UU PDP No. 27/2022 & Akses Terotentikasi BPJS Kesehatan",
          recommendation: "Sesi percakapan dan riwayat investigasi Anda tersimpan secara privat khusus untuk akun ini.",
        };
      } else if (lowerQ.includes("sepsis") || lowerQ.includes("a41.9")) {
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
        followUps: [
          "Berapa potensi koreksi tarif jika seluruh 18 klaim sepsis didowncode?",
          "Cek Regulasi PMK 3/2023 Bab VII Pedoman Sepsis",
          "Bandingkan dengan data audit RSUD Pratama Sehat",
        ],
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
        followUps: [
          "Dasar hukum larangan klaim terpisah angiografi dan PCI",
          "Rincian Berita Acara Rekonsiliasi pemotongan tagihan",
        ],
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
        followUps: [
          "Kriteria readmisi terencana vs tidak terencana PMK 3/2023",
          "Apakah 11 kasus dr. Hendra Sp.JP menggunakan nomor SEP baru?",
        ],
      };
    } else if (lowerQ.includes("kloning") || lowerQ.includes("cloning") || lowerQ.includes("cppt") || lowerQ.includes("soap")) {
      responseMsg = {
        id: `cop-${Date.now()}`,
        sender: "copilot",
        title: "Audit Integritas RME: Deteksi Duplikasi Catatan Medis (Note Cloning)",
        text: `Melalui analisis embedding semantik teks CPPT (*representasi vektor semantik TELISIK*), ditemukan indikasi plagiarisme rekam medis antar-pasien:\n\n• **Tingkat Kemiripan:** 94% – 98% kesamaan teks narasi SOAP harfiah tanpa penyesuaian tanda vital objektif.\n• **Temuan Kritis:** Jam visite tercatat berurutan dalam selang 2 menit untuk 8 pasien rawat inap intensif.`,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
        tableData: [
          { "Nomor RME Pasien": "RM-2026-9041", "Berkas Sumber (Donor)": "RM-2026-8812", "Skor Kemiripan": "97.4%", "Status Temuan": "Duplikasi Total" },
          { "Nomor RME Pasien": "RM-2026-9042", "Berkas Sumber (Donor)": "RM-2026-8812", "Skor Kemiripan": "95.1%", "Status Temuan": "Duplikasi Redaksional" },
          { "Nomor RME Pasien": "RM-2026-9049", "Berkas Sumber (Donor)": "RM-2026-8790", "Skor Kemiripan": "94.8%", "Status Temuan": "Duplikasi Parsial" },
        ],
        legalClause: "Permenkes No. 24 Tahun 2022 tentang Rekam Medis & Permenkes No. 16 Tahun 2019 (Pencegahan Kecurangan JKN)",
        recommendation: "Eskalasikan ke Tim Pencegahan Kecurangan JKN (PK-JKN) Kantor Cabang untuk verifikasi faktual tanda tangan dokter.",
        followUps: [
          "Bagaimana metode embedding semantik membuktikan plagiarisme?",
          "Tampilkan daftar 8 berkas dengan waktu visite < 2 menit",
        ],
      };
    } else {
      responseMsg = {
        id: `cop-${Date.now()}`,
        sender: "copilot",
        title: "Hasil Sintesis Penelusuran Regulasi & Rekam Medis",
        text: `Clarix AI telah menganalisis kueri Anda (${query}) berpedoman pada regulasi **Permenkes No. 3/2023**, standar koding ICD-10 & ICD-9-CM, serta basis data klaim aktif pada cabang.\n\nSistem merekomendasikan verifikator untuk mengedepankan pembuktian berbasis kutipan verbatim rekam medis guna menjamin akuntabilitas mediko-legal yang kokoh saat penerbitan naskah dinas atau rekonsiliasi.`,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
        legalClause: "UU No. 24 Tahun 2011 tentang Badan Penyelenggara Jaminan Sosial & Permenkes No. 3 Tahun 2023",
        recommendation: "Gunakan menu Triage dan Ruang Telaah untuk meninjau berkas individual yang terkait dengan temuan ini.",
        followUps: [
          "Kenapa Sepsis dianulir?",
          "Cek Regulasi PMK 3/2023",
        ],
      };
    }
  }

    const finalResponseMsg: StudioMessage = responseMsg || {
      id: `cop-${Date.now()}`,
      sender: "copilot",
      title: "Hasil Sintesis Penelusuran",
      text: "Sistem telah menganalisis pertanyaan Anda berpedoman pada regulasi JKN.",
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
    };

    const finalSession: ChatSession = {
      ...updatedSessionUser,
      messages: [...withUser, finalResponseMsg],
      updatedAt: new Date().toISOString(),
    };

    const finalSessionsList = sessions.map((s) =>
      s.id === finalSession.id ? finalSession : s
    );
    if (!finalSessionsList.some((s) => s.id === finalSession.id)) {
      finalSessionsList.unshift(finalSession);
    }
    saveSessionsForUser(finalSessionsList);
    setIsProcessing(false);
  };

  // Filtered sessions for history view
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      // 1. Mandatory user identity match (Double-check guard)
      if (s.userId !== currentUser.id) return false;

      // 2. Search keyword
      if (searchHistory.trim()) {
        const query = searchHistory.toLowerCase();
        const matchTitle = s.title.toLowerCase().includes(query);
        const matchPreview = s.previewText.toLowerCase().includes(query);
        const matchMsg = s.messages.some((m) => m.text.toLowerCase().includes(query));
        if (!matchTitle && !matchPreview && !matchMsg) return false;
      }

      // 3. Category filter
      if (selectedCategory !== "Semua") {
        if (s.category !== selectedCategory) return false;
      }

      return true;
    });
  }, [sessions, currentUser.id, searchHistory, selectedCategory]);

  const categories = ["Semua", "Upcoding Sepsis", "Alkes Implan", "Readmisi <= 30 Hari", "Kloning RME", "Rawat Jalan", "Konsultasi Umum"];

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-50/50">
      {/* Top Header */}
      <TopHeader
        title="Clarix AI Studio"
        subtitle="Investigasi Forensik & Regulasi JKN"
        rightActions={
          <div className="flex items-center gap-2">
            {/* Toggle View Button: Riwayat Chat / Kembali ke Chat */}
            {activeView === "chat" ? (
              <button
                type="button"
                onClick={() => setActiveView("history")}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-[4px] transition-colors shadow-2xs cursor-pointer"
                title="Buka riwayat percakapan akun ini"
              >
                <History className="w-3.5 h-3.5 text-slate-500" />
                <span>Riwayat Chat</span>
                <span className="bg-slate-100 text-slate-600 text-[10.5px] font-bold px-1.5 py-0.2 rounded-full border border-slate-200">
                  {sessions.length}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveView("chat")}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 border border-blue-200 hover:bg-blue-100/70 rounded-[4px] transition-colors shadow-2xs cursor-pointer"
                title="Kembali ke jendela percakapan aktif"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Chat</span>
              </button>
            )}

            {/* Chat Baru Button */}
            <button
              type="button"
              onClick={handleStartNewChat}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-[4px] transition-colors shadow-2xs cursor-pointer"
              title="Mulai sesi investigasi percakapan baru"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chat Baru</span>
            </button>
          </div>
        }
      />

      {/* VIEW 1: HISTORY VIEW (Saat dipencet, bubble chat hilang digantikan list list chat) */}
      {activeView === "history" ? (
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto w-full space-y-4">
            {/* Filter Toolbar: Search & Category Tags */}
            <div className="space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchHistory}
                  onChange={(e) => setSearchHistory(e.target.value)}
                  placeholder="Cari topik investigasi, nama RS, atau kata kunci regulasi..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-2xs"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer",
                      selectedCategory === cat
                        ? "bg-blue-600 text-white font-semibold shadow-2xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List List Chat */}
            <div className="space-y-3">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((s) => {
                  const isCurrentActive = s.id === activeSessionId;
                  const dateFormatted = new Date(s.updatedAt || s.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={s.id}
                      onClick={() => handleSelectSession(s.id)}
                      className={cn(
                        "group bg-white border rounded-xl p-4 transition-all shadow-2xs cursor-pointer flex items-start justify-between gap-4 relative",
                        isCurrentActive
                          ? "border-blue-500 ring-1 ring-blue-500/20 bg-blue-50/10"
                          : "border-slate-200 hover:border-blue-300 hover:shadow-xs"
                      )}
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border",
                            isCurrentActive
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-slate-50 text-slate-600 border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200"
                          )}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </div>

                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-[13px] font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                              {s.title}
                            </h3>
                            {isCurrentActive && (
                              <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded flex-shrink-0">
                                Sesi Aktif
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {s.previewText || (s.messages[s.messages.length - 1]?.text ?? "Tidak ada pratinjau")}
                          </p>

                          {/* Metadata row */}
                          <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1 font-mono">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {dateFormatted} WIB
                            </span>
                            <span>•</span>
                            <span className="font-medium text-slate-600">
                              {s.messages.length} pesan
                            </span>
                            {s.category && (
                              <>
                                <span>•</span>
                                <span className="bg-slate-100 text-slate-600 px-2 py-0.2 rounded font-medium text-[10.5px]">
                                  {s.category}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSession(e, s.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Hapus percakapan dari riwayat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Empty state */
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3 shadow-2xs">
                  <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Tidak Ada Riwayat Percakapan
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      {searchHistory
                        ? `Tidak ada sesi investigasi yang cocok dengan kata kunci "${searchHistory}".`
                        : `Belum ada percakapan tersimpan untuk akun ${currentUser.name}. Mulai konsultasi investigasi baru sekarang.`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleStartNewChat}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Mulai Chat Baru</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* VIEW 2: ACTIVE CHAT VIEW (Bubble chat proper) */
        <>
          {/* Main Single-Pane Chat Stream */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-4xl mx-auto w-full space-y-6">
              {messages.length === 0 ? (
                <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center px-4 py-20 space-y-3 select-none">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-2">
                    <img
                      src="/images/clarix-ai-icon.png"
                      alt="Clarix AI"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-slate-800">
                      Konsol Investigasi Clarix AI
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Mulai sesi baru dengan mengajukan pertanyaan atau kueri investigasi klaim di bawah.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((m) => {
                const isUser = m.sender === "user";

                if (isUser) {
                  return (
                    /* User Chat Bubble: Aligned Right, User Avatar Aligned to Top, Tail on Right */
                    <div key={m.id} className="flex justify-end items-start gap-2.5 group">
                      <div className="flex flex-col items-end max-w-[80%] sm:max-w-[70%]">
                        <div className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl rounded-tr-xs shadow-2xs text-[13px] leading-relaxed font-normal select-text">
                          {m.text}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1 tabular-nums font-mono">
                          {m.timestamp}
                        </span>
                      </div>
                      {/* Current User Avatar */}
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 shadow-2xs mt-0.5 border",
                          currentUser.avatarBg,
                          currentUser.avatarText,
                          currentUser.avatarBorder
                        )}
                        title={currentUser.name}
                      >
                        {currentUser.initial}
                      </div>
                    </div>
                  );
                }

                /* Clarix AI Assistant Bubble */
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

                      {/* Follow-up Action Suggestions (Matching Clarix AI Copilot in Corner) */}
                      {m.followUps && m.followUps.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 flex flex-col items-start gap-1">
                          {m.followUps.map((fu, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSend(fu)}
                              disabled={isProcessing}
                              className="inline-flex items-center gap-1.5 py-1 px-1.5 -ml-1 text-xs font-medium text-blue-700 hover:text-blue-800 hover:bg-slate-100/80 rounded transition-colors text-left cursor-pointer group disabled:opacity-50"
                            >
                              <CornerDownRight className="w-3.5 h-3.5 text-blue-600 group-hover:text-blue-800 transition-colors flex-shrink-0" />
                              <span>{fu}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }))}

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

          {/* Bottom Input Console */}
          <div className="border-t border-slate-200 bg-white/95 backdrop-blur-xs p-4 flex-shrink-0">
            <div className="max-w-4xl mx-auto w-full">
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
            </div>
          </div>
        </>
      )}
    </div>
  );
}
