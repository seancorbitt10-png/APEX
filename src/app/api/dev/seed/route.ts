import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  USER_ID_COOKIE,
  createMockUserId,
} from "@/lib/auth/session";
import { upsertAthleteForUser } from "@/lib/athlete/service";

/** Development-only seed endpoint for verification scripts. */
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const store = await cookies();
  let userId = store.get(USER_ID_COOKIE)?.value;
  if (!userId) {
    userId = createMockUserId();
  }

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

  const athlete = await upsertAthleteForUser(userId, {
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

  return NextResponse.json({ ok: true, userId, athlete });
}
