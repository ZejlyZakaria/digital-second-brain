/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/utils/football-helpers.ts
// shared helpers for football server components

import { createServerClient } from "@/lib/supabase/server";

// ─── types ────────────────────────────────────────────────────────────────────

export interface FootballTeams {
  mainTeam: any;
  mainTeamId: string | null;
  otherFavoriteTeams: any[];
  allFavoriteTeamIds: string[];
  allTeams: Record<string, any>;
}



export async function getFootballTeams(userId: string) {
  const supabase = await createServerClient();

  // main team
  const { data: settings } = await supabase
    .schema("sport").from("football_user_settings")
    .select("main_team_id").eq("user_id", userId).maybeSingle();

  const mainTeamId = settings?.main_team_id ?? null;
  let mainTeam = null;
  if (mainTeamId) {
    const { data } = await supabase.schema("sport").from("football_teams")
      .select("id, name, crest_url, api_external_id").eq("id", mainTeamId).maybeSingle();
    mainTeam = data ?? null;
  }

  // favorites
  const { data: favorites } = await supabase.schema("sport").from("user_favorites")
    .select("entity_id").eq("user_id", userId).eq("entity_type", "football_team");

  const favoriteIds = favorites?.map((f: any) => f.entity_id) ?? [];
  const otherFavoriteIds = mainTeamId
    ? favoriteIds.filter((id: string) => id !== mainTeamId)
    : favoriteIds;

  let otherFavoriteTeams: any[] = [];
  if (otherFavoriteIds.length) {
    const { data } = await supabase.schema("sport").from("football_teams")
      .select("id, name, crest_url, api_external_id").in("id", otherFavoriteIds);
    otherFavoriteTeams = data ?? [];
  }

  const allFavoriteTeamIds: string[] = [
    ...(mainTeamId ? [mainTeamId] : []),
    ...otherFavoriteIds,
  ];

  const allTeams: Record<string, any> = {};
  if (mainTeam) allTeams[mainTeam.id] = mainTeam;
  for (const t of otherFavoriteTeams) allTeams[t.id] = t;

  return { mainTeam, mainTeamId, otherFavoriteTeams, allFavoriteTeamIds, allTeams };
}

export async function getCrestsByExternalIds(externalIds: string[]) {
  if (!externalIds.length) return {};
  const supabase = await createServerClient();
  const { data } = await supabase.schema("sport").from("football_teams")
    .select("api_external_id, crest_url").in("api_external_id", externalIds);
  const map: Record<string, string | null> = {};
  for (const t of data ?? []) map[t.api_external_id] = t.crest_url;
  return map;
}

// ─── shared display helpers ───────────────────────────────────────────────────

const COMPETITION_DISPLAY: Record<string, string> = {
  "Primera Division": "La Liga",
  "UEFA Champions League": "Champions League",
  "Premier League": "Premier League",
};

export function displayCompetition(name: string | null): string {
  if (!name) return "";
  return COMPETITION_DISPLAY[name] ?? name;
}

export function formatMatchDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}