import Link from "next/link";
import { Play, Tv } from "lucide-react";
import type { DashboardMedia } from "../types";

const TYPE_LABELS: Record<string, string> = {
  film: "Movie",
  serie: "Series",
  anime: "Anime",
};

interface Props {
  media: DashboardMedia | null;
}

export default function TodayInProgressCard({ media }: Props) {
  const progress =
    media?.current_episode && media?.episodes
      ? Math.round((media.current_episode / media.episodes) * 100)
      : null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-zinc-950 min-h-50 flex flex-col">
      {/* poster as subtle background */}
      {media?.poster_url && (
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url(${media.poster_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
      )}
      {/* dark overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/90 to-zinc-950/60 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-violet-500/50 to-transparent" />

      <div className="relative flex flex-col flex-1 p-5 gap-4">
        {/* label */}
        <div className="flex items-center gap-2">
          <Play size={13} className="text-violet-400 fill-violet-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">
            In Progress
          </span>
        </div>

        {media ? (
          <>
            <div className="flex-1 flex flex-col gap-2">
              {/* type badge */}
              <span className="self-start text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border bg-violet-500/15 border-violet-500/25 text-violet-400">
                {TYPE_LABELS[media.type] ?? media.type}
              </span>

              {/* title */}
              <h3 className="text-lg font-bold text-white leading-snug line-clamp-2">
                {media.title}
              </h3>

              {/* episode info */}
              {(media.type === "serie" || media.type === "anime") &&
                media.current_season && media.current_episode && (
                  <p className="text-[11px] text-zinc-400">
                    S{media.current_season} · E{media.current_episode}
                    {media.episodes ? ` / ${media.episodes}` : ""}
                  </p>
                )}
            </div>

            {/* progress bar */}
            {progress !== null && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-600">Progress</span>
                  <span className="text-[10px] text-zinc-500 font-medium">{progress}%</span>
                </div>
                <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-violet-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="text-[11px] text-zinc-500">Continue watching</span>
              <Link
                href="/perso/watching"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/20 border border-violet-500/30 text-[11px] font-semibold text-violet-300 hover:bg-violet-500/30 transition-colors"
              >
                <Play size={10} className="fill-violet-300" />
                Continue
              </Link>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center">
              <Tv size={18} className="text-zinc-500" />
            </div>
            <p className="text-sm text-zinc-400 font-medium">Nothing in progress</p>
            <Link
              href="/perso/watching"
              className="mt-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              Browse watching →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
