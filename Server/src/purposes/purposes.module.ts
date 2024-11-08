import { Module } from '@nestjs/common';
import { PurposesController } from './purposes.controller';
import { PurposesService } from './purposes.service';
import { Purpose } from './purpose.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Purpose])],
  controllers: [PurposesController],
  providers: [PurposesService]
})
export class PurposesModule {}
