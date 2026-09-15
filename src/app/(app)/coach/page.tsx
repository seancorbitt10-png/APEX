import { Suspense } from "react";
import CoachClient from "./CoachClient";
import { loadAthleteContext } from "@/lib/athlete/actions";

export const metadata = { title: "AI Coach" };

export default async function CoachRoute() {
  const context = await loadAthleteContext();

  return (
    <Suspense
      fallback={
        <div className="apex-card p-6 text-sm text-text-secondary">
          Loading coach…
        </div>
      }
    >
      <CoachClient athleteContext={context} />
    </Suspense>
  );
}
