import { cn } from "@/lib/utils/cn";
import type { SportConfig } from "@/lib/types/sport";

interface SportBadgeProps {
  sport: SportConfig;
  size?: "sm" | "md";
  className?: string;
}

export function SportIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  // Simple geometric marks — expandable without emoji clutter
  if (icon === "baseball") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={cn("h-4 w-4", className)}
        aria-hidden
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <circle cx="12" cy="12" r="8.5" />
        <path d="M7.2 6.8c2.2 2.4 2.2 8 0 10.4" />
        <path d="M16.8 6.8c-2.2 2.4-2.2 8 0 10.4" />
      </svg>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex h-4 w-4 items-center justify-center rounded-full border border-current text-[9px] font-bold",
        className,
      )}
      aria-hidden
    >
      {icon.slice(0, 1).toUpperCase()}
    </span>
  );
}

export function SportBadge({ sport, size = "sm", className }: SportBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-border bg-surface-elevated text-text-primary",
        size === "sm" ? "px-2 py-1 text-xs" : "px-2.5 py-1.5 text-sm",
        className,
      )}
    >
      <SportIcon icon={sport.icon} />
      <span className="font-medium">{sport.shortName}</span>
    </span>
  );
}
