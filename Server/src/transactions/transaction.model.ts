import { AbstractTransaction } from './abstractions/transaction.model.abstract';
import { TransactionEntity } from './transaction.entity';
import { UserModel } from '../users/user.model';
import { PurposeModel } from '../purposes/purpose.model';

export class TransactionModel extends AbstractTransaction {
  private member: UserModel;
  private purpose: PurposeModel;

  constructor(id: number, sum: number, date: Date, member: UserModel, purpose: PurposeModel) {
    super();
    this.id = id;
    this.sum = sum;
    this.date = date;
    this.member = member;
    this.purpose = purpose;
  }

  getMember(): UserModel {
    return this.member;
  }

  setMember(member: UserModel): void {
    this.member = member;
  }

  getPurpose(): PurposeModel {
    return this.purpose;
  }

  setPurpose(purpose: PurposeModel): void {
    this.purpose = purpose;
  }

  static fromEntity(entity: TransactionEntity): TransactionModel {
    const memberModel = UserModel.fromEntity(entity.member);
    const purposeModel = PurposeModel.fromEntity(entity.purpose);
    return new TransactionModel(entity.id, entity.sum, entity.date, memberModel, purposeModel);
  }

  static toEntity(model: TransactionModel): TransactionEntity {
    const entity = new TransactionEntity();
    entity.id = model.getId();
    entity.sum = model.getSum();
    entity.date = model.getDate();
    entity.member = UserModel.toEntity(model.getMember());
    entity.purpose = PurposeModel.toEntity(model.getPurpose());
    return entity;
  }
}
