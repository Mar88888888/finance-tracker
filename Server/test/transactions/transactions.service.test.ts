import 'reflect-metadata';
import { GroupModel } from '../../src/groups/group.model';
import {
  OrderBy,
  TransactionFilterDto,
} from '../../src/transactions/dto/transaction-filter.dto';
import { TransactionEntity } from '../../src/transactions/transaction.entity';
import { TransactionModel } from '../../src/transactions/transaction.model';
import { TransactionsService } from '../../src/transactions/transactions.service';
import { UserModel } from '../../src/users/user.model';
import { createGroupModels } from '../fixtures/groups.fixtures';
import {
  createTransactionEntities,
  createTransactionModels,
} from '../fixtures/transactions.fixtures';
import { createUserModels } from '../fixtures/users.fixture';
import { RepoMock } from '../mocks/repos/repo.mock.interface';
import {
  createTransactionRepoMock,
  mockQb,
} from '../mocks/repos/transactions.repo.mock';
import { currencyServiceMock } from '../mocks/services/currency.service.mock';
import { purposeServiceMock } from '../mocks/services/purpose.service.mock';
import { usersServiceMock } from '../mocks/services/users.service.mock';
import { format as mockCsvFormat } from 'fast-csv';
import { CreateTransactionDto } from '../../src/transactions/dto/create-transaction.dto';
import { CurrencyCode } from '../../src/currency/currency-code.enum';
import { UserEntity } from '../../src/users/user.entity';
import { PurposeEntity } from '../../src/purposes/purpose.entity';
import { QueryFailedError } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { PurposeModel } from '../../src/purposes/purpose.model';

jest.mock('fast-csv', () => ({
  format: jest.fn(),
}));

const baseFilter: TransactionFilterDto = {
  orderBy: OrderBy.DATE,
  sortOrder: 'DESC',
  purposes: [1, 2, 3],
};

const cases: {
  name: string;
  filter: Partial<TransactionFilterDto>;
  expectedAmount: string;
  expectedDate: string;
}[] = [
  {
    name: 'only startDate is set',
    filter: { startDate: '2000-01-01' },
    expectedAmount: 'undefined',
    expectedDate: 'MoreThan',
  },
  {
    name: 'only endDate is set',
    filter: { endDate: '2003-01-01' },
    expectedAmount: 'undefined',
    expectedDate: 'LessThan',
  },
  {
    name: 'startDate and endDate are set',
    filter: { startDate: '2000-01-01', endDate: '2003-01-01' },
    expectedAmount: 'undefined',
    expectedDate: 'Between',
  },
  {
    name: 'only minAmount is set',
    filter: { minAmount: 100 },
    expectedAmount: 'MoreThan',
    expectedDate: 'undefined',
  },
  {
    name: 'only maxAmount is set',
    filter: { maxAmount: 500 },
    expectedAmount: 'LessThan',
    expectedDate: 'undefined',
  },
  {
    name: 'minAmount and maxAmount are set',
    filter: { minAmount: 100, maxAmount: 500 },
    expectedAmount: 'Between',
    expectedDate: 'undefined',
  },
  {
    name: 'purposes are not included in purposeIds',
    filter: { purposes: [999] },
    expectedAmount: 'undefined',
    expectedDate: 'undefined',
  },
];

