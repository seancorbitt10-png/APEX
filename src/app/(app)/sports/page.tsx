import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SportBadge, SportIcon } from "@/components/ui/SportBadge";
import { getAllSports } from "@/lib/sports/registry";
import { MOCK_ATHLETE } from "@/lib/data/mock";
import { cn } from "@/lib/utils/cn";

export const metadata = { title: "Sports" };

export default function SportsPage() {
  const sports = getAllSports();

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Sports"
        title="Your sport context"
        description="Baseball is active for V1. Additional sports enable through the shared registry — no app rebuild required."
      />

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sports.map((sport) => {
          const isPrimary = sport.id === MOCK_ATHLETE.primarySportId;
          const content = (
            <div
              className={cn(
                "apex-card flex h-full flex-col gap-4 p-5 transition-colors",
                sport.enabled
                  ? "hover:border-accent/40 hover:bg-surface-elevated"
                  : "opacity-55",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface-elevated text-accent">
                  <SportIcon icon={sport.icon} className="h-5 w-5" />
                </span>
                {isPrimary ? (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                    Primary
                  </span>
                ) : !sport.enabled ? (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    Coming later
                  </span>
                ) : null}
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold tracking-wide">
                  {sport.name}
                </h2>
                <p className="mt-1 text-xs text-text-muted">
                  id: {sport.id}
                </p>
              </div>
              {sport.enabled ? <SportBadge sport={sport} /> : null}
            </div>
          );

          return (
            <li key={sport.id}>
              {sport.enabled ? (
                <Link href={`/sports/${sport.id}`}>{content}</Link>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
