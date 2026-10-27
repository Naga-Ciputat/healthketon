"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ClaimItem, INITIAL_CLAIMS } from "./mockData";
import { CopilotAction, CopilotCitation, CopilotResponse } from "./copilotKnowledge";
import { generateCopilotAnswer } from "./copilotEngine";

function getLiveScreenContext(pathname: string, activeClaim: ClaimItem | null) {
  if (typeof window === "undefined") {
    return { pathname, activeClaim };
  }

  // Scrape visible metrics from live DOM
  const visibleMetrics: Record<string, string> = {};
  const bodyText = document.body.innerText;

  if (bodyText.includes("142,5 Jt") || bodyText.includes("142.500.000") || pathname.includes("/triage")) {
    visibleMetrics["potentialSavings"] = "Rp 142.500.000";
    visibleMetrics["potentialSavingsShort"] = "+Rp 142,5 Jt";
  }
  if (bodyText.includes("48.800.000")) {
    visibleMetrics["pendingReconciliation"] = "Rp 48.800.000";
  }
  if (bodyText.includes("24.900.000")) {
    visibleMetrics["claimDeltaTariff"] = "Rp 24.900.000";
  }
  if (bodyText.includes("91.4%") || pathname.includes("/benchmark")) {
    visibleMetrics["recall"] = "91.4%";
    visibleMetrics["falsePositiveRate"] = "4.2%";
    visibleMetrics["minRecallTarget"] = "85%";
    visibleMetrics["maxFprTolerance"] = "15%";
  }

  // Active user resolution
  let activeUser = { id: "usr-siti", name: "dr. Siti Aminah", role: "Verifikator Utama BPJS" };
  try {
    const savedUser = localStorage.getItem("telisik_active_user");
    if (savedUser) {
      activeUser = JSON.parse(savedUser);
    }
  } catch {
    // Default fallback
  }

  // Active document tab resolution in PDF Viewer
  const activeTabEl = document.querySelector(
    "[role='tab'][data-state='active'], [role='tab'][aria-selected='true'], button.border-blue-600, button.bg-blue-50"
  );
  const activeDocumentTab = activeTabEl?.textContent?.trim() || "Resume Medis";

  // Dynamic active claim resolution (match URL)
  let resolvedClaim = activeClaim;
  const matchClaim = pathname.match(/\/claims\/(CLM-[^/]+)/);
  if (matchClaim) {
    const claimIdFromUrl = matchClaim[1];
    if (!resolvedClaim || resolvedClaim.id !== claimIdFromUrl) {
      const is092 = claimIdFromUrl.includes("092");
      resolvedClaim = {
        id: claimIdFromUrl,
        hospitalName: is092 ? "RS Medika Nusantara" : "RS Sejahtera Medika",
        patientAge: is092 ? 52 : 48,
        deltaTariff: is092 ? 10000000 : 24900000,
        primaryDiagnosis: {
          code: is092 ? "I20.0" : "I21.0",
          name: is092 ? "Unstable Angina Pectoris (Non-Sepsis)" : "STEMI Anterior",
        },
      } as any;
    }
  }

  // Count visible table rows
  const visibleTableRowsCount = document.querySelectorAll("tbody tr").length;

  return {
    pathname,
    activeUser,
    activeClaim: resolvedClaim,
    activeDocumentTab,
    visibleMetrics,
    visibleTableRowsCount,
    modelName: "Gemini 2.5 Flash",
  };
}

export interface CopilotMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
  reasoningSteps?: string[];
  citations?: CopilotCitation[];
  actions?: CopilotAction[];
}

interface CopilotContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleOpen: () => void;
  activeClaim: ClaimItem | null;
  setActiveClaim: (claim: ClaimItem | null) => void;
  messages: CopilotMessage[];
  isThinking: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
  registerAction: (key: string, fn: (...args: any[]) => void) => void;
  executeAction: (action: CopilotAction) => void;
}

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeClaim, setActiveClaim] = useState<ClaimItem | null>(INITIAL_CLAIMS[0] || null);
  const [isThinking, setIsThinking] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const [registeredActions, setRegisteredActions] = useState<Record<string, (...args: any[]) => void>>({});

  const registerAction = useCallback((key: string, fn: (...args: any[]) => void) => {
    setRegisteredActions((prev) => ({ ...prev, [key]: fn }));
  }, []);

  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: "msg-welcome",
      sender: "copilot",
      text: "Halo dr. Siti Aminah, saya **Clarix AI**—asisten investigasi klinis dan regulasi platform **TELISIK**. Saya sadar konteks terhadap layar yang Anda buka dan siap membantu menelaah bukti rekam medis, regulasi PMK 3/2023, atau memandu penggunaan aplikasi.",
      timestamp: "Baru saja",
      actions: [
        {
          label: "Kenapa Sepsis dianulir?",
          actionType: "ASK_PROMPT",
          payload: { query: "Kenapa Sepsis dianulir?" },
        },
        {
          label: "Cek Regulasi PMK 3/2023",
          actionType: "NAVIGATE",
          payload: { path: "/clarix-ai" },
        },
      ],
    },
  ]);

  // Global hotkey: Ctrl + K or Cmd + K to toggle copilot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMsgId = `user-${Date.now()}`;
      const nowStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

      const newMsg: CopilotMessage = {
        id: userMsgId,
        sender: "user",
        text,
        timestamp: nowStr,
      };

      setMessages((prev) => [...prev, newMsg]);
      setIsThinking(true);

      try {
        const screenContext = getLiveScreenContext(pathname, activeClaim);
        const response: CopilotResponse = await generateCopilotAnswer(text, pathname, screenContext.activeClaim, screenContext);

        const copilotMsg: CopilotMessage = {
          id: `copilot-${Date.now()}`,
          sender: "copilot",
          text: response.answerMarkdown,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          reasoningSteps: response.reasoningSteps,
          citations: response.citations,
          actions: response.actions,
        };

        setMessages((prev) => [...prev, copilotMsg]);
      } catch (err) {
        console.error("Copilot reasoning error:", err);
      } finally {
        setIsThinking(false);
      }
    },
    [pathname, activeClaim]
  );

  const executeAction = useCallback(
    (action: CopilotAction) => {
      switch (action.actionType) {
        case "ASK_PROMPT":
          if (action.payload?.query) {
            sendMessage(action.payload.query);
          }
          break;
        case "JUMP_CITATION":
          if (registeredActions["jumpToCitation"] && action.payload) {
            registeredActions["jumpToCitation"](
              action.payload.documentId,
              action.payload.pageNumber || 1,
              action.payload.exactSubstring || ""
            );
          }
          break;
        case "OPEN_LETTER":
          if (registeredActions["openDisputeModal"]) {
            registeredActions["openDisputeModal"]();
          }
          break;
        case "NAVIGATE":
          if (action.payload?.path) {
            router.push(action.payload.path);
          }
          break;
        default:
          break;
      }
    },
    [registeredActions, router, sendMessage]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <CopilotContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggleOpen,
        activeClaim,
        setActiveClaim,
        messages,
        isThinking,
        sendMessage,
        clearMessages,
        registerAction,
        executeAction,
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
}

export function useCopilot() {
  const context = useContext(CopilotContext);
  if (!context) {
    throw new Error("useCopilot must be used within a CopilotProvider");
  }
  return context;
}
