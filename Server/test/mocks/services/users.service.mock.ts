import { UserModel } from "../../../src/users/user.model"
import { members } from "../../fixtures/users.fixture"

export const userServiceMock = {
  findOne: jest.fn().mockImplementation(async (id): Promise<UserModel>=>{
    return Promise.resolve(members.filter(member => member.getId() === id)[0])
  }),
}