import { Controller, Get, Post, Patch, Delete, Body, Param,
  ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { PurposesService } from './purposes.service';
import { CreatePurposeDto } from './dto/create-purpose.dto';
import { UpdatePurposeDto } from './dto/update-purpose.dto';
import { PurposeModel } from './purpose.model';
import { AuthGuard } from '../guards/auth.guard';
import { PurposeOwnerGuard } from '../guards/purpose-owner.guard';
import { IAuthorizedRequest } from '../abstracts/authorized-request.interface';

@Controller('purposes')
export class PurposesController {
  constructor(private readonly purposeService: PurposesService) { }


  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req: IAuthorizedRequest): Promise<PurposeModel[]> {
    return this.purposeService.findUserPurposes(req.userId);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PurposeModel> {
    return await this.purposeService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createPurposeDto: CreatePurposeDto,
    @Req() req: IAuthorizedRequest,
  ): Promise<PurposeModel> {
    return this.purposeService.create(req.userId, createPurposeDto);
  }

  @UseGuards(AuthGuard, PurposeOwnerGuard)
  @Patch('/:purposeId')
  async update(
    @Param('purposeId', ParseIntPipe) purposeId: number,
    @Body() updatePurposeDto: UpdatePurposeDto
  ): Promise<PurposeModel> {
    return this.purposeService.update(purposeId, updatePurposeDto);
  }

  @UseGuards(AuthGuard, PurposeOwnerGuard)
  @Delete('/:purposeId')
  async remove(
    @Param('purposeId', ParseIntPipe) purposeId: number
  ): Promise<void> {
    await this.purposeService.remove(purposeId);
  }
}
