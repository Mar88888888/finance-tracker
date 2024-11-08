import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';
import { UpdateGroupDto } from './dto/update.group.dto';
import { CreateGroupDto } from './dto/create.group.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupRepo: Repository<Group>,
    private userService: UsersService
  ){}

  async findById(id: number){
    return await this.groupRepo.findOne({where: {id}, relations: ['members']});
  }

  async getGroupCode(id: number){
    return (await this.findById(id)).joinCode;
  }


  async create(ownerId: number, createGroupDto: CreateGroupDto): Promise<Group> {
    const newGroup = this.groupRepo.create(createGroupDto);
    newGroup.owner = await this.userService.findOne(ownerId);
    newGroup.joinCode = this.generateJoinCode();
    newGroup.members = [];

    const user = await this.userService.findOne(ownerId);
    newGroup.members.push(user);
    return await this.groupRepo.save(newGroup);
  }

  async joinGroup(joinCode: string, userId: number) {
    const group = await this.groupRepo.findOne({ where: { joinCode }, relations: ['members'] });
    if (!group) throw new NotFoundException('Group with this code not found');

    const user = await this.userService.findOne(userId);
    group.members.push(user);

    return this.groupRepo.save(group);
  }

  async update(id: number, updatePurposeDto: UpdateGroupDto): Promise<Group> {
    const group = await this.findById(id);
    const { title } = updatePurposeDto;

    await this.groupRepo
      .createQueryBuilder()
      .update(Group)
      .set({ title })
      .where('id = :id', { id })
      .execute();

    return await this.findById(id);
  }

  private generateJoinCode(): string {
    return Math.random().toString(36).slice(2, 10); 
  }

  async remove(id: number): Promise<Group> {
    const purposeToDelete = await this.findById(id);

    await this.groupRepo
      .createQueryBuilder()
      .delete()
      .from(Group)
      .where('id = :id', { id })
      .execute();

    return purposeToDelete;
  }
}
