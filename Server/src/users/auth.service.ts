import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create.user.dto';
import { InnerUserUpdateDto } from './dto/inner-update.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { UserModel } from './user.model';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(userDto: CreateUserDto) {
    const users = await this.usersService.find({ email: userDto.email });
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(userDto.password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    userDto.password = result;

    const user = await this.usersService.create(userDto);

    let createdUser = new InnerUserUpdateDto();
    Object.assign(createdUser, userDto);

    await this.usersService.update(user.id, createdUser);
    return user;
  }

  async signin(userDto: LoginUserDto) {
    const { email, password } = userDto;
    const [user] = await this.usersService.find({ email });
    if (!user) {
      throw new BadRequestException(`Invalid credentials`);
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid credentials');
    }
    const payload = { sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return { token: accessToken, user };
  }

  public generateJwtToken(payload: { sub: number }): string {
    return this.jwtService.sign(payload);
  }

  async validateGoogleUser(googleData: { email: string; name: string }) {
    let user = (await this.usersService.find({ email: googleData.email }))[0];

    if (!user) {
      user = await this.usersService.create({
        email: googleData.email,
        password: '',
        name: googleData.name,
      });
    }

    return user;
  }

  async getUserFromToken(token: string): Promise<UserModel> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findOne(payload.sub);

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
