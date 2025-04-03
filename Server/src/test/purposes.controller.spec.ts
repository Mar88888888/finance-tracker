import { Test, TestingModule } from '@nestjs/testing';
import { PurposesController } from '../purposes/purposes.controller';
import { PurposesService } from '../purposes/purposes.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

describe('PurposesController', () => {
  let controller: PurposesController;

  const mockPurposesService = {};
  const mockJWTService = {};
  const mockUsersService = {};
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurposesController],
      providers: [
        {
          provide: PurposesService,
          useValue: mockPurposesService,
        },
        {
          provide: JwtService,
          useValue: mockJWTService
        },
        {
          provide: UsersService,
          useValue: mockUsersService
        }
      ],
    }).compile();

    controller = module.get<PurposesController>(PurposesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});