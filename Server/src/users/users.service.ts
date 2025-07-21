import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create.user.dto';
import { InnerUserUpdateDto } from './dto/inner-update.user.dto';
import { UserModel } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(userDto: CreateUserDto): Promise<UserModel> {
    const newEntity = this.usersRepository.create(userDto);
    const savedEntity = await this.usersRepository.save(newEntity);
    return UserModel.fromEntity(savedEntity);
  }

  async findOne(id: number): Promise<UserModel> {
    const entity = await this.usersRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException('User not found');
    }

    return UserModel.fromEntity(entity);
  }

  async find(query: FindOptionsWhere<UserEntity>): Promise<UserModel[]> {
    const entities = await this.usersRepository.find({ where: query });
    return entities.map(UserModel.fromEntity);
  }

  async update(id: number, updateUser: InnerUserUpdateDto): Promise<UserModel> {
    const userModel = await this.findOne(id);

    const userEntity = UserModel.toEntity(userModel);

    Object.assign(userEntity, updateUser);
    const updatedEntity = await this.usersRepository.save(userEntity);
    return UserModel.fromEntity(updatedEntity);
  }
}
