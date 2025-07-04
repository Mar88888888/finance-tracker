import { createPurposeModels } from "../../fixtures/purposes.fixtures"

const purposeModels = createPurposeModels();

export const purposeServiceMock = {
  findUserPurposes: jest.fn().mockResolvedValue(purposeModels),
  findOne: jest.fn().mockResolvedValue(purposeModels[0]),
  create: jest.fn().mockResolvedValue(purposeModels[0]),
  update: jest.fn().mockResolvedValue(purposeModels[0]),
  remove: jest.fn(),
}