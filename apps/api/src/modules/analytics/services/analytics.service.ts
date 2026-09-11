import { Injectable } from '@nestjs/common';
import { TrackEventDto } from '../dto/track-event.dto';

@Injectable()
export class AnalyticsService {
  async trackEvent(dto: TrackEventDto, userId?: string) {
    return { status: 'Event tracked', eventName: dto.eventName, userId };
  }
}
