import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  sum: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  purposeId: number;
}
