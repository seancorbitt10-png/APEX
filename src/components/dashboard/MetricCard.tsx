import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { cn } from "@/lib/utils/cn";
import type { PerformanceMetric } from "@/lib/types/training";

interface MetricCardProps {
  metric: PerformanceMetric;
  className?: string;
}

export function MetricCard({ metric, className }: MetricCardProps) {
  return (
    <article
      className={cn(
        "apex-card flex min-h-[120px] flex-col justify-between p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
          {metric.label}
        </h3>
        <StatusIndicator label={metric.status} tone={metric.tone} />
      </div>
      <p className="mt-4 font-display text-3xl font-semibold tracking-wide text-text-primary sm:text-4xl">
        {metric.value}
      </p>
      {metric.isMock ? (
        <p className="mt-2 text-[11px] text-text-muted">Demo metric</p>
      ) : null}
    </article>
  );
}
