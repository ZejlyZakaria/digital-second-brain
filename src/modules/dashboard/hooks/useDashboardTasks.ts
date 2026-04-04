/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/infrastructure/supabase/client";
import type { DashboardTask } from "../types";

const PRIORITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function getWeekBounds() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { weekStart: monday, weekEnd: sunday };
}

async function fetchAllUserTasks(userId: string): Promise<DashboardTask[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      id, title, priority, due_date, updated_at,
      status:statuses(name, color, is_completed),
      project:projects(name)
    `)
    .eq("created_by", userId)
    .eq("is_archived", false)
    .order("due_date", { ascending: true, nullsFirst: false })
    .limit(200);

  if (error) throw error;

  return ((data ?? []) as any[]).map((t) => ({
    id: t.id,
    title: t.title,
    priority: t.priority ?? "medium",
    due_date: t.due_date ?? null,
    project_name: t.project?.name ?? "Unknown",
    status_name: t.status?.name ?? "",
    status_color: t.status?.color ?? null,
    is_completed: t.status?.is_completed ?? false,
  }));
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDashboardTasks(userId: string) {
  const { data: allTasks = [], isLoading } = useQuery({
    queryKey: ["dashboard", "tasks", userId],
    queryFn: () => fetchAllUserTasks(userId),
    staleTime: 1000 * 60 * 2, // 2 min
    enabled: !!userId,
  });

  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);
  const { weekStart, weekEnd } = getWeekBounds();

  const todayTasks = allTasks
    .filter((t) => {
      if (t.is_completed || !t.due_date) return false;
      const d = new Date(t.due_date);
      return d <= todayEnd;
    })
    .sort((a, b) => {
      const pA = PRIORITY_ORDER[a.priority] ?? 4;
      const pB = PRIORITY_ORDER[b.priority] ?? 4;
      return pA - pB;
    });

  const upcomingTasks = allTasks
    .filter((t) => {
      if (t.is_completed || !t.due_date) return false;
      return new Date(t.due_date) > todayEnd;
    })
    .slice(0, 20);

  const completedTasks = allTasks
    .filter((t) => t.is_completed)
    .sort((a, b) => new Date(b.due_date ?? 0).getTime() - new Date(a.due_date ?? 0).getTime())
    .slice(0, 20);

  const overdueCount = allTasks.filter((t) => {
    if (t.is_completed || !t.due_date) return false;
    return new Date(t.due_date) < todayStart;
  }).length;

  const weekTasks = allTasks.filter((t) => {
    if (!t.due_date) return false;
    const d = new Date(t.due_date);
    return d >= weekStart && d <= weekEnd;
  });
  const weekCompleted = weekTasks.filter((t) => t.is_completed).length;
  const weekTotal = weekTasks.length;

  return {
    todayTasks,
    upcomingTasks,
    completedTasks,
    overdueCount,
    weekTotal,
    weekCompleted,
    isLoading,
  };
}
