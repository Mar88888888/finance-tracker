import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength, IsEmail } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;

}
