/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { CheckSquare, ArrowRight, Clock } from "lucide-react";
import { PriorityIcon } from "@/modules/tasks/components/PriorityIcon";
import type { DashboardTask } from "../types";

const PRIORITY_COLORS: Record<string, string> = {
  critical: "text-red-400 bg-red-500/10 border-red-500/20",
  high: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  low: "text-zinc-400 bg-zinc-500/10 border-zinc-600/20",
};

function formatDueTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  if (date.toDateString() !== now.toDateString()) {
    const diff = Math.floor((date.getTime() - now.getTime()) / 86400000);
    if (diff < 0) return `${Math.abs(diff)}d overdue`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return `Due ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
}

interface Props {
  task: DashboardTask | null;
  remainingCount: number;
}

export default function TodayPriorityCard({ task, remainingCount }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-zinc-950 min-h-50 flex flex-col">
      {/* gradient bg */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-950/60 via-zinc-950 to-zinc-950 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="relative flex flex-col flex-1 p-5 gap-4">
        {/* label */}
        <div className="flex items-center gap-2">
          <CheckSquare size={13} className="text-cyan-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
            Priority
          </span>
        </div>

        {task ? (
          <>
            {/* task title */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white leading-snug line-clamp-2">
                {task.title}
              </h3>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wide ${PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS.medium}`}
                >
                  <PriorityIcon priority={task.priority as any} />
                  {task.priority}
                </span>
                {task.due_date && (
                  <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                    <Clock size={10} />
                    {formatDueTime(task.due_date)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1.5">{task.project_name}</p>
            </div>

            {/* footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              {remainingCount > 1 ? (
                <span className="text-[11px] text-zinc-500">
                  +{remainingCount - 1} more task{remainingCount - 1 > 1 ? "s" : ""}
                </span>
              ) : (
                <span className="text-[11px] text-zinc-600">Only task today</span>
              )}
              <Link
                href="/pro/tasks"
                className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center hover:bg-indigo-500/30 transition-colors"
              >
                <ArrowRight size={13} className="text-indigo-400" />
              </Link>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckSquare size={18} className="text-emerald-400" />
            </div>
            <p className="text-sm text-zinc-400 font-medium">All clear today</p>
            <p className="text-xs text-zinc-600">No urgent tasks</p>
            <Link
              href="/pro/tasks"
              className="mt-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View tasks →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
