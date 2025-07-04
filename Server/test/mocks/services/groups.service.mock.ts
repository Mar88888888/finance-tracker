import { createGroupModels } from "../../fixtures/groups.fixtures";
import { createTransactionModels } from "../../fixtures/transactions.fixtures";

const groupModels = createGroupModels();
const transactionModels = createTransactionModels()

export const groupsServiceMock = {
  getGroupCode: jest.fn().mockResolvedValue('gorupCode'),
  getTransactions: jest.fn().mockResolvedValue(transactionModels),
  getUserGroups: jest.fn().mockResolvedValue(groupModels),
  findOne: jest.fn().mockResolvedValue(groupModels[0]),
  create: jest.fn().mockResolvedValue(groupModels[0]),
  addPurposes: jest.fn().mockResolvedValue(groupModels[0]),
  update: jest.fn().mockResolvedValue(groupModels[0]),
  joinGroup: jest.fn().mockResolvedValue(groupModels[0]),
  removeUserFromGroup: jest.fn().mockResolvedValue(groupModels[0]),
  removePurposeFromGroup: jest.fn().mockResolvedValue(groupModels[0]),
  remove: jest.fn(),
}