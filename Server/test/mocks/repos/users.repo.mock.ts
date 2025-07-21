import { UserEntity } from '../../../src/users/user.entity';
import { RepoMock } from './repo.mock.interface';

export function createUsersRepoMock(
  userEntities: UserEntity[],
): RepoMock<UserEntity> {
  return {
    findOne: jest.fn().mockResolvedValue(userEntities[0]),
    find: jest.fn().mockResolvedValue(userEntities),
    create: jest.fn().mockReturnValue(userEntities[0]),
    save: jest
      .fn()
      .mockImplementation(async (entity: UserEntity) =>
        Promise.resolve(entity),
      ),
    delete: jest.fn(),
  };
}
