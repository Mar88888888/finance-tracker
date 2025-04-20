import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' }
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [UsersService, JwtModule],
})
export class UsersModule { }
