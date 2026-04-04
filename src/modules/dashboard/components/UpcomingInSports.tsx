import Image from "next/image";
import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import { SURFACE_CONFIGS } from "@/modules/sports/tennis/lib/tennis-utils";
import type { DashboardSportEvent } from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCountdown(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return { label: "Live", urgent: true };
  const days = Math.floor(diff / 86400000);
  if (days === 0) return { label: "Today", urgent: true };
  if (days === 1) return { label: "Tomorrow", urgent: false };
  return { label: `D-${days}`, urgent: false };
}

// ─── Badge per sport ──────────────────────────────────────────────────────────

const BADGE_STYLES = {
  FOOTBALL: "bg-emerald-500/15 border-emerald-500/25 text-emerald-400",
  RACING: "bg-red-500/15 border-red-500/25 text-red-400",
  TENNIS: "bg-amber-500/15 border-amber-500/25 text-amber-400",
};

// ─── Individual event card ────────────────────────────────────────────────────

function SportEventCard({ event }: { event: DashboardSportEvent }) {
  const countdown = getCountdown(event.date);
  const badgeClass = BADGE_STYLES[event.badge as keyof typeof BADGE_STYLES] ?? BADGE_STYLES.FOOTBALL;

  return (
    <Link
      href={event.href}
      className="group relative shrink-0 w-65 overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/40 hover:border-zinc-700/80 hover:bg-zinc-900/70 transition-all duration-200"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-zinc-700/40 to-transparent" />

      <div className="p-4 flex flex-col gap-3">
        {/* top row: badge + countdown */}
        <div className="flex items-center justify-between">
          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${badgeClass}`}>
            {event.badge}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            countdown.urgent
              ? "bg-amber-500/10 border border-amber-500/25 text-amber-400"
              : "bg-zinc-800 border border-zinc-700/60 text-zinc-400"
          }`}>
            {countdown.label}
          </span>
        </div>

        {/* Football: show crests */}
        {event.type === "football" && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              {event.homeTeamCrest ? (
                <div className="relative w-8 h-8 shrink-0">
                  <Image src={event.homeTeamCrest} alt={event.homeTeam ?? ""} fill unoptimized className="object-contain" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm shrink-0">⚽</div>
              )}
              <span className="text-[11px] font-semibold text-white truncate">{event.homeTeam}</span>
            </div>
            <span className="text-[9px] font-black text-zinc-600 shrink-0">VS</span>
            <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
              <span className="text-[11px] font-semibold text-zinc-400 truncate text-right">{event.awayTeam}</span>
              {event.awayTeamCrest ? (
                <div className="relative w-8 h-8 shrink-0">
                  <Image src={event.awayTeamCrest} alt={event.awayTeam ?? ""} fill unoptimized className="object-contain" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm shrink-0">⚽</div>
              )}
            </div>
          </div>
        )}

        {/* F1: title + circuit */}
        {event.type === "f1" && (
          <div className="space-y-1.5">
            <p className="text-sm font-bold text-white leading-snug">{event.title}</p>
            {event.circuit && (
              <div className="flex items-center gap-1">
                <MapPin size={10} className="text-zinc-600 shrink-0" />
                <span className="text-[11px] text-zinc-500 truncate">{event.circuit}</span>
              </div>
            )}
          </div>
        )}

        {/* Tennis: tournament + surface */}
        {event.type === "tennis" && (
          <div className="space-y-1.5">
            <p className="text-sm font-bold text-white leading-snug">{event.title}</p>
            <div className="flex items-center gap-2">
              {event.surface && (() => {
                const cfg = SURFACE_CONFIGS[event.surface as keyof typeof SURFACE_CONFIGS];
                return cfg ? (
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border"
                    style={{ color: cfg.accent, borderColor: `${cfg.accent}40`, backgroundColor: `${cfg.accent}15` }}
                  >
                    {cfg.label}
                  </span>
                ) : null;
              })()}
              {event.location && (
                <span className="text-[11px] text-zinc-500 truncate">{event.location}</span>
              )}
            </div>
          </div>
        )}

        {/* date */}
        <p className="text-[11px] text-zinc-500">{event.subtitle}</p>
      </div>
    </Link>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

interface Props {
  events: DashboardSportEvent[];
}

export default function UpcomingInSports({ events }: Props) {
  if (!events.length) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-lg">Upcoming in Sports</span>
          <span className="text-zinc-500 text-sm">What&apos;s coming up in your world</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/perso/sports"
            className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors font-medium"
          >
            View all
            <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {events.map((event, i) => (
          <SportEventCard key={`${event.type}-${i}`} event={event} />
        ))}
      </div>
    </section>
  );
}
