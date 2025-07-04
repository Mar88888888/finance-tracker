import { ExecutionContext, ForbiddenException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { GroupOwnerGuard } from "../../src/guards/group-owner.guard";
import { UserModel } from "../../src/users/user.model";
import { GroupModel } from "../../src/groups/group.model";
import { createUserModels } from "../fixtures/users.fixture";
import { createGroupModels } from "../fixtures/groups.fixtures";
import { groupsServiceMock } from "../mocks/services/groups.service.mock";
import { executionContextMock } from "../mocks/execution-context.mock";


describe('Auth Guard', () => {
  let sut: GroupOwnerGuard;
  let userModels: UserModel[];
  let groupModels: GroupModel[];
  
  beforeEach(() => {
    sut = new GroupOwnerGuard(
      groupsServiceMock as any
    );

    userModels = createUserModels();
    groupModels = createGroupModels();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return true if user is an owner of given group', async () => {
    const result = await sut.canActivate(executionContextMock as any);
    expect(result).toBe(true);
  });

  it('should throw NotFoundException if no groupId provided',  () => {
    jest.spyOn(executionContextMock, 'switchToHttp').mockReturnValueOnce({
      getRequest: jest.fn().mockReturnValueOnce({
        userId: userModels[0].getId(),
        params: {
          groupId: undefined,
        }
      }),
      getResponse: jest.fn(),
    })
    sut.canActivate(executionContextMock as any).catch(err => {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Group ID is required');
    });
  });

  it('should throw NotFoundException if no group with provided Id found',  () => {
    jest.spyOn(groupsServiceMock, 'findOne').mockResolvedValueOnce(undefined);
    sut.canActivate(executionContextMock as any).catch(err => {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Group not found');
    });
  });

  it('should throw ForbiddenException if user is not a owner of provided group',  () => {
    jest.spyOn(groupsServiceMock, 'findOne').mockResolvedValueOnce(groupModels[2]);
    sut.canActivate(executionContextMock as any).catch(err => {
      expect(err).toBeInstanceOf(ForbiddenException);
      expect(err.message).toBe('You are not the owner of this group');
    });
  });
})