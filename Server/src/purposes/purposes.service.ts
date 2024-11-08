import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purpose } from './purpose.entity';
import { CreatePurposeDto } from './dto/create-purpose.dto';
import { UpdatePurposeDto } from './dto/update-purpose.dto';

@Injectable()
export class PurposesService {
  constructor(
    @InjectRepository(Purpose)
    private readonly purposeRepository: Repository<Purpose>,
  ) {}

  async findAll(): Promise<Purpose[]> {
    return await this.purposeRepository.createQueryBuilder()
    .select('*').orderBy('category').getRawMany();
  }


  async create(createPurposeDto: CreatePurposeDto): Promise<Purpose> {
    try {
      const { category, type } = createPurposeDto;
      const newPurpose = await this.purposeRepository
        .createQueryBuilder()
        .insert()
        .into(Purpose)
        .values({ category, type })
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


  async findOne(id: number): Promise<Purpose> {
    const purpose = await this.purposeRepository
      .createQueryBuilder('trans_category')
      .where('id = :id', { id })
      .getOne();

    if (!purpose) {
      throw new NotFoundException(`Purpose with id ${id} not found`);
    }

    return purpose;
  }

  async update(id: number, updatePurposeDto: UpdatePurposeDto): Promise<Purpose> {
    try {
      const purpose = await this.findOne(id);
      const { category, type } = updatePurposeDto;

      await this.purposeRepository
        .createQueryBuilder()
        .update(Purpose)
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

  async remove(id: number): Promise<Purpose> {
    const purposeToDelete = await this.findOne(id);

    await this.purposeRepository
      .createQueryBuilder()
      .delete()
      .from(Purpose)
      .where('id = :id', { id })
      .execute();

    return purposeToDelete;
  }
}
