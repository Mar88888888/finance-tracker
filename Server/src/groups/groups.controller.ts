import { Body, ClassSerializerInterceptor, Controller, Delete, ForbiddenException, Get, HttpStatus, NotFoundException,
   Param, Patch, Post, Req, Res, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create.group.dto';
import { UpdateGroupDto } from './dto/update.group.dto';
import { AuthGuard } from '../guards/auth.guard';
import { JoinGroupDto } from './dto/join-group.dto';
import { GroupModel } from './group.model';
import { Response } from 'express';

@Controller('groups')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: GroupModel })
export class GroupsController {
  constructor(
    private groupsService: GroupsService,
  ){}

  @Get('/:id/code')
  async getJoinCode(@Param('id') id: number){
    return await this.groupsService.getGroupCode(id);
  }

  @Get('/:id')
  async getById(@Param('id') id: number){
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

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePurposeDto: UpdateGroupDto): Promise<GroupModel> {
    const group = await this.groupsService.findById(parseInt(id));
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return this.groupsService.update(parseInt(id), updatePurposeDto);
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
  async remove(@Param('id') id: string, @Req() request, @Res({passthrough: true}) res: Response): Promise<void> {
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
}
