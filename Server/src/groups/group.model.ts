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
  getId(): number {
    return this.id;
  }

  setId(id: number): void {
    this.id = id;
  }

  getTitle(): string {
    return this.title;
  }

  setTitle(title: string): void {
    this.title = title;
  }

  getOwner(): UserModel {
    return this.owner;
  }

  setOwner(owner: UserModel): void {
    this.owner = owner;
  }

  getMembers(): UserModel[] {
    return this.members;
  }

  setMembers(members: UserModel[]): void {
    this.members = members;
  }

  getJoinCode(): string {
    return this.joinCode;
  }

  setJoinCode(joinCode: string): void {
    this.joinCode = joinCode;
  }

  addMember(user: UserModel): void {
    this.members.push(user);
  }

  removeMember(user: UserModel): void {
    this.members = this.members.filter((member) => member.getId() !== user.getId());
  }

  getPurposes(): number[] {
    return this.purposes;
  }

  setPurposes(purposes: number[]): void {
    this.purposes = purposes;
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
      owner: UserModel.fromEntity(entity.owner),
      joinCode: entity.joinCode,
      purposes: entity.purposes?.map(purpose => purpose.id) || [],
      members: entity.members?.map(user => UserModel.fromEntity(user)) || [],
    };
    return new GroupModel(params);
  }
  static toEntity(model: GroupModel): GroupEntity {
    const entity = new GroupEntity();
    entity.id = model.getId();
    entity.title = model.getTitle();
    entity.owner = UserModel.toEntity(model.getOwner());
    entity.members = model.getMembers().map(user => UserModel.toEntity(user));
    entity.joinCode = model.getJoinCode();
    entity.purposes = model.getPurposes().map(purpose => {
      const purposeEntity = new PurposeEntity();
      purposeEntity.id = purpose;
      return purposeEntity;
    });
    return entity;
  }



}
