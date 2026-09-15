import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TrainingHeroCard } from "@/components/dashboard/TrainingHeroCard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { WeeklyOverview } from "@/components/dashboard/WeeklyOverview";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { AICoachEntry } from "@/components/dashboard/AICoachEntry";
import { requireAthleteOrRedirect } from "@/lib/athlete/actions";
import { buildAthleteContext, getPrimarySport } from "@/lib/athlete/service";
import { buildDashboardSnapshot } from "@/lib/data/mock";
import {
  formatGoalLabel,
  formatSeasonLabel,
} from "@/lib/athlete/options";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const athlete = await requireAthleteOrRedirect();
  const context = buildAthleteContext(athlete);
  const snapshot = buildDashboardSnapshot(athlete);
  const primary = getPrimarySport(athlete.sports);
  const { todaysPlan, metrics, week, upcoming } = snapshot;

  return (
    <div className="space-y-6 lg:space-y-8">
      <DashboardHeader
        name={athlete.firstName}
        initials={athlete.avatarInitials}
        subtitle={`Primary: ${context.primarySport?.name ?? "Sport"} · ${
          primary?.positions.join(" · ") || "Athlete"
        } · Focus: ${
          athlete.primaryGoal
            ? formatGoalLabel(athlete.primaryGoal)
            : "Performance"
        } · ${formatSeasonLabel(athlete.season)}`}
      />

      <TrainingHeroCard plan={todaysPlan} />

      <section
        className="grid gap-3 sm:grid-cols-3 animate-fade-up-delay-2"
        aria-label="Performance snapshot"
      >
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <WeeklyOverview days={week} />

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <UpcomingEvents events={upcoming} />
        <AICoachEntry primarySportId={primary?.sportId ?? "baseball"} />
      </div>
    </div>
  );
}
