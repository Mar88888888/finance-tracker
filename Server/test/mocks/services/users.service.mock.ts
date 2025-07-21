import { createUserModels } from '../../fixtures/users.fixture';

const users = createUserModels();

export const usersServiceMock = {
  findOne: jest.fn().mockResolvedValue(users[0]),
  find: jest.fn().mockResolvedValue(users),
  create: jest.fn().mockReturnValue(users[0]),
  update: jest.fn().mockResolvedValue(users[0]),
};
