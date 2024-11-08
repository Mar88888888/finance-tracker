import { PartialType } from '@nestjs/mapped-types';
import { CreatePurposeDto } from './create-purpose.dto';

export class UpdatePurposeDto extends PartialType(CreatePurposeDto) {}
