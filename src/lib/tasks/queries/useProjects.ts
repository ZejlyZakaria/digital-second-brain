import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "../types/tasks.types";

// =====================================================
// FETCH PROJECTS
// =====================================================

async function fetchProjects(workspaceId: string): Promise<Project[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      workspace:workspaces(*)
    `,
    )
    .eq("workspace_id", workspaceId)
    .eq("status", "active")
    .order("position", { ascending: true });

  if (error) throw error;
  return data || [];
}

// =====================================================
// HOOK: useProjects
// =====================================================

export function useProjects(workspaceId: string | null) {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () => fetchProjects(workspaceId!),
    enabled: !!workspaceId, // Only run if workspaceId exists
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
