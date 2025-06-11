import { Controller, Get, Post, Patch, Body, Param,
  NotFoundException, Req, UnauthorizedException,
  UseInterceptors, ClassSerializerInterceptor, SerializeOptions,
  ParseIntPipe, 
  UseGuards,
  Res} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.user.dto';
import { UserSerializeDto } from './dto/serialize.user.dto';
import { UserModel } from './user.model';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { IGoogleAuthorizedRequest } from './abstracts/google-authorized-request.interface';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UserSerializeDto })
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: string): Promise<UserModel> {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }



  @Post('/auth/signup')
  async createUser(
    @Body() userDto: CreateUserDto,
  ) {
    const user = await this.authService.signup(userDto);
    return user;
  }


  @SerializeOptions({ type: LoginResponseDto })
  @Post('/auth/signin')
  async signin(@Body() signinDto: LoginUserDto): Promise<LoginResponseDto> {
    try {
      const { accessToken: token, user } = await this.authService.signin(signinDto);
      return { user, token };
    } catch (e) {
      if(e instanceof Error){
        console.error(e.message);
      }
      throw e;
    }
  }

  @Patch('/:id')
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserModel> {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.usersService.update(parseInt(id), updateUserDto);
  }

  @Get('/auth/bytoken')
  async getUser(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const user = await this.authService.getUserFromToken(token);
      return user;
    } catch (error) {
      console.log('Invalid token')
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Get('/auth/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
  }

  @Get('/auth/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: IGoogleAuthorizedRequest, @Res() res: Response) {
    const user = req.user;
    const token = this.authService.generateJwtToken({ sub: user.getId() });

    return res.redirect(`${process.env.FRONTEND_URL}/oauth2-redirect?token=${token}`);
  }

}
