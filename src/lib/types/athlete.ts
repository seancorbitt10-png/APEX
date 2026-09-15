import type { SportId } from "./sport";

export type ExperienceLevel =
  | "youth"
  | "high-school"
  | "college"
  | "amateur"
  | "semi-pro"
  | "pro";

export type GoalFocus =
  | "speed"
  | "explosiveness"
  | "first-step"
  | "strength"
  | "power"
  | "endurance"
  | "agility"
  | "mobility"
  | "skill"
  | "recovery"
  | (string & {});

export interface TrainingAvailability {
  daysPerWeek: number;
  preferredSessionMinutes: number;
  preferredTimes: Array<"morning" | "afternoon" | "evening">;
  notes?: string;
}

export interface ScheduleBlock {
  id: string;
  title: string;
  type: "practice" | "game" | "competition" | "training" | "recovery" | "other";
  dayOfWeek?: number; // 0=Sun … 6=Sat for recurring
  startsAt?: string; // ISO datetime for one-off
  endsAt?: string;
  location?: string;
  sportId?: SportId;
}

export interface AthleteProfile {
  id: string;
  name: string;
  age?: number;
  avatarInitials: string;
  sports: SportId[];
  primarySportId: SportId;
  positionOrEvent?: string;
  experienceLevel?: ExperienceLevel;
  goals: GoalFocus[];
  goalNotes?: string;
  trainingAvailability?: TrainingAvailability;
  equipment?: string[];
  currentSeason?: string;
  practiceSchedule?: ScheduleBlock[];
  competitionSchedule?: ScheduleBlock[];
  trainingPreferences?: string[];
  /** Placeholder for future readiness / load / wearable metrics */
  performanceMetrics?: Record<string, number | string>;
}
