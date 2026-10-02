import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedRequest } from '../guards/auth.guard';
import type { AuthUser } from '../../lib/auth';

/**
 * Extracts the authenticated user that AuthGuard resolved from the Better Auth session.
 * Only usable on routes protected by `@UseGuards(AuthGuard)`.
 */
export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<AuthenticatedRequest>().user;
    return data ? user?.[data] : user;
  },
);
