import { Controller, Get, Post, Patch, Delete, Body, Param, NotFoundException, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { PurposesService } from './purposes.service';
import { CreatePurposeDto } from './dto/create-purpose.dto';
import { UpdatePurposeDto } from './dto/update-purpose.dto';
import { PurposeModel } from './purpose.model';
import { AuthGuard } from '../guards/auth.guard';
import { PurposeOwnerGuard } from '../guards/purpose-owner.guard';

@Controller('purposes')
export class PurposesController {
  constructor(private readonly purposeService: PurposesService) { }


  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req): Promise<PurposeModel[]> {
    return this.purposeService.findUserPurposes(req.userId);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: string): Promise<PurposeModel> {
    const purpose = await this.purposeService.findOne(parseInt(id));
    if (!purpose) {
      throw new NotFoundException('Purpose not found');
    }
    return purpose;
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createPurposeDto: CreatePurposeDto,
    @Req() req,
  ): Promise<PurposeModel> {
    return this.purposeService.create(req.userId, createPurposeDto);
  }

  @UseGuards(AuthGuard, PurposeOwnerGuard)
  @Patch(':purposeId')
  async update(@Param('purposeId', ParseIntPipe) purposeId: string, @Body() updatePurposeDto: UpdatePurposeDto): Promise<PurposeModel> {
    const purpose = await this.purposeService.findOne(parseInt(purposeId));
    if (!purpose) {
      throw new NotFoundException('Purpose not found');
    }
    return this.purposeService.update(parseInt(purposeId), updatePurposeDto);
  }

  @UseGuards(AuthGuard, PurposeOwnerGuard)
  @Delete(':purposeId')
  async remove(@Param('purposeId', ParseIntPipe) purposeId: string): Promise<void> {
    const purpose = await this.purposeService.findOne(parseInt(purposeId));
    if (!purpose) {
      throw new NotFoundException('Purpose not found');
    }
    await this.purposeService.remove(parseInt(purposeId));
  }
}
