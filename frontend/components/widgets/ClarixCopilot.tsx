"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Send,
  CornerDownLeft,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
  FileText,
  ExternalLink,
  Bot,
  User,
  Scale,
  RefreshCw,
  Sliders,
  ShieldAlert,
} from "lucide-react";
import { useCopilot, CopilotMessage } from "@/lib/copilotContext";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { renderMarkdown } from "@/lib/markdownUtils";

export function ClarixCopilot() {
  const {
    isOpen,
    setIsOpen,
    toggleOpen,
    activeClaim,
    messages,
    isThinking,
    sendMessage,
    clearMessages,
    executeAction,
  } = useCopilot();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    const text = input;
    setInput("");
    sendMessage(text);
  };

  const handleChipClick = (promptText: string) => {
    sendMessage(promptText);
  };

  // Dynamic suggested prompts based on active route
  const getSuggestedChips = () => {
    if (pathname.includes("/dossier")) {
      return [
        "Kenapa Sepsis dianulir?",
        "Cek selisih stent alkes",
        "Penjelasan readmisi 15 hari",
        "Dasar hukum PMK 3/2023",
      ];
    }
    if (pathname.includes("/benchmark")) {
      return [
        "Berapa skor presisi & recall model?",
        "Jelaskan uji grounding kutipan verbatim",
        "Bagaimana mitigasi false positive?",
      ];
    }
    if (pathname.includes("/audit-trail")) {
      return [
        "Ringkas log audit bulan ini",
        "Bagaimana kepatuhan sanitasi data UU PDP?",
      ];
    }
    return [
      "Prioritaskan 3 klaim risiko tertinggi",
      "RS mana yang anomali alkesnya terbanyak?",
      "Panduan cara pakai antrean triase",
    ];
  };

  return (
    <>
      {/* Floating Action Trigger Button (Bottom-Right) */}
      {!isOpen && (
        <button
          type="button"
          onClick={toggleOpen}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-3.5 py-2 bg-white hover:bg-slate-50/90 text-slate-800 hover:text-blue-700 rounded-[8px] shadow-lg shadow-blue-500/15 hover:shadow-xl hover:shadow-blue-500/25 transition-all border border-blue-200 hover:border-blue-300 font-medium text-xs group cursor-pointer"
          title="Buka Asisten Clarix AI"
          aria-label="Buka Asisten Clarix AI"
        >
          <img
            src="/images/clarix-ai-icon.png"
            alt="Clarix AI"
            className="w-6 h-6 flex-shrink-0 object-contain drop-shadow-2xs group-hover:scale-105 transition-transform"
          />
          <span className="font-semibold tracking-tight text-slate-800 group-hover:text-blue-700 transition-colors">
            Tanya Clarix AI
          </span>
        </button>
      )}

      {/* Docked Floating Copilot Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[430px] h-[580px] max-h-[88vh] bg-white rounded-[6px] border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Copilot Header */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src="/images/clarix-ai-icon.png"
                alt="Clarix AI"
                className="w-7 h-7 flex-shrink-0 object-contain"
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    Clarix AI Copilot
                  </span>
                </div>
                <span className="text-[10.5px] text-slate-500 truncate">
                  {pathname.includes("/dossier") && activeClaim
                    ? `Konteks: ${activeClaim.id} · ${activeClaim.hospitalName}`
                    : pathname.includes("/benchmark")
                    ? "Konteks: Benchmark Evaluation Suite"
                    : pathname.includes("/audit-trail")
                    ? "Konteks: Audit Trail & Arsip"
                    : "Konteks: Triage Antrean Klaim"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={clearMessages}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
                title="Bersihkan riwayat percakapan"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={toggleOpen}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
                title="Tutup asisten"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/40 text-xs">
            {messages.map((msg, idx) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isFirst={idx === 0}
                onExecuteAction={executeAction}
              />
            ))}

            {/* Thinking / Inferencing Indicator */}
            {isThinking && (
              <div className="flex items-start gap-2 bg-white p-3 rounded-[6px] border border-blue-100 shadow-2xs animate-pulse">
                <img
                  src="/images/clarix-ai-icon.png"
                  alt="Clarix AI"
                  className="w-4 h-4 flex-shrink-0 object-contain mt-0.5"
                />
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-blue-900 block">
                    Clarix AI sedang menelaah rekam medis & regulasi...
                  </span>
                  <span className="text-[10.5px] text-slate-400">
                    Memeriksa kriteria lab, laporan bedah, dan klausul Permenkes 3/2023
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompt Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto select-none flex-shrink-0 scrollbar-none">
            {getSuggestedChips().map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-200 rounded-full whitespace-nowrap transition-colors flex-shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 flex-shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan temuan bukti, regulasi, atau panduan UI..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-[4px] focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-[4px] transition-colors flex-shrink-0 cursor-pointer disabled:cursor-not-allowed shadow-2xs"
              title="Kirim pertanyaan (Enter)"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function MessageBubble({
  message,
  onExecuteAction,
  isFirst,
}: {
  message: CopilotMessage;
  onExecuteAction: (action: any) => void;
  isFirst?: boolean;
}) {
  const [showReasoning, setShowReasoning] = useState(false);
  const isUser = message.sender === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-blue-600 text-white px-3.5 py-2 rounded-[6px] rounded-br-xs shadow-2xs text-xs font-normal leading-relaxed">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 max-w-[95%]">
      <img
        src="/images/clarix-ai-icon.png"
        alt="Clarix AI"
        className="w-6 h-6 flex-shrink-0 mt-0.5 object-contain"
      />

      <div className="flex-1 bg-white border border-slate-200 rounded-[6px] p-3 shadow-2xs space-y-2.5">
        {/* Accordion Reasoning Steps - explicitly hidden for first bubble */}
        {!isFirst && message.id !== "msg-welcome" && message.reasoningSteps && message.reasoningSteps.length > 0 && (
          <div className="border border-slate-100 rounded-[4px] bg-slate-50/70 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowReasoning((prev) => !prev)}
              className="w-full px-2.5 py-1 text-[10.5px] font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>{message.reasoningSteps.length} Langkah Penalaran & Pemanggilan Tool</span>
              </span>
              {showReasoning ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>

            {showReasoning && (
              <div className="px-2.5 pb-2 pt-1 border-t border-slate-100 space-y-1 text-[10.5px] text-slate-600 font-mono">
                {message.reasoningSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Narrative Text */}
        {renderMarkdown(message.text)}

        {/* Interactive Verbatim Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="pt-1.5 border-t border-slate-100 space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Bukti Verbatim Terverifikasi
            </span>
            {message.citations.map((c, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  onExecuteAction({
                    actionType: "JUMP_CITATION",
                    payload: c,
                  })
                }
                className="w-full text-left p-2 rounded-[4px] bg-blue-50/60 hover:bg-blue-100/60 border border-blue-200/80 transition-colors group space-y-0.5"
              >
                <div className="flex items-center justify-between text-[10.5px] font-semibold text-blue-900">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-blue-700" />
                    <span>{c.documentTitle} · Hal. {c.pageNumber}</span>
                  </span>
                  <span className="text-[10px] text-blue-700 flex items-center gap-0.5 group-hover:underline">
                    <span>Sorot PDF</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-600 italic line-clamp-2">
                  &ldquo;{c.exactSubstring}&rdquo;
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Action Suggestions (Frameless with left bent arrow) */}
        {message.actions && message.actions.length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex flex-col items-start gap-1">
            {message.actions.map((act, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onExecuteAction(act)}
                className="inline-flex items-center gap-1.5 py-1 px-1.5 -ml-1 text-xs font-medium text-blue-700 hover:text-blue-800 hover:bg-slate-100/80 rounded transition-colors text-left cursor-pointer group"
              >
                <CornerDownRight className="w-3.5 h-3.5 text-blue-600 group-hover:text-blue-800 transition-colors flex-shrink-0" />
                <span>{act.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
