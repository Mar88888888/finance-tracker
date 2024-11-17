import { Type } from "class-transformer";
import { UserModel } from "../user.model";
import { UserSerializeDto } from "./serialize.user.dto";

export class LoginResponseDto {
  @Type(() => UserSerializeDto)
  user: UserModel; 
  
  token: string;
}
