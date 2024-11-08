import { IsNotEmpty, IsNumber, IsDate, IsString, IsBoolean } from 'class-validator';
import { Type, Expose, Exclude, Transform } from 'class-transformer';

export class MemberDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Expose() 
  age: number;
  
  @IsNotEmpty()
  @IsBoolean()
  @Expose() 
  gender: boolean;

  @Exclude() email: string;
  @Exclude() password: string;
  @Exclude() isEmailVerified: boolean;
  @Exclude() verificationToken: string;
}

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
  @IsDate()
  @Expose()
  date: string;

  @IsNotEmpty()
  @Type(() => MemberDto)
  @Expose()
  member: MemberDto;
  
  @IsNotEmpty()
  @Expose()
  @Type(() => PurposeDto)
  purpose: PurposeDto;

  @Exclude()
  purposeId;
}
