import { IsOptional, IsInt, IsBoolean, IsString, IsEmail, MinLength } from 'class-validator';

export abstract class BaseUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  password?: string;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsBoolean()
  gender?: boolean;
}
