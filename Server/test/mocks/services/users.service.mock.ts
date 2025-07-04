import { UserModel } from "../../../src/users/user.model"
import { createUserModels } from "../../fixtures/users.fixture"

const users = createUserModels();

export const usersServiceMock = {
  findOne: jest.fn().mockImplementation(async (id): Promise<UserModel>=>{
    return Promise.resolve(users[0])
  }),
}