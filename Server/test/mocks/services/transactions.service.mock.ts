import { testTransactions } from "../../fixtures/transactions.fixtures";

export const transactionsServiceMock = {
  findUserPurposes: jest.fn().mockResolvedValue(testTransactions),
  findOne: jest.fn().mockResolvedValue(testTransactions[0]),
  create: jest.fn().mockResolvedValue(testTransactions[0]),
  update: jest.fn().mockResolvedValue(testTransactions[0]),
  remove: jest.fn(),
}