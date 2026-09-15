import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { SportBadge } from "@/components/ui/SportBadge";
import { requireAthleteOrRedirect } from "@/lib/athlete/actions";
import { buildDashboardSnapshot } from "@/lib/data/mock";
import { getSport } from "@/lib/sports/registry";

export const metadata = { title: "My Training" };

export default async function TrainingPage() {
  const athlete = await requireAthleteOrRedirect();
  const plan = buildDashboardSnapshot(athlete).todaysPlan;
  const sport = getSport(plan.sportId);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="My Training"
        title="Today’s session"
        description="Full adaptive programming arrives in a later PR. This screen holds the training surface."
      />

      <article className="apex-card-elevated p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          {sport ? <SportBadge sport={sport} /> : null}
          <span className="text-xs uppercase tracking-wider text-text-muted">
            {plan.estimatedMinutes} min · {plan.focus}
          </span>
        </div>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-wide">
          {plan.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
          {plan.summary}
        </p>

        <ol className="mt-8 space-y-3">
          {[
            "Warm-up & movement prep (8 min)",
            "Acceleration & first-step blocks (18 min)",
            "Power pairings — jump + med-ball (16 min)",
            "Arm-care & cool-down (13 min)",
          ].map((item, i) => (
            <li
              key={item}
              className="flex gap-3 rounded-[var(--radius-md)] border border-border-subtle bg-surface px-4 py-3 text-sm"
            >
              <span className="font-display text-accent">{i + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button disabled>Start Session</Button>
          <Link
            href="/coach"
            className="inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] border border-border px-4 text-sm font-medium text-text-primary hover:border-accent/50 hover:text-accent"
          >
            Ask AI Coach
          </Link>
        </div>
        <p className="mt-3 text-xs text-text-muted">
          Session execution & adaptation logic is not connected yet.
        </p>
      </article>
    </div>
  );
}
