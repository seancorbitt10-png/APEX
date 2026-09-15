"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AIChatComposer } from "@/components/chat/AIChatComposer";
import { getAllSports, getSport } from "@/lib/sports/registry";
import type { SportId } from "@/lib/types/sport";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sportId: SportId | null;
}

export default function CoachClient() {
  const searchParams = useSearchParams();
  const sports = getAllSports();

  const initialQ = searchParams.get("q");
  const initialSport =
    (searchParams.get("sport") as SportId | null) ?? "baseball";

  const seedMessages = useMemo(() => {
    const items: ChatMessage[] = [
      {
        id: "welcome",
        role: "assistant",
        content:
          "I’m Apex AI Coach. Tell me what’s affecting your training — fatigue, schedule changes, goals, or how practice felt. Sport context shapes how I’ll adapt plans later.",
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
        content: shellReply(initialQ, initialSport),
        sportId: initialSport,
      });
    }
    return items;
  }, [initialQ, initialSport]);

  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);

  return (
    <div className="flex min-h-[70vh] flex-col gap-6">
      <SectionHeader
        eyebrow="AI Coach"
        title="Conversation shell"
        description="UI foundation only — no AI provider is connected in PR #1."
      />

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
                content: shellReply(message, sportId),
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

function shellReply(message: string, sportId: SportId | null): string {
  const sport = getSport(sportId);
  const context = sport ? ` (${sport.name} context)` : "";
  return `Received${context}: “${message}”. The adaptive coaching engine isn’t connected yet — this is the conversation shell for future sport-aware planning.`;
}
