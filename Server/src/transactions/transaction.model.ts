import { UserEntity } from '../users/user.entity';
import { AbstractTransaction } from './abstracts/transaction.model.abstract';
import { TransactionEntity } from './transaction.entity';
import { PurposeEntity } from '../purposes/purpose.entity';

export class TransactionModel implements AbstractTransaction {
  constructor(
    public id: number,
    public sum: number,
    public date: Date,
    public userId: number,
    public purposeId: number,
    public usdEquivalent: number = 0,
    public userName?: string,
    public purposeCategory?: string,
  ) {}

  static fromEntity(entity: TransactionEntity): TransactionModel {
    return new TransactionModel(
      entity.id,
      entity.sum,
      entity.date,
      entity.member.id,
      entity.purpose.id,
      entity.usdEquivalent || 0,
      entity.member.name,
      entity.purpose.category,
    );
  }

  static toEntity(model: TransactionModel): TransactionEntity {
    const entity = new TransactionEntity();
    entity.id = model.id;
    entity.sum = model.sum;
    entity.date = model.date;
    entity.usdEquivalent = model.usdEquivalent;
    entity.member = { id: model.userId } as UserEntity;
    entity.purpose = { id: model.purposeId } as PurposeEntity;
    return entity;
  }
}
