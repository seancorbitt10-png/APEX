import type { AthleteProfile } from "@/lib/types/athlete";
import type { DashboardSnapshot } from "@/lib/types/training";
import { getPrimarySport } from "@/lib/athlete/service";
import {
  formatGoalLabel,
} from "@/lib/athlete/options";

/**
 * Demo dashboard metrics remain mock until adaptive engine lands.
 * Identity/context fields come from the persisted athlete.
 */
export function buildDashboardSnapshot(
  athlete: AthleteProfile,
): DashboardSnapshot {
  const primary = getPrimarySport(athlete.sports);
  const primaryGoal = athlete.primaryGoal
    ? formatGoalLabel(athlete.primaryGoal)
    : athlete.goals[0]
      ? formatGoalLabel(athlete.goals[0])
      : "Performance";
  const positions = primary?.positions?.join(" · ") || "Athlete";

  return {
    greetingName: athlete.firstName,
    todaysPlan: {
      id: "plan_today",
      title: "Explosive Power",
      focus: `${primaryGoal} · ${positions}`,
      estimatedMinutes: estimateMinutes(athlete.sessionDuration),
      sportId: primary?.sportId ?? "baseball",
      kind: "training",
      summary: athlete.goalNotes
        ? `Built around your goal: ${athlete.goalNotes}`
        : `Lower-body power and first-step work aligned to ${positions.toLowerCase()} development.`,
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
    week: buildWeekFromAthlete(athlete),
    upcoming: buildUpcomingFromAthlete(athlete),
  };
}

function estimateMinutes(duration: AthleteProfile["sessionDuration"]): number {
  switch (duration) {
    case "under-30":
      return 25;
    case "30-45":
      return 40;
    case "45-60":
      return 55;
    case "60-90":
      return 75;
    case "90-plus":
      return 95;
    default:
      return 55;
  }
}

function buildWeekFromAthlete(athlete: AthleteProfile) {
  const dayMeta = [
    { dayKey: "mon", dayLabel: "Mon", dow: 1 },
    { dayKey: "tue", dayLabel: "Tue", dow: 2 },
    { dayKey: "wed", dayLabel: "Wed", dow: 3 },
    { dayKey: "thu", dayLabel: "Thu", dow: 4 },
    { dayKey: "fri", dayLabel: "Fri", dow: 5 },
    { dayKey: "sat", dayLabel: "Sat", dow: 6 },
    { dayKey: "sun", dayLabel: "Sun", dow: 0 },
  ] as const;

  const today = new Date().getDay();

  return dayMeta.map(({ dayKey, dayLabel, dow }) => {
    const event = athlete.schedule.find(
      (item) => item.recurring && item.dayOfWeek === dow,
    );
    if (event?.type === "game" || event?.type === "competition") {
      return {
        dayKey,
        dayLabel,
        kind: "game" as const,
        label: event.type === "game" ? "Game" : "Comp",
        isToday: dow === today,
      };
    }
    if (event?.type === "practice") {
      return {
        dayKey,
        dayLabel,
        kind: "practice" as const,
        label: "Practice",
        isToday: dow === today,
      };
    }
    if (athlete.availableDays.includes(dow)) {
      return {
        dayKey,
        dayLabel,
        kind: "training" as const,
        label: "Training",
        isToday: dow === today,
      };
    }
    return {
      dayKey,
      dayLabel,
      kind: "recovery" as const,
      label: "Recovery",
      isToday: dow === today,
    };
  });
}

function buildUpcomingFromAthlete(athlete: AthleteProfile) {
  const upcoming = athlete.schedule
    .filter((e) => e.type === "practice" || e.type === "game" || e.type === "competition")
    .slice(0, 3)
    .map((event, index) => ({
      id: event.id || `up_${index}`,
      whenLabel: event.recurring
        ? weekdayLabel(event.dayOfWeek)
        : event.startsAt
          ? new Date(event.startsAt).toLocaleDateString(undefined, {
              weekday: "long",
            })
          : "Upcoming",
      title: event.title,
      timeLabel: event.startsAt
        ? new Date(event.startsAt).toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
          })
        : event.durationMinutes
          ? `${event.durationMinutes} min`
          : "TBD",
      kind: event.type === "practice" ? ("practice" as const) : ("game" as const),
      sportId: event.sportId,
    }));

  if (upcoming.length) return upcoming;

  return [
    {
      id: "up_placeholder",
      whenLabel: "This week",
      title: "Add practice or game commitments in Profile",
      timeLabel: "—",
      kind: "practice" as const,
      sportId: getPrimarySport(athlete.sports)?.sportId,
    },
  ];
}

function weekdayLabel(day?: number) {
  const map: Record<number, string> = {
    0: "Sundays",
    1: "Mondays",
    2: "Tuesdays",
    3: "Wednesdays",
    4: "Thursdays",
    5: "Fridays",
    6: "Saturdays",
  };
  return day === undefined ? "Weekly" : map[day] ?? "Weekly";
}

/** Time-of-day greeting helper for dashboard header */
export function getGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
