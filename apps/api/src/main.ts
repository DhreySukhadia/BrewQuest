import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable CORS for frontend application
  app.enableCors({
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Better Auth handler mount for /api/auth/* requests
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.all('/api/auth/*', toNodeHandler(auth));

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`BrewQuest API service running on port ${port}`);
}

bootstrap();
