import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../src/users/auth.service';
import { CreateUserDto } from '../../src/users/dto/create.user.dto';
import { jwtServiceMock } from '../mocks/services/jwt.service.mock';
import { usersServiceMock } from '../mocks/services/users.service.mock';
import { UserModel } from '../../src/users/user.model';
import { LoginUserDto } from '../../src/users/dto/login.user.dto';
import { scryptSync } from 'crypto';
import { emitWarning } from 'process';
import { TokenExpiredError } from '@nestjs/jwt';

describe('Auth Service', () => {
  let sut: AuthService;

  beforeEach(() => {
    sut = new AuthService(usersServiceMock as any, jwtServiceMock as any);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('sign up', () => {
    it('should throw BadRequestException if email is already in use', async () => {
      usersServiceMock.find.mockResolvedValueOnce([{}]);
      const dto: CreateUserDto = {
        email: 'test@example.com',
        password: 'pass123',
        name: 'name',
      };

      await expect(sut.signup(dto)).rejects.toThrow(BadRequestException);
    });
    it('should hash password and create and update the user', async () => {
      usersServiceMock.find.mockResolvedValueOnce([]);

      const createdUser = {
        id: 1,
      } as unknown as UserModel;

      usersServiceMock.create.mockResolvedValue(createdUser);
      usersServiceMock.update.mockResolvedValue(undefined);

      const dto: CreateUserDto = {
        email: 'test@example.com',
        password: 'myPassword',
        name: 'userName',
      };

      const result = await sut.signup({ ...dto });

      expect(usersServiceMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: dto.email,
          password: expect.stringMatching(/^[a-f0-9]+\.([a-f0-9])+$/),
        }),
      );

      expect(usersServiceMock.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          email: dto.email,
          password: expect.stringMatching(/^[a-f0-9]+\.[a-f0-9]+$/),
        }),
      );

      expect(result).toBe(createdUser);
    });
  });

  describe('sign in', () => {
    it('should throw BadRequestException if no user with given email found', async () => {
      usersServiceMock.find.mockResolvedValueOnce([]);

      const loginDto: LoginUserDto = {
        email: 'email',
        password: 'password',
      };

      await expect(sut.signin(loginDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if password is invalid', async () => {
      const salt = 'salt';
      const wrongHash = scryptSync('wrong', salt, 32).toString('hex');
      const storedHash = scryptSync('pass', salt, 32).toString('hex');
      const fakeUser = {
        password: `${salt}.${storedHash}`,
        id: 1,
      };
      usersServiceMock.find.mockResolvedValueOnce([fakeUser]);

      await expect(
        sut.signin({ email: 'a@a.com', password: 'wrong' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return accessToken and user if credentials are valid', async () => {
      const salt = 'salt';
      const hash = scryptSync('pass', salt, 32).toString('hex');
      const fakeUser = {
        password: `${salt}.${hash}`,
        id: 1,
      };
      usersServiceMock.find.mockResolvedValueOnce([fakeUser]);
      jwtServiceMock.sign.mockReturnValueOnce('jwt-token');

      const result = await sut.signin({
        email: 'a@a.com',
        password: 'pass',
      });

      expect(result).toEqual({ token: 'jwt-token', user: fakeUser });
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({ sub: 1 });
    });
  });

  it('should generate a token', () => {
    const expectedToken = jwtServiceMock.sign();

    const result = sut.generateJwtToken({ sub: 1 });

    expect(result).toBe(expectedToken);
  });

  describe('validateGoogleUser', () => {
    it('should return user by google credentials if exists', async () => {
      const googleData = {
        email: 'email.com',
        name: 'name',
      };

      const expectedUser = (await usersServiceMock.find())[0];

      const result = await sut.validateGoogleUser(googleData);

      expect(result).toEqual(expectedUser);
    });

    it('should create new user by google credentials if not exists', async () => {
      const googleData = {
        email: 'email.com',
        name: 'name',
      };

      usersServiceMock.find.mockResolvedValueOnce([]);

      const expectedUser = await usersServiceMock.create();

      const result = await sut.validateGoogleUser(googleData);

      expect(result).toEqual(expectedUser);
    });
  });

  describe('getUserFromToken', () => {
    it('should return user when token is valid', async () => {
      const token = 'valid-token';
      const fakePayload = { sub: 1 };
      const fakeUser = { id: 1, email: 'test@example.com' };

      jwtServiceMock.verify.mockReturnValue(fakePayload);
      usersServiceMock.findOne.mockResolvedValueOnce(fakeUser);

      const result = await sut.getUserFromToken(token);

      expect(jwtServiceMock.verify).toHaveBeenCalledWith(token);
      expect(usersServiceMock.findOne).toHaveBeenCalledWith(1);
      expect(result).toBe(fakeUser);
    });

    it('should throw UnauthorizedException if token is expired', async () => {
      const token = 'expired-token';
      const expiredError = new Error('jwt expired');

      jwtServiceMock.verify.mockImplementation(() => {
        throw expiredError;
      });

      await expect(sut.getUserFromToken(token)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
