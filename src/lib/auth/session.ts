import { cookies } from "next/headers";

export const SESSION_COOKIE = "apex_session";
export const USER_ID_COOKIE = "apex_user_id";

/** Mock session check — replace with real auth later. */
export async function hasSession(): Promise<boolean> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value === "1";
}

/**
 * Current mock user id. Stable for the browser session so athlete
 * data can migrate later: mockUserId → real authenticated user id.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const store = await cookies();
  if (store.get(SESSION_COOKIE)?.value !== "1") return null;
  return store.get(USER_ID_COOKIE)?.value ?? null;
}

export function createMockUserId(): string {
  return `user_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}
