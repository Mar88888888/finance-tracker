import { Body, ClassSerializerInterceptor, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { Group } from './group.entity';
import { CreateGroupDto } from './dto/create.group.dto';
import { UpdateGroupDto } from './dto/update.group.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UserSerializeDto } from '../users/dto/serialize.user.dto';
import { JoinGroupDto } from './dto/join-group.dto';

@Controller('groups')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UserSerializeDto })
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
  async create(@Body() createGroupDto: CreateGroupDto, @Req() request): Promise<Group> {
    return this.groupsService.create(request.userId, createGroupDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePurposeDto: UpdateGroupDto): Promise<Group> {
    const group = await this.groupsService.findById(parseInt(id));
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return this.groupsService.update(parseInt(id), updatePurposeDto);
  }

  @UseGuards(AuthGuard)
  @Post('/join')
  async joinGroup(
    @Body() joinGroupDto: JoinGroupDto,
    @Req() request
  ) {
    return this.groupsService.joinGroup(joinGroupDto.joinCode, request.userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Group> {
    const group = await this.groupsService.findById(parseInt(id));
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return await this.groupsService.remove(parseInt(id));
  }
}
