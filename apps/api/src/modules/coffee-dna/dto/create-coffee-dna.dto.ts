import { IsArray, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateCoffeeDnaDto {
  @IsString()
  coffeeId!: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  acidity!: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  body!: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  sweetness!: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  bitterness!: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  aromaScore!: number;

  @IsArray()
  @IsString({ each: true })
  flavorNotes!: string[];
}
