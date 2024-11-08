import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create.user.dto';
import { InnerUserUpdateDto, UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async create(user: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({where: {id}});

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async find(query: {}){
    const user = await this.usersRepository.find({where: query});
    return user;
  }

  async update(id: number, updateUser: InnerUserUpdateDto): Promise<User> {
    const user = await this.findOne(id);

    Object.assign(user, updateUser);
    return await this.usersRepository.save(user);
  }

  async remove(id: number): Promise<User> {
    const userToDelete = await this.findOne(id);

    await this.usersRepository.delete(userToDelete);
    return userToDelete;
  }
}
