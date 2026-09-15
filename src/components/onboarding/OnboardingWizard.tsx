"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { OptionChip } from "@/components/ui/OptionChip";
import { SportIcon } from "@/components/ui/SportBadge";
import { completeOnboardingAction } from "@/lib/athlete/actions";
import {
  EQUIPMENT_OPTIONS,
  EXPERIENCE_LEVELS,
  GOAL_OPTIONS,
  SEASON_OPTIONS,
  SESSION_DURATION_OPTIONS,
  WEEKDAY_OPTIONS,
  formatAvailableDays,
  formatEquipmentLabel,
  formatExperienceLabel,
  formatGoalLabel,
  formatSeasonLabel,
  formatSessionDurationLabel,
} from "@/lib/athlete/options";
import { getAllSports, getSport } from "@/lib/sports/registry";
import { validateAthleteInput } from "@/lib/athlete/validation";
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
import type { SportId } from "@/lib/types/sport";
import { cn } from "@/lib/utils/cn";

const STEPS = [
  { id: "athlete", label: "Athlete" },
  { id: "sports", label: "Sports" },
  { id: "goals", label: "Goals" },
  { id: "training", label: "Training" },
  { id: "schedule", label: "Schedule" },
  { id: "review", label: "Review" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const emptyDraft = (): AthleteProfileInput => ({
  firstName: "",
  age: undefined,
  experienceLevel: "intermediate",
  sports: [],
  goals: [],
  primaryGoal: undefined,
  goalNotes: "",
  equipment: [],
  sessionDuration: "45-60",
  daysPerWeek: 4,
  availableDays: [1, 2, 4, 6],
  season: "preseason",
  schedule: [],
  onboardingCompleted: false,
});

interface OnboardingWizardProps {
  initial?: Partial<AthleteProfileInput>;
}

export function OnboardingWizard({ initial }: OnboardingWizardProps) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<AthleteProfileInput>({
    ...emptyDraft(),
    ...initial,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const sports = getAllSports();
  const step = STEPS[stepIndex];

  const primarySport = useMemo(
    () => draft.sports.find((s) => s.isPrimary) ?? draft.sports[0],
    [draft.sports],
  );

  function goTo(index: number) {
    setErrors({});
    setStepIndex(index);
  }

  function validateStep(id: StepId): boolean {
    const partial: Partial<AthleteProfileInput> = { ...draft };
    let result;

    if (id === "athlete") {
      result = validateAthleteInput({
        ...partial,
        sports: [{ sportId: "baseball", isPrimary: true, positions: ["Outfield"] }],
        goals: ["speed"],
        equipment: ["field"],
        sessionDuration: "45-60",
        daysPerWeek: 4,
        availableDays: [1],
        season: "preseason",
      });
      const nextErrors: Record<string, string> = {};
      if (result.errors.firstName) nextErrors.firstName = result.errors.firstName;
      if (result.errors.age) nextErrors.age = result.errors.age;
      if (result.errors.experienceLevel) {
        nextErrors.experienceLevel = result.errors.experienceLevel;
      }
      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    }

    if (id === "sports") {
      result = validateAthleteInput({
        ...draft,
        firstName: draft.firstName || "Athlete",
        experienceLevel: draft.experienceLevel || "intermediate",
        goals: ["speed"],
        equipment: ["field"],
        sessionDuration: "45-60",
        daysPerWeek: 4,
        availableDays: [1],
        season: "preseason",
      });
      const nextErrors: Record<string, string> = {};
      if (result.errors.sports) nextErrors.sports = result.errors.sports;
      if (result.errors.positions) nextErrors.positions = result.errors.positions;
      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    }

    if (id === "goals") {
      result = validateAthleteInput({
        ...draft,
        firstName: draft.firstName || "Athlete",
        experienceLevel: draft.experienceLevel || "intermediate",
        sports: draft.sports.length
          ? draft.sports
          : [{ sportId: "baseball", isPrimary: true, positions: ["Outfield"] }],
        equipment: ["field"],
        sessionDuration: "45-60",
        daysPerWeek: 4,
        availableDays: [1],
        season: "preseason",
      });
      const nextErrors: Record<string, string> = {};
      if (result.errors.goals) nextErrors.goals = result.errors.goals;
      if (result.errors.primaryGoal) nextErrors.primaryGoal = result.errors.primaryGoal;
      if (result.errors.goalNotes) nextErrors.goalNotes = result.errors.goalNotes;
      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    }

    if (id === "training") {
      result = validateAthleteInput({
        ...draft,
        firstName: draft.firstName || "Athlete",
        experienceLevel: draft.experienceLevel || "intermediate",
        sports: draft.sports.length
          ? draft.sports
          : [{ sportId: "baseball", isPrimary: true, positions: ["Outfield"] }],
        goals: draft.goals.length ? draft.goals : ["speed"],
        availableDays: draft.availableDays.length ? draft.availableDays : [1],
        season: "preseason",
      });
      const nextErrors: Record<string, string> = {};
      if (result.errors.equipment) nextErrors.equipment = result.errors.equipment;
      if (result.errors.sessionDuration) {
        nextErrors.sessionDuration = result.errors.sessionDuration;
      }
      if (result.errors.daysPerWeek) nextErrors.daysPerWeek = result.errors.daysPerWeek;
      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    }

    if (id === "schedule") {
      result = validateAthleteInput({
        ...draft,
        firstName: draft.firstName || "Athlete",
        experienceLevel: draft.experienceLevel || "intermediate",
        sports: draft.sports.length
          ? draft.sports
          : [{ sportId: "baseball", isPrimary: true, positions: ["Outfield"] }],
        goals: draft.goals.length ? draft.goals : ["speed"],
        equipment: draft.equipment.length ? draft.equipment : ["field"],
        sessionDuration: draft.sessionDuration || "45-60",
        daysPerWeek: draft.daysPerWeek || 4,
      });
      const nextErrors: Record<string, string> = {};
      if (result.errors.availableDays) {
        nextErrors.availableDays = result.errors.availableDays;
      }
      if (result.errors.season) nextErrors.season = result.errors.season;
      if (result.errors.schedule) nextErrors.schedule = result.errors.schedule;
      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    }

    result = validateAthleteInput(draft);
    setErrors(result.errors);
    return result.ok;
  }

  function next() {
    if (!validateStep(step.id)) return;
    if (stepIndex < STEPS.length - 1) goTo(stepIndex + 1);
  }

  function back() {
    if (stepIndex === 0) {
      router.push("/login");
      return;
    }
    goTo(stepIndex - 1);
  }

  function toggleSport(sportId: SportId) {
    setDraft((prev) => {
      const exists = prev.sports.find((s) => s.sportId === sportId);
      if (exists) {
        const remaining = prev.sports.filter((s) => s.sportId !== sportId);
        if (!remaining.length) return prev;
        if (exists.isPrimary) {
          remaining[0] = { ...remaining[0], isPrimary: true };
        }
        return { ...prev, sports: remaining };
      }
      const nextSport: AthleteSportProfile = {
        sportId,
        isPrimary: prev.sports.length === 0,
        positions: [],
      };
      return { ...prev, sports: [...prev.sports, nextSport] };
    });
  }

  function setPrimarySport(sportId: SportId) {
    setDraft((prev) => ({
      ...prev,
      sports: prev.sports.map((s) => ({
        ...s,
        isPrimary: s.sportId === sportId,
      })),
    }));
  }

  function togglePosition(sportId: SportId, position: string) {
    setDraft((prev) => ({
      ...prev,
      sports: prev.sports.map((sport) => {
        if (sport.sportId !== sportId) return sport;
        const has = sport.positions.includes(position);
        return {
          ...sport,
          positions: has
            ? sport.positions.filter((p) => p !== position)
            : [...sport.positions, position],
        };
      }),
    }));
  }

  function toggleGoal(goal: GoalFocus) {
    setDraft((prev) => {
      const has = prev.goals.includes(goal);
      const goals = has
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal];
      const primaryGoal =
        prev.primaryGoal && goals.includes(prev.primaryGoal)
          ? prev.primaryGoal
          : goals[0];
      return { ...prev, goals, primaryGoal };
    });
  }

  function toggleEquipment(item: EquipmentAccess) {
    setDraft((prev) => {
      const has = prev.equipment.includes(item);
      return {
        ...prev,
        equipment: has
          ? prev.equipment.filter((e) => e !== item)
          : [...prev.equipment, item],
      };
    });
  }

  function toggleDay(day: number) {
    setDraft((prev) => {
      const has = prev.availableDays.includes(day);
      return {
        ...prev,
        availableDays: has
          ? prev.availableDays.filter((d) => d !== day)
          : [...prev.availableDays, day],
      };
    });
  }

  function upsertCommitment(type: ScheduleEvent["type"]) {
    const title =
      type === "practice"
        ? "Team Practice"
        : type === "game"
          ? "Game"
          : "Competition";
    const dayOfWeek = type === "game" ? 6 : 2;
    setDraft((prev) => {
      const without = prev.schedule.filter((e) => e.type !== type);
      return {
        ...prev,
        schedule: [
          ...without,
          {
            id: `${type}_${dayOfWeek}`,
            type,
            title,
            sportId: primarySport?.sportId,
            dayOfWeek,
            recurring: true,
            importance: type === "game" ? "high" : "normal",
            durationMinutes: type === "practice" ? 120 : 180,
          },
        ],
      };
    });
  }

  function removeCommitment(type: ScheduleEvent["type"]) {
    setDraft((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((e) => e.type !== type),
    }));
  }

  function submit() {
    if (!validateStep("review")) return;
    startTransition(async () => {
      const result = await completeOnboardingAction({
        ...draft,
        onboardingCompleted: true,
      });
      if (!result.ok) {
        setErrors(result.errors);
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-8 animate-fade-up">
        <p className="font-display text-2xl font-bold tracking-[0.12em]">
          APEX <span className="text-accent">AI</span>
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-wide sm:text-4xl">
          Build your athlete profile
        </h1>
        <p className="mt-2 max-w-xl text-sm text-text-secondary sm:text-base">
          Apex uses your sport, goals, schedule, and training access to adapt
          later — starting with who you are as an athlete.
        </p>
      </header>

      <nav aria-label="Onboarding progress" className="mb-8">
        <ol className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {STEPS.map((item, index) => {
            const active = index === stepIndex;
            const done = index < stepIndex;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (index <= stepIndex) goTo(index);
                  }}
                  className={cn(
                    "w-full rounded-[var(--radius-md)] border px-2 py-2 text-left transition-colors",
                    active
                      ? "border-accent/50 bg-accent-soft"
                      : done
                        ? "border-border bg-surface-elevated"
                        : "border-border-subtle bg-surface/60",
                  )}
                >
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "mt-1 block text-xs font-medium sm:text-sm",
                      active ? "text-accent" : "text-text-secondary",
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <section className="apex-card-elevated p-5 sm:p-8 animate-fade-up-delay-1">
        {step.id === "athlete" ? (
          <div className="space-y-6">
            <StepIntro
              title="Athlete"
              description="Basic identity only — no unnecessary personal data."
            />
            <Field label="First name" error={errors.firstName}>
              <input
                value={draft.firstName}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, firstName: e.target.value }))
                }
                className="field-input"
                placeholder="Alex"
                autoComplete="given-name"
              />
            </Field>
            <Field label="Age" error={errors.age} optional>
              <input
                type="number"
                min={8}
                max={80}
                value={draft.age ?? ""}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    age: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
                className="field-input"
                placeholder="19"
              />
            </Field>
            <Field label="Experience level" error={errors.experienceLevel}>
              <div className="grid gap-2 sm:grid-cols-3">
                {EXPERIENCE_LEVELS.map((level) => (
                  <OptionChip
                    key={level.id}
                    selected={draft.experienceLevel === level.id}
                    onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                        experienceLevel: level.id as ExperienceLevel,
                      }))
                    }
                  >
                    <span className="block font-medium text-inherit">
                      {level.label}
                    </span>
                    <span className="mt-1 block text-xs opacity-70">
                      {level.description}
                    </span>
                  </OptionChip>
                ))}
              </div>
            </Field>
          </div>
        ) : null}

        {step.id === "sports" ? (
          <div className="space-y-6">
            <StepIntro
              title="Sports"
              description="Select one or more sports. Baseball is available now — more sports unlock later."
            />
            {errors.sports ? <ErrorText>{errors.sports}</ErrorText> : null}
            <div className="grid gap-2 sm:grid-cols-2">
              {sports.map((sport) => {
                const selected = draft.sports.some((s) => s.sportId === sport.id);
                const isPrimary = primarySport?.sportId === sport.id;
                return (
                  <div
                    key={sport.id}
                    className={cn(
                      "rounded-[var(--radius-md)] border p-3",
                      selected ? "border-accent/40 bg-accent-soft/30" : "border-border",
                      !sport.enabled && "opacity-50",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        disabled={!sport.enabled && !selected}
                        onClick={() => sport.enabled && toggleSport(sport.id)}
                        className="flex flex-1 items-center gap-3 text-left"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface">
                          <SportIcon
                            icon={sport.icon}
                            className={selected ? "text-accent" : "text-text-muted"}
                          />
                        </span>
                        <span>
                          <span className="block text-sm font-medium">
                            {sport.name}
                          </span>
                          <span className="text-xs text-text-muted">
                            {sport.enabled ? "Available" : "Coming later"}
                          </span>
                        </span>
                      </button>
                      {selected ? (
                        <button
                          type="button"
                          onClick={() => setPrimarySport(sport.id)}
                          className={cn(
                            "rounded-[var(--radius-sm)] border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider",
                            isPrimary
                              ? "border-accent/40 text-accent"
                              : "border-border text-text-muted",
                          )}
                        >
                          {isPrimary ? "Primary" : "Make primary"}
                        </button>
                      ) : null}
                    </div>

                    {selected && sport.config.positions?.length ? (
                      <div className="mt-3 border-t border-border-subtle pt-3">
                        <p className="mb-2 text-xs uppercase tracking-wider text-text-muted">
                          Positions
                        </p>
                        {errors.positions && isPrimary ? (
                          <ErrorText>{errors.positions}</ErrorText>
                        ) : null}
                        <div className="flex flex-wrap gap-2">
                          {sport.config.positions.map((position) => {
                            const active = draft.sports
                              .find((s) => s.sportId === sport.id)
                              ?.positions.includes(position);
                            return (
                              <OptionChip
                                key={position}
                                selected={active}
                                onClick={() => togglePosition(sport.id, position)}
                                className="px-2.5 py-1.5 text-xs"
                              >
                                {position}
                              </OptionChip>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {step.id === "goals" ? (
          <div className="space-y-6">
            <StepIntro
              title="Goals"
              description="Athlete-stated objectives for training focus — not a scientific assessment."
            />
            {errors.goals ? <ErrorText>{errors.goals}</ErrorText> : null}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {GOAL_OPTIONS.map((goal) => (
                <OptionChip
                  key={goal.id}
                  selected={draft.goals.includes(goal.id)}
                  onClick={() => toggleGoal(goal.id)}
                >
                  {goal.label}
                </OptionChip>
              ))}
            </div>
            {draft.goals.length ? (
              <Field label="Primary goal" error={errors.primaryGoal}>
                <div className="flex flex-wrap gap-2">
                  {draft.goals.map((goal) => (
                    <OptionChip
                      key={goal}
                      selected={draft.primaryGoal === goal}
                      onClick={() =>
                        setDraft((prev) => ({ ...prev, primaryGoal: goal }))
                      }
                      className="px-2.5 py-1.5 text-xs"
                    >
                      {formatGoalLabel(goal)}
                    </OptionChip>
                  ))}
                </div>
              </Field>
            ) : null}
            <Field
              label="What are you trying to improve?"
              error={errors.goalNotes}
              optional
            >
              <textarea
                value={draft.goalNotes ?? ""}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, goalNotes: e.target.value }))
                }
                rows={3}
                maxLength={280}
                className="field-input resize-y"
                placeholder="I want to become faster and more explosive in the outfield."
              />
            </Field>
          </div>
        ) : null}

        {step.id === "training" ? (
          <div className="space-y-6">
            <StepIntro
              title="Training access"
              description="Equipment and time available for athletic performance work."
            />
            <Field label="Equipment / access" error={errors.equipment}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {EQUIPMENT_OPTIONS.map((item) => (
                  <OptionChip
                    key={item.id}
                    selected={draft.equipment.includes(item.id)}
                    onClick={() => toggleEquipment(item.id)}
                  >
                    {item.label}
                  </OptionChip>
                ))}
              </div>
            </Field>
            <Field label="Typical session length" error={errors.sessionDuration}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {SESSION_DURATION_OPTIONS.map((item) => (
                  <OptionChip
                    key={item.id}
                    selected={draft.sessionDuration === item.id}
                    onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                        sessionDuration: item.id as SessionDuration,
                      }))
                    }
                  >
                    {item.label}
                  </OptionChip>
                ))}
              </div>
            </Field>
            <Field label="Training days per week" error={errors.daysPerWeek}>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <OptionChip
                    key={n}
                    selected={draft.daysPerWeek === n}
                    onClick={() =>
                      setDraft((prev) => ({ ...prev, daysPerWeek: n }))
                    }
                    className="min-w-11 justify-center px-3 py-2 text-center"
                  >
                    {n}
                  </OptionChip>
                ))}
              </div>
            </Field>
          </div>
        ) : null}

        {step.id === "schedule" ? (
          <div className="space-y-6">
            <StepIntro
              title="Schedule & season"
              description="High-level availability and fixed commitments. Full natural-language scheduling comes later."
            />
            <Field label="Current season" error={errors.season}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {SEASON_OPTIONS.map((item) => (
                  <OptionChip
                    key={item.id}
                    selected={draft.season === item.id}
                    onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                        season: item.id as SeasonPhase,
                      }))
                    }
                  >
                    {item.label}
                  </OptionChip>
                ))}
              </div>
            </Field>
            <Field
              label="Days available for additional training"
              error={errors.availableDays}
            >
              <div className="flex flex-wrap gap-2">
                {WEEKDAY_OPTIONS.map((day) => (
                  <OptionChip
                    key={day.id}
                    selected={draft.availableDays.includes(day.id)}
                    onClick={() => toggleDay(day.id)}
                    className="min-w-12 justify-center text-center"
                  >
                    {day.short}
                  </OptionChip>
                ))}
              </div>
            </Field>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                Fixed commitments
              </p>
              {errors.schedule ? <ErrorText>{errors.schedule}</ErrorText> : null}
              <div className="space-y-2">
                {(
                  [
                    { type: "practice" as const, label: "Weekly practice (Tue)" },
                    { type: "game" as const, label: "Weekly game (Sat)" },
                  ] as const
                ).map((item) => {
                  const active = draft.schedule.some((e) => e.type === item.type);
                  return (
                    <div
                      key={item.type}
                      className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border px-3 py-3"
                    >
                      <span className="text-sm">{item.label}</span>
                      <Button
                        size="sm"
                        variant={active ? "secondary" : "outline"}
                        onClick={() =>
                          active
                            ? removeCommitment(item.type)
                            : upsertCommitment(item.type)
                        }
                      >
                        {active ? "Remove" : "Add"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {step.id === "review" ? (
          <div className="space-y-6">
            <StepIntro
              title="Review"
              description="Confirm your athletic context. You can edit anytime from Profile."
            />
            {errors.form ? <ErrorText>{errors.form}</ErrorText> : null}
            <div className="space-y-3">
              <ReviewCard
                title="Athlete"
                onEdit={() => goTo(0)}
                body={`${draft.firstName || "—"}${draft.age ? ` · Age ${draft.age}` : ""} · ${formatExperienceLabel(draft.experienceLevel)}`}
              />
              <ReviewCard
                title="Primary sport"
                onEdit={() => goTo(1)}
                body={`${getSport(primarySport?.sportId)?.name ?? "—"} · ${(primarySport?.positions ?? []).join(" · ") || "No positions"}`}
              />
              <ReviewCard
                title="Goals"
                onEdit={() => goTo(2)}
                body={`${draft.goals.map(formatGoalLabel).join(" · ") || "—"}${draft.primaryGoal ? ` · Primary: ${formatGoalLabel(draft.primaryGoal)}` : ""}`}
              />
              <ReviewCard
                title="Training access"
                onEdit={() => goTo(3)}
                body={`${draft.equipment.map(formatEquipmentLabel).join(" · ") || "—"} · ${formatSessionDurationLabel(draft.sessionDuration)} · ${draft.daysPerWeek} days/week`}
              />
              <ReviewCard
                title="Schedule"
                onEdit={() => goTo(4)}
                body={`${formatSeasonLabel(draft.season)} · ${formatAvailableDays(draft.availableDays)} · ${draft.schedule.length} commitment${draft.schedule.length === 1 ? "" : "s"}`}
              />
            </div>
            {draft.goalNotes ? (
              <p className="rounded-[var(--radius-md)] border border-border-subtle bg-surface px-4 py-3 text-sm text-text-secondary">
                “{draft.goalNotes}”
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-5">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" onClick={back}>
              {stepIndex === 0 ? "Back to sign in" : "Back"}
            </Button>
            {process.env.NODE_ENV === "development" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDraft({
                    firstName: "Sean",
                    age: 22,
                    experienceLevel: "intermediate",
                    sports: [
                      {
                        sportId: "baseball",
                        isPrimary: true,
                        positions: ["Outfield"],
                      },
                    ],
                    goals: ["speed", "explosiveness"],
                    primaryGoal: "speed",
                    goalNotes:
                      "I want to become faster and more explosive in the outfield.",
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
                    onboardingCompleted: false,
                  });
                  setErrors({});
                  goTo(STEPS.length - 1);
                }}
              >
                Prefill Sean (dev)
              </Button>
            ) : null}
          </div>
          {step.id === "review" ? (
            <Button size="lg" onClick={submit} disabled={pending}>
              {pending ? "Building…" : "Build My Apex"}
            </Button>
          ) : (
            <Button size="lg" onClick={next}>
              Continue
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

function StepIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold tracking-wide">{title}</h2>
      <p className="mt-1.5 text-sm text-text-secondary">{description}</p>
    </div>
  );
}

function Field({
  label,
  children,
  error,
  optional,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  optional?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 flex items-baseline gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
        <span>{label}</span>
        {optional ? (
          <span className="normal-case tracking-normal text-text-muted/70">
            optional
          </span>
        ) : null}
      </label>
      {children}
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-sm text-danger">{children}</p>;
}

function ReviewCard({
  title,
  body,
  onEdit,
}: {
  title: string;
  body: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          {title}
        </p>
        <p className="mt-1 text-sm text-text-primary">{body}</p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 text-xs font-semibold uppercase tracking-wider text-accent hover:underline"
      >
        Edit
      </button>
    </div>
  );
}
