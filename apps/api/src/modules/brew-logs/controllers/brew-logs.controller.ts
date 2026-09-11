import { Controller, Get, Param } from '@nestjs/common';
import { BrewLogsService } from '../services/brew-logs.service';

@Controller('brew-logs')
export class BrewLogsController {
  constructor(private readonly brewLogsService: BrewLogsService) {}

  @Get('user/:userId')
  findAllByUser(@Param('userId') userId: string) {
    return this.brewLogsService.findAllByUser(userId);
  }
}
