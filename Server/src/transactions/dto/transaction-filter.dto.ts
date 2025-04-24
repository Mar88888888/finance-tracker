import { IsOptional, IsDateString, IsBoolean, IsIn, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export enum OrderBy {
  DATE = 'date',
  SUM = 'sum',
  PURPOSE_ID = 'purposeId'
}

export class TransactionFilterDto {
  @IsOptional()
  @IsDateString()
  startdate?: string;

  @IsOptional()
  @IsDateString()
  enddate?: string;

  @IsOptional()
  @Transform(({ value }) => value.split(',').map((id: string) => parseInt(id, 10)))
  purposes?: number[];

  @IsOptional()
  @IsEnum(OrderBy)
  orderBy?: OrderBy;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}
