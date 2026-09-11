import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateBrewLogDto {
  @IsString()
  coffeeId!: string;

  @IsString()
  brewMethod!: string;

  @IsString()
  grindSize!: string;

  @IsNumber()
  coffeeDoseGrams!: number;

  @IsNumber()
  waterAmountMl!: number;

  @IsOptional()
  @IsNumber()
  waterTempCelsius?: number;

  @IsOptional()
  @IsNumber()
  brewTimeSeconds?: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  tastingNotes?: string;
}
