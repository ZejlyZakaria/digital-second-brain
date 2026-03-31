"use client";

import { TasksLayout } from "@/components/tasks/layout/TasksLayout";
import { KanbanBoard } from "@/components/tasks/kanban/KanbanBoard";
import { CalendarView } from "@/components/tasks/calendar/CalendarView";
import { ListView } from "@/components/tasks/list";
import { TasksEmptyState } from "@/components/tasks/TasksEmptyState";
import { TasksSkeleton } from "@/components/tasks/TasksSkeletons";
import { useTasksStore } from "@/lib/tasks/stores/tasksStore";
import { useWorkspaces } from "@/lib/tasks/queries/useWorkspaces";
import { useProjects } from "@/lib/tasks/queries/useProjects";

export default function TasksPage() {
  const { viewMode } = useTasksStore();
  const { data: workspaces, isLoading: workspacesLoading } = useWorkspaces();

  const firstWorkspaceId = workspaces?.[0]?.id ?? null;
  // Only runs when a workspace exists
  const { data: projects, isLoading: projectsLoading } = useProjects(firstWorkspaceId);

  // Still resolving
  const isLoading =
    workspacesLoading ||
    (!!firstWorkspaceId && projectsLoading);

  if (isLoading) return <TasksSkeleton />;

  // No workspace at all, OR workspace exists but no projects
  const isEmpty = !workspaces?.length || !projects?.length;

  if (isEmpty) return <TasksEmptyState />;

  return (
    <TasksLayout>
      {viewMode === "kanban" && <KanbanBoard />}
      {viewMode === "list" && <ListView />}
      {viewMode === "calendar" && <CalendarView />}
    </TasksLayout>
  );
}
