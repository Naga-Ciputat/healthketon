"use client";

import React, { useState } from "react";
import { TopHeader } from "@/components/widgets/TopHeader";
import { TabsBar } from "@/components/widgets/TabsBar";
import { FilterToolbar } from "@/components/widgets/FilterToolbar";
import { DashedEmptyState } from "@/components/widgets/DashedEmptyState";
import { NoteCard, NoteCardProps } from "@/components/widgets/NoteCard";
import { FileText, FileCode } from "lucide-react";

export default function NotesPage() {
  const [activeTab, setActiveTab] = useState("notes");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [notes, setNotes] = useState<NoteCardProps[]>([
    {
      id: "1",
      companyName: "Microsoft",
      title: "Untitled note",
      contentSnippet: "This note has no content.",
      authorName: "Muhammad Raihan Maulana",
      authorAvatarText: "M",
      authorAvatarColor: "bg-orange-500",
      dateLabel: "Today",
    },
  ]);

  const handleCreateNote = () => {
    const newNote: NoteCardProps = {
      id: Date.now().toString(),
      companyName: "Internal Note",
      title: `New Note #${notes.length + 1}`,
      contentSnippet: "Click to write content and record notes for your team.",
      authorName: "Muhammad Raihan Maulana",
      authorAvatarText: "M",
      authorAvatarColor: "bg-orange-500",
      dateLabel: "Just now",
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const tabs = [
    { id: "notes", label: "Notes", count: notes.length, icon: FileText },
    { id: "templates", label: "Templates", count: 0, icon: FileCode },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* Top Header with Tabs on Left, Help & Ask Attio on Right */}
      <TopHeader
        title={
          <TabsBar
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="border-b-0 px-0"
          />
        }
        showHelp={true}
        showAskAttio={true}
      />

      {/* Filter and Action Toolbar */}
      <FilterToolbar
        sortLabel="Creation date"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        primaryActionLabel="New note"
        onPrimaryAction={handleCreateNote}
        className="px-6 py-2.5"
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {activeTab === "notes" ? (
          <>
            {/* Favorites Section */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500">Favorites</h3>
              <DashedEmptyState
                title="Favorites"
                description="Notes that you favorite will appear here"
              />
            </div>

            {/* Created Today Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold text-gray-700">Created today</h3>
                <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded-full">
                  {notes.length}
                </span>
              </div>

              {/* Notes Grid / List */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    : "space-y-3 max-w-2xl"
                }
              >
                {notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    {...note}
                    onClick={() => console.log("Clicked note:", note.id)}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Templates Empty State */
          <div className="py-12">
            <DashedEmptyState
              title="No templates found"
              description="Create reusable note templates for meeting transcripts, sales calls, or briefs."
            />
          </div>
        )}
      </div>
    </div>
  );
}
