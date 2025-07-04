import { GroupEntity } from "../../../src/groups/group.entity";
import { createGroupEntities, createGroupModels } from "../../fixtures/groups.fixtures";

const groupModels = createGroupModels();
const groupEntities = createGroupEntities(groupModels);

export const groupRepoMock = {
  findOne: jest.fn().mockResolvedValue(groupEntities[0]),
  find: jest.fn().mockResolvedValue(groupEntities),
  create: jest.fn().mockReturnValue(groupEntities[0]),
  save: jest.fn().mockImplementation(async (savedGroupEntity: GroupEntity): Promise<GroupEntity>=>{
    return Promise.resolve(savedGroupEntity);
  }),
  delete: jest.fn(),
}
