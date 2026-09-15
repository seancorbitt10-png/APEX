import { AppShell } from "@/components/shell/AppShell";
import { getEnabledSports } from "@/lib/sports/registry";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sports = getEnabledSports();

  return <AppShell sports={sports}>{children}</AppShell>;
}
