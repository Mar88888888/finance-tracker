import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from '../groups/groups.controller';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { GroupsService } from '../groups/groups.service';

describe('GroupsController', () => {
  let controller: GroupsController;

  const mockJwtService = {};
  const mockUsersService = {};
  const mockGroupsService = {};
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        {
          provide: GroupsService,
          useValue: mockGroupsService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
