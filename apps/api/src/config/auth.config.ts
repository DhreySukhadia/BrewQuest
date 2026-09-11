import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.BETTER_AUTH_SECRET || 'fallback_secret',
  baseUrl: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
}));
