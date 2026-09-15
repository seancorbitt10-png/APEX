"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AIChatComposer } from "@/components/chat/AIChatComposer";
import { getAllSports, getSport } from "@/lib/sports/registry";
import {
  formatAvailableDays,
  formatEquipmentLabel,
  formatGoalLabel,
  formatSeasonLabel,
} from "@/lib/athlete/options";
import type { AthleteContext } from "@/lib/types/athlete";
import type { SportId } from "@/lib/types/sport";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sportId: SportId | null;
}

interface CoachClientProps {
  athleteContext: AthleteContext | null;
}

export default function CoachClient({ athleteContext }: CoachClientProps) {
  const searchParams = useSearchParams();
  const sports = getAllSports();
  const defaultSport =
    athleteContext?.primarySport?.id ??
    ((searchParams.get("sport") as SportId | null) || "baseball");

  const initialQ = searchParams.get("q");
  const initialSport =
    (searchParams.get("sport") as SportId | null) ?? defaultSport;

  const contextSummary = useMemo(() => {
    if (!athleteContext) {
      return "No persisted athlete context yet.";
    }
    const { athlete, primarySport, positions } = athleteContext;
    return [
      athlete.firstName,
      primarySport?.name,
      positions.join("/"),
      athlete.primaryGoal
        ? `Primary goal: ${formatGoalLabel(athlete.primaryGoal)}`
        : null,
      formatSeasonLabel(athlete.season),
      `Availability: ${formatAvailableDays(athlete.availableDays)}`,
      `Equipment: ${athlete.equipment.map(formatEquipmentLabel).join(", ")}`,
    ]
      .filter(Boolean)
      .join(" · ");
  }, [athleteContext]);

  const seedMessages = useMemo(() => {
    const items: ChatMessage[] = [
      {
        id: "welcome",
        role: "assistant",
        content: athleteContext
          ? `I’m Apex AI Coach. I have your athlete context loaded (${contextSummary}). No AI provider is connected yet — this shell will eventually use that context to adapt training.`
          : "I’m Apex AI Coach. Complete onboarding so I can load your athlete context. No AI provider is connected yet.",
        sportId: initialSport,
      },
    ];
    if (initialQ) {
      items.push({
        id: "seed-user",
        role: "user",
        content: initialQ,
        sportId: initialSport,
      });
      items.push({
        id: "seed-assistant",
        role: "assistant",
        content: shellReply(initialQ, initialSport, athleteContext),
        sportId: initialSport,
      });
    }
    return items;
  }, [initialQ, initialSport, athleteContext, contextSummary]);

  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);

  return (
    <div className="flex min-h-[70vh] flex-col gap-6">
      <SectionHeader
        eyebrow="AI Coach"
        title="Conversation shell"
        description="Athlete context is available locally. No AI provider is connected in this PR."
      />

      {athleteContext ? (
        <div className="apex-card px-4 py-3 text-sm text-text-secondary">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
            Athlete context loaded
          </p>
          <p className="mt-1">{contextSummary}</p>
        </div>
      ) : null}

      <div className="apex-card flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.map((message) => {
            const sport = getSport(message.sportId);
            return (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[85%] rounded-[var(--radius-md)] border border-accent/30 bg-accent-soft px-4 py-3 text-sm"
                    : "max-w-[90%] rounded-[var(--radius-md)] border border-border bg-surface-elevated px-4 py-3 text-sm text-text-secondary"
                }
              >
                {sport && message.role === "user" ? (
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                    {sport.name}
                  </p>
                ) : null}
                <p className="leading-relaxed text-text-primary">
                  {message.content}
                </p>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border-subtle p-3 sm:p-4">
          <AIChatComposer
            sports={sports}
            initialSportId={initialSport}
            navigateOnSubmit={false}
            placeholder="Ask Apex AI anything…"
            onSubmitMessage={({ message, sportId }) => {
              const userMsg: ChatMessage = {
                id: `u_${Date.now()}`,
                role: "user",
                content: message,
                sportId,
              };
              const assistantMsg: ChatMessage = {
                id: `a_${Date.now()}`,
                role: "assistant",
                content: shellReply(message, sportId, athleteContext),
                sportId,
              };
              setMessages((prev) => [...prev, userMsg, assistantMsg]);
            }}
          />
        </div>
      </div>
    </div>
  );
}

function shellReply(
  message: string,
  sportId: SportId | null,
  context: AthleteContext | null,
): string {
  const sport = getSport(sportId);
  const sportLabel = sport ? ` (${sport.name} context)` : "";
  const athleteLabel = context
    ? ` Athlete: ${context.athlete.firstName}; goals: ${context.goals
        .map(formatGoalLabel)
        .join(", ")}; season: ${formatSeasonLabel(context.season)}.`
    : "";
  return `Received${sportLabel}: “${message}”.${athleteLabel} The adaptive coaching engine isn’t connected yet — this shell confirms athlete context can be retrieved without an AI API.`;
}
