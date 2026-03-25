/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/utils/tmdb.ts

const TMDB_BASE = "https://api.themoviedb.org/3";

// server-side: calls TMDB directly (API key never exposed)
// client-side: goes through /api/tmdb proxy
async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const isServer = typeof window === "undefined";

  if (isServer) {
    const key = process.env.TMDB_API_KEY;
    if (!key) throw new Error("TMDB_API_KEY not set");
    const search = new URLSearchParams({ api_key: key, language: "fr-FR", ...params });
    const res = await fetch(`${TMDB_BASE}/${endpoint}?${search.toString()}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
    return res.json();
  }

  // client-side → proxy route
  const search = new URLSearchParams({ endpoint, language: "fr-FR", ...params });
  const res = await fetch(`/api/tmdb?${search.toString()}`);
  if (!res.ok) throw new Error(`TMDB fetch failed: ${res.status}`);
  return res.json();
}

// trending movie of the week (rating > 7, used for hero)
export async function getTrendingMovie() {
  const data = await tmdbFetch<{ results: any[] }>("trending/movie/week");
  return data.results.find((m) => m.vote_average >= 7 && m.vote_count >= 100) ?? data.results[0] ?? null;
}

// trending tv show of the week
export async function getTrendingTV(extraParams: Record<string, string> = {}) {
  const today = new Date().toISOString().split("T")[0];
  const data = await tmdbFetch<{ results: any[] }>("discover/tv", {
    sort_by: "first_air_date.desc",
    "vote_average.gte": "7",
    "vote_count.gte": "50",
    "first_air_date.lte": today,
    include_adult: "false",
    page: "1",
    ...extraParams,
  });
  return data.results.slice(0, 3);
}

// search movies or tv
export async function searchTMDB(query: string, type: "movie" | "tv") {
  const data = await tmdbFetch<{ results: any[] }>(`search/${type}`, {
    query: encodeURIComponent(query),
    page: "1",
  });
  return data.results.slice(0, 6);
}

// movie or tv details with credits
export async function getMediaDetails(id: number, type: "movie" | "tv") {
  return tmdbFetch<any>(`${type}/${id}`, { append_to_response: "credits" });
}

// genre list
export async function getGenres(type: "movie" | "tv") {
  const data = await tmdbFetch<{ genres: { id: number; name: string }[] }>(`genre/${type}/list`);
  return data.genres;
}

// genre id → name map
export const genreIdToName: Record<number, string> = {
  12: "Adventure", 14: "Fantasy", 16: "Animation", 18: "Drama",
  27: "Horror", 28: "Action", 35: "Comedy", 36: "History",
  37: "Western", 53: "Thriller", 80: "Crime", 99: "Documentary",
  878: "Sci-Fi", 9648: "Mystery", 10402: "Music", 10749: "Romance",
  10751: "Family", 10752: "War", 10759: "Action & Adventure",
  10762: "Kids", 10765: "Sci-Fi & Fantasy", 10768: "War & Politics",
  10770: "TV Movie",
};

export function mapTmdbGenres(genreIds: number[]): string[] {
  return genreIds
    .map((id) => genreIdToName[id])
    .filter(Boolean) as string[];
}