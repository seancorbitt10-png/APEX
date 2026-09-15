"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SportIcon } from "@/components/ui/SportBadge";
import type { SportConfig } from "@/lib/types/sport";

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
}

interface SidebarProps {
  primaryNav: NavItem[];
  sports: SportConfig[];
  bottomNav: NavItem[];
  open: boolean;
  onClose: () => void;
}

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-accent-soft text-accent"
          : "text-text-secondary hover:bg-surface-hover hover:text-text-primary",
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon
        name={item.icon}
        className={cn(
          "h-[18px] w-[18px]",
          active ? "text-accent" : "text-text-muted group-hover:text-text-secondary",
        )}
      />
      <span>{item.label}</span>
      {active ? (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
      ) : null}
    </Link>
  );
}

export function Sidebar({
  primaryNav,
  sports,
  bottomNav,
  open,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-[var(--header-height)] items-center gap-3 border-b border-border-subtle px-5">
        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex items-center gap-2.5 focus-visible:outline-offset-4"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] border border-accent/30 bg-accent-soft">
            <span className="font-display text-sm font-bold tracking-wider text-accent">
              A
            </span>
          </span>
          <span className="font-display text-xl font-bold tracking-[0.12em] text-text-primary">
            APEX <span className="text-accent">AI</span>
          </span>
        </Link>
        <button
          type="button"
          className="ml-auto rounded-[var(--radius-sm)] p-2 text-text-secondary hover:bg-surface-hover lg:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <Icon name="close" className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Primary">
        <ul className="space-y-1">
          {primaryNav.map((item) => (
            <li key={item.href}>
              <NavLink
                item={item}
                active={isActive(item.href)}
                onNavigate={onClose}
              />
            </li>
          ))}
        </ul>

        <div className="my-4 border-t border-border-subtle" />

        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
          Sports
        </p>
        <ul className="space-y-1">
          {sports.map((sport) => {
            const href = `/sports/${sport.id}`;
            const active = isActive(href);
            return (
              <li key={sport.id}>
                <Link
                  href={href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent-soft text-accent"
                      : "text-text-secondary hover:bg-surface-hover hover:text-text-primary",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <SportIcon
                    icon={sport.icon}
                    className={active ? "text-accent" : "text-text-muted"}
                  />
                  <span>{sport.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border-subtle px-3 py-3">
        <ul className="space-y-1">
          {bottomNav.map((item) => (
            <li key={item.href}>
              <NavLink
                item={item}
                active={isActive(item.href)}
                onNavigate={onClose}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden w-[var(--sidebar-width)] border-r border-border-subtle bg-surface lg:block"
        aria-label="Application sidebar"
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <button
          type="button"
          aria-label="Close menu overlay"
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={onClose}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 w-[min(100%,var(--sidebar-width))] border-r border-border-subtle bg-surface transition-transform duration-200",
            open ? "translate-x-0" : "-translate-x-full",
          )}
          aria-hidden={!open}
        >
          {content}
        </aside>
      </div>
    </>
  );
}
