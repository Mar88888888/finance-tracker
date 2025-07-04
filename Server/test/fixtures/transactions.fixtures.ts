import { TransactionEntity } from "../../src/transactions/transaction.entity";
import { TransactionModel } from "../../src/transactions/transaction.model";

export function createTransactionModels(): TransactionModel[] {
  return [
    new TransactionModel(
      12,
      150,
      new Date('01-02-2025'),
      10,
      2
    ),
    new TransactionModel(
      11,
      1500,
      new Date('02-02-2025'),
      5,
      2
    )
  ];
}

export function createTransactionEntities(transactionModels: TransactionModel[]): TransactionEntity[] {
  return transactionModels.map(TransactionModel.toEntity);
}