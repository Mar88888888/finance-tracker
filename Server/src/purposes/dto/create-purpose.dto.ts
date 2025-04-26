import { IsNotEmpty, IsBoolean, IsString } from 'class-validator';

export class CreatePurposeDto {
  @IsNotEmpty()
  @IsString()
  category: string;
}
