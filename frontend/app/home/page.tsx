"use client";

import React from "react";
import { TopHeader } from "@/components/widgets/TopHeader";
import { OmniboxInput } from "@/components/widgets/OmniboxInput";
import { MeetingSyncWidget } from "@/components/widgets/MeetingSyncWidget";
import { TaskSummaryWidget } from "@/components/widgets/TaskSummaryWidget";
import { Home as HomeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* Header */}
      <TopHeader
        title={
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-900">
            <HomeIcon className="w-3.5 h-3.5 text-gray-500" />
            <span>Home</span>
          </div>
        }
        showHelp={true}
        showAskAttio={false}
      />

      {/* Main Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-10 py-8 max-w-4xl w-full mx-auto space-y-9">
        {/* Greeting */}
        <div>
          <h1 className="text-xl font-bold text-gray-950 tracking-tight">
            Good evening, Muhammad Raihan.
          </h1>
        </div>

        {/* Omnibox / AI Prompt Input */}
        <OmniboxInput
          showGreeting={false}
          placeholder="Ask anything..."
          onSubmit={(query) => {
            console.log("Submitted query:", query);
          }}
        />

        {/* Meetings Section Widget */}
        <MeetingSyncWidget />

        {/* Tasks Section Widget */}
        <TaskSummaryWidget
          taskCount={0}
          onViewAll={() => router.push("/tasks")}
          onNewTask={() => router.push("/tasks")}
        />
      </div>
    </div>
  );
}
