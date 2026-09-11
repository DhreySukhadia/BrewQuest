import { Controller, Get, Param } from '@nestjs/common';
import { CoffeeDnaService } from '../services/coffee-dna.service';

@Controller('coffee-dna')
export class CoffeeDnaController {
  constructor(private readonly coffeeDnaService: CoffeeDnaService) {}

  @Get(':coffeeId')
  findByCoffeeId(@Param('coffeeId') coffeeId: string) {
    return this.coffeeDnaService.findByCoffeeId(coffeeId);
  }
}
