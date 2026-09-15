import { cn } from "@/lib/utils/cn";

interface OptionChipProps {
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button";
  "aria-pressed"?: boolean;
}

export function OptionChip({
  selected,
  disabled,
  onClick,
  children,
  className,
}: OptionChipProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-[var(--radius-md)] border px-3 py-2.5 text-left text-sm transition-colors",
        selected
          ? "border-accent/50 bg-accent-soft text-accent"
          : "border-border bg-surface text-text-secondary hover:border-border hover:bg-surface-hover hover:text-text-primary",
        disabled && "cursor-not-allowed opacity-40 hover:bg-surface hover:text-text-secondary",
        className,
      )}
    >
      {children}
    </button>
  );
}
