import { GroupModel } from "../../src/groups/group.model";
import { members } from "./users.fixture";

export const groupModels = [
  new GroupModel({
    id: 1,
    title: 'GroupTitle',
    owner: members[0],
    joinCode: 'jestTestCode11',
    members,
    purposes: [2],
  }),
  new GroupModel({
    id: 2,
    title: 'GroupTitl2',
    owner: members[0],
    joinCode: 'jestTestCode2',
    members: [members[0]],
  }),
  new GroupModel({
    id: 3,
    title: 'GroupTitl3',
    owner: members[1],
    joinCode: 'jestTestCode3',
    purposes: [2],
  }),
]

export const groupEntities = groupModels.map(model => GroupModel.toEntity(model));
