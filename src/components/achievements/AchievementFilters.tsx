"use client";

import { siteConfig } from "@/config/site";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const PLACE_OPTIONS = [
  { label: `TOP ${siteConfig.achievements.defaultMaxPlace}`, value: "" },
  ...siteConfig.achievements.placeFilters.map((place) => ({
    label: `TOP ${place}`,
    value: String(place),
  })),
];

interface AchievementFiltersProps {
  years: string[];
}

export function AchievementFilters({ years }: AchievementFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentYear = searchParams.get("year") ?? "";
  const currentPlace = searchParams.get("place") ?? "";

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {/* Year filter */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => update("year", "")}
          className="text-[11px] tracking-[0.12em] uppercase px-3 py-1.5 rounded-full border transition-all duration-150"
          style={{
            fontFamily: "var(--font-display)",
            background: !currentYear ? "var(--accent-red)" : "var(--surface)",
            color: !currentYear ? "white" : "var(--text-soft)",
            borderColor: !currentYear ? "var(--accent-red)" : "var(--line)",
          }}
        >
          ALL YEARS
        </button>
        {years.map((year) => (
          <button
            key={year}
            onClick={() => update("year", year)}
            className="text-[11px] tracking-[0.12em] uppercase px-3 py-1.5 rounded-full border transition-all duration-150"
            style={{
              fontFamily: "var(--font-display)",
              background: currentYear === year ? "var(--accent-red)" : "var(--surface)",
              color: currentYear === year ? "white" : "var(--text-soft)",
              borderColor: currentYear === year ? "var(--accent-red)" : "var(--line)",
            }}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Place filter */}
      <div className="flex flex-wrap gap-1.5">
        {PLACE_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            onClick={() => update("place", opt.value)}
            className="text-[11px] tracking-[0.12em] uppercase px-3 py-1.5 rounded-full border transition-all duration-150"
            style={{
              fontFamily: "var(--font-display)",
              background: currentPlace === opt.value ? "var(--accent-orange)" : "var(--surface)",
              color: currentPlace === opt.value ? "white" : "var(--text-soft)",
              borderColor: currentPlace === opt.value ? "var(--accent-orange)" : "var(--line)",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
