import type { AchievementsResponse } from "@/lib/ctftime/types";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { formatDate } from "@/lib/utils/date";

interface CTFtimeSummaryProps {
  data: AchievementsResponse;
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex flex-col gap-1 p-4 rounded-[14px]"
      style={{ border: "1px solid var(--line)", background: "var(--surface)" }}
    >
      <span
        className="text-[10px] tracking-[0.16em] uppercase"
        style={{ fontFamily: "var(--font-display)", color: "var(--muted)" }}
      >
        {label}
      </span>
      <span
        className="text-[22px] font-bold"
        style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
      >
        {value}
      </span>
    </div>
  );
}

export function CTFtimeSummary({ data }: CTFtimeSummaryProps) {
  const { team, stale, lastUpdated } = data;

  return (
    <div className="mb-10">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {team.overallPlace != null && (
          <StatCard label="Overall Rank" value={`#${team.overallPlace}`} />
        )}
        {team.countryPlace != null && (
          <StatCard
            label={`${team.country ? (new Intl.DisplayNames(["en"], { type: "region" }).of(team.country) ?? team.country) : "Country"} Rank`}
            value={`#${team.countryPlace}`}
          />
        )}
        {team.ratingPoints != null && (
          <StatCard label="Rating Points" value={team.ratingPoints.toFixed(1)} />
        )}
        <StatCard label="Team" value={team.name} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-[12px]" style={{ color: "var(--muted)" }}>
        <div className="flex items-center gap-3">
          <ExternalLink
            href={team.profileUrl}
            className="hover:text-[var(--accent-red)] transition-colors underline"
          >
            CTFtime profile
          </ExternalLink>
          {stale && (
            <span
              className="px-2 py-0.5 rounded text-[11px]"
              style={{
                background: "var(--surface-muted)",
                border: "1px solid var(--line)",
                color: "var(--accent-orange)",
              }}
            >
              Cached data
            </span>
          )}
        </div>
        <span>Updated: {formatDate(lastUpdated, "MMM d, yyyy HH:mm")}</span>
      </div>
    </div>
  );
}
