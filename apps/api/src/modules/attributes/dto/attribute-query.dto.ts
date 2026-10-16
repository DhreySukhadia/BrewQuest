import { IsEnum, IsOptional } from 'class-validator';
import { AttributeCategory } from '@brewquest/db';

export class AttributeQueryDto {
  @IsOptional()
  @IsEnum(AttributeCategory, {
    message: `category must be a valid AttributeCategory (${Object.values(AttributeCategory).join(', ')})`,
  })
  category?: AttributeCategory;
}
