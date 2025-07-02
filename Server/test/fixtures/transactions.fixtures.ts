import { TransactionModel } from "../../src/transactions/transaction.model";

export const testTransactions = [
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
]