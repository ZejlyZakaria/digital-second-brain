import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Workspace } from "../types/tasks.types";

// =====================================================
// FETCH WORKSPACES
// =====================================================

async function fetchWorkspaces(): Promise<Workspace[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .order("position", { ascending: true });

  if (error) throw error;
  return data || [];
}

// =====================================================
// HOOK: useWorkspaces
// =====================================================

export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: fetchWorkspaces,
    staleTime: 1000 * 60 * 10, // 10 minutes (workspaces don't change often)
  });
}
