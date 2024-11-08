import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create.user.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password', 'email'] as const) {}

export class InnerUserUpdateDto extends UpdateUserDto {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  verificationToken?: string;

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;
}