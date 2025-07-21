import { createUserModels } from '../../fixtures/users.fixture';

const users = createUserModels();

export const authServiceMock = {
  signup: jest.fn().mockResolvedValue(users[0]),
  signin: jest.fn().mockResolvedValue({ accessToken: 'token', user: users[0] }),
  getUserFromToken: jest.fn().mockResolvedValue(users[0]),
  generateJwtToken: jest.fn().mockReturnValue('token'),
  validateGoogleUser: jest.fn().mockResolvedValue(users[0]),
};
