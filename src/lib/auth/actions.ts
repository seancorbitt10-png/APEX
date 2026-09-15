"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  USER_ID_COOKIE,
  createMockUserId,
} from "@/lib/auth/session";
import { getAthleteForUser } from "@/lib/athlete/service";

export async function signIn() {
  const store = await cookies();
  let userId = store.get(USER_ID_COOKIE)?.value;
  if (!userId) {
    userId = createMockUserId();
  }

  store.set(SESSION_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  store.set(USER_ID_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  const athlete = await getAthleteForUser(userId);
  if (!athlete?.onboardingCompleted) {
    redirect("/onboarding");
  }
  redirect("/dashboard");
}

export async function signOut() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  // Keep USER_ID_COOKIE so returning to the same browser can resume the athlete
  // after sign-in. Clear both if you need a full reset during local testing.
  redirect("/login");
}
