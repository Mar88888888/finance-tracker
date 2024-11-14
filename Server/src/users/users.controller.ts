import { Controller, Get, Post, Patch, Delete, Body, Param, NotFoundException, Res, Query, BadRequestException, Req, UnauthorizedException, UseInterceptors, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginUserDto } from './dto/login.user.dto';
import { UserSerializeDto } from './dto/serialize.user.dto';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UserSerializeDto })
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}
    
  @Post('/auth/signup')
  async createUser(
    @Body() userDto: CreateUserDto,
  ) {
    const user = await this.authService.signup(userDto);
    
    return user;
  }
    

  @Post('/auth/signin')
  async signin(@Body() signinDto: LoginUserDto, @Res({passthrough: true}) res: Response) {
    try {
      const { accessToken, user } = await this.authService.signin(signinDto);

      return {user, accessToken};
    } catch (e) {
      console.error(e.message);
      throw e;
    }
  }
  
  @Post('/auth/signout')
  signOut(@Res({passthrough: true}) res: Response) {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return 'Signed out';
  }
  
  @Get('/auth/verify-email')
    async verifyEmail(@Query('token') token: string) {
      let res  = await this.authService.verifyEmail(token);
    return res;
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    console.log(updateUserDto);
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
      console.log('Not header')
      throw new UnauthorizedException('Authorization header is missing');
    }
    
    const token = authHeader.split(' ')[1]; 
    if (!token) {
      console.log('Not token')
      throw new UnauthorizedException('Token is missing');
    }
    
    try {
      console.log(token);
      const user = await this.authService.getUserFromToken(token);
      return user;
    } catch (error) {
      console.log('Invalid token')
      throw new UnauthorizedException('Invalid token');
    }
  }

}
