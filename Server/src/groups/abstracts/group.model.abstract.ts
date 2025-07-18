import { Type } from "class-transformer";
import { UserSerializeDto } from "../../users/dto/serialize.user.dto";
import { UserModel } from "../../users/user.model";

export abstract class AbstractGroupModel {
  protected id: number;
  protected title: string;

  @Type(/* istanbul ignore next */() => UserSerializeDto)
  protected owner: UserModel;

  @Type(/* istanbul ignore next */() => UserSerializeDto)
  protected members: UserModel[] = [];

  protected purposes: number[] = [];

  protected joinCode: string;

  abstract getId(): number;
  abstract setId(id: number): void;
  abstract getTitle(): string;
  abstract setTitle(title: string): void;
  abstract getOwner(): UserModel;
  abstract setOwner(owner: UserModel): void;
  abstract getMembers(): UserModel[];
  abstract setMembers(members: UserModel[]): void;
  abstract getJoinCode(): string;
  abstract setJoinCode(joinCode: string): void;

  abstract addMember(user: UserModel): void;
  abstract removeMember(memberId: number): void;
}
