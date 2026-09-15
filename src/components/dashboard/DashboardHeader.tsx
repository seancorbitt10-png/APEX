import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { getGreeting } from "@/lib/data/mock";

interface DashboardHeaderProps {
  name: string;
  initials?: string;
  subtitle?: string;
}

export function DashboardHeader({
  name,
  initials,
  subtitle = "Here’s what your training looks like today.",
}: DashboardHeaderProps) {
  const greeting = getGreeting();
  const avatar = (initials ?? name.slice(0, 2)).toUpperCase();

  return (
    <header className="flex flex-wrap items-start justify-between gap-4 animate-fade-up">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-wide text-text-primary sm:text-4xl">
          {greeting}, {name}.
        </h1>
        <p className="mt-1.5 max-w-xl text-sm text-text-secondary sm:text-base">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/settings"
          className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
          aria-label="Notifications"
        >
          <Icon name="bell" className="h-[18px] w-[18px]" />
        </Link>
        <Link
          href="/profile"
          className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface pl-1.5 pr-3 text-sm text-text-primary transition-colors hover:bg-surface-hover"
          aria-label="Open profile"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-accent-soft text-xs font-bold text-accent">
            {avatar}
          </span>
          <span className="hidden sm:inline">{name}</span>
        </Link>
      </div>
    </header>
  );
}
