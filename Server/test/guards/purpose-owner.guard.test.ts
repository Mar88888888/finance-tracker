import { ExecutionContext, ForbiddenException, NotFoundException, } from "@nestjs/common";
import { members } from "../fixtures/users.fixture";
import { testTransactions } from "../fixtures/transactions.fixtures";
import { PurposeOwnerGuard } from "../../src/guards/purpose-owner.guard";
import { testPurposesModels } from "../fixtures/purposes.fixtures";

const purposeServiceMock = {
  findOne: jest.fn().mockResolvedValue(testPurposesModels[0])
};

const executionContextMock: Partial<
  Record<
    jest.FunctionPropertyNames<ExecutionContext>,
    jest.MockedFunction<any>
  >
> = {
  switchToHttp: jest.fn().mockReturnValue({
    getRequest: jest.fn().mockReturnValue({
      userId: members[0].getId(),
      params: {
        purposeId: testPurposesModels[0].getId(),
      }
    }),
    getResponse: jest.fn(),
  }),
};


describe('Auth Guard', () => {
  let sut: PurposeOwnerGuard;

  beforeEach(() => {
    sut = new PurposeOwnerGuard(
      purposeServiceMock as any
    );
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
        userId: members[0].getId(),
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
    jest.spyOn(purposeServiceMock, 'findOne').mockResolvedValueOnce(testTransactions[1]);
    sut.canActivate(executionContextMock as any).catch(err => {
      expect(err).toBeInstanceOf(ForbiddenException);
      expect(err.message).toBe('You are not the owner of this purpose');
    });
  });
});