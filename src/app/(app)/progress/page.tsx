import { SectionHeader } from "@/components/ui/SectionHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MOCK_DASHBOARD } from "@/lib/data/mock";

export const metadata = { title: "Progress" };

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Progress"
        title="Performance snapshot"
        description="Values below are demonstration metrics for PR #1 — not scientifically computed."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {MOCK_DASHBOARD.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <section className="apex-card p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold tracking-wide">
          Trends
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Charts, readiness history, and load management visualizations will
          connect here once athlete data and the adaptive engine are live.
        </p>
        <div className="mt-6 flex h-40 items-end gap-2 rounded-[var(--radius-md)] border border-dashed border-border px-4 pb-4 pt-6">
          {[42, 55, 48, 62, 58, 70, 66, 74, 68, 82].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-accent/25"
              style={{ height: `${h}%` }}
              aria-hidden
            />
          ))}
        </div>
        <p className="mt-2 text-center text-[11px] text-text-muted">
          Placeholder readiness trend
        </p>
      </section>
    </div>
  );
}
