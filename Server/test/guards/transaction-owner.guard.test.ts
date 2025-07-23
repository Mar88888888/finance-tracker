import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { createUserModels } from '../fixtures/users.fixture';
import { TransactionOwnerGuard } from '../../src/guards/transaction-owner.guard';
import { UserModel } from '../../src/users/user.model';
import { transactionsServiceMock } from '../mocks/services/transactions.service.mock';
import { executionContextMock } from '../mocks/execution-context.mock';
import { TransactionModel } from '../../src/transactions/transaction.model';
import { createTransactionModels } from '../fixtures/transactions.fixtures';

describe('Auth Guard', () => {
  let sut: TransactionOwnerGuard;
  let userModels: UserModel[];
  let transactionModels: TransactionModel[];

  beforeEach(() => {
    sut = new TransactionOwnerGuard(transactionsServiceMock as any);

    userModels = createUserModels();
    transactionModels = createTransactionModels();
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

  it('should throw NotFoundException if no transactionId provided', () => {
    jest.spyOn(executionContextMock, 'switchToHttp').mockReturnValueOnce({
      getRequest: jest.fn().mockReturnValueOnce({
        userId: userModels[0].id,
        params: {
          transactionId: undefined,
        },
      }),
      getResponse: jest.fn(),
    });
    sut.canActivate(executionContextMock as any).catch((err) => {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Transaction ID is required');
    });
  });

  it('should throw NotFoundException if no transaction with provided Id found', () => {
    transactionsServiceMock.findOne.mockResolvedValueOnce(undefined);
    sut.canActivate(executionContextMock as any).catch((err) => {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Transaction not found');
    });
  });

  it('should throw ForbiddenException if user is not an owner of provided transaction', () => {
    transactionsServiceMock.findOne.mockResolvedValueOnce(transactionModels[1]);
    sut.canActivate(executionContextMock as any).catch((err) => {
      expect(err).toBeInstanceOf(ForbiddenException);
      expect(err.message).toBe('You are not the owner of this transaction');
    });
  });
});
