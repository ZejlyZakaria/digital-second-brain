export type Category = "movies" | "tvshows" | "anime";

export type WatchItem = {
  priority_level: string;
  id: string;
  type: "film" | "serie" | "anime";
  title: string;
  original_title: string;
  description: string;
  poster_url: string;
  backdrop_url: string;
  year: number;
  runtime: number | null;
  episode_runtime?: number;
  seasons?: number;
  episodes?: number;
  current_episode?: number;
  current_season?: number;
  in_progress: boolean
  rating: number;
  user_rating: number;
  watched: boolean;
  want_to_watch: boolean;
  favorite: boolean;
  watched_at: string | null;
  priority: number;
  tmdb_id: number;
  notes: string;
  tags: string[];
  directors?: { name: string; profile_url?: string }[]; // plusieurs réalisateurs possibles
  studio?: string; // compagnie principale
  status?: "ended" | "ongoing"; 
  created_at: string;
};

export const genreColors: Record<string, string> = {
  "Sci-Fi": "bg-cyan-500/15 text-cyan-400",
  Thriller: "bg-amber-500/15 text-amber-400",
  Noir: "bg-zinc-500/15 text-zinc-300",
  Fantasy: "bg-emerald-500/15 text-emerald-400",
  Adventure: "bg-lime-500/15 text-lime-400",
  Mecha: "bg-red-500/15 text-red-400",
  Action: "bg-orange-500/15 text-orange-400",
  Drama: "bg-blue-500/15 text-blue-400",
  Psychological: "bg-indigo-500/15 text-indigo-400",
  War: "bg-stone-500/15 text-stone-300",
  "Slice of Life": "bg-pink-500/15 text-pink-400",
  Romance: "bg-rose-500/15 text-rose-400",
  Horror: "bg-red-500/15 text-red-400",
  Mystery: "bg-violet-500/15 text-violet-400",
  Crime: "bg-amber-500/15 text-amber-400",
  "Dark Fantasy": "bg-indigo-500/15 text-indigo-400",
};


