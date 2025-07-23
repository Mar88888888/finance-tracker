import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../../src/users/dto/create.user.dto';
import { UserEntity } from '../../src/users/user.entity';
import { UserModel } from '../../src/users/user.model';
import { UsersService } from '../../src/users/users.service';
import {
  createUserEntities,
  createUserModels,
} from '../fixtures/users.fixture';
import { RepoMock } from '../mocks/repos/repo.mock.interface';
import { createUsersRepoMock } from '../mocks/repos/users.repo.mock';
import { FindOptionsWhere } from 'typeorm';
import { InnerUserUpdateDto } from '../../src/users/dto/inner-update.user.dto';

describe('User Service', () => {
  let sut: UsersService;

  let usersRepoMock: RepoMock<UserEntity>;
  let userModels: UserModel[];
  let userEntities: UserEntity[];

  beforeEach(() => {
    userModels = createUserModels();
    userEntities = createUserEntities(userModels);
    usersRepoMock = createUsersRepoMock(userEntities);

    sut = new UsersService(usersRepoMock as any);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'username',
      password: 'password',
      email: 'email',
    };
    const result = await sut.create(createUserDto);

    const userEntity: UserEntity = usersRepoMock.create();
    expect(result).toEqual(userEntity);
    expect(usersRepoMock.create).toHaveBeenCalledWith(createUserDto);
    expect(usersRepoMock.save).toHaveBeenCalledWith(userEntity);
  });

  describe('find one', () => {
    it('should find a user by id', async () => {
      const userId = 1;
      const result = await sut.findOne(userId);

      const userModel = await usersRepoMock.findOne();

      expect(result).toEqual(userModel);
      expect(usersRepoMock.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      usersRepoMock.findOne.mockResolvedValueOnce(null);
      await expect(sut.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  it('should find users by provided query', async () => {
    const userQuery: FindOptionsWhere<UserEntity> = {
      email: 'email@e.com',
    };
    const result = await sut.find(userQuery);

    const expectedUsers = await usersRepoMock.find();
    expect(result).toEqual(expectedUsers);
    expect(usersRepoMock.find).toHaveBeenCalledWith({ where: userQuery });
  });

  it('should update user', async () => {
    const userId = 1;
    const updateUserDto: InnerUserUpdateDto = {
      email: 'email1@em.com',
    };
    const result = await sut.update(userId, updateUserDto);

    expect(usersRepoMock.findOne).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(result.email).toEqual(updateUserDto.email);
  });
});
