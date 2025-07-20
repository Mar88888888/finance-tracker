import { createTransactionModels } from '../../fixtures/transactions.fixtures';

const transactionModels = createTransactionModels();

export const transactionsServiceMock = {
  findOne: jest.fn().mockResolvedValue(transactionModels[0]),
  create: jest.fn().mockResolvedValue(transactionModels[0]),
  find: jest.fn().mockResolvedValue(transactionModels),
  getGroupTransactions: jest.fn().mockResolvedValue(transactionModels),
  exportToCsv: jest.fn(),
  update: jest.fn().mockResolvedValue(transactionModels[0]),
  remove: jest.fn(),
};
