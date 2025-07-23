import { createPurposeModels } from '../fixtures/purposes.fixtures';

const purposeModels = createPurposeModels();

export const createPurposeDtoMock = {
  category: 'New Purpose',
};

export const updatePurposeDtoMock = {
  category: purposeModels[1].category,
};
