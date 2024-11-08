import { IsNumber, IsDate, IsOptional } from 'class-validator';

export class UpdateTransactionDto {
  @IsOptional()
  @IsNumber()
  sum?: number;

  @IsOptional()
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsNumber()
  purposeId?: number;
}
