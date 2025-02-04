import {
  Body, ClassSerializerInterceptor, Controller,
  Delete, ForbiddenException, Get, HttpStatus,
  NotFoundException, Param, Patch, Post, Req, Res,
  SerializeOptions, UseGuards, UseInterceptors,
  ParseIntPipe
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create.group.dto';
import { UpdateGroupDto } from './dto/update.group.dto';
import { AuthGuard } from '../guards/auth.guard';
import { JoinGroupDto } from './dto/join-group.dto';
import { GroupModel } from './group.model';
import { Response } from 'express';
import { SerializeTransactionDto } from 'src/transactions/dto/serialize.transaction.dto';
import { AddPurposeDto } from './dto/add-purpose.dto';

@Controller('groups')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: GroupModel, })
export class GroupsController {
  constructor(
    private groupsService: GroupsService,
  ) { }

  @Get('/:id/code')
  async getJoinCode(@Param('id', ParseIntPipe) id: number) {
    return await this.groupsService.getGroupCode(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: SerializeTransactionDto })
  @Get('/:id/transactions')
  async getTransactions(@Param('id', ParseIntPipe) id: number) {
    return await this.groupsService.getTransactions(id);
  }

  @Get('/:id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await this.groupsService.findById(id);
  }


  @UseGuards(AuthGuard)
  @Get()
  async getUserGroups(@Req() request: Request) {
    const userId = request['userId'];
    return await this.groupsService.getUserGroups(userId);
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createGroupDto: CreateGroupDto, @Req() request): Promise<GroupModel> {
    return this.groupsService.create(request.userId, createGroupDto);
  }

  @UseGuards(AuthGuard)
  @Post('/:id/purposes')
  async addPurposes(@Param('id', ParseIntPipe) groupId: string, @Body() purposes: AddPurposeDto): Promise<GroupModel> {
    return this.groupsService.addPurposes(groupId, purposes);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateGroupDto: UpdateGroupDto): Promise<GroupModel> {
    const group = await this.groupsService.findById(parseInt(id));
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return this.groupsService.update(parseInt(id), updateGroupDto);
  }

  @UseGuards(AuthGuard)
  @Post('/members')
  async joinGroup(
    @Body() joinGroupDto: JoinGroupDto,
    @Req() request
  ) {
    return this.groupsService.joinGroup(joinGroupDto.joinCode, request.userId);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: string, @Req() request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const group = await this.groupsService.findById(parseInt(id));

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.getOwner().getId() !== request.userId) {
      throw new ForbiddenException('You are not the owner of this group');
    }

    await this.groupsService.remove(parseInt(id));
    res.status(HttpStatus.NO_CONTENT);
  }

  @UseGuards(AuthGuard)
  @Delete('/:groupId/members/:memberId')
  async removeUserFromGroup(@Param('groupId', ParseIntPipe) groupId: string, @Param('memberId', ParseIntPipe) memberId: string, @Req() request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const group = await this.groupsService.findById(parseInt(groupId));

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.getOwner().getId() !== request.userId) {
      throw new ForbiddenException('You are not the owner of this group');
    }

    await this.groupsService.removeUserFromGroup(group, parseInt(memberId));

    res.status(HttpStatus.NO_CONTENT);
  }

  @UseGuards(AuthGuard)
  @Delete('/:groupId/purposes')
  async removePurposesFromGroup(@Param('groupId', ParseIntPipe) groupId: string, @Body() purposes: AddPurposeDto, @Req() request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const group = await this.groupsService.findById(parseInt(groupId));

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.getOwner().getId() !== request.userId) {
      throw new ForbiddenException('You are not the owner of this group');
    }

    await this.groupsService.removePurposesFromGroup(group, purposes.purposeIds);

    res.status(HttpStatus.NO_CONTENT);
  }
}
