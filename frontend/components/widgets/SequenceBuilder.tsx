"use client";

import React, { useState } from "react";
import {
  Info,
  ChevronDown,
  Mail,
  MoreHorizontal,
  FileText,
  FilePlus,
  Plus,
  ArrowDown,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SequenceStep {
  id: string;
  stepNumber: number;
  type: "automated_email" | "manual_email" | "task";
  title: string;
  subject?: string;
  content?: string;
}

export interface SequenceBuilderProps {
  isPublished?: boolean;
  onPublish?: () => void;
  triggerDelay?: string;
  onAddStep?: () => void;
  className?: string;
}

export function SequenceBuilder({
  isPublished = false,
  onPublish,
  triggerDelay = "immediately",
  onAddStep,
  className,
}: SequenceBuilderProps) {
  const [subject, setSubject] = useState("");
  const [published, setPublished] = useState(isPublished);

  const handlePublish = () => {
    setPublished(true);
    onPublish?.();
  };

  return (
    <div className={cn("w-full flex flex-col items-center py-5 px-6 space-y-6", className)}>
      {/* Top Banner: Sequence status */}
      {!published && (
        <div className="w-full max-w-3xl bg-blue-50/70 border border-blue-200/80 rounded-lg px-4 py-2.5 flex items-center justify-between text-xs text-blue-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="font-medium text-blue-900">
              This sequence has not yet been published
            </span>
          </div>
          <button
            type="button"
            onClick={handlePublish}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium rounded-md shadow-2xs transition-colors"
          >
            Publish sequence
          </button>
        </div>
      )}

      {/* Canvas Flow Container */}
      <div className="w-full max-w-3xl flex flex-col items-center">
        {/* Trigger Node */}
        <button
          type="button"
          className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-gray-200 rounded-full shadow-2xs text-xs text-gray-700 hover:border-gray-300 hover:shadow-xs transition-all"
        >
          <div className="w-4 h-4 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] text-gray-600 font-medium">
            @
          </div>
          <span>Start</span>
          <span className="font-semibold text-gray-900">{triggerDelay}</span>
          <span>after enrollment</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>

        {/* Connector Line */}
        <div className="w-px h-6 bg-gray-200" />

        {/* Step 1 Node Card */}
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-2xs hover:shadow-xs transition-shadow overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded border border-blue-200 bg-blue-50/50 flex items-center justify-center text-blue-600">
                <Mail className="w-3 h-3" />
              </div>
              <span className="text-xs font-semibold text-gray-900">Step 1</span>
              <span className="text-xs text-gray-500 font-normal">Automated email</span>
            </div>
            <button
              type="button"
              className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Card Body */}
          <div className="p-4 space-y-4">
            {/* Subject Field */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-gray-400 w-14">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="flex-1 text-xs text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none focus:ring-0 border-none p-0"
              />
            </div>

            <div className="border-t border-gray-100" />

            {/* Template Selection Prompt & Search */}
            <div className="space-y-4 pt-1">
              <p className="text-xs text-gray-400 font-normal">
                Start typing, or pick a template (use ↑ ↓ to navigate)
              </p>

              {/* Favorite Templates Section */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
                  Favorite templates
                </span>
                <p className="text-xs text-gray-400 italic">
                  Templates that you favorite will appear here
                </p>
              </div>

              {/* Actions Section */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
                  Actions
                </span>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full px-2 py-1.5 rounded transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-gray-400" />
                    <span>View all templates</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full px-2 py-1.5 rounded transition-colors"
                  >
                    <FilePlus className="w-3.5 h-3.5 text-gray-400" />
                    <span>Create new template</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Downward Connector Arrow */}
        <div className="flex flex-col items-center my-2">
          <div className="w-px h-5 bg-gray-200" />
          <ArrowDown className="w-3.5 h-3.5 text-gray-300 -mt-1" />
        </div>

        {/* Add Step Button */}
        <button
          type="button"
          onClick={onAddStep}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 shadow-2xs hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-gray-500" />
          <span>Add step to sequence</span>
        </button>
      </div>
    </div>
  );
}
