import Link from "next/link";
import { SportBadge } from "@/components/ui/SportBadge";
import { getSport } from "@/lib/sports/registry";
import type { DailyPlan } from "@/lib/types/training";
import { cn } from "@/lib/utils/cn";

interface TrainingHeroCardProps {
  plan: DailyPlan;
}

export function TrainingHeroCard({ plan }: TrainingHeroCardProps) {
  const sport = getSport(plan.sportId);

  return (
    <section
      className="apex-card-elevated relative overflow-hidden animate-fade-up-delay-1"
      aria-labelledby="todays-plan-heading"
    >
      {/* Athletic visual plane */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(46,230,168,0.10)_0%,transparent_42%,transparent_58%,rgba(16,16,18,0.4)_100%)]" />
        <div className="absolute -right-8 top-0 h-full w-[55%] opacity-[0.18] sm:opacity-[0.28]">
          <AthleteSilhouette />
        </div>
        <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl animate-pulse-soft" />
      </div>

      <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            Today’s Plan
          </p>
          <h2
            id="todays-plan-heading"
            className="mt-3 font-display text-4xl font-bold tracking-wide text-text-primary sm:text-5xl"
          >
            {plan.title}
          </h2>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wider text-text-muted">
                Focus
              </dt>
              <dd className="mt-1 text-base font-medium text-text-primary">
                {plan.focus}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-text-muted">
                Estimated Duration
              </dt>
              <dd className="mt-1 text-base font-medium text-text-primary">
                {plan.estimatedMinutes} min
              </dd>
            </div>
          </dl>

          {plan.summary ? (
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-text-secondary">
              {plan.summary}
            </p>
          ) : null}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/training"
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] px-5 text-sm font-medium",
                "bg-accent text-accent-foreground shadow-[0_0_20px_var(--accent-glow)] hover:brightness-110",
              )}
            >
              View Training
            </Link>
            <Link
              href="/coach"
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] border border-border px-5 text-sm font-medium",
                "text-text-primary hover:border-accent/50 hover:text-accent",
              )}
            >
              Ask AI Coach
            </Link>
            {sport ? <SportBadge sport={sport} className="ml-1" /> : null}
          </div>
        </div>

        <div className="hidden rounded-[var(--radius-md)] border border-border/70 bg-background/40 p-4 backdrop-blur-sm lg:block">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
            Session Intent
          </p>
          <ul className="mt-3 space-y-2.5 text-sm text-text-secondary">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              First-step acceleration drills
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              Lower-body power development
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              Light arm prep ahead of practice
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function AthleteSilhouette() {
  return (
    <svg
      viewBox="0 0 320 360"
      className="h-full w-full"
      fill="currentColor"
      aria-hidden
    >
      <path
        className="text-text-primary"
        d="M168 42c18 0 32 14 32 32s-14 32-32 32-32-14-32-32 14-32 32-32zm-14 72h28c22 0 36 12 42 30l18 52c4 12-2 20-12 22l-8 2v48l26 66c4 10-2 18-12 18h-20c-8 0-12-4-14-10l-22-58-8 20v70c0 10-6 16-16 16h-18c-10 0-16-6-16-16V248l-20 42c-4 8-12 12-20 10l-16-4c-10-2-14-12-10-20l48-110v-28c0-18 12-30 30-30z"
      />
      <path
        className="text-accent"
        opacity="0.55"
        d="M214 148c28 18 48 48 52 86"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle cx="262" cy="250" r="10" className="text-accent" opacity="0.7" />
    </svg>
  );
}
