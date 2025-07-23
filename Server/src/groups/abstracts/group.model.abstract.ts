import { Type } from 'class-transformer';
import { UserSerializeDto } from '../../users/dto/serialize.user.dto';
import { UserModel } from '../../users/user.model';

export abstract class AbstractGroupModel {
  id: number;
  title: string;

  @Type(/* istanbul ignore next */ () => UserSerializeDto)
  owner: UserModel;

  @Type(/* istanbul ignore next */ () => UserSerializeDto)
  members: UserModel[] = [];

  purposes: number[] = [];

  joinCode: string;

  abstract addMember(user: UserModel): void;
  abstract removeMember(memberId: number): void;
  abstract addPurposes(purposes: number[]): void;
  abstract removePurpose(purposeId: number): void;
}
