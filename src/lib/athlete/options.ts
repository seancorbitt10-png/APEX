import type {
  EquipmentAccess,
  ExperienceLevel,
  GoalFocus,
  SeasonPhase,
  SessionDuration,
} from "@/lib/types/athlete";

export const EXPERIENCE_LEVELS: Array<{
  id: ExperienceLevel;
  label: string;
  description: string;
}> = [
  {
    id: "beginner",
    label: "Beginner",
    description: "Building foundations and consistency",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "Training regularly with clear goals",
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "High-level competitive training",
  },
];

export const GOAL_OPTIONS: Array<{ id: GoalFocus; label: string }> = [
  { id: "speed", label: "Speed" },
  { id: "explosiveness", label: "Explosiveness" },
  { id: "strength", label: "Strength" },
  { id: "agility", label: "Agility" },
  { id: "conditioning", label: "Conditioning" },
  { id: "power", label: "Power" },
  { id: "mobility", label: "Mobility" },
  { id: "recovery", label: "Recovery" },
  { id: "sport-performance", label: "Sport performance" },
  { id: "position-specific", label: "Position-specific development" },
];

export const EQUIPMENT_OPTIONS: Array<{ id: EquipmentAccess; label: string }> =
  [
    { id: "full-gym", label: "Full gym" },
    { id: "basic-weights", label: "Basic weights" },
    { id: "dumbbells", label: "Dumbbells" },
    { id: "barbell-rack", label: "Barbell / rack" },
    { id: "machines", label: "Machines" },
    { id: "resistance-bands", label: "Resistance bands" },
    { id: "field", label: "Field" },
    { id: "track", label: "Track" },
    { id: "home-only", label: "Home only" },
    { id: "other", label: "Other" },
  ];

export const SESSION_DURATION_OPTIONS: Array<{
  id: SessionDuration;
  label: string;
}> = [
  { id: "under-30", label: "Under 30 min" },
  { id: "30-45", label: "30–45 min" },
  { id: "45-60", label: "45–60 min" },
  { id: "60-90", label: "60–90 min" },
  { id: "90-plus", label: "90+ min" },
];

export const SEASON_OPTIONS: Array<{ id: SeasonPhase; label: string }> = [
  { id: "offseason", label: "Offseason" },
  { id: "preseason", label: "Preseason" },
  { id: "in-season", label: "In-season" },
  { id: "postseason", label: "Postseason" },
  { id: "none", label: "No current season" },
];

export const WEEKDAY_OPTIONS: Array<{ id: number; label: string; short: string }> =
  [
    { id: 1, label: "Monday", short: "Mon" },
    { id: 2, label: "Tuesday", short: "Tue" },
    { id: 3, label: "Wednesday", short: "Wed" },
    { id: 4, label: "Thursday", short: "Thu" },
    { id: 5, label: "Friday", short: "Fri" },
    { id: 6, label: "Saturday", short: "Sat" },
    { id: 0, label: "Sunday", short: "Sun" },
  ];

export function formatGoalLabel(goal: string): string {
  const match = GOAL_OPTIONS.find((g) => g.id === goal);
  if (match) return match.label;
  return goal
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatEquipmentLabel(id: string): string {
  return EQUIPMENT_OPTIONS.find((e) => e.id === id)?.label ?? id;
}

export function formatSeasonLabel(id: string): string {
  return SEASON_OPTIONS.find((s) => s.id === id)?.label ?? id;
}

export function formatSessionDurationLabel(id: string): string {
  return SESSION_DURATION_OPTIONS.find((s) => s.id === id)?.label ?? id;
}

export function formatExperienceLabel(id: string): string {
  return EXPERIENCE_LEVELS.find((e) => e.id === id)?.label ?? id;
}

export function formatAvailableDays(days: number[]): string {
  if (!days.length) return "Not set";
  const order = [1, 2, 3, 4, 5, 6, 0];
  return order
    .filter((d) => days.includes(d))
    .map((d) => WEEKDAY_OPTIONS.find((w) => w.id === d)?.short ?? String(d))
    .join(" · ");
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "AA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
