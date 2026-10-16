import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { AttributeCategory } from '@brewquest/db';

export class CreateAttributeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsEnum(AttributeCategory, {
    message: `category must be a valid AttributeCategory (${Object.values(AttributeCategory).join(', ')})`,
  })
  category!: AttributeCategory;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
