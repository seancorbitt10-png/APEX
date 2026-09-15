import type {
  AthleteContext,
  AthleteProfile,
  AthleteProfileInput,
  AthleteSportProfile,
  GoalFocus,
} from "@/lib/types/athlete";
import { getSport } from "@/lib/sports/registry";
import { initialsFromName } from "@/lib/athlete/options";
import {
  getAthleteByUserId,
  saveAthlete,
} from "@/lib/athlete/repository";

export function getPrimarySport(
  sports: AthleteSportProfile[],
): AthleteSportProfile | null {
  return sports.find((s) => s.isPrimary) ?? sports[0] ?? null;
}

export function buildAthleteContext(athlete: AthleteProfile): AthleteContext {
  const primary = getPrimarySport(athlete.sports);
  const sportConfigs = athlete.sports
    .map((s) => getSport(s.sportId))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return {
    athlete,
    sports: sportConfigs,
    primarySport: primary ? getSport(primary.sportId) : null,
    positions: primary?.positions ?? [],
    goals: athlete.goals,
    primaryGoal: athlete.primaryGoal,
    experience: athlete.experienceLevel,
    equipment: athlete.equipment,
    availability: {
      daysPerWeek: athlete.daysPerWeek,
      sessionDuration: athlete.sessionDuration,
      availableDays: athlete.availableDays,
    },
    season: athlete.season,
    schedule: athlete.schedule,
  };
}

export async function getAthleteForUser(
  userId: string,
): Promise<AthleteProfile | null> {
  return getAthleteByUserId(userId);
}

export async function getAthleteContextForUser(
  userId: string,
): Promise<AthleteContext | null> {
  const athlete = await getAthleteByUserId(userId);
  if (!athlete) return null;
  return buildAthleteContext(athlete);
}

export function normalizeSports(
  sports: AthleteSportProfile[],
  primarySportId?: string,
): AthleteSportProfile[] {
  if (!sports.length) return [];
  const primaryId =
    primarySportId && sports.some((s) => s.sportId === primarySportId)
      ? primarySportId
      : sports.find((s) => s.isPrimary)?.sportId ?? sports[0].sportId;

  return sports.map((sport) => ({
    ...sport,
    positions: [...new Set(sport.positions)],
    isPrimary: sport.sportId === primaryId,
  }));
}

export function createAthleteProfile(
  userId: string,
  input: AthleteProfileInput,
): AthleteProfile {
  const now = new Date().toISOString();
  const sports = normalizeSports(input.sports);
  const primaryGoal =
    input.primaryGoal && input.goals.includes(input.primaryGoal)
      ? input.primaryGoal
      : (input.goals[0] as GoalFocus | undefined);

  return {
    id: input.id ?? `athlete_${userId}`,
    userId,
    firstName: input.firstName.trim(),
    age: input.age,
    avatarInitials: input.avatarInitials ?? initialsFromName(input.firstName),
    experienceLevel: input.experienceLevel,
    sports,
    goals: input.goals,
    primaryGoal,
    goalNotes: input.goalNotes?.trim() || undefined,
    equipment: input.equipment,
    sessionDuration: input.sessionDuration,
    daysPerWeek: input.daysPerWeek,
    availableDays: [...new Set(input.availableDays)].sort((a, b) => {
      const order = [1, 2, 3, 4, 5, 6, 0];
      return order.indexOf(a) - order.indexOf(b);
    }),
    season: input.season,
    schedule: input.schedule ?? [],
    onboardingCompleted: input.onboardingCompleted ?? true,
    createdAt: input.createdAt ?? now,
    updatedAt: now,
  };
}

export async function upsertAthleteForUser(
  userId: string,
  input: AthleteProfileInput,
): Promise<AthleteProfile> {
  const existing = await getAthleteByUserId(userId);
  const profile = createAthleteProfile(userId, {
    ...input,
    id: existing?.id,
    createdAt: existing?.createdAt,
  });
  return saveAthlete(profile);
}
