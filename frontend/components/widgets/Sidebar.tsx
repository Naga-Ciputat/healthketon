"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Inbox,
  Home,
  CheckSquare,
  FileText,
  Mail,
  Video,
  BarChart2,
  Send,
  GitBranch,
  Building2,
  Users,
  Plus,
  UserPlus,
  ChevronDown,
  PanelLeftClose,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarProps {
  currentPath?: string;
  className?: string;
  taskCount?: number;
  trialDaysLeft?: number;
  workspaceName?: string;
}

export function Sidebar({
  currentPath,
  className,
  taskCount = 1,
  trialDaysLeft = 14,
  workspaceName = "NAGA CIPUTAT",
}: SidebarProps) {
  const pathname = usePathname() || currentPath || "/home";

  const mainNavItems = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Tasks", href: "/tasks", icon: CheckSquare, badge: taskCount },
    { label: "Notes", href: "/notes", icon: FileText },
    { label: "Emails", href: "/emails", icon: Mail },
    { label: "Calls", href: "/calls", icon: Video },
    { label: "Reports", href: "/reports", icon: BarChart2 },
    { label: "Sequences", href: "/sequences", icon: Send },
    { label: "Workflows", href: "/workflows", icon: GitBranch },
  ];

  return (
    <aside
      className={cn(
        "w-64 flex-shrink-0 h-screen bg-white border-r border-gray-200 flex flex-col justify-between select-none text-[13px] text-gray-700",
        className
      )}
    >
      {/* Top Section */}
      <div className="flex flex-col overflow-y-auto">
        {/* Workspace Switcher Header */}
        <div className="px-3 py-3 flex items-center justify-between border-b border-transparent hover:bg-gray-50/50 cursor-pointer transition-colors">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-md bg-[#00bcd4] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
              N
            </div>
            <span className="font-semibold text-gray-900 text-xs tracking-wider truncate">
              {workspaceName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          </div>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
            title="Toggle sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar Input Trigger */}
        <div className="px-3 pt-2 pb-1">
          <div className="flex items-center justify-between px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100/80 border border-gray-200/80 rounded-lg text-gray-500 cursor-pointer transition-colors group">
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
              <span className="text-xs">Search</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="text-[10px] bg-white border border-gray-200 px-1 py-0.5 rounded-[4px] font-medium text-gray-500">
                CTRL K
              </kbd>
              <Inbox className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 cursor-pointer ml-1" />
            </div>
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav className="px-2 py-1 space-y-0.5">
          {mainNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/home" && pathname === "/") ||
              pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors font-medium text-xs group",
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isActive
                        ? "text-gray-900"
                        : "text-gray-400 group-hover:text-gray-600"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-blue-600 text-white text-[10px] font-semibold px-1.5 py-0.2 rounded-full min-w-[16px] text-center leading-4">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Section: Records */}
        <div className="px-2 pt-3">
          <div className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            <ChevronDown className="w-3 h-3" />
            <span>Records</span>
          </div>
          <div className="space-y-0.5 mt-0.5">
            <Link
              href="/companies"
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <div className="w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                B
              </div>
              <span>Companies</span>
            </Link>
            <Link
              href="/people"
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <Users className="w-2.5 h-2.5" />
              </div>
              <span>People</span>
            </Link>
          </div>
        </div>

        {/* Section: Lists */}
        <div className="px-2 pt-3">
          <div className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            <ChevronDown className="w-3 h-3" />
            <span>Lists</span>
          </div>
          <div className="mt-0.5 px-1">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-transparent hover:border-gray-200 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-gray-400" />
              <span>New list</span>
            </button>
          </div>
        </div>

        {/* Section: Chats */}
        <div className="px-2 pt-3">
          <div className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            <ChevronDown className="w-3 h-3" />
            <span>Chats</span>
          </div>
          <div className="mt-0.5 px-1">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-transparent hover:border-gray-200 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-gray-400" />
              <span>New chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-gray-100 space-y-2">
        <Link
          href="/storybook"
          className={cn(
            "w-full flex items-center justify-between px-2 py-1.5 text-xs font-medium rounded-md transition-colors",
            pathname === "/storybook"
              ? "bg-purple-50 text-purple-700 font-semibold"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-[2px] bg-pink-500" />
            <span>Storybook Catalog</span>
          </div>
          <span className="text-[10px] bg-pink-100 text-pink-700 px-1.5 py-0.2 rounded-[4px] font-semibold">
            10 widgets
          </span>
        </Link>

        <button
          type="button"
          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
        >
          <UserPlus className="w-4 h-4 text-gray-400" />
          <span>Invite members</span>
        </button>

        <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50/80 border border-gray-200/70 rounded-lg text-xs">
          <div className="flex items-center gap-1.5 text-gray-700 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{trialDaysLeft} days left on trial!</span>
          </div>
          <button
            type="button"
            className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-200 text-gray-900 rounded font-medium text-[11px] transition-colors shadow-2xs"
          >
            Keep Pro
          </button>
        </div>
      </div>
    </aside>
  );
}
