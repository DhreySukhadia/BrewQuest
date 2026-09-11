import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  webUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
}));
