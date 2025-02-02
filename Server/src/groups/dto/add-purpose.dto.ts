import { IsArray, IsNotEmpty } from 'class-validator';

export class AddPurposeDto {
  @IsNotEmpty()
  @IsArray()
  purposeIds: number[];

}
