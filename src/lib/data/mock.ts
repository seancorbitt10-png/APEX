import type { AthleteProfile } from "@/lib/types/athlete";
import type { DashboardSnapshot } from "@/lib/types/training";

/**
 * Centralized mock data for PR #1.
 * Replace these exports with API/database reads later — keep consumers unchanged.
 */

export const MOCK_ATHLETE: AthleteProfile = {
  id: "athlete_alex",
  name: "Alex",
  age: 19,
  avatarInitials: "AX",
  sports: ["baseball"],
  primarySportId: "baseball",
  positionOrEvent: "Outfielder",
  experienceLevel: "college",
  goals: ["speed", "explosiveness", "first-step"],
  goalNotes: "Improve first-step quickness out of the batter’s box and in the outfield.",
  trainingAvailability: {
    daysPerWeek: 5,
    preferredSessionMinutes: 55,
    preferredTimes: ["afternoon", "evening"],
  },
  equipment: ["Cleats", "Bat", "Glove", "Resistance bands", "Medicine ball"],
  currentSeason: "Pre-season",
  practiceSchedule: [
    {
      id: "prac_tue",
      title: "Baseball Practice",
      type: "practice",
      dayOfWeek: 2,
      location: "Main Field",
      sportId: "baseball",
    },
    {
      id: "prac_fri",
      title: "Baseball Practice",
      type: "practice",
      dayOfWeek: 5,
      location: "Main Field",
      sportId: "baseball",
    },
  ],
  competitionSchedule: [
    {
      id: "game_sat",
      title: "vs. Rivals",
      type: "game",
      startsAt: "2026-09-19T13:00:00",
      location: "Home Field",
      sportId: "baseball",
    },
  ],
  trainingPreferences: [
    "Short explosive sessions over long grind work",
    "Prioritize recovery the day before games",
  ],
  performanceMetrics: {
    readiness: 82,
    trainingLoad: 598,
    recovery: "Good",
  },
};

export const MOCK_DASHBOARD: DashboardSnapshot = {
  greetingName: MOCK_ATHLETE.name,
  todaysPlan: {
    id: "plan_today",
    title: "Explosive Power",
    focus: "Speed + Power",
    estimatedMinutes: 55,
    sportId: "baseball",
    kind: "training",
    summary:
      "Lower-body power, first-step acceleration, and arm-path prep before tomorrow’s practice.",
  },
  metrics: [
    {
      id: "readiness",
      label: "Readiness",
      value: "82%",
      status: "Optimal",
      tone: "optimal",
      isMock: true,
    },
    {
      id: "load",
      label: "Training Load",
      value: 598,
      status: "Balanced",
      tone: "balanced",
      isMock: true,
    },
    {
      id: "recovery",
      label: "Recovery",
      value: "Good",
      status: "On track",
      tone: "good",
      isMock: true,
    },
  ],
  week: [
    { dayKey: "mon", dayLabel: "Mon", kind: "training", label: "Training" },
    { dayKey: "tue", dayLabel: "Tue", kind: "practice", label: "Practice" },
    { dayKey: "wed", dayLabel: "Wed", kind: "recovery", label: "Recovery" },
    {
      dayKey: "thu",
      dayLabel: "Thu",
      kind: "training",
      label: "Training",
      isToday: true,
    },
    { dayKey: "fri", dayLabel: "Fri", kind: "practice", label: "Practice" },
    { dayKey: "sat", dayLabel: "Sat", kind: "game", label: "Game" },
    { dayKey: "sun", dayLabel: "Sun", kind: "recovery", label: "Recovery" },
  ],
  upcoming: [
    {
      id: "up_1",
      whenLabel: "Tomorrow",
      title: "Baseball Practice",
      timeLabel: "4:00 PM",
      kind: "practice",
      sportId: "baseball",
    },
    {
      id: "up_2",
      whenLabel: "Saturday",
      title: "vs. Rivals",
      timeLabel: "1:00 PM",
      kind: "game",
      sportId: "baseball",
    },
  ],
};

/** Time-of-day greeting helper for dashboard header */
export function getGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
