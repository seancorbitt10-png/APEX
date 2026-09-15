"use client";

import { useState } from "react";
import { Sidebar, type NavItem } from "@/components/shell/Sidebar";
import { MobileNavigation } from "@/components/shell/MobileNavigation";
import type { SportConfig } from "@/lib/types/sport";

const PRIMARY_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/training", label: "My Training", icon: "training" },
  { href: "/sports", label: "Sports", icon: "sports" },
  { href: "/calendar", label: "Calendar", icon: "calendar" },
  { href: "/progress", label: "Progress", icon: "progress" },
  { href: "/coach", label: "AI Coach", icon: "coach" },
];

const BOTTOM_NAV: NavItem[] = [
  { href: "/profile", label: "Profile", icon: "profile" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

const MOBILE_ITEMS = [
  { href: "/dashboard", label: "Home", icon: "dashboard" as const },
  { href: "/training", label: "Train", icon: "training" as const },
  { href: "/calendar", label: "Calendar", icon: "calendar" as const },
  { href: "/coach", label: "Coach", icon: "coach" as const },
];

interface AppShellProps {
  children: React.ReactNode;
  sports: SportConfig[];
}

export function AppShell({ children, sports }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="apex-atmosphere min-h-dvh">
      <Sidebar
        primaryNav={PRIMARY_NAV}
        sports={sports}
        bottomNav={BOTTOM_NAV}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="lg:pl-[var(--sidebar-width)]">
        <header className="sticky top-0 z-20 flex h-[var(--header-height)] items-center gap-3 border-b border-border-subtle bg-background/80 px-4 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-[var(--radius-sm)] p-2 text-text-secondary hover:bg-surface-hover"
            aria-label="Open navigation"
          >
            <span className="sr-only">Open navigation</span>
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden
            >
              <path d="M5 7h14M5 12h14M5 17h14" strokeLinecap="round" />
            </svg>
          </button>
          <span className="font-display text-lg font-bold tracking-[0.12em]">
            APEX <span className="text-accent">AI</span>
          </span>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:py-8 lg:pb-8">
          {children}
        </main>
      </div>

      <MobileNavigation
        items={MOBILE_ITEMS}
        onOpenMenu={() => setMobileOpen(true)}
      />
    </div>
  );
}
