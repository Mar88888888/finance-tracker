import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { createUserModels } from "../fixtures/users.fixture";
import { PurposeOwnerGuard } from "../../src/guards/purpose-owner.guard";
import { UserModel } from "../../src/users/user.model";
import { purposeServiceMock } from "../mocks/services/purpose.service.mock";
import { executionContextMock } from "../mocks/execution-context.mock";
import { PurposeModel } from "../../src/purposes/purpose.model";
import { createPurposeModels } from "../fixtures/purposes.fixtures";


describe('Auth Guard', () => {
  let sut: PurposeOwnerGuard;
  let userModels: UserModel[];
  let purposeModels: PurposeModel[];

  beforeEach(() => {
    sut = new PurposeOwnerGuard(
      purposeServiceMock as any
    );
    
    userModels = createUserModels();
    purposeModels = createPurposeModels();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return true if user is an owner of given purpose', async () => {
    const result = await sut.canActivate(executionContextMock as any);
    expect(result).toBe(true);
  });

  it('should throw NotFoundException if no purposeId provided',  () => {
    jest.spyOn(executionContextMock, 'switchToHttp').mockReturnValueOnce({
      getRequest: jest.fn().mockReturnValueOnce({
        userId: userModels[0].getId(),
        params: {
          purposeId: undefined,
        }
      }),
      getResponse: jest.fn(),
    })
    sut.canActivate(executionContextMock as any).catch(err => {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Purpose ID is required');
    });
  });

  it('should throw NotFoundException if no purpose with provided Id found',  () => {
    jest.spyOn(purposeServiceMock, 'findOne').mockResolvedValueOnce(undefined);
    sut.canActivate(executionContextMock as any).catch(err => {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Purpose not found');
    });
  });

  it('should throw ForbiddenException if user is not an owner of provided purpose',  () => {
    jest.spyOn(purposeServiceMock, 'findOne').mockResolvedValueOnce(purposeModels[1]);
    sut.canActivate(executionContextMock as any).catch(err => {
      expect(err).toBeInstanceOf(ForbiddenException);
      expect(err.message).toBe('You are not the owner of this purpose');
    });
  });
});