import { Module } from '@nestjs/common';
import { PurposesController } from './purposes.controller';
import { PurposesService } from './purposes.service';
import { PurposeEntity } from './purpose.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PurposeEntity])],
  controllers: [PurposesController],
  providers: [PurposesService]
})
export class PurposesModule {}
