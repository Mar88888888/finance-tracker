import { PurposeEntity } from "../../src/purposes/purpose.entity";
import { PurposeModel } from "../../src/purposes/purpose.model";

export function createPurposeModels() {
  return [
    new PurposeModel(1, 'Purpose 1', 10),
    new PurposeModel(2, 'Purpose 2', 5),
    new PurposeModel(3, 'Purpose 3', 3),
  ];
}

export function createPurposeEntities(purposeModels: PurposeModel[]): PurposeEntity[] {
  return purposeModels.map(PurposeModel.toEntity);
}


