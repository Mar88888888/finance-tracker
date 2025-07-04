import { GroupEntity } from "../../../src/groups/group.entity";

export function createGroupRepoMock(groupEntities: GroupEntity[]) {
  return {
    findOne: jest.fn().mockResolvedValue(groupEntities[0]),
    find: jest.fn().mockResolvedValue(groupEntities),
    create: jest.fn().mockReturnValue(groupEntities[0]),
    save: jest.fn().mockImplementation(async (entity: GroupEntity) => Promise.resolve(entity)),
    delete: jest.fn(),
  };
}
