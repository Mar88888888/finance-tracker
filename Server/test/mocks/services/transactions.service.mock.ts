import { createTransactionModels } from "../../fixtures/transactions.fixtures";

const transactionModels = createTransactionModels();

export const transactionsServiceMock = {
  findOne: jest.fn().mockResolvedValue(transactionModels[0]),
  getGroupTransactions: jest.fn().mockResolvedValue(transactionModels),
  exportToCsv: jest.fn(),
}