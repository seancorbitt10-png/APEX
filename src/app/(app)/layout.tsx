import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { getEnabledSports } from "@/lib/sports/registry";
import { getCurrentUserId } from "@/lib/auth/session";
import { getAthleteForUser } from "@/lib/athlete/service";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const athlete = await getAthleteForUser(userId);
  if (!athlete?.onboardingCompleted) {
    redirect("/onboarding");
  }

  const sports = getEnabledSports();

  return <AppShell sports={sports}>{children}</AppShell>;
}
