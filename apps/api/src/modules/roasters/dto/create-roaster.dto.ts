import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRoasterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(150)
  name!: string;
}
