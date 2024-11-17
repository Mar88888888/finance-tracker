import { IsNotEmpty } from 'class-validator';
import { BaseUserDto } from './abstracts/base.user.dto';

export class CreateUserDto extends BaseUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  age: number;

  @IsNotEmpty()
  gender: boolean;
}
