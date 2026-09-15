import type { SportConfig, SportId } from "./sport";

/** Athlete-stated experience — not a medical or performance score. */
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export type GoalFocus =
  | "speed"
  | "explosiveness"
  | "strength"
  | "agility"
  | "conditioning"
  | "power"
  | "mobility"
  | "recovery"
  | "sport-performance"
  | "position-specific"
  | (string & {});

export type EquipmentAccess =
  | "full-gym"
  | "basic-weights"
  | "dumbbells"
  | "barbell-rack"
  | "machines"
  | "resistance-bands"
  | "field"
  | "track"
  | "home-only"
  | "other";

export type SessionDuration =
  | "under-30"
  | "30-45"
  | "45-60"
  | "60-90"
  | "90-plus";

export type SeasonPhase =
  | "offseason"
  | "preseason"
  | "in-season"
  | "postseason"
  | "none";

export type ScheduleEventType =
  | "practice"
  | "game"
  | "competition"
  | "training"
  | "recovery"
  | "other";

/**
 * Per-sport athlete context. Keeps sport-specific fields modular
 * instead of a flat schema with dozens of nullable columns.
 */
export interface AthleteSportProfile {
  sportId: SportId;
  isPrimary: boolean;
  /** Positions and/or events for this sport */
  positions: string[];
  experience?: ExperienceLevel;
  /** Extensible sport-specific metadata without polluting the core schema */
  metadata?: Record<string, string | number | boolean | string[]>;
}

/**
 * Fixed commitment / schedule event foundation.
 * Future NL scheduling can populate these fields.
 */
export interface ScheduleEvent {
  id: string;
  type: ScheduleEventType;
  title: string;
  sportId?: SportId;
  /** 0=Sun … 6=Sat for recurring weekly commitments */
  dayOfWeek?: number;
  startsAt?: string;
  durationMinutes?: number;
  importance?: "low" | "normal" | "high";
  recurring?: boolean;
  location?: string;
}

export interface AthleteProfile {
  id: string;
  /** Mock user id today → real auth user id later */
  userId: string;
  firstName: string;
  age?: number;
  avatarInitials: string;
  experienceLevel: ExperienceLevel;
  sports: AthleteSportProfile[];
  goals: GoalFocus[];
  primaryGoal?: GoalFocus;
  goalNotes?: string;
  equipment: EquipmentAccess[];
  sessionDuration: SessionDuration;
  daysPerWeek: number;
  /** Days generally available for additional training (0=Sun … 6=Sat) */
  availableDays: number[];
  season: SeasonPhase;
  schedule: ScheduleEvent[];
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Structured handoff object for the future AI Coach layer. */
export interface AthleteContext {
  athlete: AthleteProfile;
  sports: SportConfig[];
  primarySport: SportConfig | null;
  positions: string[];
  goals: GoalFocus[];
  primaryGoal?: GoalFocus;
  experience: ExperienceLevel;
  equipment: EquipmentAccess[];
  availability: {
    daysPerWeek: number;
    sessionDuration: SessionDuration;
    availableDays: number[];
  };
  season: SeasonPhase;
  schedule: ScheduleEvent[];
}

export type AthleteProfileInput = Omit<
  AthleteProfile,
  "id" | "userId" | "avatarInitials" | "createdAt" | "updatedAt"
> & {
  id?: string;
  userId?: string;
  avatarInitials?: string;
  createdAt?: string;
  updatedAt?: string;
};
