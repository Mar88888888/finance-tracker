import { UserModel } from "../user.model";

export interface IGoogleAuthorizedRequest extends Request{
  user: UserModel;
}