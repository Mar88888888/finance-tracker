import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  sum: number;

  @IsNotEmpty()
  @IsDate()
  t_date: Date;

  @IsNotEmpty()
  @IsNumber()
  member_id: number;

  @IsNotEmpty()
  @IsNumber()
  purpose_id: number;
}
