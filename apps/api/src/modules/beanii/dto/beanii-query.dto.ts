import { IsOptional, IsString } from 'class-validator';

export class BeaniiQueryDto {
  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  conversationId?: string;
}
