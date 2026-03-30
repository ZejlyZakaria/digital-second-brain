"use client";

import { useTasksStore } from "@/lib/tasks/stores/tasksStore";
import { TasksSidebar } from "./TasksSidebar";
import { TasksTopbar } from "./TasksTopbar";
import { useWorkspaces } from "@/lib/tasks/queries/useWorkspaces";
import { useProjects } from "@/lib/tasks/queries/useProjects";
// =====================================================
// TASKS LAYOUT
// Combines: Global Sidebar (already rendered) + Tasks Sidebar + Topbar + Content
// =====================================================

interface TasksLayoutProps {
  children: React.ReactNode;
}

export function TasksLayout({ children }: TasksLayoutProps) {
  const { selectedProjectId } = useTasksStore();
  
  // Check si user a des projets
  const { data: workspaces } = useWorkspaces();
  const firstWorkspaceId = workspaces?.[0]?.id ?? null;
  const { data: allProjects } = useProjects(firstWorkspaceId);
  const hasProjects = allProjects && allProjects.length > 0;

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Sidebar SEULEMENT si projets existent */}
      {hasProjects && <TasksSidebar />}

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Topbar SEULEMENT si projet sélectionné */}
        {selectedProjectId && <TasksTopbar />}

        <div className="flex-1 overflow-y-auto relative">
          {children}
        </div>
      </div>
    </div>
  );
}