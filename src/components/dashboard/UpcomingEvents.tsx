import { cn } from "@/lib/utils/cn";
import type { UpcomingEvent } from "@/lib/types/training";

interface UpcomingEventsProps {
  events: UpcomingEvent[];
  className?: string;
}

export function UpcomingEvents({ events, className }: UpcomingEventsProps) {
  return (
    <section
      className={cn("apex-card p-5 sm:p-6 animate-fade-up-delay-3", className)}
      aria-labelledby="upcoming-heading"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
        Schedule
      </p>
      <h2
        id="upcoming-heading"
        className="mt-1 font-display text-xl font-semibold tracking-wide"
      >
        Upcoming
      </h2>

      <ul className="mt-5 space-y-3">
        {events.map((event) => (
          <li
            key={event.id}
            className="flex items-start justify-between gap-3 rounded-[var(--radius-md)] border border-border-subtle bg-surface-elevated/60 px-3.5 py-3"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                {event.whenLabel}
              </p>
              <p className="mt-1 text-sm font-medium text-text-primary">
                {event.title}
              </p>
            </div>
            <p className="shrink-0 text-sm text-text-secondary">{event.timeLabel}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
