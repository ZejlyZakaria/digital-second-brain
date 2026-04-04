/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, AlertTriangle, Clock, Folder } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { PriorityIcon } from "@/modules/tasks/components/PriorityIcon";
import { useDashboardTasks } from "../hooks/useDashboardTasks";
import type { DashboardTask } from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PRIORITY_BADGE: Record<string, string> = {
  critical: "bg-red-500/10 border-red-500/25 text-red-400",
  high: "bg-orange-500/10 border-orange-500/25 text-orange-400",
  medium: "bg-yellow-500/10 border-yellow-500/25 text-yellow-400",
  low: "bg-zinc-700/30 border-zinc-600/30 text-zinc-500",
};

function formatDueDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);

  if (date < todayStart) {
    const diff = Math.ceil((todayStart.getTime() - date.getTime()) / 86400000);
    return diff === 1 ? "Yesterday" : `${diff}d ago`;
  }
  if (date <= todayEnd) {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }
  const diff = Math.ceil((date.getTime() - todayEnd.getTime()) / 86400000);
  if (diff === 1) return "Tomorrow";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Task Row ─────────────────────────────────────────────────────────────────

function TaskRow({ task }: { task: DashboardTask }) {
  const dueLabel = formatDueDate(task.due_date);
  const isOverdue =
    task.due_date && !task.is_completed && new Date(task.due_date) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div className="group flex items-center gap-3 px-4 py-2.5 border-b border-white/4 last:border-b-0 hover:bg-white/2 transition-colors">
      {/* priority icon */}
      <div className="shrink-0 w-4 flex items-center justify-center">
        <PriorityIcon priority={task.priority as any} />
      </div>

      {/* title */}
      <span className={cn("flex-1 text-sm truncate", task.is_completed ? "line-through text-zinc-600" : "text-zinc-200")}>
        {task.title}
      </span>

      {/* priority badge */}
      <span className={cn("hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border shrink-0", PRIORITY_BADGE[task.priority] ?? PRIORITY_BADGE.medium)}>
        {task.priority}
      </span>

      {/* project */}
      <div className="hidden md:flex items-center gap-1 shrink-0 text-zinc-600">
        <Folder size={10} />
        <span className="text-[10px]">{task.project_name}</span>
      </div>

      {/* due */}
      {dueLabel && (
        <div className={cn("hidden sm:flex items-center gap-1 shrink-0 text-[10px]", isOverdue ? "text-red-400" : "text-zinc-500")}>
          <Clock size={10} />
          <span>{dueLabel}</span>
        </div>
      )}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: string }) {
  const messages: Record<string, { icon: string; text: string; sub: string }> = {
    today: { icon: "✓", text: "No tasks due today", sub: "Great job staying on top of things" },
    upcoming: { icon: "📅", text: "No upcoming tasks", sub: "Your schedule is clear" },
    completed: { icon: "🎉", text: "No completed tasks this week", sub: "Complete tasks to see them here" },
  };
  const m = messages[tab] ?? messages.today;

  return (
    <div className="flex flex-col items-center justify-center h-32 gap-2 text-center">
      <span className="text-2xl">{m.icon}</span>
      <p className="text-sm text-zinc-500">{m.text}</p>
      <p className="text-xs text-zinc-700">{m.sub}</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const TABS = ["today", "upcoming", "completed"] as const;
type Tab = typeof TABS[number];

interface Props {
  userId: string;
}

export default function TasksSection({ userId }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("today");
  const {
    todayTasks,
    upcomingTasks,
    completedTasks,
    overdueCount,
    weekTotal,
    weekCompleted,
    isLoading,
  } = useDashboardTasks(userId);

  const tasksByTab: Record<Tab, DashboardTask[]> = {
    today: todayTasks,
    upcoming: upcomingTasks,
    completed: completedTasks,
  };

  const tabCounts: Record<Tab, number> = {
    today: todayTasks.length,
    upcoming: upcomingTasks.length,
    completed: completedTasks.length,
  };

  const weekProgress = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;
  const activeTasks = tasksByTab[activeTab];

  return (
    <section>
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-white font-bold text-lg">Your Tasks</span>
        <Link
          href="/pro/tasks"
          className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors font-medium"
        >
          View all <ArrowRight size={11} />
        </Link>
      </div>

      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 overflow-hidden">
        {/* tabs */}
        <div className="flex items-center gap-1 px-4 pt-3 pb-0 border-b border-zinc-800/60">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative px-3 py-2 text-xs font-semibold capitalize transition-colors",
                activeTab === tab ? "text-white" : "text-zinc-500 hover:text-zinc-300",
              )}
            >
              {tab}
              {tabCounts[tab] > 0 && (
                <span className={cn(
                  "ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                  activeTab === tab ? "bg-zinc-700 text-zinc-300" : "bg-zinc-800 text-zinc-600",
                )}>
                  {tabCounts[tab]}
                </span>
              )}
              {activeTab === tab && (
                <span className="absolute bottom-0 inset-x-0 h-px bg-indigo-500" />
              )}
            </button>
          ))}
        </div>

        {/* content: task list + side panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* task list (2/3) */}
          <div className="lg:col-span-2 min-h-40">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-5 h-5 rounded-full border-2 border-zinc-700 border-t-indigo-500 animate-spin" />
              </div>
            ) : activeTasks.length > 0 ? (
              activeTasks.map((task) => <TaskRow key={task.id} task={task} />)
            ) : (
              <EmptyState tab={activeTab} />
            )}
          </div>

          {/* side panel (1/3) */}
          <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-zinc-800/60 p-4 flex flex-col gap-4">
            {/* overdue alert */}
            {overdueCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-500/8 border border-amber-500/20">
                <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                <span className="text-xs text-amber-300 font-medium">
                  {overdueCount} overdue task{overdueCount > 1 ? "s" : ""}
                </span>
                <Link href="/pro/tasks" className="ml-auto">
                  <ArrowRight size={12} className="text-amber-500" />
                </Link>
              </div>
            )}

            {/* week progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-medium">This week progress</span>
                <span className="text-xs font-bold text-zinc-300">{weekProgress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-linear-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                  style={{ width: `${weekProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-zinc-600">
                {weekCompleted} / {weekTotal} completed
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
