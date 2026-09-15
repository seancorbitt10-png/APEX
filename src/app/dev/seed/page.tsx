import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  USER_ID_COOKIE,
  createMockUserId,
  getCurrentUserId,
} from "@/lib/auth/session";
import { upsertAthleteForUser } from "@/lib/athlete/service";

export const metadata = { title: "Dev Seed" };

/**
 * Development-only helper to seed a complete Sean athlete profile
 * and land on the dashboard. Not linked from production navigation.
 */
export default async function DevSeedPage() {
  if (process.env.NODE_ENV === "production") {
    redirect("/login");
  }

  return (
    <div className="apex-atmosphere flex min-h-dvh items-center justify-center px-4">
      <div className="apex-card-elevated w-full max-w-md p-8 text-center">
        <p className="font-display text-2xl font-bold tracking-[0.12em]">
          APEX <span className="text-accent">AI</span>
        </p>
        <h1 className="mt-4 font-display text-2xl font-semibold">
          Dev athlete seed
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Creates a persisted Sean / Baseball / Outfield profile for local
          verification, then opens the dashboard.
        </p>
        <form action={seedSeanAndRedirect} className="mt-6">
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-md)] bg-accent text-sm font-medium text-accent-foreground"
          >
            Seed Sean & open dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

async function seedSeanAndRedirect() {
  "use server";

  if (process.env.NODE_ENV === "production") {
    redirect("/login");
  }

  const store = await cookies();
  let userId = await getCurrentUserId();
  if (!userId) {
    userId = createMockUserId();
    store.set(SESSION_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    store.set(USER_ID_COOKIE, userId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  } else if (store.get(SESSION_COOKIE)?.value !== "1") {
    store.set(SESSION_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  await upsertAthleteForUser(userId, {
    firstName: "Sean",
    age: 22,
    experienceLevel: "intermediate",
    sports: [
      { sportId: "baseball", isPrimary: true, positions: ["Outfield"] },
    ],
    goals: ["speed", "explosiveness"],
    primaryGoal: "speed",
    goalNotes: "I want to become faster and more explosive in the outfield.",
    equipment: ["full-gym", "field"],
    sessionDuration: "45-60",
    daysPerWeek: 4,
    availableDays: [1, 2, 4, 6],
    season: "in-season",
    schedule: [
      {
        id: "practice_2",
        type: "practice",
        title: "Team Practice",
        sportId: "baseball",
        dayOfWeek: 2,
        recurring: true,
        importance: "normal",
        durationMinutes: 120,
      },
      {
        id: "game_6",
        type: "game",
        title: "Game",
        sportId: "baseball",
        dayOfWeek: 6,
        recurring: true,
        importance: "high",
        durationMinutes: 180,
      },
    ],
    onboardingCompleted: true,
  });

  redirect("/dashboard");
}
