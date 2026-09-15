import { AIChatComposer } from "@/components/chat/AIChatComposer";
import { getAllSports } from "@/lib/sports/registry";
import type { SportId } from "@/lib/types/sport";

interface AICoachEntryProps {
  primarySportId?: SportId;
  prompt?: string;
}

export function AICoachEntry({
  primarySportId = "baseball",
  prompt = "What’s affecting your training?",
}: AICoachEntryProps) {
  const sports = getAllSports();

  return (
    <section
      className="apex-card p-5 sm:p-6 animate-fade-up-delay-3"
      aria-labelledby="coach-entry-heading"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
        AI Coach
      </p>
      <h2
        id="coach-entry-heading"
        className="mt-1 font-display text-xl font-semibold tracking-wide"
      >
        {prompt}
      </h2>
      <p className="mt-1.5 text-sm text-text-secondary">
        Share fatigue, schedule conflicts, or goals — Apex will adapt with your
        sport context.
      </p>
      <div className="mt-4">
        <AIChatComposer
          sports={sports}
          initialSportId={primarySportId}
          placeholder="Ask Apex AI…"
        />
      </div>
    </section>
  );
}
