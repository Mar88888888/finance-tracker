import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionsController } from '../transactions/transactions.controller';

describe('TransactionsController', () => {
  let controller: TransactionsController;

  const mockJwtService = {};
  const mockUsersService = {};
  const mockTransactionsService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ]
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
