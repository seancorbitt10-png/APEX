import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { requireAthleteOrRedirect } from "@/lib/athlete/actions";
import { getPrimarySport } from "@/lib/athlete/service";
import { formatExperienceLabel } from "@/lib/athlete/options";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const athlete = await requireAthleteOrRedirect();
  const primary = getPrimarySport(athlete.sports);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Profile"
        title={athlete.firstName}
        description="Edit your athletic identity and training context. Changes persist for the dashboard and future AI Coach."
      />

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-md)] border border-accent/30 bg-accent-soft font-display text-2xl font-bold text-accent">
          {athlete.avatarInitials}
        </div>
        <div>
          <p className="font-display text-2xl font-semibold tracking-wide">
            {athlete.firstName}
          </p>
          <p className="text-sm text-text-secondary">
            {primary?.positions.join(" · ") || "Athlete"}
            {athlete.age ? ` · Age ${athlete.age}` : null}
            {` · ${formatExperienceLabel(athlete.experienceLevel)}`}
          </p>
        </div>
      </div>

      <ProfileEditor athlete={athlete} />
    </div>
  );
}
