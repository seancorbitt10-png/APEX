"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { OptionChip } from "@/components/ui/OptionChip";
import { SportIcon } from "@/components/ui/SportBadge";
import { updateAthleteProfileAction } from "@/lib/athlete/actions";
import {
  EQUIPMENT_OPTIONS,
  EXPERIENCE_LEVELS,
  GOAL_OPTIONS,
  SEASON_OPTIONS,
  SESSION_DURATION_OPTIONS,
  WEEKDAY_OPTIONS,
  formatGoalLabel,
} from "@/lib/athlete/options";
import { getAllSports } from "@/lib/sports/registry";
import type {
  AthleteProfile,
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

interface ProfileEditorProps {
  athlete: AthleteProfile;
}

export function ProfileEditor({ athlete }: ProfileEditorProps) {
  const [draft, setDraft] = useState<AthleteProfile>(athlete);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const sports = getAllSports();
  const primarySport =
    draft.sports.find((s) => s.isPrimary) ?? draft.sports[0];

  function toggleSport(sportId: SportId) {
    setDraft((prev) => {
      const exists = prev.sports.find((s) => s.sportId === sportId);
      if (exists) {
        const remaining = prev.sports.filter((s) => s.sportId !== sportId);
        if (!remaining.length) return prev;
        if (exists.isPrimary) remaining[0] = { ...remaining[0], isPrimary: true };
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
      const goals = has ? prev.goals.filter((g) => g !== goal) : [...prev.goals, goal];
      const primaryGoal =
        prev.primaryGoal && goals.includes(prev.primaryGoal)
          ? prev.primaryGoal
          : goals[0];
      return { ...prev, goals, primaryGoal };
    });
  }

  function toggleEquipment(item: EquipmentAccess) {
    setDraft((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter((e) => e !== item)
        : [...prev.equipment, item],
    }));
  }

  function toggleDay(day: number) {
    setDraft((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  }

  function upsertCommitment(type: ScheduleEvent["type"]) {
    const title =
      type === "practice" ? "Team Practice" : type === "game" ? "Game" : "Competition";
    const dayOfWeek = type === "game" ? 6 : 2;
    setDraft((prev) => ({
      ...prev,
      schedule: [
        ...prev.schedule.filter((e) => e.type !== type),
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
    }));
  }

  function save() {
    setMessage(null);
    startTransition(async () => {
      try {
        const result = await updateAthleteProfileAction({
          firstName: draft.firstName,
          age: draft.age,
          experienceLevel: draft.experienceLevel,
          sports: draft.sports,
          goals: draft.goals,
          primaryGoal: draft.primaryGoal,
          goalNotes: draft.goalNotes,
          equipment: draft.equipment,
          sessionDuration: draft.sessionDuration,
          daysPerWeek: draft.daysPerWeek,
          availableDays: draft.availableDays,
          season: draft.season,
          schedule: draft.schedule,
          onboardingCompleted: true,
        });
        setErrors(result.errors);
        if (result.ok) {
          setMessage(result.message ?? "Profile saved.");
          setDraft((prev) => ({
            ...prev,
            firstName: draft.firstName.trim(),
            age: draft.age,
          }));
        }
      } catch (error) {
        setErrors({
          form:
            error instanceof Error
              ? error.message
              : "Could not save profile. Try again.",
        });
      }
    });
  }

  return (
    <div className="space-y-6">
      <section className="apex-card p-5 sm:p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold tracking-wide">
          Basic information
        </h2>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
          First name
          <input
            className="field-input mt-2"
            value={draft.firstName}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, firstName: e.target.value }))
            }
          />
        </label>
        {errors.firstName ? <p className="text-sm text-danger">{errors.firstName}</p> : null}
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
          Age
          <input
            type="number"
            min={8}
            max={80}
            className="field-input mt-2"
            value={draft.age ?? ""}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                age: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            onBlur={(e) =>
              setDraft((prev) => ({
                ...prev,
                age: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
          />
        </label>
        {errors.age ? <p className="text-sm text-danger">{errors.age}</p> : null}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Experience
          </p>
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
                {level.label}
              </OptionChip>
            ))}
          </div>
        </div>
      </section>

      <section className="apex-card p-5 sm:p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold tracking-wide">
          Sports & positions
        </h2>
        {errors.sports ? <p className="text-sm text-danger">{errors.sports}</p> : null}
        {errors.positions ? (
          <p className="text-sm text-danger">{errors.positions}</p>
        ) : null}
        <div className="grid gap-2 sm:grid-cols-2">
          {sports.map((sport) => {
            const selected = draft.sports.some((s) => s.sportId === sport.id);
            const isPrimary = primarySport?.sportId === sport.id;
            return (
              <div
                key={sport.id}
                className={cn(
                  "rounded-[var(--radius-md)] border p-3",
                  selected ? "border-accent/40 bg-accent-soft/20" : "border-border",
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
                    <SportIcon
                      icon={sport.icon}
                      className={selected ? "text-accent" : "text-text-muted"}
                    />
                    <span className="text-sm font-medium">{sport.name}</span>
                  </button>
                  {selected ? (
                    <button
                      type="button"
                      onClick={() => setPrimarySport(sport.id)}
                      className={cn(
                        "text-[10px] font-semibold uppercase tracking-wider",
                        isPrimary ? "text-accent" : "text-text-muted",
                      )}
                    >
                      {isPrimary ? "Primary" : "Make primary"}
                    </button>
                  ) : null}
                </div>
                {selected && sport.config.positions?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
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
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className="apex-card p-5 sm:p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold tracking-wide">Goals</h2>
        {errors.goals ? <p className="text-sm text-danger">{errors.goals}</p> : null}
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
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Primary goal
            </p>
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
          </div>
        ) : null}
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
          What are you trying to improve?
          <textarea
            className="field-input mt-2 resize-y"
            rows={3}
            maxLength={280}
            value={draft.goalNotes ?? ""}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, goalNotes: e.target.value }))
            }
          />
        </label>
      </section>

      <section className="apex-card p-5 sm:p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold tracking-wide">
          Training access
        </h2>
        {errors.equipment ? (
          <p className="text-sm text-danger">{errors.equipment}</p>
        ) : null}
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
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Session length
          </p>
          <div className="flex flex-wrap gap-2">
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
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Days / week
          </p>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <OptionChip
                key={n}
                selected={draft.daysPerWeek === n}
                onClick={() => setDraft((prev) => ({ ...prev, daysPerWeek: n }))}
              >
                {n}
              </OptionChip>
            ))}
          </div>
        </div>
      </section>

      <section className="apex-card p-5 sm:p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold tracking-wide">
          Availability & season
        </h2>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Season
          </p>
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
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Available days
          </p>
          {errors.availableDays ? (
            <p className="mb-2 text-sm text-danger">{errors.availableDays}</p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {WEEKDAY_OPTIONS.map((day) => (
              <OptionChip
                key={day.id}
                selected={draft.availableDays.includes(day.id)}
                onClick={() => toggleDay(day.id)}
              >
                {day.short}
              </OptionChip>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Commitments
          </p>
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
                className="flex items-center justify-between rounded-[var(--radius-md)] border border-border px-3 py-3 text-sm"
              >
                <span>{item.label}</span>
                <Button
                  size="sm"
                  variant={active ? "secondary" : "outline"}
                  onClick={() =>
                    active
                      ? setDraft((prev) => ({
                          ...prev,
                          schedule: prev.schedule.filter((e) => e.type !== item.type),
                        }))
                      : upsertCommitment(item.type)
                  }
                >
                  {active ? "Remove" : "Add"}
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Button size="lg" onClick={save} disabled={pending}>
          {pending ? "Saving…" : "Save profile"}
        </Button>
        {message ? <p className="text-sm text-accent">{message}</p> : null}
        {errors.form ? <p className="text-sm text-danger">{errors.form}</p> : null}
      </div>
    </div>
  );
}
