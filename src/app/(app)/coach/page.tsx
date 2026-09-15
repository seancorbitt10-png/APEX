import { Suspense } from "react";
import CoachClient from "./CoachClient";

export const metadata = { title: "AI Coach" };

export default function CoachRoute() {
  return (
    <Suspense
      fallback={
        <div className="apex-card p-6 text-sm text-text-secondary">
          Loading coach…
        </div>
      }
    >
      <CoachClient />
    </Suspense>
  );
}
