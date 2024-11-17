import { TransactionEntity } from "../../transactions/transaction.entity";
import { GroupEntity } from "../../groups/group.entity";

export abstract class AbstractUserModel {
  protected id: number;
  protected name: string;
  protected email: string;
  protected password: string;
  protected age: number;
  protected gender: boolean;
  protected isEmailVerified: boolean;
  protected verificationToken?: string;
  protected transactions: TransactionEntity[] = [];
  protected myGroups: GroupEntity[] = [];
  protected groups: GroupEntity[] = [];

  abstract getId(): number;
  abstract setId(id: number): void;
  abstract getName(): string;
  abstract setName(name: string): void;
  abstract getEmail(): string;
  abstract setEmail(email: string): void;
  abstract getPassword(): string;
  abstract setPassword(password: string): void;
  abstract getAge(): number;
  abstract setAge(age: number): void;
  abstract getGender(): boolean;
  abstract setGender(gender: boolean): void;
  abstract getIsEmailVerified(): boolean;
  abstract setIsEmailVerified(isEmailVerified: boolean): void;
  abstract getVerificationToken(): string | undefined;
  abstract setVerificationToken(verificationToken: string | undefined): void;
  abstract getTransactions(): TransactionEntity[];
  abstract setTransactions(transactions: TransactionEntity[]): void;
  abstract getMyGroups(): GroupEntity[];
  abstract setMyGroups(myGroups: GroupEntity[]): void;
  abstract getGroups(): GroupEntity[];
  abstract setGroups(groups: GroupEntity[]): void;
  abstract isVerified(): boolean;
}
