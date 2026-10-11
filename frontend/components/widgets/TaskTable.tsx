"use client";

import React, { useState } from "react";
import {
  Calendar,
  FileText,
  AtSign,
  Check,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TaskItem {
  id: string;
  title: string;
  dueDate: string;
  dueStatus?: "today" | "upcoming" | "overdue";
  recordName?: string;
  assignedToName: string;
  assignedToAvatarText?: string;
  assignedToAvatarColor?: string;
  completed?: boolean;
}

export interface TaskTableProps {
  tasks?: TaskItem[];
  onToggleTask?: (taskId: string) => void;
  onAddTask?: (title: string) => void;
  className?: string;
}

export function TaskTable({
  tasks: initialTasks,
  onToggleTask,
  onAddTask,
  className,
}: TaskTableProps) {
  const [tasks, setTasks] = useState<TaskItem[]>(
    initialTasks || [
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
    ]
  );

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleToggle = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
    onToggleTask?.(taskId);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: TaskItem = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      dueDate: "Due today",
      dueStatus: "today",
      recordName: "",
      assignedToName: "Muhammad Raihan Maulana",
      assignedToAvatarText: "M",
      assignedToAvatarColor: "bg-orange-500",
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
    onAddTask?.(newTaskTitle.trim());
    setNewTaskTitle("");
    setIsAdding(false);
  };

  const activeTodayTasks = tasks.filter((t) => !t.completed);

  return (
    <div className={cn("w-full bg-white select-none text-xs text-gray-700", className)}>
      {/* Table Column Headers */}
      <div className="grid grid-cols-12 gap-4 px-6 py-2 border-b border-gray-100 text-gray-400 font-medium text-[11px]">
        <div className="col-span-5 flex items-center gap-1.5">
          <span>Task</span>
        </div>
        <div className="col-span-3 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>Due date</span>
        </div>
        <div className="col-span-2 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-gray-400" />
          <span>Record</span>
        </div>
        <div className="col-span-2 flex items-center gap-1.5">
          <AtSign className="w-3.5 h-3.5 text-gray-400" />
          <span>Assigned to</span>
        </div>
      </div>

      {/* Group Header: Today */}
      <div className="px-6 py-2.5 flex items-center gap-2 border-b border-gray-50 bg-gray-50/40">
        <span className="font-semibold text-gray-900 text-xs">Today</span>
        <span className="text-[10px] font-semibold bg-gray-200/80 text-gray-700 px-1.5 py-0.2 rounded-full">
          {activeTodayTasks.length}
        </span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="grid grid-cols-12 gap-4 px-6 py-2.5 items-center hover:bg-gray-50/70 transition-colors group"
          >
            {/* Task Title & Checkbox */}
            <div className="col-span-5 flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => handleToggle(task.id)}
                className={cn(
                  "w-4 h-4 rounded-full border flex items-center justify-center transition-colors flex-shrink-0",
                  task.completed
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 hover:border-gray-500 bg-white"
                )}
              >
                {task.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </button>
              <span
                className={cn(
                  "truncate font-medium text-gray-900",
                  task.completed && "line-through text-gray-400"
                )}
              >
                {task.title}
              </span>
            </div>

            {/* Due Date */}
            <div className="col-span-3">
              <span
                className={cn(
                  "text-xs font-medium",
                  task.dueStatus === "today"
                    ? "text-amber-600"
                    : task.dueStatus === "overdue"
                    ? "text-rose-600"
                    : "text-gray-500"
                )}
              >
                {task.dueDate}
              </span>
            </div>

            {/* Record */}
            <div className="col-span-2 text-gray-400">
              {task.recordName || "—"}
            </div>

            {/* Assigned To */}
            <div className="col-span-2 flex items-center gap-2 min-w-0">
              <div
                className={cn(
                  "w-4 h-4 rounded-full text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0",
                  task.assignedToAvatarColor || "bg-orange-500"
                )}
              >
                {task.assignedToAvatarText || "M"}
              </div>
              <span className="truncate text-gray-700 font-medium">
                {task.assignedToName}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Inline */}
      {isAdding ? (
        <form onSubmit={handleCreateNew} className="px-6 py-2 border-t border-gray-100 flex items-center gap-2">
          <input
            type="text"
            autoFocus
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Write a task name and press Enter..."
            className="flex-1 text-xs border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-2.5 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="px-6 py-2.5 flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors w-full"
        >
          <Plus className="w-3.5 h-3.5 text-gray-400" />
          <span>New task</span>
        </button>
      )}
    </div>
  );
}
