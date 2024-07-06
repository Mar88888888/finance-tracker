import { IsNotEmpty, IsNumber, IsDate, IsOptional } from 'class-validator';

export class UpdateTransactionDto {
  @IsOptional()
  @IsNumber()
  sum?: number;

  @IsOptional()
  @IsDate()
  t_date?: Date;

  @IsOptional()
  @IsNumber()
  member_id?: number;

  @IsOptional()
  @IsNumber()
  purpose_id?: number;
}
