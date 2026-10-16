import { Module } from '@nestjs/common';
import { RoastersController } from './controllers/roasters.controller';
import { RoastersService } from './services/roasters.service';

@Module({
  controllers: [RoastersController],
  providers: [RoastersService],
  exports: [RoastersService],
})
export class RoastersModule {}
