import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth, type AuthSession, type AuthUser } from '../../lib/auth';

export type AuthenticatedRequest = Request & {
  user: AuthUser;
  session: Omit<AuthSession['session'], 'token'>;
};

/**
 * Server-side authorization boundary for protected routes.
 *
 * Resolves the Better Auth session from the request cookie (Better Auth verifies
 * the signature, looks up the session and its user, and rejects expired sessions),
 * then requires the user's account status to be ACTIVE.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const result = await auth.api
      .getSession({
        headers: fromNodeHeaders(request.headers),
        // Always read the current session/user from the database, and leave session
        // refresh to the client's get-session call (the guard cannot re-issue the cookie).
        query: { disableCookieCache: true, disableRefresh: true },
      })
      .catch(() => null);

    if (!result) {
      throw new UnauthorizedException();
    }

    if (result.user.status !== 'ACTIVE') {
      throw new ForbiddenException('Account is not active');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { token, ...session } = result.session;
    request.user = result.user;
    request.session = session;
    return true;
  }
}
