import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AssignCoffeeAttributeDto {
  @IsString()
  @IsNotEmpty()
  attributeId!: string;

  @IsOptional()
  @IsNumber({}, { message: 'strength must be a valid number' })
  strength?: number | null;
}
