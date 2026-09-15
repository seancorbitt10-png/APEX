import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { signOut } from "@/lib/auth/actions";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Settings"
        title="Preferences"
        description="Lightweight settings foundation — expand as product features land."
      />

      <section className="apex-card p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold tracking-wide">
          Appearance
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Apex AI is dark-first for a performance aesthetic. Theme controls can
          be added later if needed.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface-elevated px-3 py-2 text-sm">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Dark performance theme
        </div>
      </section>

      <section className="apex-card p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold tracking-wide">
          Notifications
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Training reminders and schedule alerts will live here. Not wired in
          PR #1.
        </p>
        <label className="mt-4 flex cursor-not-allowed items-center justify-between gap-4 rounded-[var(--radius-md)] border border-border-subtle px-4 py-3 opacity-60">
          <span className="text-sm">Session reminders</span>
          <input type="checkbox" disabled aria-label="Session reminders" />
        </label>
      </section>

      <section className="apex-card p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold tracking-wide">
          Session
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Mock authentication for exploring the foundation UI.
        </p>
        <form action={signOut} className="mt-4">
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </section>
    </div>
  );
}
