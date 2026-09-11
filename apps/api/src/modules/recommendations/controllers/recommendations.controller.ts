import { Controller, Get } from '@nestjs/common';
import { RecommendationsService } from '../services/recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get()
  getRecommendations() {
    return this.recommendationsService.generateRecommendations();
  }
}
