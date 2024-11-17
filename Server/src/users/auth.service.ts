import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { MailService } from '../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create.user.dto';
import { InnerUserUpdateDto } from './dto/inner-update.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { UserModel } from './user.model';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}  

  async signup(userDto: CreateUserDto) {
    const users = await this.usersService.find({email: userDto.email});
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(userDto.password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    userDto.password = result;
    
    const user = await this.usersService.create(userDto);

    const verificationToken = uuidv4();
    let createdUser = new InnerUserUpdateDto();
    Object.assign(createdUser, userDto)
    createdUser.verificationToken = verificationToken;
    
    await this.usersService.update(user.getId(), createdUser);
    // await this.mailService.sendVerificationEmail(verificationToken, user);

    // const payload = { sub: user.id, email: user.email };
    // const access_token = this.jwtService.sign(payload);

    return user;
  }

  async signin(userDto: LoginUserDto) {
    const { email, password } = userDto;
    const [user] = await this.usersService.find({email});
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const [salt, storedHash] = user.getPassword().split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }
    const payload = { sub: user.getId() };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken: accessToken, user };
  }

  async verifyEmail(token: string) {
    const [user] = (await this.usersService.find({verificationToken: token}));
    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }
    user.setIsEmailVerified(true);
    await this.usersService.updateFromModel(user.getId(), user);
    return { message: 'Email verified successfully' };
  }

  public generateJwtToken(payload: { sub: number }): string {
    return this.jwtService.sign(payload);
  }

  async getUserFromToken(token: string): Promise<UserModel> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}