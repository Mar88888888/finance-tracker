import { Type } from 'class-transformer';
import { IsNumber, IsDate, IsOptional } from 'class-validator';

export class UpdateTransactionDto {
  @IsOptional()
  @IsNumber()
  sum?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)

  date?: Date;

  @IsOptional()
  @IsNumber()
  purposeId?: number;
}
