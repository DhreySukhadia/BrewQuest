import { IsOptional, IsString } from 'class-validator';

export class UpdateCoffeeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  roaster?: string;

  @IsOptional()
  @IsString()
  roastLevel?: string;
}
