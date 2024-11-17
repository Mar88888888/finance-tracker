import { OmitType } from '@nestjs/mapped-types';
import { ConcreteBaseUserDto } from './base.user.dto.concrete';

export class UpdateUserDto extends OmitType(ConcreteBaseUserDto, ['password', 'email'] as const) {}

