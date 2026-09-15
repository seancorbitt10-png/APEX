export default function NotFound() {
  return (
    <div className="apex-atmosphere flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-5xl font-bold tracking-wide text-text-primary">
        404
      </p>
      <p className="mt-3 text-sm text-text-secondary">
        That route isn’t available yet.
      </p>
      <a
        href="/dashboard"
        className="mt-6 inline-flex h-10 items-center rounded-[var(--radius-md)] bg-accent px-4 text-sm font-medium text-accent-foreground"
      >
        Back to Dashboard
      </a>
    </div>
  );
}
