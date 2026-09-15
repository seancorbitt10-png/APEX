"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/auth/session";
import {
  getAthleteContextForUser,
  getAthleteForUser,
  upsertAthleteForUser,
} from "@/lib/athlete/service";
import { validateAthleteInput } from "@/lib/athlete/validation";
import type { AthleteProfileInput } from "@/lib/types/athlete";

export type AthleteActionState = {
  ok: boolean;
  errors: Record<string, string>;
  message?: string;
};

export async function completeOnboardingAction(
  input: AthleteProfileInput,
): Promise<AthleteActionState> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { ok: false, errors: { form: "You need to sign in first." } };
  }

  const validation = validateAthleteInput({
    ...input,
    onboardingCompleted: true,
  });
  if (!validation.ok) {
    return { ok: false, errors: validation.errors };
  }

  await upsertAthleteForUser(userId, {
    ...input,
    onboardingCompleted: true,
  });

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function updateAthleteProfileAction(
  input: AthleteProfileInput,
): Promise<AthleteActionState> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { ok: false, errors: { form: "You need to sign in first." } };
  }

  const validation = validateAthleteInput({
    ...input,
    onboardingCompleted: true,
  });
  if (!validation.ok) {
    return { ok: false, errors: validation.errors };
  }

  await upsertAthleteForUser(userId, {
    ...input,
    onboardingCompleted: true,
  });

  revalidatePath("/", "layout");
  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/coach");

  return { ok: true, errors: {}, message: "Profile saved." };
}

export async function requireAthleteOrRedirect() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");
  const athlete = await getAthleteForUser(userId);
  if (!athlete?.onboardingCompleted) redirect("/onboarding");
  return athlete;
}

export async function loadAthleteContext() {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  return getAthleteContextForUser(userId);
}
