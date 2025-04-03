import { IsOptional } from 'class-validator';
import { UpdateUserDto } from './update.user.dto';

export class InnerUserUpdateDto extends UpdateUserDto {
  @IsOptional()
  password?: string;

  @IsOptional()
  email?: string;
}
