import { PurposesService } from '../../src/purposes/purposes.service';
import { cahceManagerMock } from '../mocks/cache-manager.mock';
import { usersServiceMock } from '../mocks/services/users.service.mock';
import { purposeRepoMock } from '../mocks/repos/purposes.repo.mock';
import {
  createPurposeEntities,
  createPurposeModels,
} from '../fixtures/purposes.fixtures';
import { createUserModels } from '../fixtures/users.fixture';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PurposeModel } from '../../src/purposes/purpose.model';
import { createPurposeDtoMock, updatePurposeDtoMock } from './purpose.dto.mock';
import { UserModel } from '../../src/users/user.model';
import { PurposeEntity } from '../../src/purposes/purpose.entity';

describe('Purposes service', () => {
  let sut: PurposesService;
  let userModels: UserModel[];
  let purposeModels: PurposeModel[];

  let purposeEntities: PurposeEntity[];

  beforeEach(() => {
    sut = new PurposesService(
      purposeRepoMock as any,
      usersServiceMock as any,
      cahceManagerMock as any,
    );

    userModels = createUserModels();
    purposeModels = createPurposeModels();

    purposeEntities = createPurposeEntities(purposeModels);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return all purposes from cache if defined there', async () => {
    jest.spyOn(cahceManagerMock, 'get').mockResolvedValueOnce(purposeModels);
    const result = await sut.findAll();
    expect(result).toEqual(purposeModels);
    expect(purposeRepoMock.find).toHaveBeenCalledTimes(0);
  });

  it('should return all purposes from db if no purposes cached', async () => {
    jest.spyOn(cahceManagerMock, 'get').mockResolvedValueOnce(null);
    const result = await sut.findAll();
    expect(result).toEqual(purposeModels);
    expect(cahceManagerMock.set).toHaveBeenCalledTimes(1);
  });

  it('should return purposes for current user from cache if defined there', async () => {
    jest.spyOn(cahceManagerMock, 'get').mockResolvedValueOnce(purposeModels);
    const result = await sut.findUserPurposes(userModels[0].id);
    expect(result).toEqual(purposeModels);
    expect(purposeRepoMock.find).toHaveBeenCalledTimes(0);
  });

  it('should return purposes for current user from db if no purposes cached', async () => {
    jest.spyOn(cahceManagerMock, 'get').mockResolvedValueOnce(null);
    const result = await sut.findUserPurposes(userModels[0].id);
    expect(result).toEqual(purposeModels);
    expect(cahceManagerMock.set).toHaveBeenCalledTimes(1);
  });

  it('should throw BadRequestException if purpose with providen title already exists on create', () => {
    sut.create(userModels[0].id, createPurposeDtoMock).catch((err) => {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('Purpose with these values already exists.');
    });
  });

  it('should create an purpose', async () => {
    jest.spyOn(purposeRepoMock, 'findOne').mockResolvedValueOnce(undefined);
    const result = await sut.create(userModels[0].id, createPurposeDtoMock);
    const expected = new PurposeModel(
      1,
      createPurposeDtoMock.category,
      userModels[0].id,
    );
    expect(result).toEqual(expected);
  });

  it('should return purpose by Id', async () => {
    const result = await sut.findOne(purposeModels[0].id);
    expect(result).toEqual(purposeModels[0]);
  });

  it('should throw a NotFoundException if no purpose with given id found', () => {
    const purposeId = purposeModels[0].id;
    jest.spyOn(purposeRepoMock, 'findOne').mockResolvedValueOnce(undefined);
    sut.findOne(purposeId).catch((err) => {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe(`Purpose with id ${purposeId} not found`);
    });
  });

  it('should throw BadRequestException if purpose with providen title already exists on update', () => {
    sut
      .update(userModels[0].id, purposeModels[1].id, updatePurposeDtoMock)
      .catch((err) => {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toBe('Purpose with these values already exists.');
      });
  });

  it('should update an purpose', async () => {
    jest
      .spyOn(purposeRepoMock, 'findOne')
      .mockResolvedValueOnce(purposeEntities[0]);
    jest.spyOn(purposeRepoMock, 'findOne').mockResolvedValueOnce(undefined);
    const result = await sut.update(
      userModels[0].id,
      purposeModels[1].id,
      updatePurposeDtoMock,
    );
    const expected = new PurposeModel(
      1,
      updatePurposeDtoMock.category,
      userModels[0].id,
    );
    expect(result).toEqual(expected);
  });

  it('should delete a purpose by id', async () => {
    await sut.remove(purposeModels[0].id);

    expect(purposeRepoMock.delete).toHaveBeenCalledTimes(1);
  });

  it('should clear cached purposes if purpose for deletion exists', async () => {
    await sut.remove(purposeModels[0].id);

    expect(cahceManagerMock.del).toHaveBeenCalledTimes(2);
  });
});
