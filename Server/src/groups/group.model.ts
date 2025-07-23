import { UserModel } from '../users/user.model';
import { AbstractGroupModel } from './abstracts/group.model.abstract';
import { GroupEntity } from './group.entity';
import { PurposeEntity } from '../purposes/purpose.entity';

export interface GroupModelParams {
  id: number;
  title: string;
  owner: UserModel;
  joinCode: string;
  purposes?: number[];
  members?: UserModel[];
}

export class GroupModel extends AbstractGroupModel {
  constructor(params: GroupModelParams) {
    super();
    this.id = params.id;
    this.title = params.title;
    this.owner = params.owner;
    this.joinCode = params.joinCode;
    this.purposes = params.purposes || [];
    this.members = params.members || [];
  }

  addMember(user: UserModel): void {
    this.members.push(user);
  }

  removeMember(memberId: number): void {
    this.members = this.members.filter((member) => member.id !== memberId);
  }

  addPurposes(purposes: number[]): void {
    this.purposes.push(...purposes);
    this.purposes = [...new Set(this.purposes)];
  }

  removePurpose(purposeId: number): void {
    this.purposes = this.purposes.filter((purpose) => purposeId != purpose);
  }

  static fromEntity(entity: GroupEntity): GroupModel {
    const params: GroupModelParams = {
      id: entity.id,
      title: entity.title,
      owner: entity.owner && UserModel.fromEntity(entity.owner),
      joinCode: entity.joinCode,
      purposes: entity.purposes?.map((purpose) => purpose.id) || [],
      members: entity.members?.map((user) => UserModel.fromEntity(user)) || [],
    };
    return new GroupModel(params);
  }

  static toEntity(model: GroupModel): GroupEntity {
    const entity = new GroupEntity();
    entity.id = model.id;
    entity.title = model.title;
    entity.owner = UserModel.toEntity(model.owner);
    entity.members = model.members.map((user) => UserModel.toEntity(user));
    entity.joinCode = model.joinCode;
    entity.purposes = model.purposes.map((purpose) => {
      const purposeEntity = new PurposeEntity();
      purposeEntity.id = purpose;
      return purposeEntity;
    });
    return entity;
  }
}
