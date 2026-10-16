import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(150)
  name!: string;

  @IsOptional()
  @IsString()
  roasterId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  origin?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  region?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  farm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  altitude?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  variety?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  processing?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  roast?: string;
}
