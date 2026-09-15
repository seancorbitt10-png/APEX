import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { getCurrentUserId } from "@/lib/auth/session";
import { getAthleteForUser } from "@/lib/athlete/service";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Onboarding",
};

export default async function OnboardingPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const existing = await getAthleteForUser(userId);
  if (existing?.onboardingCompleted) {
    redirect("/dashboard");
  }

  return (
    <div className="apex-atmosphere min-h-dvh px-4 py-8 sm:px-6 sm:py-12">
      <OnboardingWizard
        initial={
          existing
            ? {
                firstName: existing.firstName,
                age: existing.age,
                experienceLevel: existing.experienceLevel,
                sports: existing.sports,
                goals: existing.goals,
                primaryGoal: existing.primaryGoal,
                goalNotes: existing.goalNotes,
                equipment: existing.equipment,
                sessionDuration: existing.sessionDuration,
                daysPerWeek: existing.daysPerWeek,
                availableDays: existing.availableDays,
                season: existing.season,
                schedule: existing.schedule,
              }
            : undefined
        }
      />
    </div>
  );
}
