import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

import type { Status } from "../types/tasks.types";

// =====================================================
// FETCH STATUSES (Kanban columns)
// =====================================================

async function fetchStatuses(projectId: string): Promise<Status[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("statuses")
    .select("*")
    .eq("project_id", projectId)
    .order("position", { ascending: true });

  if (error) throw error;
  return data || [];
}

// =====================================================
// HOOK: useStatuses
// =====================================================

export function useStatuses(projectId: string | null) {
  return useQuery({
    queryKey: ["statuses", projectId],
    queryFn: () => fetchStatuses(projectId!),
    enabled: !!projectId, // Only run if projectId exists
    staleTime: 1000 * 60 * 10, // 10 minutes (statuses rarely change)
  });
}
