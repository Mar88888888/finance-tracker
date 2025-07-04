import { IsDate, IsEnum, IsInt, IsNumber, IsString, Min } from "class-validator";
import { RecurrenceUnit } from "../subscription.entity";
import { Type } from "class-transformer";

export class CreateSubscriptionDto {
  @IsInt()
  @Min(1)
  interval: number;

  @IsString()
  @IsEnum(RecurrenceUnit)
  unit: RecurrenceUnit;

  @IsDate()
  @Type(/* istanbul ignore next */() => Date)
  startDate: Date;
  
  @IsDate()
  @Type(/* istanbul ignore next */() => Date)
  endDate?: Date;
}
