import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from '../groups/groups.service';
import * as crypto from 'crypto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GroupEntity } from '../groups/group.entity';
import { UsersService } from '../users/users.service';
import { TransactionsService } from '../transactions/transactions.service';

describe('GroupsService', () => {
  let service: GroupsService;

  const mockGroupRepository = {};
  const mockUsersService = {};
  const mockTransactionsService = {};


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupsService,
        {
          provide: getRepositoryToken(GroupEntity),
          useValue: mockGroupRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  it('should generate a join code of 8 hexadecimal characters', () => {
    const mockRandomBytes = Buffer.from([0x01, 0x23, 0x45, 0x67]);

    const spy = jest.spyOn(crypto, 'randomBytes');
    spy.mockImplementation(() => mockRandomBytes);

    const joinCode = (service as any).generateJoinCode();

    expect(joinCode).toHaveLength(8);
    expect(joinCode).toMatch(/^[0-9a-f]{8}$/);
    expect(joinCode).toBe('01234567');

    spy.mockRestore();
  });
});