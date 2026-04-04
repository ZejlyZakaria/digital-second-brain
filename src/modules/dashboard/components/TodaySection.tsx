import TodayPriorityCard from "./TodayPriorityCard";
import TodayUpNextCard from "./TodayUpNextCard";
import TodayInProgressCard from "./TodayInProgressCard";
import type { DashboardData } from "../types";

interface Props {
  data: DashboardData;
}

export default function TodaySection({ data }: Props) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-lg">✦ Today</span>
          <span className="text-zinc-500 text-sm">Your day, intelligently prioritized</span>
        </div>
        {data.tasks.length > 0 && (
          <span className="text-[11px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full">
            {data.tasks.length} priorit{data.tasks.length > 1 ? "ies" : "y"}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TodayPriorityCard
          task={data.priorityTask}
          remainingCount={data.tasks.length}
        />
        <TodayUpNextCard event={data.upNextEvent} />
        <TodayInProgressCard media={data.inProgressMedia} />
      </div>
    </section>
  );
}
