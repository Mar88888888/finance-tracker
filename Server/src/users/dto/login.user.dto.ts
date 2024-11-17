import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { BaseUserDto } from './abstracts/base.user.dto';

export class LoginUserDto extends BaseUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}


