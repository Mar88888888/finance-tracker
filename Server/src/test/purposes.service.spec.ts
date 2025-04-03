import { Test, TestingModule } from '@nestjs/testing';
import { PurposesService } from '../purposes/purposes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PurposeEntity } from '../purposes/purpose.entity';
import { UsersService } from '../users/users.service';

const mockPurposeRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const mockUsersService = {
  findOne: jest.fn(),
  create: jest.fn(),
};

describe('PurposesService', () => {
  let service: PurposesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurposesService,
        {
          provide: getRepositoryToken(PurposeEntity),
          useValue: mockPurposeRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<PurposesService>(PurposesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});