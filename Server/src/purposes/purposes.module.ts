import { Module } from '@nestjs/common';
import { PurposesController } from './purposes.controller';
import { PurposesService } from './purposes.service';
import { PurposeEntity } from './purpose.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([PurposeEntity]), UsersModule],
  controllers: [PurposesController],
  providers: [PurposesService, JwtService]
})
export class PurposesModule { }
