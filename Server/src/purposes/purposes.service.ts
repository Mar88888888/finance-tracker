import { Injectable, NotFoundException,
  BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, QueryFailedError, Repository } from 'typeorm';
import { PurposeEntity } from './purpose.entity';
import { CreatePurposeDto } from './dto/create-purpose.dto';
import { UpdatePurposeDto } from './dto/update-purpose.dto';
import { PurposeModel } from './purpose.model';
import { UsersService } from '../users/users.service';
import { UserModel } from '../users/user.model';

@Injectable()
export class PurposesService {
  constructor(
    @InjectRepository(PurposeEntity)
    private readonly purposeRepository: Repository<PurposeEntity>,
    private readonly usersService: UsersService
  ) { }

  async findAll(): Promise<PurposeModel[]> {
    const options: FindManyOptions<PurposeEntity> = {
      order: {
        category: "ASC"
      },
    }
    return (await this.purposeRepository.find(options)).map(PurposeModel.fromEntity);
  }

  async findUserPurposes(userId: number): Promise<PurposeModel[]> {
    const options: FindManyOptions<PurposeEntity> = {
      where: { 
        user: { 
          id: userId
        } 
      },
      relations: ['user']
    }
    return (await this.purposeRepository.find(options)).map(PurposeModel.fromEntity);
  }


  async create(userId: number, createPurposeDto: CreatePurposeDto): Promise<PurposeModel> {
    try {
      const existingPurpose = await this.purposeRepository.findOne({
        where: {
          category: createPurposeDto.category,
          user: { id: userId }
        }
      });

      if (existingPurpose) {
        throw new BadRequestException("Purpose with these values already exists.");
      }

      const user = await this.usersService.findOne(userId);

      const newPurposeEntity = this.purposeRepository.create(createPurposeDto);
      newPurposeEntity.user = UserModel.toEntity(await this.usersService.findOne(userId));
      this.purposeRepository.save(newPurposeEntity);
      return PurposeModel.fromEntity(newPurposeEntity);

    } catch (error) {

      if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
        throw new BadRequestException("Purpose with these values already exists.");
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException("Purpose with these values already exists.");
      } else if (error instanceof Error) {
        console.error(error.message);
        throw new InternalServerErrorException();
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }


  async findOne(id: number): Promise<PurposeModel> {
    const purpose =
    await this.purposeRepository.findOne({ where: { id }, relations: ['user', 'transactions'] });

    if (!purpose) {
      throw new NotFoundException(`Purpose with id ${id} not found`);
    }

    return PurposeModel.fromEntity(purpose);
  }

  async update(id: number, updatePurposeDto: UpdatePurposeDto): Promise<PurposeModel> {
    try {

      const purpose = PurposeModel.toEntity(await this.findOne(id));
      Object.assign(purpose, updatePurposeDto);
      return PurposeModel.fromEntity(await this.purposeRepository.save(purpose));

    } catch (error) {
      if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
        throw new BadRequestException("Purpose with these values already exists.");
      } else if (error instanceof Error) {
        console.error(error.message);
        throw new InternalServerErrorException();
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

  async remove(id: number): Promise<void> {
    await this.purposeRepository.delete(id);
  }

}
