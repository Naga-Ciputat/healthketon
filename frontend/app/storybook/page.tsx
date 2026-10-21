"use client";

import React, { useState } from "react";
import { TopHeader } from "@/components/widgets/TopHeader";
import { OmniboxInput } from "@/components/widgets/OmniboxInput";
import { MeetingSyncWidget } from "@/components/widgets/MeetingSyncWidget";
import { TaskSummaryWidget } from "@/components/widgets/TaskSummaryWidget";
import { TabsBar } from "@/components/widgets/TabsBar";
import { FilterToolbar } from "@/components/widgets/FilterToolbar";
import { DashedEmptyState } from "@/components/widgets/DashedEmptyState";
import { NoteCard } from "@/components/widgets/NoteCard";
import { ToggleSwitch } from "@/components/widgets/ToggleSwitch";
import { SequenceBuilder } from "@/components/widgets/SequenceBuilder";
import { SequenceInspector } from "@/components/widgets/SequenceInspector";
import { TaskTable } from "@/components/widgets/TaskTable";
import { MetricHeader } from "@/components/widgets/MetricHeader";
import { EvidenceCard } from "@/components/widgets/EvidenceCard";
import { DossierActionBar } from "@/components/widgets/DossierActionBar";
import { INITIAL_CLAIMS } from "@/lib/mockData";
import {
  Layers,
  Sparkles,
  BookOpen,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WidgetDoc {
  id: string;
  name: string;
  category: string;
  screenshotRef: string;
  description: string;
  component: React.ReactNode;
}

export default function StorybookCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeWidgetId, setActiveWidgetId] = useState<string>("evidence-card");

  // State for interactive widgets
  const [toggleState, setToggleState] = useState(true);
  const [toolbarView, setToolbarView] = useState<"list" | "grid">("grid");
  const [activeTab, setActiveTab] = useState("notes");

  const categories = [
    "All",
    "Clarix AI Clinical",
    "Navigation",
    "AI & Input",
    "Dashboard",
    "Cards & Empty States",
    "Sequences",
    "Tables & Data",
  ];

  const widgets: WidgetDoc[] = [
    {
      id: "evidence-card",
      name: "EvidenceCard",
      category: "Clarix AI Clinical",
      screenshotRef: "Screen 2 (Evidence Dossier)",
      description: "Interactive clinical discrepancy card with 100% Verbatim verification badge, narrative discrepancy reasoning, and click-to-highlight quotation trigger.",
      component: (
        <div className="max-w-xl w-full mx-auto space-y-3">
          <EvidenceCard
            finding={INITIAL_CLAIMS[0].findings[0]}
            onSelectCitation={(cit) => alert(`Selected citation in: ${cit.documentTitle}`)}
          />
        </div>
      ),
    },
    {
      id: "metric-header",
      name: "MetricHeader",
      category: "Clarix AI Clinical",
      screenshotRef: "Screen 1 (Triage Queue)",
      description: "Triage metrics summary showing pending claim volume, detected inefficiency rupiah, and fast-tracked clean claims.",
      component: (
        <div className="w-full">
          <MetricHeader
            totalPendingCount={24}
            highRiskCount={4}
            totalInefficiencyRupiah={142500000}
            fastTrackedCount={12}
          />
        </div>
      ),
    },
    {
      id: "dossier-action-bar",
      name: "DossierActionBar",
      category: "Clarix AI Clinical",
      screenshotRef: "Screen 2 (Dossier Workspace)",
      description: "Fixed decision bar with Agentic AI recommendation banner (92% confidence) and 4 human-in-the-loop action buttons.",
      component: (
        <div className="max-w-xl w-full mx-auto border border-slate-200 rounded-xl overflow-hidden">
          <DossierActionBar
            recommendedActionText="Rekomendasi: PENDING — Minta Klarifikasi Jumlah Alkes & Downcode Sepsis"
            confidenceScore={92}
            onTriggerAction={(act) => alert(`Action triggered: ${act}`)}
          />
        </div>
      ),
    },
    {
      id: "omnibox",
      name: "OmniboxInput",
      category: "AI & Input",
      screenshotRef: "Screenshot 1 (Home)",
      description: "Attio-style AI prompt input bar with 'Auto' badge, voice mic trigger, info tooltip, and primary upward action button.",
      component: (
        <div className="max-w-3xl w-full mx-auto">
          <OmniboxInput
            placeholder="Ask anything..."
            onSubmit={(val) => alert(`Submitted prompt: "${val}"`)}
          />
        </div>
      ),
    },
    {
      id: "meeting-sync",
      name: "MeetingSyncWidget",
      category: "Dashboard",
      screenshotRef: "Screenshot 1 (Home)",
      description: "Calendar integrations card offering one-click synchronization with Google Workspace and Microsoft 365.",
      component: (
        <div className="max-w-2xl w-full mx-auto">
          <MeetingSyncWidget
            dateLabel="Today, Oct 11"
            onSyncGoogle={() => alert("Connecting to Google Calendar...")}
            onSyncMicrosoft={() => alert("Connecting to Microsoft 365...")}
          />
        </div>
      ),
    },
    {
      id: "task-summary",
      name: "TaskSummaryWidget",
      category: "Dashboard",
      screenshotRef: "Screenshot 1 (Home)",
      description: "Dashboard task summary displaying count, empty-state illustration/copy, and '+ New task' quick action.",
      component: (
        <div className="max-w-2xl w-full mx-auto">
          <TaskSummaryWidget
            taskCount={0}
            onViewAll={() => alert("Navigating to full Tasks view")}
            onNewTask={() => alert("Creating task...")}
          />
        </div>
      ),
    },
    {
      id: "top-header",
      name: "TopHeader",
      category: "Navigation",
      screenshotRef: "Screenshots 1, 2, 3, 4",
      description: "Clean persistent header with title/breadcrumbs, Help link, and optional 'Ask Attio' and 'Share' buttons.",
      component: (
        <div className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-2xs">
          <TopHeader
            title="Sequences / Untitled Sequence"
            showShare={true}
            showHelp={true}
            showAskAttio={true}
          />
        </div>
      ),
    },
    {
      id: "tabs-bar",
      name: "TabsBar",
      category: "Navigation",
      screenshotRef: "Screenshot 2 & 3",
      description: "Underlined tab bar with active border highlight and rounded item count badges.",
      component: (
        <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <TabsBar
            tabs={[
              { id: "notes", label: "Notes", count: 1 },
              { id: "templates", label: "Templates", count: 0 },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>
      ),
    },
    {
      id: "filter-toolbar",
      name: "FilterToolbar",
      category: "Navigation",
      screenshotRef: "Screenshots 2 & 4",
      description: "Action toolbar featuring sort order dropdown, list/grid toggle switches, View settings, and primary blue action button.",
      component: (
        <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <FilterToolbar
            sortLabel="Creation date"
            viewMode={toolbarView}
            onViewModeChange={setToolbarView}
            primaryActionLabel="New note"
            onPrimaryAction={() => alert("New note clicked")}
          />
        </div>
      ),
    },
    {
      id: "dashed-empty-state",
      name: "DashedEmptyState",
      category: "Cards & Empty States",
      screenshotRef: "Screenshot 2 (Notes)",
      description: "Dashed container indicating empty states for favorites or templates.",
      component: (
        <div className="w-full max-w-xl mx-auto">
          <DashedEmptyState
            title="Favorites"
            description="Notes that you favorite will appear here"
          />
        </div>
      ),
    },
    {
      id: "note-card",
      name: "NoteCard",
      category: "Cards & Empty States",
      screenshotRef: "Screenshot 2 (Notes)",
      description: "Clean note card showing company logo badge, note title, preview snippet, user avatar, and relative timestamp.",
      component: (
        <div className="max-w-sm mx-auto">
          <NoteCard
            companyName="Microsoft"
            title="Untitled note"
            contentSnippet="This note has no content."
            authorName="Muhammad Raihan Maulana"
            authorAvatarText="M"
            dateLabel="Today"
            onClick={() => alert("Note card clicked")}
          />
        </div>
      ),
    },
    {
      id: "toggle-switch",
      name: "ToggleSwitch",
      category: "Sequences",
      screenshotRef: "Screenshot 3 (Sequences)",
      description: "Attio-style sleek blue toggle switch with labels and optional helper description.",
      component: (
        <div className="max-w-sm mx-auto bg-white p-4 border border-gray-200 rounded-lg shadow-2xs space-y-3">
          <ToggleSwitch
            label="Business days only"
            checked={toggleState}
            onChange={setToggleState}
          />
          <ToggleSwitch
            label="Thread emails"
            description="Keep follow-ups inside the original conversation"
            checked={!toggleState}
            onChange={(val) => setToggleState(!val)}
          />
        </div>
      ),
    },
    {
      id: "sequence-builder",
      name: "SequenceBuilder",
      category: "Sequences",
      screenshotRef: "Screenshot 3 (Sequences)",
      description: "Interactive sequence canvas flow with unpublished alert banner, trigger node, automated email step card, and step connector.",
      component: (
        <div className="w-full border border-gray-200 rounded-lg overflow-hidden bg-gray-50/40">
          <SequenceBuilder
            isPublished={false}
            triggerDelay="immediately"
            onPublish={() => alert("Sequence published!")}
            onAddStep={() => alert("Add step opened")}
          />
        </div>
      ),
    },
    {
      id: "sequence-inspector",
      name: "SequenceInspector",
      category: "Sequences",
      screenshotRef: "Screenshot 3 (Sequences)",
      description: "Right sidebar properties inspector covering sending schedule, timezone, business day filters, email threading, and exit criteria.",
      component: (
        <div className="max-w-xs mx-auto border border-gray-200 rounded-lg overflow-hidden">
          <SequenceInspector
            title="Untitled Sequence"
            startHour="09:00"
            endHour="17:00"
            timezone="Asia/Jakarta"
          />
        </div>
      ),
    },
    {
      id: "task-table",
      name: "TaskTable",
      category: "Tables & Data",
      screenshotRef: "Screenshot 4 (Tasks)",
      description: "Task data grid with column headers, date grouping, circular toggle checkboxes, amber 'Due today' badges, and assignee avatars.",
      component: (
        <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <TaskTable />
        </div>
      ),
    },
  ];

  const filteredWidgets =
    selectedCategory === "All"
      ? widgets
      : widgets.filter((w) => w.category === selectedCategory);

  const activeWidget =
    widgets.find((w) => w.id === activeWidgetId) || widgets[0];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* Header */}
      <TopHeader
        title={
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-pink-500 text-white flex items-center justify-center font-bold text-[10px]">
              S
            </div>
            <span className="font-semibold text-gray-900 text-xs">
              Attio Component Storybook & Catalog
            </span>
            <span className="text-[10px] bg-pink-50 text-pink-700 font-semibold px-2 py-0.5 rounded-full border border-pink-200/60">
              12 Widgets Available
            </span>
          </div>
        }
        showHelp={false}
        showAskAttio={false}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Widget Sidebar */}
        <div className="w-72 border-r border-gray-200 flex flex-col bg-gray-50/30 flex-shrink-0">
          {/* Category Filter Pills */}
          <div className="p-3 border-b border-gray-200 flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-2 py-1 text-[11px] font-medium rounded transition-colors",
                  selectedCategory === cat
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Widget List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredWidgets.map((widget) => {
              const isActive = widget.id === activeWidget.id;
              return (
                <button
                  key={widget.id}
                  type="button"
                  onClick={() => setActiveWidgetId(widget.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex flex-col gap-0.5",
                    isActive
                      ? "bg-white text-gray-900 shadow-2xs border border-gray-200 font-semibold"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>{widget.name}</span>
                    <span className="text-[10px] text-gray-400 font-normal">
                      {widget.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-normal truncate">
                    {widget.screenshotRef}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Preview Panel */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/20">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Widget Meta Bar */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {activeWidget.category}
                  </span>
                  <h2 className="text-lg font-bold text-gray-900 mt-1">
                    {activeWidget.name}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 font-medium">Source:</span>
                  <div className="text-xs font-semibold text-gray-800">
                    {activeWidget.screenshotRef}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {activeWidget.description}
              </p>
            </div>

            {/* Interactive Preview Canvas */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-2xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Interactive Preview
                </span>
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Live component state
                </span>
              </div>

              {/* Rendered Component */}
              <div className="py-2 flex items-center justify-center">
                {activeWidget.component}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
