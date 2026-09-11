import { IsArray, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateCoffeeDnaDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  acidity?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  body?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  flavorNotes?: string[];
}
