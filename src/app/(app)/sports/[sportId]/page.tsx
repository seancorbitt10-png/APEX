import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SportBadge } from "@/components/ui/SportBadge";
import { getSport } from "@/lib/sports/registry";
import { requireAthleteOrRedirect } from "@/lib/athlete/actions";
import { getPrimarySport } from "@/lib/athlete/service";
import { formatSeasonLabel } from "@/lib/athlete/options";

export const metadata = { title: "Sport" };

export default async function SportDetailPage({
  params,
}: {
  params: Promise<{ sportId: string }>;
}) {
  const { sportId } = await params;
  const sport = getSport(sportId);
  const athlete = await requireAthleteOrRedirect();
  const primary = getPrimarySport(athlete.sports);
  const athleteSport = athlete.sports.find((s) => s.sportId === sportId);

  if (!sport || !sport.enabled) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Sport Context"
        title={sport.name}
        description="Sport-specific configuration feeds future adaptive planning and AI context."
        action={<SportBadge sport={sport} size="md" />}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="apex-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold tracking-wide">
            Athlete fit
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-border-subtle pb-3">
              <dt className="text-text-muted">Primary sport</dt>
              <dd>{primary?.sportId === sport.id ? "Yes" : "No"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-border-subtle pb-3">
              <dt className="text-text-muted">Position / event</dt>
              <dd>{athleteSport?.positions.join(" · ") || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Season</dt>
              <dd>{formatSeasonLabel(athlete.season)}</dd>
            </div>
          </dl>
        </section>

        <section className="apex-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold tracking-wide">
            Configuration
          </h2>
          <div className="mt-4 space-y-4 text-sm">
            {sport.config.positions?.length ? (
              <div>
                <p className="text-xs uppercase tracking-wider text-text-muted">
                  Positions
                </p>
                <p className="mt-1.5 text-text-secondary">
                  {sport.config.positions.join(" · ")}
                </p>
              </div>
            ) : null}
            {sport.config.seasonPhases?.length ? (
              <div>
                <p className="text-xs uppercase tracking-wider text-text-muted">
                  Season phases
                </p>
                <p className="mt-1.5 text-text-secondary">
                  {sport.config.seasonPhases.join(" · ")}
                </p>
              </div>
            ) : null}
            {sport.config.defaultMetrics?.length ? (
              <div>
                <p className="text-xs uppercase tracking-wider text-text-muted">
                  Default metrics
                </p>
                <p className="mt-1.5 text-text-secondary">
                  {sport.config.defaultMetrics.join(" · ")}
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
