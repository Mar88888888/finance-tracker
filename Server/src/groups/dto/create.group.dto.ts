import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  mindate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  maxdate: Date;
}
