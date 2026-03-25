/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/utils/tennis-helpers.ts

export interface TennisPlayers {
  favoritePlayers: any[];
  favoritePlayerIds: string[];
  mainPlayerId: string | null;
}

export async function getTennisPlayers(
  supabase: any,
  userId: string
): Promise<TennisPlayers> {
  // favorites
  const { data: favorites } = await supabase
    .schema("sport")
    .from("user_favorites")
    .select("entity_id")
    .eq("user_id", userId)
    .eq("entity_type", "tennis_player");

  const favoritePlayerIds = favorites?.map((f: any) => f.entity_id) ?? [];

  let favoritePlayers: any[] = [];
  if (favoritePlayerIds.length) {
    const { data } = await supabase
      .schema("sport")
      .from("tennis_players")
      .select("id, name, country, photo_thumb_url, photo_cutout_url") 
      .in("id", favoritePlayerIds);
    
    // ✅ Mapper pour avoir photo_url (priorité cutout > thumb)
    favoritePlayers = (data ?? []).map((p: any) => ({
      id: p.id,
      name: p.name,
      country: p.country,
      photo_url: p.photo_thumb_url ?? p.photo_cutout_url ??  null, 
    }));
  }

  // main player
  const { data: settings } = await supabase
    .schema("sport")
    .from("tennis_user_settings")
    .select("main_player_id")
    .eq("user_id", userId)
    .maybeSingle();

  const mainPlayerId = settings?.main_player_id ?? null;

  return { favoritePlayers, favoritePlayerIds, mainPlayerId };
}

// ─── Surface config (inchangé) ────────────────────────────────────────────────

export type Surface = "clay" | "hard" | "grass" | "indoor" | "unknown";

export interface SurfaceConfig {
  label: string;
  bg: string;
  accent: string;
  textAccent: string;
  lines: string;
}

export const SURFACE_CONFIGS: Record<Surface, SurfaceConfig> = {
  clay: {
    label: "Terre battue",
    bg: "linear-gradient(135deg, #7c3a1e 0%, #a0522d 40%, #8b4513 100%)",
    accent: "#e8752a",
    textAccent: "#f4a460",
    lines: "rgba(255,220,150,0.25)",
  },
  hard: {
    label: "Dur",
    bg: "linear-gradient(135deg, #1a3a5c 0%, #1e4d8c 40%, #2563a8 100%)",
    accent: "#3b82f6",
    textAccent: "#93c5fd",
    lines: "rgba(147,197,253,0.25)",
  },
  grass: {
    label: "Gazon",
    bg: "linear-gradient(135deg, #14532d 0%, #166534 40%, #15803d 100%)",
    accent: "#22c55e",
    textAccent: "#86efac",
    lines: "rgba(134,239,172,0.25)",
  },
  indoor: {
    label: "Intérieur",
    bg: "linear-gradient(135deg, #312e81 0%, #3730a3 40%, #4338ca 100%)",
    accent: "#818cf8",
    textAccent: "#c7d2fe",
    lines: "rgba(199,210,254,0.25)",
  },
  unknown: {
    label: "Surface inconnue",
    bg: "linear-gradient(135deg, #18181b 0%, #27272a 40%, #3f3f46 100%)",
    accent: "#71717a",
    textAccent: "#a1a1aa",
    lines: "rgba(161,161,170,0.2)",
  },
};

export function getSurface(tournamentName: string | null): Surface {
  if (!tournamentName) return "unknown";
  const name = tournamentName.toLowerCase();
  if (name.includes("roland") || name.includes("french") || name.includes("clay") ||
      name.includes("barcelona") || name.includes("madrid") || name.includes("rome") ||
      name.includes("monte") || name.includes("hamburg") || name.includes("rio") ||
      name.includes("munich") || name.includes("estoril") || name.includes("geneva")) return "clay";
  if (name.includes("wimbledon") || name.includes("grass") || name.includes("halle") ||
      name.includes("queens") || name.includes("hertogenbosch") || name.includes("stuttgart")) return "grass";
  if (name.includes("indoor") || name.includes("paris masters") || name.includes("nitto") ||
      name.includes("rotterdam") || name.includes("vienna") || name.includes("basel") ||
      name.includes("atp finals")) return "indoor";
  return "hard";
}