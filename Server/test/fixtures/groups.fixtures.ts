import { GroupEntity } from "../../src/groups/group.entity";
import { GroupModel } from "../../src/groups/group.model";
import { createUserModels } from "./users.fixture";

const users = createUserModels();

export function createGroupModels(): GroupModel[] {
  return [
    new GroupModel({
      id: 1,
      title: 'GroupTitle',
      owner: users[0],
      joinCode: 'jestTestCode11',
      members: users,
      purposes: [2],
    }),
    new GroupModel({
      id: 2,
      title: 'GroupTitl2',
      owner: users[0],
      joinCode: 'jestTestCode2',
      members: [users[0]],
    }),
    new GroupModel({
      id: 3,
      title: 'GroupTitl3',
      owner: users[1],
      joinCode: 'jestTestCode3',
      purposes: [2],
    }),
  ]
} 

export function createGroupEntities(groupModels: GroupModel[]): GroupEntity[] {
  return groupModels.map(model => GroupModel.toEntity(model))
}
