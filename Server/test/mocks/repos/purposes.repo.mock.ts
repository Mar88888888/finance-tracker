import { CreatePurposeDto } from "../../../src/purposes/dto/create-purpose.dto";
import { PurposeEntity } from "../../../src/purposes/purpose.entity";
import { createPurposeEntities, createPurposeModels } from "../../fixtures/purposes.fixtures";


const purposeModels = createPurposeModels();
const purposeEntities = createPurposeEntities(purposeModels)

export const purposeRepoMock = {
  findOne: jest.fn().mockResolvedValue(purposeEntities[0]),
  find: jest.fn().mockResolvedValue(purposeEntities),
  create: jest.fn().mockImplementation((createPurposeDto: CreatePurposeDto): PurposeEntity=>{
    let entity = new PurposeEntity();
    entity.id = 1;
    entity.category = createPurposeDto.category;
    return entity;
  }),
  save: jest.fn().mockImplementation(async (savedPurposeEntity: PurposeEntity): Promise<PurposeEntity>=>{
    return Promise.resolve(savedPurposeEntity);
  }),
  delete: jest.fn(),
}