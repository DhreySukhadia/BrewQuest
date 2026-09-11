import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CoffeesModule } from './modules/coffees/coffees.module';
import { CoffeeDnaModule } from './modules/coffee-dna/coffee-dna.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { BrewLogsModule } from './modules/brew-logs/brew-logs.module';
import { BeaniiModule } from './modules/beanii/beanii.module';
import { SearchModule } from './modules/search/search.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CoffeesModule,
    CoffeeDnaModule,
    RecommendationsModule,
    BrewLogsModule,
    BeaniiModule,
    SearchModule,
    AnalyticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
