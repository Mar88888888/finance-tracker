import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Inject
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, QueryFailedError, Repository } from 'typeorm';
import { Cache } from 'cache-manager';
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
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  private getAllCacheKey(): string {
    return 'purposes:all';
  }

  private getUserCacheKey(userId: number): string {
    return `purposes:user#${userId}`;
  }

  async findAll(): Promise<PurposeModel[]> {
    const cacheKey = this.getAllCacheKey();
    const cached = await this.cacheManager.get<PurposeModel[]>(cacheKey);
    if (cached) return cached;

    const options: FindManyOptions<PurposeEntity> = {
      order: {
        category: 'ASC',
      },
    };

    const result = (await this.purposeRepository.find(options)).map(PurposeModel.fromEntity);
    await this.cacheManager.set(cacheKey, result, 3600);
    return result;
  }

  async findUserPurposes(userId: number): Promise<PurposeModel[]> {
    const cacheKey = this.getUserCacheKey(userId);
    const cached = await this.cacheManager.get<PurposeModel[]>(cacheKey);
    if (cached) return cached;

    const options: FindManyOptions<PurposeEntity> = {
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user'],
    };

    const result = (await this.purposeRepository.find(options)).map(PurposeModel.fromEntity);
    await this.cacheManager.set(cacheKey, result, 3600);
    return result;
  }

  async create(userId: number, createPurposeDto: CreatePurposeDto): Promise<PurposeModel> {
    try {
      const existingPurpose = await this.purposeRepository.findOne({
        where: {
          category: createPurposeDto.category,
          user: { id: userId },
        },
      });

      if (existingPurpose) {
        throw new BadRequestException('Purpose with these values already exists.');
      }

      const user = await this.usersService.findOne(userId);
      const newPurposeEntity = this.purposeRepository.create(createPurposeDto);
      newPurposeEntity.user = UserModel.toEntity(user);

      await this.purposeRepository.save(newPurposeEntity);

      await this.cacheManager.del(this.getAllCacheKey());
      await this.cacheManager.del(this.getUserCacheKey(userId));

      return PurposeModel.fromEntity(newPurposeEntity);
    } catch (error) {
      if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
        throw new BadRequestException('Purpose with these values already exists.');
      } else if (error instanceof BadRequestException) {
        throw error;
      } else if (error instanceof Error) {
        console.error(error.message);
        throw new InternalServerErrorException();
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

  async findOne(id: number): Promise<PurposeModel> {
    const purpose = await this.purposeRepository.findOne({
      where: { id },
      relations: ['user', 'transactions'],
    });

    if (!purpose) {
      throw new NotFoundException(`Purpose with id ${id} not found`);
    }

    return PurposeModel.fromEntity(purpose);
  }

  async update(id: number, updatePurposeDto: UpdatePurposeDto): Promise<PurposeModel> {
    try {
      const entity = await this.findOne(id);
      const purpose = PurposeModel.toEntity(entity);
      Object.assign(purpose, updatePurposeDto);

      const saved = await this.purposeRepository.save(purpose);

      await this.cacheManager.del(this.getAllCacheKey());
      await this.cacheManager.del(this.getUserCacheKey(purpose.user.id));

      return PurposeModel.fromEntity(saved);
    } catch (error) {
      if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
        throw new BadRequestException('Purpose with these values already exists.');
      } else if (error instanceof Error) {
        console.error(error.message);
        throw new InternalServerErrorException();
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

  async remove(id: number): Promise<void> {
    const purpose = await this.findOne(id);
    await this.purposeRepository.delete(id);

    await this.cacheManager.del(this.getAllCacheKey());
    await this.cacheManager.del(this.getUserCacheKey(purpose.getUserId()));
  }
}