describe('Transactions Service', () => {
  let sut: TransactionsService;
  let transactionsRepoMock: RepoMock<TransactionEntity>;
  let transactionEntities: TransactionEntity[];
  let transactionModels: TransactionModel[];
  let userModels: UserModel[];
  let groupModels: GroupModel[];

  beforeEach(() => {
    transactionModels = createTransactionModels();
    transactionEntities = createTransactionEntities(transactionModels);
    transactionsRepoMock = createTransactionRepoMock(transactionEntities);
    userModels = createUserModels();
    groupModels = createGroupModels();

    sut = new TransactionsService(
      transactionsRepoMock as any,
      purposeServiceMock as any,
      usersServiceMock as any,
      currencyServiceMock as any,
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return all transactions with relations', async () => {
    const result = await sut.findAll();

    expect(result).toEqual(transactionModels);
    result.map((transaction) => {
      expect(transaction.getUserId()).toBeDefined();
      expect(transaction.getPurposeId()).toBeDefined();
    });
  });

  it('should return transactions for given user', async () => {
    const userId = userModels[0].getId();
    const result = await sut.getUserTransactions(userId);

    expect(result).toEqual(transactionModels);
    expect(transactionsRepoMock.find).toHaveBeenCalledWith({
      where: { member: { id: userId } },
      order: { date: 'DESC' },
      relations: ['purpose', 'member'],
    });
  });

  it('should return transactions for given group', async () => {
    const transactionFilters: TransactionFilterDto = {
      maxAmount: 500,
      minAmount: 200,
      startDate: '01-01-2001',
      endDate: '01-01-2003',
      purposes: [1, 2, 3, 4, 5],
      orderBy: OrderBy.DATE,
      sortOrder: 'DESC',
    };

    const result = await sut.getGroupTransactions(
      groupModels[0],
      transactionFilters,
    );

    expect(result).toEqual(transactionModels);
    expect(transactionsRepoMock.find).toHaveBeenCalled();
  });
  it('should return empty array if given group has no members or purposes', async () => {
    groupModels[0].setMembers([]);
    const result = await sut.getGroupTransactions(groupModels[0], {});
    expect(result).toEqual([]);
  });

  it.each(cases)('should process edge case: $name', async ({ filter }) => {
    const group = groupModels[0];
    const filters: TransactionFilterDto = {
      ...baseFilter,
      ...filter,
    };

    await sut.getGroupTransactions(group, filters);

    expect(transactionsRepoMock.find).toHaveBeenCalled();

    const callArgs = transactionsRepoMock.find.mock.calls[0][0];

    if (filter.minAmount && filter.maxAmount) {
      expect(callArgs.where.sum.type).toBe('between');
    } else if (filter.minAmount) {
      expect(callArgs.where.sum.type).toBe('moreThan');
    } else if (filter.maxAmount) {
      expect(callArgs.where.sum.type).toBe('lessThan');
    }
    if (filter.startDate && filter.endDate) {
      expect(callArgs.where.date.type).toBe('between');
    } else if (filter.startDate) {
      expect(callArgs.where.date.type).toBe('moreThan');
    } else if (filter.endDate) {
      expect(callArgs.where.date.type).toBe('lessThan');
    }
  });

  it('writes proper CSV and ends stream', async () => {
    const write = jest.fn();
    const pipe = jest.fn();
    const end = jest.fn();

    (mockCsvFormat as jest.Mock).mockReturnValue({ write, pipe, end });

    await sut.exportToCsv(transactionModels, {} as any);

    expect(pipe).toHaveBeenCalled();
    expect(write).toHaveBeenCalledWith(
      expect.objectContaining({
        ID: transactionModels[0].getId(),
        Date: transactionModels[0].getDate().toISOString().split('T')[0],
        Sum: transactionModels[0].getSum(),
        Purpose: 'Purpose 1',
        Member: 'SomeName',
      }),
    );
    expect(end).toHaveBeenCalled();
  });

  it('should call where and andWhere with correct filters', async () => {
    const mockTransactions = transactionEntities;
    mockQb.getMany.mockResolvedValue(mockTransactions);

    const queryParams: TransactionFilterDto = {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      minAmount: 100,
      maxAmount: 500,
      purposes: [1, 2],
      orderBy: OrderBy.SUM,
    };

    const result = await sut.find(1, queryParams);

    expect(transactionsRepoMock.createQueryBuilder).toHaveBeenCalledWith(
      'transaction',
    );

    expect(mockQb.where).toHaveBeenCalledWith('member.id = :userId', {
      userId: 1,
    });
    expect(mockQb.andWhere).toHaveBeenCalledWith(
      'transaction.date >= :startDate',
      { startDate: '2024-01-01' },
    );
    expect(mockQb.andWhere).toHaveBeenCalledWith(
      'transaction.date <= :endDate',
      { endDate: '2024-12-31' },
    );
    expect(mockQb.andWhere).toHaveBeenCalledWith(
      'transaction.sum >= :minAmount',
      { minAmount: 100 },
    );
    expect(mockQb.andWhere).toHaveBeenCalledWith(
      'transaction.sum <= :maxAmount',
      { maxAmount: 500 },
    );
    expect(mockQb.andWhere).toHaveBeenCalledWith(
      'purpose.id IN (:...purposes)',
      { purposes: [1, 2] },
    );

    expect(mockQb.orderBy).toHaveBeenCalledWith('transaction.sum', 'ASC');
    expect(mockQb.getMany).toHaveBeenCalled();
    expect(result).toEqual(mockTransactions.map(TransactionModel.fromEntity));
  });

  describe('create', () => {
    it('creates and returns a transaction', async () => {
      const userId = 1;
      const dto: CreateTransactionDto = {
        purposeId: 1,
        sum: 100,
        currency: CurrencyCode.USD,
        date: new Date('2024-01-01'),
      };

      const mockCurrency = {
        code: CurrencyCode.USD,
        name: 'USD',
        transactions: [],
      };
      const exchangeRate = 1.5;

      const mockEntity = {
        id: 1,
        ...dto,
        member: { id: userId } as UserEntity,
        currency: mockCurrency,
        purpose: purposeServiceMock.findOne(),
        usdEquivalent: dto.sum * exchangeRate,
      };

      currencyServiceMock.getCurrencyEntity.mockResolvedValue(mockCurrency);
      currencyServiceMock.getExchangeRateToUSD.mockResolvedValue(exchangeRate);
      transactionsRepoMock.create.mockReturnValue(mockEntity);
      transactionsRepoMock.save.mockResolvedValue(mockEntity);

      const result = await sut.create(userId, dto);

      expect(purposeServiceMock.findOne).toHaveBeenCalledWith(dto.purposeId);
      expect(currencyServiceMock.getCurrencyEntity).toHaveBeenCalledWith(
        dto.currency,
      );
      expect(currencyServiceMock.getExchangeRateToUSD).toHaveBeenCalledWith(
        'USD',
        '2024-01-01',
      );
      expect(transactionsRepoMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          sum: dto.sum,
          member: { id: userId },
        }),
      );
      expect(transactionsRepoMock.save).toHaveBeenCalledWith(mockEntity);
      expect(result).toEqual(TransactionModel.fromEntity(mockEntity));
    });

    it('throws ConflictException on duplicate error', async () => {
      const dto = {
        purposeId: 1,
        sum: 100,
        currency: CurrencyCode.USD,
        date: new Date(),
      };

      currencyServiceMock.getCurrencyEntity.mockResolvedValue({});
      currencyServiceMock.getExchangeRateToUSD.mockResolvedValue(1);
      transactionsRepoMock.create.mockReturnValue({} as TransactionEntity);

      const conflictError = new QueryFailedError('', [], {
        code: '23505',
      } as any);

      transactionsRepoMock.save.mockRejectedValue(conflictError);

      await expect(sut.create(1, dto)).rejects.toThrow(
        'Transaction with these values already exists.',
      );
    });

    it('throws InternalServerErrorException on unexpected error', async () => {
      const dto = {
        purposeId: 1,
        sum: 100,
        currency: CurrencyCode.USD,
        date: new Date(),
      };

      purposeServiceMock.findOne.mockRejectedValueOnce(
        new Error('Unexpected fail'),
      );

      await expect(sut.create(1, dto)).rejects.toThrow(
        'Failed to create transaction',
      );
    });
  });

  describe('findOne', () => {
    it('should return transaction model if found', async () => {
      const modelSpy = jest
        .spyOn(TransactionModel, 'fromEntity')
        .mockReturnValueOnce({ id: 1 } as any);

      const result = await sut.findOne(1);

      expect(transactionsRepoMock.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['member', 'purpose'],
      });
      expect(modelSpy).toHaveBeenCalledWith(transactionEntities[0]);
      expect(result).toEqual({ id: 1 });
    });

    it('should throw NotFoundException if transaction not found', async () => {
      transactionsRepoMock.findOne.mockResolvedValueOnce(null);

      await expect(sut.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const transactionId = 1;
    const existingTransaction = createTransactionModels()[0];
    const updatedDto = {
      sum: 200,
      date: new Date('2025-01-01'),
      purposeId: 2,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update transaction with new fields and purpose', async () => {
      jest.spyOn(sut, 'findOne').mockResolvedValueOnce(existingTransaction);

      transactionsRepoMock.save.mockImplementationOnce(
        async (entity) => entity,
      );

      const result = await sut.update(transactionId, updatedDto);
      expect(sut.findOne).toHaveBeenCalledWith(transactionId);
      expect(purposeServiceMock.findOne).toHaveBeenCalledWith(
        updatedDto.purposeId,
      );
      expect(transactionsRepoMock.save).toHaveBeenCalled();

      const expectedPurpose: PurposeModel = await purposeServiceMock.findOne();

      expect(result.getSum()).toBe(updatedDto.sum);
      expect(result.getPurposeId()).toBe(expectedPurpose.getId());
    });

    it('should update transaction without changing purpose if purposeId not provided', async () => {
      const partialDto = { sum: 150 };

      jest.spyOn(sut, 'findOne').mockResolvedValue(existingTransaction);
      transactionsRepoMock.save.mockImplementation(async (entity) => entity);

      const result = await sut.update(transactionId, partialDto);

      expect(sut.findOne).toHaveBeenCalledWith(transactionId);
      expect(purposeServiceMock.findOne).not.toHaveBeenCalled();
      expect(transactionsRepoMock.save).toHaveBeenCalled();

      expect(result.getSum()).toBe(partialDto.sum);
      expect(result.getPurposeId()).toBe(existingTransaction.getPurposeId());
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest
        .spyOn(sut, 'findOne')
        .mockRejectedValue(new Error('Failed to update transaction'));

      await expect(sut.update(transactionId, updatedDto)).rejects.toThrow(
        'Failed to update transaction',
      );
    });
  });

  describe('remove', () => {
    it('should call transactionRepository.delete with the correct id', async () => {
      const id = 42;
      const deleteMock = jest
        .spyOn(transactionsRepoMock, 'delete')
        .mockResolvedValue({} as any);

      await sut.remove(id);

      expect(deleteMock).toHaveBeenCalledWith(id);
      expect(deleteMock).toHaveBeenCalledTimes(1);
    });
  });
});
