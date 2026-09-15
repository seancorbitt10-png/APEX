import { cookies } from "next/headers";

export const SESSION_COOKIE = "apex_session";

/** Mock session check for PR #1 — replace with real auth later. */
export async function hasSession(): Promise<boolean> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value === "1";
}
