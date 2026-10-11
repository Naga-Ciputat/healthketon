"use client";

import React, { useState } from "react";
import { TopHeader } from "@/components/widgets/TopHeader";
import { TabsBar } from "@/components/widgets/TabsBar";
import { SequenceBuilder } from "@/components/widgets/SequenceBuilder";
import { SequenceInspector } from "@/components/widgets/SequenceInspector";
import { ToggleSwitch } from "@/components/widgets/ToggleSwitch";
import {
  Send,
  Star,
  MoreHorizontal,
  Edit3,
  Users,
  Settings,
  UserPlus,
} from "lucide-react";

export default function SequencesPage() {
  const [activeTab, setActiveTab] = useState("editor");
  const [sequenceEnabled, setSequenceEnabled] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const tabs = [
    { id: "editor", label: "Editor", icon: Edit3 },
    { id: "recipients", label: "Recipients", count: 0, icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* Top Header: Breadcrumbs & Actions */}
      <TopHeader
        title={
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-gray-500 font-normal">
              <Send className="w-3.5 h-3.5 rotate-45 -ml-0.5" />
              <span>Sequences</span>
            </div>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-900">Untitled Sequence</span>
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className="text-gray-300 hover:text-amber-500 transition-colors ml-0.5"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  isFavorite ? "fill-amber-400 text-amber-400" : ""
                }`}
              />
            </button>
          </div>
        }
        showShare={true}
        showHelp={true}
        showAskAttio={true}
        rightActions={
          <button
            type="button"
            className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        }
      />

      {/* Sub-header Bar: Tabs & Enable Sequence */}
      <div className="h-10 border-b border-gray-200 px-6 flex items-center justify-between bg-white flex-shrink-0 select-none">
        <TabsBar
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="border-b-0 px-0 h-full"
        />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ToggleSwitch
              label="Enable sequence"
              checked={sequenceEnabled}
              onChange={setSequenceEnabled}
            />
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100/60 text-blue-600 border border-blue-200/60 rounded-md text-xs font-medium cursor-not-allowed hover:bg-blue-100/80 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Enroll recipients</span>
          </button>
        </div>
      </div>

      {/* Main Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sequence Canvas Flow */}
        <div className="flex-1 overflow-y-auto bg-gray-50/30">
          <SequenceBuilder
            isPublished={isPublished}
            onPublish={() => setIsPublished(true)}
          />
        </div>

        {/* Right Properties Inspector */}
        <SequenceInspector />
      </div>
    </div>
  );
}
