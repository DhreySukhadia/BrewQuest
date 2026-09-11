import { Module } from '@nestjs/common';
import { CoffeeDnaController } from './controllers/coffee-dna.controller';
import { CoffeeDnaService } from './services/coffee-dna.service';

@Module({
  controllers: [CoffeeDnaController],
  providers: [CoffeeDnaService],
  exports: [CoffeeDnaService],
})
export class CoffeeDnaModule {}
