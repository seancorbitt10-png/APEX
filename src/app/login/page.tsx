import { signIn } from "@/lib/auth/actions";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="apex-atmosphere flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-up">
        <div className="mb-10 text-center">
          <p className="font-display text-4xl font-bold tracking-[0.14em] text-text-primary">
            APEX <span className="text-accent">AI</span>
          </p>
          <p className="mt-3 text-sm text-text-secondary">
            Adaptive training for athletes.
          </p>
        </div>

        <div className="apex-card-elevated p-7 sm:p-8">
          <h1 className="font-display text-2xl font-semibold tracking-wide">
            Enter the platform
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            PR #1 uses a mock session so you can explore the dashboard shell.
            Real authentication lands in a later PR.
          </p>

          <form action={signIn} className="mt-7 space-y-4">
            <div>
              <label
                htmlFor="athlete-name"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted"
              >
                Athlete
              </label>
              <input
                id="athlete-name"
                name="name"
                defaultValue="Alex"
                readOnly
                className="h-11 w-full rounded-[var(--radius-md)] border border-border bg-background px-3 text-sm text-text-primary"
              />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Continue to Dashboard
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
