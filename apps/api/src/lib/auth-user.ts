import type { BetterAuthOptions } from 'better-auth';
import { APIError } from 'better-auth/api';
import type { GoogleProfile } from 'better-auth/social-providers';
import {
  generateUniqueUsername,
  normalizeRequestedUsername,
  type IsUsernameTaken,
} from './username';

const NAME_MAX_LENGTH = 50;

/**
 * Maps a Google profile onto BrewQuest name fields only.
 * Better Auth keeps id/email/emailVerified/image from the verified ID token;
 * username, name and server-owned fields are resolved by `prepareNewUser`.
 */
export function mapGoogleProfileToUser(profile: GoogleProfile) {
  const firstName = (
    profile.given_name?.trim() ||
    profile.name?.trim().split(/\s+/)[0] ||
    profile.email.split('@')[0]
  ).slice(0, NAME_MAX_LENGTH);
  const lastName = profile.family_name?.trim().slice(0, NAME_MAX_LENGTH);

  return lastName ? { firstName, lastName } : { firstName };
}

/**
 * BrewQuest fields on the Better Auth user model.
 *
 * - firstName / lastName / username may be supplied at signup.
 * - role / status / experienceTier are `input: false`: Better Auth replaces any
 *   client-supplied value with the default on create and rejects them on update.
 */
export const userAdditionalFields = {
  firstName: { type: 'string', required: true },
  lastName: { type: 'string', required: false },
  username: { type: 'string', required: false },
  role: { type: ['USER', 'ADMIN'], required: false, input: false, defaultValue: 'USER' },
  status: {
    type: ['ACTIVE', 'SUSPENDED', 'DELETED'],
    required: false,
    input: false,
    defaultValue: 'ACTIVE',
  },
  experienceTier: {
    type: ['BEGINNER', 'INTERMEDIATE', 'EXPLORER', 'ENTHUSIAST'],
    required: false,
    input: false,
    defaultValue: 'BEGINNER',
  },
} satisfies NonNullable<NonNullable<BetterAuthOptions['user']>['additionalFields']>;

function badRequest(code: string, message: string): APIError {
  return new APIError('BAD_REQUEST', { code, message });
}

function readName(value: unknown, field: string, required: boolean): string | null {
  if (value === undefined || value === null) {
    if (required) throw badRequest('MISSING_FIELD', `${field} is required`);
    return null;
  }
  if (typeof value !== 'string') {
    throw badRequest('INVALID_FIELD', `${field} must be a string`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    if (required) throw badRequest('MISSING_FIELD', `${field} is required`);
    return null;
  }
  if (trimmed.length > NAME_MAX_LENGTH) {
    throw badRequest('INVALID_FIELD', `${field} must be at most ${NAME_MAX_LENGTH} characters`);
  }
  return trimmed;
}

/**
 * Computes the BrewQuest-specific fields for a user about to be created.
 * Runs inside Better Auth's `databaseHooks.user.create.before`.
 */
export async function prepareNewUser(user: Record<string, unknown>, isTaken: IsUsernameTaken) {
  const firstName = readName(user.firstName, 'firstName', true) as string;
  const lastName = readName(user.lastName, 'lastName', false);

  let username: string;
  if (user.username !== undefined && user.username !== null && user.username !== '') {
    const requested =
      typeof user.username === 'string' ? normalizeRequestedUsername(user.username) : null;
    if (!requested) {
      throw badRequest(
        'INVALID_USERNAME',
        'Username must be 3-30 characters and contain only letters, numbers, and underscores',
      );
    }
    if (await isTaken(requested)) {
      throw new APIError('UNPROCESSABLE_ENTITY', {
        code: 'USERNAME_IS_ALREADY_TAKEN',
        message: 'Username is already taken. Please try another.',
      });
    }
    username = requested;
  } else {
    username = await generateUniqueUsername(firstName, isTaken);
  }

  return {
    firstName,
    lastName,
    username,
    name: lastName ? `${firstName} ${lastName}` : firstName,
  };
}

function readNameForUpdate(
  value: unknown,
  field: string,
  required: boolean,
): string | null | undefined {
  if (value === undefined) {
    return undefined; // Not provided in update
  }
  if (value === null) {
    if (required) throw badRequest('MISSING_FIELD', `${field} is required`);
    return null; // Explicitly cleared
  }
  if (typeof value !== 'string') {
    throw badRequest('INVALID_FIELD', `${field} must be a string`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    if (required) throw badRequest('MISSING_FIELD', `${field} is required`);
    return null;
  }
  if (trimmed.length > NAME_MAX_LENGTH) {
    throw badRequest('INVALID_FIELD', `${field} must be at most ${NAME_MAX_LENGTH} characters`);
  }
  return trimmed;
}

const PROFILE_FIELDS = ['firstName', 'lastName', 'username', 'name'] as const;

/** True when an update touches BrewQuest profile fields (including the derived `name`). */
export function hasProfileFields(updateData: Record<string, unknown>): boolean {
  return PROFILE_FIELDS.some((field) => updateData[field] !== undefined);
}

/**
 * Computes the BrewQuest-specific fields for a user about to be updated.
 * Runs inside Better Auth's `databaseHooks.user.update.before`.
 */
export async function prepareUpdatedUser(
  updateData: Record<string, unknown>,
  currentUser: { firstName: string; lastName: string | null; username: string },
  isTaken: IsUsernameTaken,
) {
  const newFirstName = readNameForUpdate(updateData.firstName, 'firstName', true);
  const newLastName = readNameForUpdate(updateData.lastName, 'lastName', false);

  const resolvedFirstName =
    newFirstName !== undefined ? (newFirstName as string) : currentUser.firstName;
  const resolvedLastName = newLastName !== undefined ? newLastName : currentUser.lastName;

  let username: string | undefined = undefined;
  if (updateData.username !== undefined) {
    if (updateData.username === null || updateData.username === '') {
      throw badRequest('INVALID_USERNAME', 'Username cannot be empty');
    }
    const requested =
      typeof updateData.username === 'string'
        ? normalizeRequestedUsername(updateData.username)
        : null;
    if (!requested) {
      throw badRequest(
        'INVALID_USERNAME',
        'Username must be 3-30 characters and contain only letters, numbers, and underscores',
      );
    }

    if (requested !== currentUser.username) {
      if (await isTaken(requested)) {
        throw new APIError('UNPROCESSABLE_ENTITY', {
          code: 'USERNAME_IS_ALREADY_TAKEN',
          message: 'Username is already taken. Please try another.',
        });
      }
      username = requested;
    } else {
      username = requested; // Same username is allowed
    }
  }

  const result: Record<string, unknown> = {};
  if (newFirstName !== undefined) result.firstName = newFirstName;
  if (newLastName !== undefined) result.lastName = newLastName;
  if (username !== undefined) result.username = username;

  // `name` is always derived; a client-supplied `name` is overwritten, never stored as-is.
  if (newFirstName !== undefined || newLastName !== undefined || updateData.name !== undefined) {
    result.name = resolvedLastName ? `${resolvedFirstName} ${resolvedLastName}` : resolvedFirstName;
  }

  // Prevent email updates via this profile endpoint
  if (updateData.email !== undefined) {
    throw badRequest(
      'UNSUPPORTED_OPERATION',
      'Email updates are not supported through this endpoint',
    );
  }

  return result;
}
