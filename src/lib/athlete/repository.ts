import { promises as fs } from "fs";
import path from "path";
import type { AthleteProfile } from "@/lib/types/athlete";

/**
 * Athlete persistence repository.
 * File-backed for PR #2 — swap this implementation for a database later
 * without changing UI or service callers.
 */

const DATA_DIR = path.join(process.cwd(), "data", "athletes");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function fileForUser(userId: string) {
  const safe = userId.replace(/[^a-zA-Z0-9_-]/g, "_");
  return path.join(DATA_DIR, `${safe}.json`);
}

export async function getAthleteByUserId(
  userId: string,
): Promise<AthleteProfile | null> {
  try {
    const raw = await fs.readFile(fileForUser(userId), "utf8");
    return JSON.parse(raw) as AthleteProfile;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return null;
    throw error;
  }
}

export async function saveAthlete(
  profile: AthleteProfile,
): Promise<AthleteProfile> {
  await ensureDir();
  const next: AthleteProfile = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(fileForUser(profile.userId), JSON.stringify(next, null, 2), "utf8");
  return next;
}

export async function deleteAthleteByUserId(userId: string): Promise<void> {
  try {
    await fs.unlink(fileForUser(userId));
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return;
    throw error;
  }
}
