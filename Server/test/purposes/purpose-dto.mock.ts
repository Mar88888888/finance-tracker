import { testPurposesModels } from "../fixtures/purposes.fixtures";

export const createPurposeDtoMock = {
  category: "New Purpose",
};

export  const updatePurposeDtoMock = {
    category: testPurposesModels[1].getCategory(),
  };