import { UserEntity } from '../users/user.entity';
import { AbstractTransaction } from './abstractions/transaction.model.abstract';
import { TransactionEntity } from './transaction.entity';
import { PurposeEntity } from '../purposes/purpose.entity';

export class TransactionModel extends AbstractTransaction {


  constructor(id: number, sum: number, date: Date, memberId: number, purposeId: number, usdEquivalent: number = 0) {
    super();
    this.id = id;
    this.sum = sum;
    this.date = date;
    this.userId = memberId;
    this.purposeId = purposeId;
    this.usdEquivalent = usdEquivalent;
  }

  static fromEntity(entity: TransactionEntity): TransactionModel {
    return new TransactionModel(
      entity.id,
      entity.sum,
      entity.date,
      entity.member.id,
      entity.purpose.id,
      entity.usdEquivalent || 0,
    );
  }

  static toEntity(model: TransactionModel): TransactionEntity {
    const entity = new TransactionEntity();
    entity.id = model.getId();
    entity.sum = model.getSum();
    entity.date = model.getDate();
    entity.usdEquivalent = model.getUsdEquivalent();
    entity.member = { id: model.userId } as UserEntity;
    entity.purpose = { id: model.purposeId } as PurposeEntity;
    return entity;
  }
}
