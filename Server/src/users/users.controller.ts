import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  ParseIntPipe,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.user.dto';
import { UserSerializeDto } from './dto/serialize.user.dto';
import { UserModel } from './user.model';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { AuthGuard as JwtAuthGuard } from '../guards/auth.guard';
import { IGoogleAuthorizedRequest } from './abstracts/google-authorized-request.interface';
import { IAuthorizedRequest } from '../abstracts/authorized-request.interface';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UserSerializeDto })
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserModel> {
    return await this.usersService.findOne(id);
  }

  @Post('/auth/signup')
  async createUser(@Body() userDto: CreateUserDto): Promise<UserModel> {
    return await this.authService.signup(userDto);
  }

  @SerializeOptions({ type: LoginResponseDto })
  @Post('/auth/signin')
  async signin(@Body() signinDto: LoginUserDto): Promise<LoginResponseDto> {
    return await this.authService.signin(signinDto);
  }

  @Patch('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserModel> {
    return await this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/auth/bytoken')
  async getUser(@Req() req: IAuthorizedRequest) {
    return this.usersService.findOne(req.userId);
  }

  @Get('/auth/google')
  @UseGuards(PassportAuthGuard('google'))
  async googleAuth() {}

  @Get('/auth/google/redirect')
  @UseGuards(PassportAuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: IGoogleAuthorizedRequest,
    @Res() res: Response,
  ) {
    const user = req.user;
    const token = this.authService.generateJwtToken({ sub: user.id });

    return res.redirect(
      `${process.env.FRONTEND_URL}/oauth2-redirect?token=${token}`,
    );
  }
}
