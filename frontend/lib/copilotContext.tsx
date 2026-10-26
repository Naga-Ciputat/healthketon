"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ClaimItem, INITIAL_CLAIMS } from "./mockData";
import { CopilotAction, CopilotCitation, CopilotResponse } from "./copilotKnowledge";
import { generateCopilotAnswer } from "./copilotEngine";

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
      reasoningSteps: [
        "Inisialisasi konteks TELISIK Platform",
        "Menghubungkan data klaim aktif #CLM-2026-089 (RS Sejahtera Medika)",
      ],
      actions: [
        {
          label: "Kenapa Sepsis dianulir?",
          actionType: "ASK_PROMPT",
          payload: { query: "Kenapa Sepsis dianulir?" },
        },
        {
          label: "Cek Regulasi PMK 3/2023",
          actionType: "NAVIGATE",
          payload: { path: "/intelligence" },
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
        const response: CopilotResponse = await generateCopilotAnswer(text, pathname, activeClaim);

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
