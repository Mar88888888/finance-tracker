import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from '../transactions/transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionEntity } from '../transactions/transaction.entity';
import { PurposesService } from '../purposes/purposes.service';

describe('TransactionsService', () => {
  let service: TransactionsService;

  const mockTransactionRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
  const mockPurposesService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionsService,
        {
          provide: getRepositoryToken(TransactionEntity),
          useValue: mockTransactionRepository,
        },
        {
          provide: PurposesService,
          useValue: mockPurposesService,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
