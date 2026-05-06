import type { Achievement } from "@/lib/ctftime/types";
import { formatDateShort } from "@/lib/utils/date";
import { ordinal, rankColor, rankColorClass } from "@/lib/utils/rank";
import { ExternalLink } from "@/components/ui/ExternalLink";

interface AchievementRowProps {
  item: Achievement;
}

export function AchievementRow({ item }: AchievementRowProps) {
  const dateLabel = item.date ? formatDateShort(item.date) : String(item.year);

  const rankStyle = {
    color: rankColor(item.place),
    fontFamily: "var(--font-display)",
  };

  return (
    <div
      className="group flex items-center gap-4 py-3 px-2 anim-slide-left transition-colors duration-150 hover:bg-[var(--surface)]"
      style={{
        borderBottom: "1px solid var(--line-soft)",
      }}
    >
      {/* Rank badge */}
      <div
        className={`text-[13px] font-mono min-w-[52px] ${rankColorClass(item.place)}`}
        style={rankStyle}
      >
        [{ordinal(item.place).toUpperCase()}]
      </div>

      {/* Event name */}
      <div className="flex-1 min-w-0">
        {item.eventUrl ? (
          <ExternalLink
            href={item.eventUrl}
            className="text-[14px] font-medium truncate block transition-colors duration-150 group-hover:text-[var(--accent-red)]"
            style={{ color: "var(--text)" }}
          >
            {item.eventName}
          </ExternalLink>
        ) : (
          <span className="text-[14px] font-medium truncate block" style={{ color: "var(--text)" }}>
            {item.eventName}
          </span>
        )}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px]" style={{ color: "var(--muted)" }}>
          <time dateTime={item.date ?? String(item.year)}>{dateLabel}</time>
          {(item.ctfPoints || item.ratingPoints) && <span style={{ color: "var(--muted-2)" }}>·</span>}
          {item.ctfPoints && <span>{item.ctfPoints.toFixed(0)} pts</span>}
          {item.ctfPoints && item.ratingPoints && <span style={{ color: "var(--muted-2)" }}>·</span>}
          {item.ratingPoints && <span>{item.ratingPoints.toFixed(3)} rating</span>}
        </div>
      </div>

      {/* Month */}
      <div
        className="text-[12px] tracking-[0.12em] min-w-[32px] text-right"
        style={{ fontFamily: "var(--font-display)", color: "var(--muted)" }}
      >
        {item.month ?? ""}
      </div>
    </div>
  );
}
