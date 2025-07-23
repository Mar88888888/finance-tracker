import { CurrencyCode } from '../../src/currency/currency-code.enum';
import { CreateSubscriptionDto } from '../../src/subscriptions/dto/create-subscription.dto';
import { RecurrenceUnit } from '../../src/subscriptions/subscription.entity';
import { CreateTransactionDto } from '../../src/transactions/dto/create-transaction.dto';
import { TransactionFilterDto } from '../../src/transactions/dto/transaction-filter.dto';
import { TransactionModel } from '../../src/transactions/transaction.model';
import { TransactionsController } from '../../src/transactions/transactions.controller';
import { createTransactionModels } from '../fixtures/transactions.fixtures';
import { authorizedRequest } from '../mocks/authorized-request.mock';
import { subscriptionsServiceMock } from '../mocks/services/subscriptions.service.mock';
import { transactionsServiceMock } from '../mocks/services/transactions.service.mock';
import { usersServiceMock } from '../mocks/services/users.service.mock';

describe('Transactions Controller', () => {
  let sut: TransactionsController;
  let transactionModels: TransactionModel[];
  const filterDto: TransactionFilterDto = {
    startDate: '01-02-2003',
    maxAmount: 500,
  };

  beforeEach(() => {
    transactionModels = createTransactionModels();

    sut = new TransactionsController(
      transactionsServiceMock as any,
      usersServiceMock as any,
      subscriptionsServiceMock as any,
      subscriptionsServiceMock as any,
    );
  });

  it('should find transactions', async () => {
    const result = await sut.find(authorizedRequest, filterDto);

    expect(transactionsServiceMock.find).toHaveBeenCalledWith(
      authorizedRequest.userId,
      filterDto,
    );
    expect(result).toEqual(transactionModels);
  });

  it('should call find and exportToCsv, set headers correctly', async () => {
    const mockRes = {
      setHeader: jest.fn(),
    } as any;

    const findSpy = jest
      .spyOn(transactionsServiceMock, 'find')
      .mockResolvedValueOnce(transactionModels);

    const exportSpy = jest
      .spyOn(transactionsServiceMock, 'exportToCsv')
      .mockResolvedValueOnce(undefined);

    await sut.exportTransactions(authorizedRequest, filterDto, mockRes);

    expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
    expect(mockRes.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename=transactions.csv',
    );
    expect(findSpy).toHaveBeenCalledWith(authorizedRequest.userId, filterDto);
    expect(exportSpy).toHaveBeenCalledWith(transactionModels, mockRes);
  });

  it('should create a transaction and set location header', async () => {
    const createDto: CreateTransactionDto = {
      sum: 500,
      date: new Date('01-01-2001'),
      currency: CurrencyCode.EUR,
      purposeId: 1,
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      header: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await sut.create(createDto, authorizedRequest, res as any);

    expect(transactionsServiceMock.create).toHaveBeenCalledWith(
      authorizedRequest.userId,
      createDto,
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.header).toHaveBeenCalledWith(
      'Location',
      `/transactions/${transactionModels[0].id}`,
    );
    expect(res.json).toHaveBeenCalledWith(transactionModels[0]);
  });

  it('should return user for transaction owner', async () => {
    const result = await sut.getUser(1);

    expect(transactionsServiceMock.findOne).toHaveBeenCalledWith(1);
    expect(usersServiceMock.findOne).toHaveBeenCalledWith(
      transactionModels[0].userId,
    );
    expect(result).toEqual(await usersServiceMock.findOne());
  });

  it('should return a transaction by Id', async () => {
    const result = await sut.findOne(1);

    expect(result).toEqual(await transactionsServiceMock.findOne());
  });

  it('should call update service method and return updated transaction', async () => {
    const result = await sut.update(1, {});

    expect(transactionsServiceMock.update).toHaveBeenCalledWith(1, {});
    expect(result).toEqual(await transactionsServiceMock.update());
  });

  it('should delete a transaction', async () => {
    await sut.remove(1);

    expect(transactionsServiceMock.remove).toHaveBeenCalledWith(1);
  });

  it('should create a subscription for transaction', async () => {
    const createSubscriptionDto: CreateSubscriptionDto = {
      interval: 1,
      unit: RecurrenceUnit.DAY,
      startDate: new Date('01-01-2001'),
    };
    const result = await sut.createSubscription(
      authorizedRequest,
      createSubscriptionDto,
      1,
    );

    expect(result).toEqual(await subscriptionsServiceMock.createSubscription());
    expect(subscriptionsServiceMock.createSubscription).toHaveBeenCalledWith(
      authorizedRequest.userId,
      1,
      createSubscriptionDto,
    );
  });
});
