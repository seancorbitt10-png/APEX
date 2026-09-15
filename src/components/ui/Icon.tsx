import { cn } from "@/lib/utils/cn";

const icons = {
  dashboard: (
    <path d="M4 4h7v7H4V4zm9 0h7v5h-7V4zM4 13h7v7H4v-7zm9 3h7v4h-7v-4z" />
  ),
  training: (
    <path d="M6.5 8.5 4 11l2.5 2.5M17.5 8.5 20 11l-2.5 2.5M9 6l1.5 12M15 6l-1.5 12M8 9h8M8 15h8" />
  ),
  sports: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M4.5 10.5h15M4.5 13.5h15M12 4c2.5 2.8 2.5 12.2 0 16M12 4c-2.5 2.8-2.5 12.2 0 16" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </>
  ),
  progress: (
    <path d="M4 17 9 12l3.5 3.5L20 7M15 7h5v5" />
  ),
  coach: (
    <>
      <path d="M5 16.5V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8.5l-3.2-2H7.2L5 16.5z" />
      <path d="M9 9.5h6M9 12h4" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="9" r="3.2" />
      <path d="M5.5 19c1.6-3 4-4.5 6.5-4.5S17 16 18.5 19" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18" />
    </>
  ),
  bell: (
    <>
      <path d="M6.5 16h11l-1.2-1.4V10a4.3 4.3 0 1 0-8.6 0v4.6L6.5 16z" />
      <path d="M10 17.5a2 2 0 0 0 4 0" />
    </>
  ),
  menu: (
    <path d="M5 7h14M5 12h14M5 17h14" />
  ),
  close: (
    <path d="M7 7l10 10M17 7 7 17" />
  ),
  chevronDown: (
    <path d="M7 10l5 5 5-5" />
  ),
  send: (
    <path d="M5 12h12M13 7l5 5-5 5" />
  ),
  baseball: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M7.2 6.8c2.2 2.4 2.2 8 0 10.4M16.8 6.8c-2.2 2.4-2.2 8 0 10.4" />
    </>
  ),
} as const;

export type IconName = keyof typeof icons;

interface IconProps {
  name: IconName;
  className?: string;
  title?: string;
}

export function Icon({ name, className, title }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-5 w-5 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {icons[name]}
    </svg>
  );
}
