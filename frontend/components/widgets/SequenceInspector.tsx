"use client";

import React, { useState } from "react";
import {
  Send,
  Plus,
  Reply,
  ChevronDown,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ToggleSwitch } from "./ToggleSwitch";

export interface SequenceInspectorProps {
  title?: string;
  description?: string;
  startHour?: string;
  endHour?: string;
  timezone?: string;
  businessDaysOnly?: boolean;
  unsubscribeOption?: string;
  threadEmails?: boolean;
  includeSignature?: boolean;
  onUpdate?: (settings: any) => void;
  className?: string;
}

export function SequenceInspector({
  title = "Untitled Sequence",
  description,
  startHour = "09:00",
  endHour = "17:00",
  timezone = "Asia/Jakarta",
  businessDaysOnly = true,
  unsubscribeOption = "Stop hearing from me",
  threadEmails = true,
  includeSignature = true,
  onUpdate,
  className,
}: SequenceInspectorProps) {
  const [desc, setDesc] = useState(description || "");
  const [bDays, setBDays] = useState(businessDaysOnly);
  const [thread, setThread] = useState(threadEmails);
  const [sig, setSig] = useState(includeSignature);
  const [selectedTz, setSelectedTz] = useState(timezone);
  const [unsub, setUnsub] = useState(unsubscribeOption);

  return (
    <aside
      className={cn(
        "w-80 border-l border-gray-200 bg-white h-full flex flex-col p-5 select-none overflow-y-auto text-xs text-gray-700 space-y-6 flex-shrink-0",
        className
      )}
    >
      {/* Sequence Header Info */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-500">
            <Send className="w-3.5 h-3.5 rotate-45 -ml-0.5" />
          </div>
          <h2 className="text-sm font-semibold text-gray-900 tracking-tight">
            {title}
          </h2>
        </div>
        <input
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Add a description..."
          className="w-full text-xs text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none focus:ring-0 border-none p-0"
        />
      </div>

      <div className="border-t border-gray-100" />

      {/* Delivery Section */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-semibold text-gray-900">Delivery</h3>

        <div className="space-y-1.5">
          <span className="text-xs text-gray-500">Sending window</span>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between border border-gray-200 rounded-md px-2.5 py-1.5 bg-white text-gray-800 shadow-2xs cursor-pointer hover:border-gray-300">
              <span>{startHour}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>
            <div className="flex items-center justify-between border border-gray-200 rounded-md px-2.5 py-1.5 bg-white text-gray-800 shadow-2xs cursor-pointer hover:border-gray-300">
              <span>{endHour}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center justify-between border border-gray-200 rounded-md px-2.5 py-1.5 bg-white text-gray-800 shadow-2xs cursor-pointer hover:border-gray-300 mt-2">
            <span>{selectedTz}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>
        </div>

        <ToggleSwitch
          label="Business days only"
          checked={bDays}
          onChange={setBDays}
          className="pt-1"
        />
      </div>

      <div className="border-t border-gray-100" />

      {/* Email Section */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-semibold text-gray-900">Email</h3>

        <div className="space-y-1.5">
          <span className="text-xs text-gray-500">Unsubscribe link</span>
          <div className="flex items-center justify-between border border-gray-200 rounded-md px-2.5 py-1.5 bg-white text-gray-800 shadow-2xs cursor-pointer hover:border-gray-300">
            <span>{unsub}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>
        </div>

        <ToggleSwitch
          label="Thread emails"
          checked={thread}
          onChange={setThread}
          className="pt-1"
        />

        <ToggleSwitch
          label="Include sender signature"
          checked={sig}
          onChange={setSig}
          className="pt-1"
        />
      </div>

      <div className="border-t border-gray-100" />

      {/* Exit criteria Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-gray-900">Exit criteria</h3>
          <button
            type="button"
            className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="border border-gray-200 rounded-md p-2 flex items-center gap-2 bg-white shadow-2xs text-gray-700">
          <div className="w-5 h-5 rounded bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500">
            <Reply className="w-3 h-3" />
          </div>
          <span className="text-xs font-medium text-gray-800">Reply received</span>
        </div>
      </div>
    </aside>
  );
}
