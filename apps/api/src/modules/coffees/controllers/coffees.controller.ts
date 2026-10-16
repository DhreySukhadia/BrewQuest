import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CoffeesService } from '../services/coffees.service';
import { CreateCoffeeDto } from '../dto/create-coffee.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../../lib/auth';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get()
  findAll() {
    return this.coffeesService.findAll();
  }

  @Get('roaster/:roasterId')
  findByRoaster(@Param('roasterId') roasterId: string) {
    return this.coffeesService.findByRoaster(roasterId);
  }

  @Get(':id/attributes')
  findAttributes(@Param('id') id: string) {
    return this.coffeesService.findAttributes(id);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.coffeesService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Body() dto: CreateCoffeeDto, @CurrentUser() user: AuthUser) {
    return this.coffeesService.create(dto, user.id);
  }
}
