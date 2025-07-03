import { CreatePurposeDto } from "../../../src/purposes/dto/create-purpose.dto";
import { PurposeEntity } from "../../../src/purposes/purpose.entity";
import { testPurposesEntities } from "../../fixtures/purposes.fixtures";

export const purposeRepoMock = {
  findOne: jest.fn().mockReturnValue(testPurposesEntities[0]),
  find: jest.fn().mockReturnValue(testPurposesEntities),
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