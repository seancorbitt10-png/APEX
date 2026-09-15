import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth/session";
import {
  getAthleteForUser,
  upsertAthleteForUser,
  buildAthleteContext,
} from "@/lib/athlete/service";
import { validateAthleteInput } from "@/lib/athlete/validation";
import type { AthleteProfileInput } from "@/lib/types/athlete";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const athlete = await getAthleteForUser(userId);
  if (!athlete) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    athlete,
    context: buildAthleteContext(athlete),
  });
}

export async function PUT(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<AthleteProfileInput>;
  const existing = await getAthleteForUser(userId);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const input: AthleteProfileInput = {
    firstName: body.firstName ?? existing.firstName,
    age: body.age ?? existing.age,
    experienceLevel: body.experienceLevel ?? existing.experienceLevel,
    sports: body.sports ?? existing.sports,
    goals: body.goals ?? existing.goals,
    primaryGoal: body.primaryGoal ?? existing.primaryGoal,
    goalNotes: body.goalNotes ?? existing.goalNotes,
    equipment: body.equipment ?? existing.equipment,
    sessionDuration: body.sessionDuration ?? existing.sessionDuration,
    daysPerWeek: body.daysPerWeek ?? existing.daysPerWeek,
    availableDays: body.availableDays ?? existing.availableDays,
    season: body.season ?? existing.season,
    schedule: body.schedule ?? existing.schedule,
    onboardingCompleted: true,
  };

  const validation = validateAthleteInput(input);
  if (!validation.ok) {
    return NextResponse.json({ errors: validation.errors }, { status: 400 });
  }

  const athlete = await upsertAthleteForUser(userId, input);
  return NextResponse.json({
    athlete,
    context: buildAthleteContext(athlete),
  });
}
