import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@brewquest/db';
import {
  hasProfileFields,
  mapGoogleProfileToUser,
  prepareNewUser,
  prepareUpdatedUser,
  userAdditionalFields,
} from './auth-user';
import { APIError } from 'better-auth/api';

const isUsernameTaken = async (username: string) =>
  (await prisma.user.findUnique({ where: { username }, select: { id: true } })) !== null;

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  // Callback: `${BETTER_AUTH_URL}/api/auth/callback/google`.
  // Only registered when credentials are configured.
  socialProviders:
    googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            mapProfileToUser: mapGoogleProfileToUser,
          },
        }
      : {},
  user: {
    additionalFields: userAdditionalFields,
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({ data: await prepareNewUser(user, isUsernameTaken) }),
      },
      update: {
        before: async (user, ctx) => {
          // Internal Better Auth updates without profile fields (e.g. emailVerified after a
          // Google sign-in) pass through unchanged.
          if (!hasProfileFields(user)) return;

          // Better Auth does not pass the target row to this hook. Profile fields may only be
          // changed by the signed-in user via /update-user, which always updates session.user.
          const sessionUserId = ctx?.path === '/update-user' ? ctx.context.session?.user.id : null;
          if (!sessionUserId) {
            throw new APIError('FORBIDDEN', {
              code: 'PROFILE_UPDATE_NOT_ALLOWED',
              message: 'Profile fields can only be changed through update-user',
            });
          }
          const existingUser = await prisma.user.findUnique({
            where: { id: sessionUserId },
            select: { firstName: true, lastName: true, username: true, status: true },
          });
          if (!existingUser) {
            throw new APIError('UNAUTHORIZED', { message: 'User not found' });
          }
          if (existingUser.status !== 'ACTIVE') {
            throw new APIError('FORBIDDEN', {
              code: 'ACCOUNT_NOT_ACTIVE',
              message: 'Account is not active',
            });
          }
          return { data: await prepareUpdatedUser(user, existingUser, isUsernameTaken) };
        },
      },
    },
    session: {
      create: {
        // A new session means a successful sign-in (signup auto sign-in, email login, OAuth).
        // get-session refreshes update an existing session and do not run this hook.
        after: async (session, ctx) => {
          await prisma.user
            .update({ where: { id: session.userId }, data: { lastLoginAt: session.createdAt } })
            .catch((error: unknown) =>
              ctx?.context.logger.error('Failed to update lastLoginAt', error),
            );
        },
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || 'fallback_secret_for_development',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
});

export type AuthSession = typeof auth.$Infer.Session;
export type AuthUser = AuthSession['user'];
