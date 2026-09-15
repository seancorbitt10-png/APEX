import type {
  AthleteProfileInput,
  AthleteSportProfile,
  EquipmentAccess,
  ExperienceLevel,
  GoalFocus,
  ScheduleEvent,
  SeasonPhase,
  SessionDuration,
} from "@/lib/types/athlete";
import { getSport } from "@/lib/sports/registry";

export type ValidationResult = {
  ok: boolean;
  errors: Record<string, string>;
};

export function validateAthleteInput(input: Partial<AthleteProfileInput>): ValidationResult {
  const errors: Record<string, string> = {};

  const firstName = input.firstName?.trim() ?? "";
  if (!firstName) {
    errors.firstName = "First name is required.";
  } else if (firstName.length > 40) {
    errors.firstName = "Keep first name under 40 characters.";
  }

  if (input.age !== undefined && input.age !== null) {
    if (!Number.isInteger(input.age) || input.age < 8 || input.age > 80) {
      errors.age = "Enter an age between 8 and 80.";
    }
  }

  const experience = input.experienceLevel as ExperienceLevel | undefined;
  if (!experience || !["beginner", "intermediate", "advanced"].includes(experience)) {
    errors.experienceLevel = "Select an experience level.";
  }

  const sports = input.sports ?? [];
  if (!sports.length) {
    errors.sports = "Select at least one sport.";
  } else {
    const primaryCount = sports.filter((s) => s.isPrimary).length;
    if (primaryCount !== 1) {
      errors.sports = "Choose exactly one primary sport.";
    }
    for (const sport of sports) {
      const config = getSport(sport.sportId);
      if (!config) {
        errors.sports = `Unknown sport: ${sport.sportId}`;
        break;
      }
      if (!config.enabled) {
        errors.sports = `${config.name} is not available yet.`;
        break;
      }
      if (config.config.positions?.length && !sport.positions.length) {
        errors.positions = `Select at least one position for ${config.name}.`;
        break;
      }
    }
  }

  const goals = input.goals ?? [];
  if (!goals.length) {
    errors.goals = "Select at least one training goal.";
  } else if (input.primaryGoal && !goals.includes(input.primaryGoal as GoalFocus)) {
    errors.primaryGoal = "Primary goal must be one of your selected goals.";
  }

  const equipment = (input.equipment ?? []) as EquipmentAccess[];
  if (!equipment.length) {
    errors.equipment = "Select at least one training access option.";
  }

  const duration = input.sessionDuration as SessionDuration | undefined;
  if (
    !duration ||
    !["under-30", "30-45", "45-60", "60-90", "90-plus"].includes(duration)
  ) {
    errors.sessionDuration = "Select typical session length.";
  }

  const daysPerWeek = input.daysPerWeek;
  if (
    daysPerWeek === undefined ||
    !Number.isInteger(daysPerWeek) ||
    daysPerWeek < 1 ||
    daysPerWeek > 7
  ) {
    errors.daysPerWeek = "Choose training days per week (1–7).";
  }

  const availableDays = input.availableDays ?? [];
  if (!availableDays.length) {
    errors.availableDays = "Select at least one available training day.";
  } else if (availableDays.some((d) => d < 0 || d > 6)) {
    errors.availableDays = "Invalid training day selection.";
  }

  const season = input.season as SeasonPhase | undefined;
  if (
    !season ||
    !["offseason", "preseason", "in-season", "postseason", "none"].includes(season)
  ) {
    errors.season = "Select your current season.";
  }

  if (input.goalNotes && input.goalNotes.length > 280) {
    errors.goalNotes = "Keep notes under 280 characters.";
  }

  const schedule = (input.schedule ?? []) as ScheduleEvent[];
  for (const event of schedule) {
    if (!event.title?.trim()) {
      errors.schedule = "Schedule items need a title.";
      break;
    }
    if (event.dayOfWeek !== undefined && (event.dayOfWeek < 0 || event.dayOfWeek > 6)) {
      errors.schedule = "Invalid schedule day.";
      break;
    }
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

export function ensurePrimarySport(
  sports: AthleteSportProfile[],
  primarySportId: string,
): AthleteSportProfile[] {
  return sports.map((sport) => ({
    ...sport,
    isPrimary: sport.sportId === primarySportId,
  }));
}
