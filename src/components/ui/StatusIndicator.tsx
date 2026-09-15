import { cn } from "@/lib/utils/cn";

type StatusTone = "optimal" | "balanced" | "good" | "caution" | "neutral";

const toneStyles: Record<StatusTone, string> = {
  optimal: "text-accent bg-accent-soft",
  balanced: "text-info bg-[rgba(90,168,232,0.12)]",
  good: "text-success bg-accent-soft",
  caution: "text-warning bg-[rgba(232,184,74,0.12)]",
  neutral: "text-text-secondary bg-surface-hover",
};

interface StatusIndicatorProps {
  label: string;
  tone?: StatusTone;
  className?: string;
}

export function StatusIndicator({
  label,
  tone = "neutral",
  className,
}: StatusIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-sm)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        toneStyles[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
