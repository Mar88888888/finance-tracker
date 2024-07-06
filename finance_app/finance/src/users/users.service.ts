import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.createQueryBuilder()
    .select('*').orderBy('name').getRawMany();
  }


  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, age, gender } = createUserDto;

    const newUser = await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({ name, age, gender })
      .returning('*')
      .execute();

    return newUser.raw[0];
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }


  
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const { name, age, gender } = updateUserDto;

    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ name, age, gender })
      .where('id = :id', { id })
      .execute();

    return await this.findOne(id);
  }

  async remove(id: number): Promise<User> {
    const userToDelete = await this.findOne(id);

    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id })
      .execute();

    return userToDelete;
  }
}
