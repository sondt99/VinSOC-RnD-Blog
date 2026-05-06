import { siteConfig } from "@/config/site";
import type { Achievement } from "@/lib/ctftime/types";
import { AchievementRow } from "./AchievementRow";

interface AchievementListProps {
  grouped: Record<string, Achievement[]>;
  filteredYear?: string;
  filterPlace?: number;
  searchQuery?: string;
}

function byDateDesc(a: Achievement, b: Achievement): number {
  const aDate = a.date ? new Date(a.date).getTime() : Number.MIN_SAFE_INTEGER;
  const bDate = b.date ? new Date(b.date).getTime() : Number.MIN_SAFE_INTEGER;
  if (aDate !== bDate) return bDate - aDate;
  return a.eventName.localeCompare(b.eventName);
}

export function AchievementList({
  grouped,
  filteredYear,
  filterPlace,
  searchQuery,
}: AchievementListProps) {
  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  const filtered = filteredYear ? years.filter((y) => String(y) === filteredYear) : years;

  return (
    <div className="space-y-10">
      {filtered.map((year) => {
        const maxPlace = filterPlace ?? siteConfig.achievements.defaultMaxPlace;
        let events = [...(grouped[String(year)] ?? [])]
          .filter((event) => event.place <= maxPlace)
          .sort(byDateDesc);

        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          events = events.filter((e) => e.eventName.toLowerCase().includes(q));
        }

        if (events.length === 0) return null;

        return (
          <section key={year}>
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-[28px] font-bold tracking-[0.22em]"
                style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
              >
                {year}
              </h2>
              <span
                className="text-[11px] tracking-[0.16em] uppercase"
                style={{ fontFamily: "var(--font-display)", color: "var(--muted)" }}
              >
                {events.length} EVENT{events.length !== 1 ? "S" : ""} · TOP {maxPlace} · NEWEST FIRST
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {events.map((item, i) => (
                <AchievementRow key={`${item.eventName}-${i}`} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
