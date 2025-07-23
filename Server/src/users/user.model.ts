import { TransactionEntity } from '../transactions/transaction.entity';
import { AbstractUserModel } from './abstracts/user.model.abstract';
import { GroupEntity } from '../groups/group.entity';
import { UserEntity } from '../users/user.entity';
import { PurposeEntity } from '../purposes/purpose.entity';

export interface UserModelParams {
  id: number;
  name: string;
  email: string;
  password: string;
  age: number;
  gender: boolean;
  verificationToken?: string;
  transactions?: TransactionEntity[];
  ownedGroups?: GroupEntity[];
  groups?: GroupEntity[];
  purposes?: PurposeEntity[];
}

export class UserModel extends AbstractUserModel {
  constructor(params: UserModelParams) {
    super();

    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.password = params.password;
    this.age = params.age;
    this.gender = params.gender;
    this.transactions = params.transactions || [];
    this.ownedGroups = params.ownedGroups || [];
    this.groups = params.groups || [];
    this.purposes = params.purposes || [];
  }
  static fromEntity(entity: UserEntity): UserModel {
    const params: UserModelParams = {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      age: entity.age,
      gender: entity.gender,
      verificationToken: entity.verificationToken,
      transactions: entity.transactions || [],
      ownedGroups: entity.ownedGroups || [],
      groups: entity.groups || [],
      purposes: entity.purposes || [],
    };
    return new UserModel(params);
  }

  static toEntity(model: UserModel): UserEntity {
    const entity = new UserEntity();
    entity.id = model.id;
    entity.name = model.name;
    entity.email = model.email;
    entity.password = model.password;
    entity.age = model.age;
    entity.gender = model.gender;
    entity.transactions = model.transactions;
    entity.ownedGroups = model.ownedGroups;
    entity.groups = model.groups;
    entity.purposes = model.purposes;
    return entity;
  }
}
