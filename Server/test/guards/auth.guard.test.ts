import { ExecutionContext, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "../../src/guards/auth.guard"
import { usersServiceMock } from "../mocks/services/users.service.mock";

const jwtServiceMock = {
  verifyAsync: jest.fn().mockResolvedValue({sub: 5}),
};

let tokenMock = 'someToken';

const executionContextMock: Partial<
  Record<
    jest.FunctionPropertyNames<ExecutionContext>,
    jest.MockedFunction<any>
  >
> = {
  switchToHttp: jest.fn().mockReturnValue({
    getRequest: jest.fn().mockReturnValue({
      headers: {
        authorization: `Bearer ${tokenMock}`
      }
    }),
    getResponse: jest.fn(),
  }),
};


describe('Auth Guard', () => {
  let sut: AuthGuard;

  beforeEach(() => {
    sut = new AuthGuard(
      jwtServiceMock as any,
      usersServiceMock as any
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return true if token is valid', async () => {
    const result = await sut.canActivate(executionContextMock as any);
    expect(result).toBe(true);
  })

  it('should throw unauthorized exception if no auth header provided', () => {
    jest.spyOn(executionContextMock, 'switchToHttp').mockReturnValueOnce({
      getRequest: jest.fn().mockReturnValueOnce({
        headers: {}
      }),
      getResponse: jest.fn(),
    })
    sut
      .canActivate(executionContextMock as any)
      .catch(err => expect(err).toBeInstanceOf(UnauthorizedException));
  });

  it('should throw unauthorized exception if no token provided', () => {
    tokenMock = '';
    jest.spyOn(executionContextMock, 'switchToHttp').mockReturnValueOnce({
      getRequest: jest.fn().mockReturnValueOnce({
        headers: {
          authorization: `Bearer ${tokenMock}`
        }
      }),
      getResponse: jest.fn(),
    })
    sut
      .canActivate(executionContextMock as any)
      .catch(err => expect(err).toBeInstanceOf(UnauthorizedException));
  });


  it('should throw unauthorized exception if no user with given id found', () => {
    jest.spyOn(usersServiceMock, 'findOne').mockImplementationOnce(async () => {
      throw new NotFoundException();
    });
    sut
      .canActivate(executionContextMock as any)
      .catch(err => expect(err).toBeInstanceOf(UnauthorizedException));
  });
})