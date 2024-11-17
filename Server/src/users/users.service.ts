import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create.user.dto';
import { InnerUserUpdateDto } from './dto/inner-update.user.dto';
import { UserModel } from './user.model';
import { UserDtoConverter } from './dto/user-dto.converter';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserModel[]> {
    const entities = await this.usersRepository.find();
    return entities.map(UserModel.fromEntity);
  }

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

  async find(query: {}): Promise<UserModel[]> {
    const entities = await this.usersRepository.find({ where: query });
    return entities.map(UserModel.fromEntity);
  }

  async update(id: number, updateUser: InnerUserUpdateDto): Promise<UserModel> {
    const entity = await this.findOneEntity(id);

    Object.assign(entity, updateUser);
    const updatedEntity = await this.usersRepository.save(entity);
    return UserModel.fromEntity(updatedEntity);
  }

  async updateFromModel(id: number, user: UserModel): Promise<UserModel> {
    const updateUserDto = UserDtoConverter.toInnerUpdateDto(user);
    return this.update(id, updateUserDto);
  }

  async remove(id: number): Promise<UserModel> {
    const entity = await this.findOneEntity(id);

    await this.usersRepository.delete(entity);
    return UserModel.fromEntity(entity);
  }

  private async findOneEntity(id: number): Promise<UserEntity> {
    const entity = await this.usersRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException('User not found');
    }

    return entity;
  }

}
