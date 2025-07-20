import { Type } from 'class-transformer';
import { IsNumber, IsDate, IsOptional } from 'class-validator';

export class UpdateTransactionDto {
  @IsOptional()
  @IsNumber()
  sum?: number;

  @IsOptional()
  @IsDate()
  @Type(/* istanbul ignore next */ () => Date)
  date?: Date;

  @IsOptional()
  @IsNumber()
  purposeId?: number;
}
