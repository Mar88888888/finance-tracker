import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurposeEntity } from './purpose.entity';
import { CreatePurposeDto } from './dto/create-purpose.dto';
import { UpdatePurposeDto } from './dto/update-purpose.dto';
import { PurposeModel } from './purpose.model';

@Injectable()
export class PurposesService {
  constructor(
    @InjectRepository(PurposeEntity)
    private readonly purposeRepository: Repository<PurposeEntity>,
  ) { }

  async findAll(): Promise<PurposeModel[]> {
    return (await this.purposeRepository.createQueryBuilder()
      .select('*').orderBy('category').getRawMany()).map(PurposeModel.fromEntity);
  }

  async findUserPurposes(userId: number): Promise<PurposeModel[]> {
    return (await this.purposeRepository.find(
      {
        where: { user: { id: userId } },
        relations: ['user']
      }
    )).map(PurposeModel.fromEntity);
  }


  async create(userId: number, createPurposeDto: CreatePurposeDto): Promise<PurposeModel> {
    try {
      const { category, type } = createPurposeDto;
      const newPurpose = await this.purposeRepository
        .createQueryBuilder()
        .insert()
        .into(PurposeEntity)
        .values({ category, type, user: { id: userId } })
        .execute();

      return this.findOne(newPurpose.raw[0].id);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Ця категорія вже існує.');
      } else {
        throw error;
      }
    }
  }


  async findOne(id: number): Promise<PurposeModel> {
    const purpose = await this.purposeRepository
      .createQueryBuilder('trans_category')
      .leftJoinAndSelect('trans_category.user', 'user')
      .where('trans_category.id = :id', { id })
      .getOne();

    if (!purpose) {
      throw new NotFoundException(`Purpose with id ${id} not found`);
    }

    return PurposeModel.fromEntity(purpose);
  }

  async update(id: number, updatePurposeDto: UpdatePurposeDto): Promise<PurposeModel> {
    try {
      const purpose = await this.findOne(id);
      const { category, type } = updatePurposeDto;

      await this.purposeRepository
        .createQueryBuilder()
        .update(PurposeEntity)
        .set({ category, type })
        .where('id = :id', { id })
        .execute();

      return await this.findOne(id);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Ця категорія вже існує.');
      } else {
        throw error;
      }
    }
  }

  async remove(id: number): Promise<PurposeModel> {
    const purposeToDelete = await this.findOne(id);

    await this.purposeRepository
      .createQueryBuilder()
      .delete()
      .from(PurposeEntity)
      .where('id = :id', { id })
      .execute();

    return purposeToDelete;
  }
}
