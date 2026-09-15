export type SessionKind = "training" | "practice" | "game" | "recovery" | "rest";

export interface DailyPlan {
  id: string;
  title: string;
  focus: string;
  estimatedMinutes: number;
  sportId: string;
  kind: SessionKind;
  summary?: string;
}

export interface PerformanceMetric {
  id: string;
  label: string;
  value: string | number;
  status: string;
  tone: "optimal" | "balanced" | "good" | "caution" | "neutral";
  /** Clarifies mock vs computed once real data lands */
  isMock: boolean;
}

export interface WeekDayOverview {
  dayKey: string;
  dayLabel: string;
  kind: SessionKind;
  label: string;
  isToday?: boolean;
}

export interface UpcomingEvent {
  id: string;
  whenLabel: string;
  title: string;
  timeLabel: string;
  kind: SessionKind | "competition";
  sportId?: string;
}

export interface DashboardSnapshot {
  greetingName: string;
  todaysPlan: DailyPlan;
  metrics: PerformanceMetric[];
  week: WeekDayOverview[];
  upcoming: UpcomingEvent[];
}
