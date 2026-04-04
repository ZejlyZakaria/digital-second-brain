import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { SURFACE_CONFIGS } from "@/modules/sports/tennis/lib/tennis-utils";
import type { DashboardSportEvent } from "../types";

// ─── Gradient per sport ───────────────────────────────────────────────────────

const SPORT_STYLES = {
  football: {
    gradient: "from-emerald-950/70 via-zinc-950 to-zinc-950",
    accent: "via-emerald-500/40",
    badge: "bg-emerald-500/15 border-emerald-500/25 text-emerald-400",
    border: "border-emerald-500/20",
  },
  f1: {
    gradient: "from-red-950/70 via-zinc-950 to-zinc-950",
    accent: "via-red-500/40",
    badge: "bg-red-500/15 border-red-500/25 text-red-400",
    border: "border-red-500/20",
  },
  tennis: {
    gradient: "from-amber-950/70 via-zinc-950 to-zinc-950",
    accent: "via-amber-500/40",
    badge: "bg-amber-500/15 border-amber-500/25 text-amber-400",
    border: "border-amber-500/20",
  },
};

// ─── Football content ─────────────────────────────────────────────────────────

function FootballContent({ event }: { event: DashboardSportEvent }) {
  return (
    <div className="flex-1 flex flex-col gap-3">
      <h3 className="text-lg font-bold text-white leading-snug">
        {event.homeTeam} <span className="text-zinc-500 font-normal text-base">vs</span> {event.awayTeam}
      </h3>
      <div className="flex items-center gap-3">
        {event.homeTeamCrest && (
          <div className="relative w-9 h-9 shrink-0">
            <Image src={event.homeTeamCrest} alt={event.homeTeam ?? ""} fill unoptimized className="object-contain" />
          </div>
        )}
        <span className="text-xs font-black text-zinc-600">VS</span>
        {event.awayTeamCrest && (
          <div className="relative w-9 h-9 shrink-0">
            <Image src={event.awayTeamCrest} alt={event.awayTeam ?? ""} fill unoptimized className="object-contain" />
          </div>
        )}
      </div>
      {event.competition && (
        <p className="text-[11px] text-zinc-500">{event.competition}</p>
      )}
    </div>
  );
}

// ─── F1 content ───────────────────────────────────────────────────────────────

function F1Content({ event }: { event: DashboardSportEvent }) {
  return (
    <div className="flex-1 flex flex-col gap-2">
      <h3 className="text-lg font-bold text-white leading-snug">{event.title}</h3>
      {event.circuit && (
        <div className="flex items-center gap-1.5">
          <MapPin size={11} className="text-zinc-500 shrink-0" />
          <span className="text-[11px] text-zinc-400">{event.circuit}</span>
        </div>
      )}
      {event.country && (
        <p className="text-[11px] text-zinc-600">{event.country}</p>
      )}
    </div>
  );
}

// ─── Tennis content ───────────────────────────────────────────────────────────

function TennisContent({ event }: { event: DashboardSportEvent }) {
  const surfaceConfig = event.surface ? SURFACE_CONFIGS[event.surface as keyof typeof SURFACE_CONFIGS] : null;

  return (
    <div className="flex-1 flex flex-col gap-2">
      <h3 className="text-lg font-bold text-white leading-snug">{event.title}</h3>
      <div className="flex items-center gap-2 flex-wrap">
        {surfaceConfig && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
            style={{
              color: surfaceConfig.accent,
              borderColor: `${surfaceConfig.accent}40`,
              backgroundColor: `${surfaceConfig.accent}15`,
            }}
          >
            {surfaceConfig.label}
          </span>
        )}
        {event.location && (
          <span className="text-[11px] text-zinc-500">{event.location}</span>
        )}
      </div>
    </div>
  );
}

// ─── Main card ────────────────────────────────────────────────────────────────

interface Props {
  event: DashboardSportEvent | null;
}

export default function TodayUpNextCard({ event }: Props) {
  const styles = event ? SPORT_STYLES[event.type] : SPORT_STYLES.f1;

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${event ? styles.border : "border-zinc-800/60"} bg-zinc-950 min-h-50 flex flex-col`}>
      <div className={`absolute inset-0 bg-linear-to-br ${event ? styles.gradient : "from-zinc-900/30 to-zinc-950"} pointer-events-none`} />
      <div className={`absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent ${event ? styles.accent : "via-zinc-700/40"} to-transparent`} />

      <div className="relative flex flex-col flex-1 p-5 gap-4">
        {/* label */}
        <div className="flex items-center gap-2">
          <Calendar size={13} className="text-emerald-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Up Next
          </span>
        </div>

        {event ? (
          <>
            {/* badge */}
            <span className={`self-start text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${styles.badge}`}>
              {event.badge}
            </span>

            {/* sport-specific content */}
            {event.type === "football" && <FootballContent event={event} />}
            {event.type === "f1" && <F1Content event={event} />}
            {event.type === "tennis" && <TennisContent event={event} />}

            {/* footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="text-[11px] text-zinc-400">{event.subtitle}</span>
              <Link
                href={event.href}
                className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                View details
                <ExternalLink size={10} />
              </Link>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center text-xl">
              📅
            </div>
            <p className="text-sm text-zinc-400 font-medium">No upcoming events</p>
            <p className="text-xs text-zinc-600">Check back later</p>
          </div>
        )}
      </div>
    </div>
  );
}
