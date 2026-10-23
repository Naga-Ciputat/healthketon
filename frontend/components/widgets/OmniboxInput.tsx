"use client";

import React, { useState } from "react";
import { ArrowUp, Mic, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OmniboxInputProps {
  greeting?: string;
  userName?: string;
  showGreeting?: boolean;
  placeholder?: string;
  initialMode?: string;
  onSend?: (text: string) => void;
  onSubmit?: (text: string) => void;
  className?: string;
}

export function OmniboxInput({
  greeting = "Good evening",
  userName = "Muhammad Raihan",
  showGreeting = true,
  placeholder = "Ask anything...",
  initialMode = "Auto",
  onSend,
  onSubmit,
  className,
}: OmniboxInputProps) {
  const [value, setValue] = useState("");

  const triggerSubmit = () => {
    if (value.trim()) {
      (onSubmit || onSend)?.(value.trim());
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      triggerSubmit();
    }
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto flex flex-col items-center", className)}>
      {/* Greeting Title */}
      {showGreeting && (
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 tracking-tight text-center">
          {greeting}, {userName}.
        </h2>
      )}

      {/* Omnibox Card */}
      <div className="w-full bg-white border border-gray-200/90 rounded-2xl p-3.5 shadow-xs hover:border-gray-300 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 transition-all">
        <textarea
          rows={3}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full text-sm text-gray-800 placeholder-gray-400 outline-none resize-none bg-transparent leading-relaxed"
        />

        {/* Action Bottom Bar */}
        <div className="flex items-center justify-between pt-2 mt-1 border-t border-transparent">
          <div className="flex items-center gap-2">
            {/* Left helper tag if needed */}
          </div>

          <div className="flex items-center gap-2">
            {/* Auto indicator button */}
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              <span>Auto</span>
            </button>

            {/* Info button */}
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
              title="Informasi Modul Verifikasi"
            >
              <Info className="w-3.5 h-3.5" />
            </button>

            {/* Mic button */}
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
              title="Voice Input"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>

            {/* Submit arrow button */}
            <button
              type="button"
              onClick={() => {
                if (value.trim()) {
                  onSend?.(value.trim());
                  setValue("");
                }
              }}
              disabled={!value.trim()}
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center transition-all",
                value.trim()
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-2xs"
                  : "bg-blue-200 text-white cursor-not-allowed"
              )}
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
