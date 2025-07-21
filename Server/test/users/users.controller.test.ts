import { CreateUserDto } from '../../src/users/dto/create.user.dto';
import { LoginUserDto } from '../../src/users/dto/login.user.dto';
import { UsersController } from '../../src/users/users.controller';
import { authorizedRequest } from '../mocks/authorized-request.mock';
import { authServiceMock } from '../mocks/services/auth.service.mock';
import { usersServiceMock } from '../mocks/services/users.service.mock';

describe('Users Controller', () => {
  let sut: UsersController;

  beforeEach(() => {
    sut = new UsersController(usersServiceMock as any, authServiceMock as any);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return user by id', async () => {
    const result = await sut.findOne(1);

    const expected = await usersServiceMock.findOne();

    expect(result).toEqual(expected);
  });

  it('should create user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'name',
      password: 'password',
      email: 'email',
    };
    const result = await sut.createUser(createUserDto);

    const expected = await authServiceMock.signup();

    expect(result).toEqual(expected);
    expect(authServiceMock.signup).toHaveBeenCalledWith(createUserDto);
  });

  it('should sign user in and return token', async () => {
    const loginDto: LoginUserDto = {
      email: 'email',
      password: 'password',
    };

    const result = await sut.signin(loginDto);

    const expected = await authServiceMock.signin();

    expect(result).toEqual(expected);
  });

  it('should update user', async () => {
    const userId = 1;
    const updateUserDto = {
      name: 'name2',
    };
    const result = await sut.update(userId, updateUserDto);
    const expected = await usersServiceMock.update();

    expect(result).toEqual(expected);

    expect(usersServiceMock.update).toHaveBeenCalledWith(userId, updateUserDto);
  });

  it('should return user by token', async () => {
    const result = await sut.getUser(authorizedRequest);

    const expected = await usersServiceMock.findOne();

    expect(result).toEqual(expected);
    expect(usersServiceMock.findOne).toHaveBeenCalledWith(
      authorizedRequest.userId,
    );
  });

  it('should redirect with token after Google login', () => {
    const mockUser = { getId: () => 123 };
    const mockRequest = { user: mockUser } as any;
    const mockResponse = {
      redirect: jest.fn(),
    } as any;

    sut.googleAuthRedirect(mockRequest, mockResponse);

    expect(authServiceMock.generateJwtToken).toHaveBeenCalledWith({ sub: 123 });
    expect(mockResponse.redirect).toHaveBeenCalledWith(
      `${process.env.FRONTEND_URL}/oauth2-redirect?token=token`,
    );
  });

  it('should trigger google auth guard', async () => {
    await sut.googleAuth();
  });
});
