import { UserModel } from "../user.model";
import { InnerUserUpdateDto } from "./inner-update.user.dto";

export class UserDtoConverter {
  static toInnerUpdateDto(model: UserModel): InnerUserUpdateDto {
    return {
      name: model.getName(),
      email: model.getEmail(),
      age: model.getAge(),
      gender: model.getGender(),
    };
  }
}
