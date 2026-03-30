"use client";

import { TasksLayout } from "@/components/tasks/layout/TasksLayout";
import { KanbanBoard } from "@/components/tasks/kanban/KanbanBoard";
import { CalendarView } from "@/components/tasks/calendar/CalendarView";
import { ListView } from "@/components/tasks/list";
import { useTasksStore } from "@/lib/tasks/stores/tasksStore";

export default function TasksPage() {
  const { viewMode } = useTasksStore();

  return (
    <TasksLayout>
      {viewMode === "kanban" && <KanbanBoard />}
      {viewMode === "list" && <ListView />}
      {viewMode === "calendar" && <CalendarView />}
    </TasksLayout>
  );
}