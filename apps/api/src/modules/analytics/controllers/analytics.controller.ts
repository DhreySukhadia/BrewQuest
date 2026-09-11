import { Body, Controller, Post } from '@nestjs/common';
import { AnalyticsService } from '../services/analytics.service';
import { TrackEventDto } from '../dto/track-event.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('event')
  trackEvent(@Body() dto: TrackEventDto) {
    return this.analyticsService.trackEvent(dto);
  }
}
