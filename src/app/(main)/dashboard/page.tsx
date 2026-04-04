import { redirect } from "next/navigation";
import { createServerClient } from "@/infrastructure/supabase/server";
import { getDashboardData } from "@/modules/dashboard/service";
import TodaySection from "@/modules/dashboard/components/TodaySection";
import UpcomingInSports from "@/modules/dashboard/components/UpcomingInSports";
import TasksSection from "@/modules/dashboard/components/TasksSection";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const data = await getDashboardData(user.id);

  // Get display name from user metadata or email
  const userName =
    user.user_metadata?.full_name?.split(" ")[0] ??
    user.user_metadata?.name?.split(" ")[0] ??
    user.email?.split("@")[0] ??
    "there";

  return (
    <div className="min-h-screen bg-[#09090b] overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {formatDate()}
          </h1>
          <p className="text-zinc-400 mt-1">
            {getGreeting()}, {userName}
          </p>
        </div>

        {/* Today — 3 dynamic cards */}
        <TodaySection data={data} />

        {/* Upcoming in Sports */}
        <UpcomingInSports events={data.sportEvents} />

        {/* Your Tasks */}
        <TasksSection userId={user.id} />

      </div>
    </div>
  );
}
