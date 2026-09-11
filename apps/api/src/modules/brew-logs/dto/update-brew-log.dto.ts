import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateBrewLogDto {
  @IsOptional()
  @IsString()
  grindSize?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  tastingNotes?: string;
}
