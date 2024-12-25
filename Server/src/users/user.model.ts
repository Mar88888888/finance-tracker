import { TransactionEntity } from "src/transactions/transaction.entity";
import { AbstractUserModel } from "./abstracts/user.model.abstract";
import { GroupEntity } from "src/groups/group.entity";
import { UserEntity } from "src/users/user.entity";
import { PurposeEntity } from "../purposes/purpose.entity";

export class UserModel extends AbstractUserModel {
  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    age: number,
    gender: boolean,
    isEmailVerified: boolean,
    verificationToken?: string,
    transactions: TransactionEntity[] = [],
    myGroups: GroupEntity[] = [],
    groups: GroupEntity[] = [],
    purposes: PurposeEntity[] = []
  ) {
    super();
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.age = age;
    this.gender = gender;
    this.isEmailVerified = isEmailVerified;
    this.verificationToken = verificationToken;
    this.transactions = transactions;
    this.myGroups = myGroups;
    this.groups = groups;
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

  getIsEmailVerified(): boolean {
    return this.isEmailVerified;
  }

  setIsEmailVerified(isEmailVerified: boolean): void {
    this.isEmailVerified = isEmailVerified;
  }

  getVerificationToken(): string | undefined {
    return this.verificationToken;
  }

  setVerificationToken(verificationToken: string | undefined): void {
    this.verificationToken = verificationToken;
  }

  getTransactions(): TransactionEntity[] {
    return this.transactions;
  }

  setTransactions(transactions: TransactionEntity[]): void {
    this.transactions = transactions;
  }

  getMyGroups(): GroupEntity[] {
    return this.myGroups;
  }

  setMyGroups(myGroups: GroupEntity[]): void {
    this.myGroups = myGroups;
  }

  getGroups(): GroupEntity[] {
    return this.groups;
  }

  setGroups(groups: GroupEntity[]): void {
    this.groups = groups;
  }

  isVerified(): boolean {
    return this.isEmailVerified;
  }

  getPurposes(): PurposeEntity[] {
    return this.purposes;
  }

  setPurposes(purposes: PurposeEntity[]): void {
    this.purposes = purposes;
  }

  static fromEntity(entity: UserEntity): UserModel {
    return new UserModel(
      entity.id,
      entity.name,
      entity.email,
      entity.password,
      entity.age,
      entity.gender,
      entity.isEmailVerified,
      entity.verificationToken,
      entity.transactions || [],
      entity.myGroups || [],
      entity.groups || [],
      entity.purposes || []
    );
  }

  static toEntity(model: UserModel): UserEntity {
    const entity = new UserEntity();
    entity.id = model.getId();
    entity.name = model.getName();
    entity.email = model.getEmail();
    entity.password = model.getPassword();
    entity.age = model.getAge();
    entity.gender = model.getGender();
    entity.isEmailVerified = model.getIsEmailVerified();
    entity.verificationToken = model.getVerificationToken();
    entity.transactions = model.getTransactions();
    entity.myGroups = model.getMyGroups();
    entity.groups = model.getGroups();
    entity.purposes = model.getPurposes();
    return entity;
  }
}
