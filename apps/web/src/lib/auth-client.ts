import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  plugins: [
    // Mirrors the server's user.additionalFields (apps/api/src/lib/auth-user.ts)
    // so signUp.email accepts firstName / lastName / username.
    inferAdditionalFields({
      user: {
        firstName: { type: 'string', required: true },
        lastName: { type: 'string', required: false },
        username: { type: 'string', required: false },
        role: { type: 'string', required: false, input: false },
        status: { type: 'string', required: false, input: false },
        experienceTier: { type: 'string', required: false, input: false },
      },
    }),
  ],
});

export const { signIn, signUp, useSession, signOut } = authClient;
