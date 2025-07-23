import { PurposeModel } from '../../src/purposes/purpose.model';
import { PurposesController } from '../../src/purposes/purposes.controller';
import { createPurposeModels } from '../fixtures/purposes.fixtures';
import { authorizedRequest } from '../mocks/authorized-request.mock';
import { purposeServiceMock } from '../mocks/services/purpose.service.mock';
import { createPurposeDtoMock, updatePurposeDtoMock } from './purpose.dto.mock';

describe('Purposes Controller', () => {
  let sut: PurposesController;
  let purposeModels: PurposeModel[];

  beforeEach(() => {
    sut = new PurposesController(purposeServiceMock as any);

    purposeModels = createPurposeModels();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return all user purposes', async () => {
    const result = await sut.findAll(authorizedRequest);
    expect(result).toEqual(purposeModels);
    expect(purposeServiceMock.findUserPurposes).toHaveBeenCalledWith(
      authorizedRequest.userId,
    );
  });

  it('should return purpose by id', async () => {
    const purposeId = purposeModels[0].id;

    const result = await sut.findOne(purposeId);
    expect(result).toEqual(purposeModels[0]);
    expect(purposeServiceMock.findOne).toHaveBeenCalledWith(purposeId);
  });

  it('should create a purpose', async () => {
    const result = await sut.create(createPurposeDtoMock, authorizedRequest);

    expect(result).toEqual(purposeModels[0]);
    expect(purposeServiceMock.create).toHaveBeenCalledWith(
      authorizedRequest.userId,
      createPurposeDtoMock,
    );
  });

  it('should update a purpose', async () => {
    const purposeId = purposeModels[0].id;

    const result = await sut.update(
      authorizedRequest,
      purposeId,
      updatePurposeDtoMock,
    );

    expect(result).toEqual(purposeModels[0]);
    expect(purposeServiceMock.update).toHaveBeenCalledWith(
      authorizedRequest.userId,
      purposeId,
      updatePurposeDtoMock,
    );
  });

  it('should delete a purpose', async () => {
    const purposeId = purposeModels[0].id;

    await sut.remove(purposeId);
    expect(purposeServiceMock.remove).toHaveBeenCalledWith(purposeId);
  });
});
