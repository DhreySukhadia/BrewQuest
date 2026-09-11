import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateRecommendationFeedbackDto {
  @IsString()
  recommendationId!: string;

  @IsBoolean()
  isHelpful!: boolean;

  @IsOptional()
  @IsString()
  feedbackText?: string;
}
