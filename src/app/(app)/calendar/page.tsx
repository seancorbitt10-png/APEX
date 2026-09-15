import { SectionHeader } from "@/components/ui/SectionHeader";
import { MOCK_DASHBOARD } from "@/lib/data/mock";
import { cn } from "@/lib/utils/cn";

export const metadata = { title: "Calendar" };

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Calendar"
        title="Practice & competition"
        description="Apex plans around your real schedule — not isolated workouts."
      />

      <section className="apex-card p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold tracking-wide">
          Week at a glance
        </h2>
        <ul className="mt-5 space-y-2">
          {MOCK_DASHBOARD.week.map((day) => (
            <li
              key={day.dayKey}
              className={cn(
                "flex items-center justify-between rounded-[var(--radius-md)] border border-border-subtle px-4 py-3 text-sm",
                day.isToday && "border-accent/40 bg-accent-soft/40",
              )}
            >
              <span className="font-medium">{day.dayLabel}</span>
              <span className="text-text-secondary">{day.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="apex-card p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold tracking-wide">
          Upcoming events
        </h2>
        <ul className="mt-4 space-y-3">
          {MOCK_DASHBOARD.upcoming.map((event) => (
            <li
              key={event.id}
              className="flex items-center justify-between border-b border-border-subtle pb-3 text-sm last:border-0 last:pb-0"
            >
              <div>
                <p className="text-text-muted">{event.whenLabel}</p>
                <p className="font-medium">{event.title}</p>
              </div>
              <p className="text-text-secondary">{event.timeLabel}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
