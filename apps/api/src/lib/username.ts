import { randomInt } from 'node:crypto';

/**
 * Centralized BrewQuest username rules.
 *
 * Used by the Better Auth user-creation hook so every creation path
 * (email/password signup now, social sign-in later) shares one implementation.
 * The database `@unique` constraint on `user.username` remains the final authority.
 */

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;

const USERNAME_PATTERN = /^[a-z0-9_]+$/;
const GENERATED_BASE_MAX_LENGTH = 20;
const FALLBACK_BASE = 'brewer';
const MAX_GENERATION_ATTEMPTS = 8;

export type IsUsernameTaken = (username: string) => Promise<boolean>;

/**
 * Normalizes a user-supplied username (trim + lowercase).
 * Returns null when the result does not satisfy the username format.
 */
export function normalizeRequestedUsername(input: string): string | null {
  const username = input.trim().toLowerCase();
  if (
    username.length < USERNAME_MIN_LENGTH ||
    username.length > USERNAME_MAX_LENGTH ||
    !USERNAME_PATTERN.test(username)
  ) {
    return null;
  }
  return username;
}

/**
 * Derives a username base from free text such as a first name:
 * strips accents, lowercases, and removes everything except a-z / 0-9.
 */
export function toUsernameBase(seed: string): string {
  return seed
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, GENERATED_BASE_MAX_LENGTH);
}

function randomDigits(length: number): string {
  return randomInt(0, 10 ** length)
    .toString()
    .padStart(length, '0');
}

/**
 * Generates an available username from a seed (e.g. firstName).
 * Tries the plain base first, then appends random numeric suffixes.
 */
export async function generateUniqueUsername(
  seed: string,
  isTaken: IsUsernameTaken,
): Promise<string> {
  const base = toUsernameBase(seed) || FALLBACK_BASE;

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
    const candidate =
      attempt === 0 && base.length >= USERNAME_MIN_LENGTH
        ? base
        : `${base}${randomDigits(attempt < MAX_GENERATION_ATTEMPTS / 2 ? 4 : 6)}`;

    if (!(await isTaken(candidate))) {
      return candidate;
    }
  }

  throw new Error('Unable to generate a unique username');
}
