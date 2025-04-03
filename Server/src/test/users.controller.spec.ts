import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users/users.controller';
import { AuthService } from '../users/auth.service';
import { UsersService } from '../users/users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {};
  const mockAuthService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
