import { PurposeModel } from "../../src/purposes/purpose.model";

export const testPurposesModels = [
  new PurposeModel(1, 'Purpose 1', 10),
  new PurposeModel(2, 'Purpose 2', 5),
  new PurposeModel(3, 'Purpose 3', 3),
];

export const testPurposesEntities = testPurposesModels.map(entity => PurposeModel.toEntity(entity))