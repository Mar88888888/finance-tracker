import { IsNotEmpty, IsOptional, IsString, IsInt, IsBoolean, MinLength, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsBoolean()
  gender?: boolean;
}
