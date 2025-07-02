import { ExecutionContext, ForbiddenException, NotFoundException, } from "@nestjs/common";
import { members } from "../fixtures/users.fixture";
import { TransactionOwnerGuard } from "../../src/guards/transaction-owner.guard";
import { testTransactions } from "../fixtures/transactions.fixtures";

const transactionServiceMock = {
  findOne: jest.fn().mockResolvedValue(testTransactions[0])
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
        transactionId: testTransactions[0].getId(),
      }
    }),
    getResponse: jest.fn(),
  }),
};


describe('Auth Guard', () => {
  let sut: TransactionOwnerGuard;

  beforeEach(() => {
    sut = new TransactionOwnerGuard(
      transactionServiceMock as any
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return true if user is an owner of given transaction', async () => {
    const result = await sut.canActivate(executionContextMock as any);
    expect(result).toBe(true);
  });

  it('should throw NotFoundException if no transactionId provided',  () => {
    jest.spyOn(executionContextMock, 'switchToHttp').mockReturnValueOnce({
      getRequest: jest.fn().mockReturnValueOnce({
        userId: members[0].getId(),
        params: {
          transactionId: undefined,
        }
      }),
      getResponse: jest.fn(),
    })
    sut.canActivate(executionContextMock as any).catch(err => {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Transaction ID is required');
    });
  });

  it('should throw NotFoundException if no transaction with provided Id found',  () => {
    jest.spyOn(transactionServiceMock, 'findOne').mockResolvedValueOnce(undefined);
    sut.canActivate(executionContextMock as any).catch(err => {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Transaction not found');
    });
  });

  it('should throw ForbiddenException if user is not an owner of provided transaction',  () => {
    jest.spyOn(transactionServiceMock, 'findOne').mockResolvedValueOnce(testTransactions[1]);
    sut.canActivate(executionContextMock as any).catch(err => {
      expect(err).toBeInstanceOf(ForbiddenException);
      expect(err.message).toBe('You are not the owner of this transaction');
    });
  });
})