import { SectionHeader } from "@/components/ui/SectionHeader";
import { SportBadge } from "@/components/ui/SportBadge";
import { MOCK_ATHLETE } from "@/lib/data/mock";
import { getSport } from "@/lib/sports/registry";

export const metadata = { title: "Profile" };

export default function ProfilePage() {
  const athlete = MOCK_ATHLETE;
  const primarySport = getSport(athlete.primarySportId);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Profile"
        title={athlete.name}
        description="Athlete context foundation for adaptive training. Expandable — not a full onboarding flow."
      />

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-md)] border border-accent/30 bg-accent-soft font-display text-2xl font-bold text-accent">
          {athlete.avatarInitials}
        </div>
        <div>
          <p className="font-display text-2xl font-semibold tracking-wide">
            {athlete.name}
          </p>
          <p className="text-sm text-text-secondary">
            {athlete.positionOrEvent}
            {athlete.age ? ` · Age ${athlete.age}` : null}
            {athlete.experienceLevel
              ? ` · ${formatExperience(athlete.experienceLevel)}`
              : null}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ProfileCard title="Sports">
          <div className="flex flex-wrap gap-2">
            {athlete.sports.map((id) => {
              const sport = getSport(id);
              return sport ? <SportBadge key={id} sport={sport} /> : null;
            })}
          </div>
          <p className="mt-3 text-sm text-text-secondary">
            Primary: {primarySport?.name ?? athlete.primarySportId}
          </p>
        </ProfileCard>

        <ProfileCard title="Goals">
          <ul className="flex flex-wrap gap-2">
            {athlete.goals.map((goal) => (
              <li
                key={goal}
                className="rounded-[var(--radius-sm)] border border-border bg-surface-elevated px-2.5 py-1 text-xs font-medium capitalize"
              >
                {goal.replace("-", " ")}
              </li>
            ))}
          </ul>
          {athlete.goalNotes ? (
            <p className="mt-3 text-sm text-text-secondary">{athlete.goalNotes}</p>
          ) : null}
        </ProfileCard>

        <ProfileCard title="Training availability">
          {athlete.trainingAvailability ? (
            <dl className="space-y-2 text-sm">
              <Row
                label="Days / week"
                value={String(athlete.trainingAvailability.daysPerWeek)}
              />
              <Row
                label="Session length"
                value={`${athlete.trainingAvailability.preferredSessionMinutes} min`}
              />
              <Row
                label="Preferred times"
                value={athlete.trainingAvailability.preferredTimes.join(", ")}
              />
            </dl>
          ) : (
            <p className="text-sm text-text-muted">Not set</p>
          )}
        </ProfileCard>

        <ProfileCard title="Season & schedule">
          <dl className="space-y-2 text-sm">
            <Row label="Current season" value={athlete.currentSeason ?? "—"} />
            <Row
              label="Practices"
              value={`${athlete.practiceSchedule?.length ?? 0} recurring`}
            />
            <Row
              label="Competitions"
              value={`${athlete.competitionSchedule?.length ?? 0} upcoming`}
            />
          </dl>
        </ProfileCard>

        <ProfileCard title="Equipment">
          <p className="text-sm text-text-secondary">
            {athlete.equipment?.join(" · ") ?? "—"}
          </p>
        </ProfileCard>

        <ProfileCard title="Preferences">
          <ul className="list-inside list-disc space-y-1.5 text-sm text-text-secondary">
            {athlete.trainingPreferences?.map((pref) => (
              <li key={pref}>{pref}</li>
            )) ?? <li>None yet</li>}
          </ul>
        </ProfileCard>
      </div>
    </div>
  );
}

function ProfileCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="apex-card p-5">
      <h2 className="font-display text-lg font-semibold tracking-wide">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border-subtle pb-2 last:border-0 last:pb-0">
      <dt className="text-text-muted">{label}</dt>
      <dd className="text-right capitalize">{value}</dd>
    </div>
  );
}

function formatExperience(level: string) {
  return level
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
