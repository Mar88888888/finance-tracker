import { ExecutionContext, ForbiddenException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { groupModels } from "../fixtures/groups.fixtures";
import { members } from "../fixtures/users.fixture";
import { GroupOwnerGuard } from "../../src/guards/group-owner.guard";

const groupsServiceMock = {
  findOne: jest.fn().mockResolvedValue(groupModels[1])
};

const executionContextMock: Partial<
  Record<
    jest.FunctionPropertyNames<ExecutionContext>,
    jest.MockedFunction<any>
  >
> = {
  switchToHttp: jest.fn().mockReturnValue({
    getRequest: jest.fn().mockReturnValue({
      userId: members[0].getId(),
      params: {
        groupId: groupModels[1].getId(),
      }
    }),
    getResponse: jest.fn(),
  }),
};


describe('Auth Guard', () => {
  let sut: GroupOwnerGuard;

  beforeEach(() => {
    sut = new GroupOwnerGuard(
      groupsServiceMock as any
    );
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
        userId: members[0].getId(),
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