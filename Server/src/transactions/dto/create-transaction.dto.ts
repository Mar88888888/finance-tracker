import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsDate, IsEnum } from 'class-validator';
import { CurrencyCode } from '../../currency/currency-code.enum';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  sum: number;

  @IsNotEmpty()
  @IsDate()
  @Type(/* istanbul ignore next */ () => Date)
  date: Date;

  @IsNotEmpty()
  @IsEnum(CurrencyCode)
  currency: CurrencyCode;

  @IsNotEmpty()
  @IsNumber()
  purposeId: number;
}
