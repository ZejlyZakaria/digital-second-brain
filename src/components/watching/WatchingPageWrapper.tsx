// components/watching/WatchingPageWrapper.tsx
import { Suspense } from "react";
import { createServerClient } from "@/lib/supabase/server";
import WatchingHero from "@/components/watching/WatchingHero";
import WatchingClient from "@/components/watching/WatchingClient";
import TopTenSection from "@/components/watching/sections/TopTenSection";
import InProgressSection from "@/components/watching/sections/InProgressSection";
import RecentlyWatchedSection from "@/components/watching/sections/RecentlyWatchedSection";
import WantToWatchSection from "@/components/watching/sections/WantToWatchSection";
import { MoviesHeroSkeleton, CarouselSkeleton } from "@/components/watching/WatchingSkeletons";
import { WATCHING_CONFIGS, type MediaType } from "@/lib/utils/watching-config";

export default async function WatchingPageWrapper({ type }: { type: MediaType }) {
  const config  = WATCHING_CONFIGS[type];
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-8 text-zinc-500">Connecte-toi pour accéder à ta collection.</div>;
  }

  return (
    <WatchingClient userId={user.id} config={config}>
      {/* hero */}
      <Suspense fallback={<MoviesHeroSkeleton />}>
        <WatchingHero config={config} />
      </Suspense>

      {/* top 10 */}
      <Suspense fallback={<CarouselSkeleton />}>
        <TopTenSection userId={user.id} config={config} />
      </Suspense>

      {/* en cours — séries et animes uniquement */}
      {config.hasInProgress && (
        <Suspense fallback={<CarouselSkeleton />}>
          <InProgressSection userId={user.id} config={config} />
        </Suspense>
      )}

      {/* vu récemment */}
      <Suspense fallback={<CarouselSkeleton />}>
        <RecentlyWatchedSection userId={user.id} config={config} />
      </Suspense>

      {/* à voir */}
      <Suspense fallback={<CarouselSkeleton />}>
        <WantToWatchSection userId={user.id} config={config} />
      </Suspense>
    </WatchingClient>
  );
}