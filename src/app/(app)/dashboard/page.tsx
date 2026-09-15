import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TrainingHeroCard } from "@/components/dashboard/TrainingHeroCard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { WeeklyOverview } from "@/components/dashboard/WeeklyOverview";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { AICoachEntry } from "@/components/dashboard/AICoachEntry";
import { MOCK_ATHLETE, MOCK_DASHBOARD } from "@/lib/data/mock";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  const { todaysPlan, metrics, week, upcoming } = MOCK_DASHBOARD;

  return (
    <div className="space-y-6 lg:space-y-8">
      <DashboardHeader name={MOCK_ATHLETE.name} />

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
        <AICoachEntry primarySportId={MOCK_ATHLETE.primarySportId} />
      </div>
    </div>
  );
}
