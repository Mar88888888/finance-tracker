import { testPurposesModels } from "../../fixtures/purposes.fixtures";

export const purposeServiceMock = {
  findUserPurposes: jest.fn().mockResolvedValueOnce(testPurposesModels),
  findOne: jest.fn().mockResolvedValueOnce(testPurposesModels[0]),
  create: jest.fn().mockResolvedValueOnce(testPurposesModels[0]),
  update: jest.fn().mockResolvedValueOnce(testPurposesModels[0]),
  remove: jest.fn(),
}