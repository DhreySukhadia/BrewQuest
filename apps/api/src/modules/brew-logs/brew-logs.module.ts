import { Module } from '@nestjs/common';
import { BrewLogsController } from './controllers/brew-logs.controller';
import { BrewLogsService } from './services/brew-logs.service';

@Module({
  controllers: [BrewLogsController],
  providers: [BrewLogsService],
  exports: [BrewLogsService],
})
export class BrewLogsModule {}
