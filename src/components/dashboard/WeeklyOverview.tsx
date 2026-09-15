import { cn } from "@/lib/utils/cn";
import type { SessionKind, WeekDayOverview } from "@/lib/types/training";

const kindStyles: Record<SessionKind, string> = {
  training: "border-accent/40 bg-accent-soft text-accent",
  practice: "border-info/40 bg-[rgba(90,168,232,0.12)] text-info",
  game: "border-warning/40 bg-[rgba(232,184,74,0.12)] text-warning",
  recovery: "border-border bg-surface-hover text-text-secondary",
  rest: "border-border bg-surface-hover text-text-muted",
};

interface WeeklyOverviewProps {
  days: WeekDayOverview[];
}

export function WeeklyOverview({ days }: WeeklyOverviewProps) {
  return (
    <section className="apex-card p-5 sm:p-6 animate-fade-up-delay-2" aria-labelledby="week-heading">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
            This Week
          </p>
          <h2 id="week-heading" className="mt-1 font-display text-xl font-semibold tracking-wide">
            Training Overview
          </h2>
        </div>
        <p className="hidden text-xs text-text-muted sm:block">
          Built around practice & competition
        </p>
      </div>

      <ul className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((day) => (
          <li key={day.dayKey}>
            <div
              className={cn(
                "flex min-h-[88px] flex-col items-center justify-between rounded-[var(--radius-md)] border px-1 py-2 text-center sm:min-h-[100px] sm:px-2 sm:py-3",
                kindStyles[day.kind],
                day.isToday && "ring-1 ring-accent/60 shadow-[0_0_16px_var(--accent-glow)]",
              )}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80 sm:text-[11px]">
                {day.dayLabel}
              </span>
              <span className="text-[10px] font-medium leading-tight sm:text-xs">
                {day.label}
              </span>
              {day.isToday ? (
                <span className="text-[9px] font-semibold uppercase tracking-wide">
                  Today
                </span>
              ) : (
                <span className="h-3" />
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
