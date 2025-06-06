import { IsNotEmpty, IsNumber, IsDate, IsString, IsBoolean } from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { UserSerializeDto } from '../../users/dto/serialize.user.dto';
import { UserModel } from '../../users/user.model';

export class PurposeDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Expose()
  category: string;

  @IsNotEmpty()
  @IsBoolean()
  @Expose()
  type: boolean;
}

export class SerializeTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  sum: number;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  usdEquivalent: number;

  @IsNotEmpty()
  @IsDate()
  @Expose()
  date: string;

  @IsNotEmpty()
  @Type(() => UserSerializeDto)
  @Expose()
  member: UserModel;

  @IsNotEmpty()
  @Expose()
  @IsNumber()
  purposeId: number;
}
