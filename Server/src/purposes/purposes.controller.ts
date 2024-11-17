import { Controller, Get, Post, Patch, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { PurposesService } from './purposes.service';
import { CreatePurposeDto } from './dto/create-purpose.dto';
import { UpdatePurposeDto } from './dto/update-purpose.dto';
import { PurposeModel } from './purpose.model';

@Controller('purposes')
export class PurposesController {
  constructor(private readonly purposeService: PurposesService) {}

  @Get()
  async findAll(): Promise<PurposeModel[]> {
    return this.purposeService.findAll();
  }

  @Post()
  async create(@Body() createPurposeDto: CreatePurposeDto): Promise<PurposeModel> {
    return this.purposeService.create(createPurposeDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePurposeDto: UpdatePurposeDto): Promise<PurposeModel> {
    const purpose = await this.purposeService.findOne(parseInt(id));
    if (!purpose) {
      throw new NotFoundException('Purpose not found');
    }
    return this.purposeService.update(parseInt(id), updatePurposeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const purpose = await this.purposeService.findOne(parseInt(id));
    if (!purpose) {
      throw new NotFoundException('Purpose not found');
    }
    await this.purposeService.remove(parseInt(id));
  }
}
