import { Suspense } from "react";
import { getCachedVinSOCAchievements } from "@/lib/ctftime/cache";
import { PageHero } from "@/components/layout/PageHero";
import { CTFtimeSummary } from "@/components/achievements/CTFtimeSummary";
import { AchievementList } from "@/components/achievements/AchievementList";
import { AchievementFilters } from "@/components/achievements/AchievementFilters";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Metadata } from "next";

export const revalidate = 21600;

export const metadata: Metadata = {
  title: "Achievements",
  description: "VinSOC RnD CTF competitive history and rankings.",
};

interface Props {
  searchParams: Promise<{ year?: string; place?: string; q?: string }>;
}

export default async function AchievementsPage({ searchParams }: Props) {
  const sp = await searchParams;
  let data;
  try {
    data = await getCachedVinSOCAchievements();
  } catch {
    return (
      <div>
        <PageHero title="ACHIEVEMENTS" subtitle="HONORS & COMPETITIVE HISTORY" />
        <div className="max-w-[1040px] mx-auto px-5 py-10">
          <EmptyState
            title="CTFtime temporarily unavailable"
            description="Please check back later."
          />
        </div>
      </div>
    );
  }

  const years = Object.keys(data.grouped).sort((a, b) => Number(b) - Number(a));
  const filterPlace = sp.place ? parseInt(sp.place, 10) : undefined;

  return (
    <div>
      <PageHero title="ACHIEVEMENTS" subtitle="HONORS & COMPETITIVE HISTORY" />
      <div className="max-w-[1040px] mx-auto px-5 py-10">
        <CTFtimeSummary data={data} />

        <Suspense>
          <AchievementFilters years={years} />
        </Suspense>

        {data.achievements.length === 0 ? (
          <EmptyState title="No results found" description="No CTFtime results to display." />
        ) : (
          <AchievementList
            grouped={data.grouped}
            filteredYear={sp.year}
            filterPlace={filterPlace}
            searchQuery={sp.q}
          />
        )}
      </div>
    </div>
  );
}
