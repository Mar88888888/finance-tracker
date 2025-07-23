import { TransactionEntity } from '../transactions/transaction.entity';
import { PurposeEntity } from './purpose.entity';
import { AbstractPurpose } from './abstracts/purpose.model.abstract';
import { UserEntity } from '../users/user.entity';

export class PurposeModel extends AbstractPurpose {
  private transactions: TransactionEntity[] = [];

  constructor(id: number, category: string, userId: number) {
    super();
    this.id = id;
    this.category = category;
    this.userId = userId;
  }

  static fromEntity(entity: PurposeEntity): PurposeModel {
    const model = new PurposeModel(entity.id, entity.category, entity.user.id);
    model.transactions = entity.transactions || [];
    return model;
  }

  static toEntity(model: PurposeModel): PurposeEntity {
    const entity = new PurposeEntity();
    entity.id = model.id;
    entity.category = model.category;
    entity.transactions = model.transactions;
    entity.user = { id: model.userId } as UserEntity;
    return entity;
  }
}
