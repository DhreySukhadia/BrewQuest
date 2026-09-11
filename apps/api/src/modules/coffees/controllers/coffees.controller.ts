import { Controller, Get } from '@nestjs/common';
import { CoffeesService } from '../services/coffees.service';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get()
  findAll() {
    return this.coffeesService.findAll();
  }
}
