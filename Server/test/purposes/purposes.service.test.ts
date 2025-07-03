import { PurposesService } from "../../src/purposes/purposes.service"
import { cahceManagerMock } from "../mocks/cache-manager.mock";
import { userServiceMock } from "../mocks/services/users.service.mock";
import { purposeRepoMock } from "../mocks/repos/purposes.repo.mock";
import { testPurposesEntities, testPurposesModels } from "../fixtures/purposes.fixtures";
import { members } from "../fixtures/users.fixture";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { PurposeModel } from "../../src/purposes/purpose.model";
import { createPurposeDtoMock, updatePurposeDtoMock } from "./purpose-dto.mock";


describe('Purposes service', () => {
  let sut: PurposesService;

  beforeEach(() => {
    sut = new PurposesService(
      purposeRepoMock as any,
      userServiceMock as any,
      cahceManagerMock as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return all purposes from cache if defined there', async () => {
    jest.spyOn(cahceManagerMock, 'get').mockResolvedValueOnce(testPurposesModels);
    const result = await sut.findAll();
    expect(result).toEqual(testPurposesModels);
    expect(purposeRepoMock.find).toHaveBeenCalledTimes(0);
  });

  it('should return all purposes from db if no purposes cached', async () => {
    jest.spyOn(cahceManagerMock, 'get').mockResolvedValueOnce(null);
    const result = await sut.findAll();
    expect(result).toEqual(testPurposesModels);
    expect(cahceManagerMock.set).toHaveBeenCalledTimes(1);
  });

  it('should return purposes for current user from cache if defined there', async () => {
    jest.spyOn(cahceManagerMock, 'get').mockResolvedValueOnce(testPurposesModels);
    const result = await sut.findUserPurposes(members[0].getId());
    expect(result).toEqual(testPurposesModels);
    expect(purposeRepoMock.find).toHaveBeenCalledTimes(0);
  });

  it('should return purposes for current user from db if no purposes cached', async () => {
    jest.spyOn(cahceManagerMock, 'get').mockResolvedValueOnce(null);
    const result = await sut.findUserPurposes(members[0].getId());
    expect(result).toEqual(testPurposesModels);
    expect(cahceManagerMock.set).toHaveBeenCalledTimes(1);
  });



  it('should throw BadRequestException if purpose with providen title already exists on create', () => {
    sut.create(members[0].getId(), createPurposeDtoMock).catch(err => {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('Purpose with these values already exists.');
    });
  });

  it('should create an purpose', async () => {
    jest.spyOn(purposeRepoMock, 'findOne').mockResolvedValueOnce(undefined);
    const result = await sut.create(members[0].getId(), createPurposeDtoMock);
    const expected = new PurposeModel(
      1, 
      createPurposeDtoMock.category, 
      members[0].getId()
    );
    expect(result).toEqual(expected);
  });

  it('should return purpose by Id', async () => {
    const result = await sut.findOne(testPurposesModels[0].getId());
    expect(result).toEqual(testPurposesModels[0]);
  })

  it('should throw a NotFoundException if no purpose with given id found', () => {
    const purposeId = testPurposesModels[0].getId()
    jest.spyOn(purposeRepoMock, 'findOne').mockResolvedValueOnce(undefined);
    sut.findOne(purposeId).catch(err => {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe(`Purpose with id ${purposeId} not found`);
    });
  });



  it('should throw BadRequestException if purpose with providen title already exists on update', () => {
    sut.update(members[0].getId(), testPurposesModels[1].getId(), updatePurposeDtoMock).catch(err => {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('Purpose with these values already exists.');
    });
  });

  it('should update an purpose', async () => {
    jest.spyOn(purposeRepoMock, 'findOne').mockResolvedValueOnce(testPurposesEntities[0]);
    jest.spyOn(purposeRepoMock, 'findOne').mockResolvedValueOnce(undefined);
    const result = await sut.update(members[0].getId(), testPurposesModels[1].getId(), updatePurposeDtoMock);
    const expected = new PurposeModel(
      1, 
      updatePurposeDtoMock.category, 
      members[0].getId()
    );
    expect(result).toEqual(expected);
  });

  it('should delete a purpose by id', async () => {
    await sut.remove(testPurposesModels[0].getId());

    expect(purposeRepoMock.delete).toHaveBeenCalledTimes(1);
  });

  it('should clear cached purposes if purpose for deletion exists', async () => {
    await sut.remove(testPurposesModels[0].getId());

    expect(cahceManagerMock.del).toHaveBeenCalledTimes(2);
  });


})