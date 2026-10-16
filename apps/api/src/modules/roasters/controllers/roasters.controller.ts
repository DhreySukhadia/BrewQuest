import { Controller, Get, Param } from '@nestjs/common';
import { RoastersService } from '../services/roasters.service';

@Controller('roasters')
export class RoastersController {
  constructor(private readonly roastersService: RoastersService) {}

  @Get()
  findAll() {
    return this.roastersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.roastersService.findById(id);
  }
}
