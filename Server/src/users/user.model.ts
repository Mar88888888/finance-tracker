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
  myGroups?: GroupEntity[];
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
    this.myGroups = params.myGroups || [];
    this.groups = params.groups || [];
    this.purposes = params.purposes || [];
  }
  getId(): number {
    return this.id;
  }

  setId(id: number): void {
    this.id = id;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  getPassword(): string {
    return this.password;
  }

  setPassword(password: string): void {
    this.password = password;
  }

  getAge(): number {
    return this.age;
  }

  setAge(age: number): void {
    this.age = age;
  }

  getGender(): boolean {
    return this.gender;
  }

  setGender(gender: boolean): void {
    this.gender = gender;
  }

  getTransactions(): TransactionEntity[] {
    return this.transactions;
  }

  setTransactions(transactions: TransactionEntity[]): void {
    this.transactions = transactions;
  }

  getOwnedGroups(): GroupEntity[] {
    return this.myGroups;
  }

  setOwnedGroups(myGroups: GroupEntity[]): void {
    this.myGroups = myGroups;
  }

  getGroups(): GroupEntity[] {
    return this.groups;
  }

  setGroups(groups: GroupEntity[]): void {
    this.groups = groups;
  }

  getPurposes(): PurposeEntity[] {
    return this.purposes;
  }

  setPurposes(purposes: PurposeEntity[]): void {
    this.purposes = purposes;
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
      myGroups: entity.myGroups || [],
      groups: entity.groups || [],
      purposes: entity.purposes || [],
    };
    return new UserModel(params);
  }

  static toEntity(model: UserModel): UserEntity {
    const entity = new UserEntity();
    entity.id = model.getId();
    entity.name = model.getName();
    entity.email = model.getEmail();
    entity.password = model.getPassword();
    entity.age = model.getAge();
    entity.gender = model.getGender();
    entity.transactions = model.getTransactions();
    entity.myGroups = model.getOwnedGroups();
    entity.groups = model.getGroups();
    entity.purposes = model.getPurposes();
    return entity;
  }
}
