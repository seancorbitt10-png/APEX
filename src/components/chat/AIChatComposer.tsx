"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { SportIcon } from "@/components/ui/SportBadge";
import { cn } from "@/lib/utils/cn";
import type { SportConfig } from "@/lib/types/sport";
import type { SportId } from "@/lib/types/sport";

interface SportSelectorProps {
  sports: SportConfig[];
  value: SportId | null;
  onChange: (sportId: SportId | null) => void;
  allowNone?: boolean;
  className?: string;
}

export function SportSelector({
  sports,
  value,
  onChange,
  allowNone = true,
  className,
}: SportSelectorProps) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const selected = sports.find((s) => s.id === value) ?? null;

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-border bg-surface-elevated px-2.5 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-hover"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        {selected ? (
          <>
            <SportIcon icon={selected.icon} className="text-accent" />
            <span>{selected.shortName}</span>
          </>
        ) : (
          <span className="text-text-secondary">No sport</span>
        )}
        <Icon name="chevronDown" className="h-3.5 w-3.5 text-text-muted" />
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10 cursor-default"
            aria-label="Close sport selector"
            onClick={() => setOpen(false)}
          />
          <ul
            id={listId}
            role="listbox"
            className="absolute left-0 top-full z-20 mt-1 min-w-[160px] overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface-elevated py-1 shadow-lg"
          >
            {allowNone ? (
              <li role="option" aria-selected={value === null}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-hover",
                    value === null ? "text-accent" : "text-text-secondary",
                  )}
                  onClick={() => {
                    onChange(null);
                    setOpen(false);
                  }}
                >
                  No sport
                </button>
              </li>
            ) : null}
            {sports.map((sport) => (
              <li key={sport.id} role="option" aria-selected={value === sport.id}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-hover",
                    value === sport.id ? "text-accent" : "text-text-primary",
                    !sport.enabled && "opacity-40",
                  )}
                  disabled={!sport.enabled}
                  onClick={() => {
                    onChange(sport.id);
                    setOpen(false);
                  }}
                >
                  <SportIcon icon={sport.icon} />
                  {sport.name}
                  {!sport.enabled ? (
                    <span className="ml-auto text-[10px] uppercase text-text-muted">
                      Soon
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

interface AIChatComposerProps {
  sports: SportConfig[];
  initialSportId?: SportId | null;
  placeholder?: string;
  /** If true, submitting navigates to /coach with query params (shell only). */
  navigateOnSubmit?: boolean;
  className?: string;
  onSubmitMessage?: (payload: {
    message: string;
    sportId: SportId | null;
  }) => void;
}

export function AIChatComposer({
  sports,
  initialSportId = "baseball",
  placeholder = "Ask Apex AI anything…",
  navigateOnSubmit = true,
  className,
  onSubmitMessage,
}: AIChatComposerProps) {
  const router = useRouter();
  const inputId = useId();
  const [sportId, setSportId] = useState<SportId | null>(initialSportId);
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    onSubmitMessage?.({ message: trimmed, sportId });

    if (navigateOnSubmit) {
      const params = new URLSearchParams({ q: trimmed });
      if (sportId) params.set("sport", sportId);
      router.push(`/coach?${params.toString()}`);
    }

    setMessage("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-[var(--radius-lg)] border border-border bg-surface-elevated p-3 shadow-[0_0_0_1px_rgba(46,230,168,0.04)]",
        className,
      )}
    >
      <div className="mb-2">
        <SportSelector
          sports={sports}
          value={sportId}
          onChange={setSportId}
          allowNone
        />
      </div>
      <div className="flex items-end gap-2">
        <label htmlFor={inputId} className="sr-only">
          Message Apex AI
        </label>
        <input
          id={inputId}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="min-h-11 flex-1 rounded-[var(--radius-md)] border border-border bg-background px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-accent"
          autoComplete="off"
        />
        <button
          type="submit"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-accent text-accent-foreground transition-opacity hover:brightness-110 disabled:opacity-40"
          aria-label="Send message"
          disabled={!message.trim()}
        >
          <Icon name="send" className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
