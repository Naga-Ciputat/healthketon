"use client";

import React, { useState } from "react";
import { TopHeader } from "@/components/widgets/TopHeader";
import { FilterToolbar } from "@/components/widgets/FilterToolbar";
import { TaskTable, TaskItem } from "@/components/widgets/TaskTable";
import { CheckSquare } from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: "1",
      title: "contoh",
      dueDate: "Due today",
      dueStatus: "today",
      recordName: "",
      assignedToName: "Muhammad Raihan Mau...",
      assignedToAvatarText: "M",
      assignedToAvatarColor: "bg-orange-500",
      completed: false,
    },
  ]);

  const handleAddNewTask = () => {
    const newTask: TaskItem = {
      id: Date.now().toString(),
      title: `Task #${tasks.length + 1}`,
      dueDate: "Due today",
      dueStatus: "today",
      recordName: "",
      assignedToName: "Muhammad Raihan Mau...",
      assignedToAvatarText: "M",
      assignedToAvatarColor: "bg-orange-500",
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* Top Header */}
      <TopHeader
        title={
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-900">
            <CheckSquare className="w-3.5 h-3.5 text-gray-600" />
            <span>Tasks</span>
          </div>
        }
        showHelp={true}
        showAskAttio={true}
      />

      {/* Filter and View Settings Toolbar */}
      <FilterToolbar
        sortLabel="Due date"
        showViewMode={false}
        hasFilterButton={true}
        primaryActionLabel="New task"
        onPrimaryAction={handleAddNewTask}
      />

      {/* Main Task Data Table */}
      <div className="flex-1 overflow-y-auto">
        <TaskTable
          tasks={tasks}
          onAddTask={(title) => {
            const newTask: TaskItem = {
              id: Date.now().toString(),
              title,
              dueDate: "Due today",
              dueStatus: "today",
              recordName: "",
              assignedToName: "Muhammad Raihan Mau...",
              completed: false,
            };
            setTasks((prev) => [newTask, ...prev]);
          }}
        />
      </div>
    </div>
  );
}
