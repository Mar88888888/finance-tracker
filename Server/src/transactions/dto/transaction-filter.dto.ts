import { IsOptional, IsDateString, IsBoolean, IsIn, IsEnum, IsNumber, min, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum OrderBy {
  DATE = 'date',
  SUM = 'sum',
  PURPOSE_ID = 'purposeId'
}

export class TransactionFilterDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxAmount?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((id) => parseInt(id, 10));
    }
    if (Array.isArray(value)) {
      return value.map((id) => parseInt(id, 10));
    }
    return [];
  })
  purposes?: number[];
  

  @IsOptional()
  @IsEnum(OrderBy)
  orderBy?: OrderBy;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}
