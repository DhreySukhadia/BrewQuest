import { IsObject, IsOptional, IsString } from 'class-validator';

export class TrackEventDto {
  @IsString()
  eventName!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
