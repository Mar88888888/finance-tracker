import { testPurposesModels } from "../../fixtures/purposes.fixtures";

export const purposeServiceMock = {
  findUserPurposes: jest.fn().mockResolvedValue(testPurposesModels),
  findOne: jest.fn().mockResolvedValue(testPurposesModels[0]),
  create: jest.fn().mockResolvedValue(testPurposesModels[0]),
  update: jest.fn().mockResolvedValue(testPurposesModels[0]),
  remove: jest.fn(),
}