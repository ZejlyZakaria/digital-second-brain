// lib/utils/watching-config.ts
// single source of truth for all watching section configs

export type MediaType = "film" | "serie" | "anime";

export interface WatchingConfig {
  type: MediaType;
  label: string;           // "film" | "série" | "anime"
  labelPlural: string;
  tmdbSearchType: "movie" | "tv";
  tmdbTrendingEndpoint: string;
  tmdbNowEndpoint: string;
  tmdbAnimeFilter: boolean;
  hasInProgress: boolean;  // TV shows + animes only
  accentColor: string;
}

export const WATCHING_CONFIGS: Record<MediaType, WatchingConfig> = {
  film: {
    type: "film",
    label: "film",
    labelPlural: "films",
    tmdbSearchType: "movie",
    tmdbTrendingEndpoint: "trending/movie/week",
    tmdbNowEndpoint: "movie/now_playing",
    tmdbAnimeFilter: false,
    hasInProgress: false,
    accentColor: "#8b5cf6",
  },
  serie: {
    type: "serie",
    label: "série",
    labelPlural: "séries",
    tmdbSearchType: "tv",
    tmdbTrendingEndpoint: "trending/tv/week",
    tmdbNowEndpoint: "tv/on_the_air",
    tmdbAnimeFilter: false,
    hasInProgress: true,
    accentColor: "#0ea5e9",
  },
  anime: {
    type: "anime",
    label: "anime",
    labelPlural: "animes",
    tmdbSearchType: "tv",
    tmdbTrendingEndpoint: "discover/tv",
    tmdbNowEndpoint: "discover/tv",
    tmdbAnimeFilter: true,
    hasInProgress: true,
    accentColor: "#f43f5e",
  },
};