import { Injectable, NotFoundException,
   ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, LessThanOrEqual, MoreThanOrEqual,
   QueryFailedError, Repository } from 'typeorm';
import { TransactionEntity } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PurposesService } from '../purposes/purposes.service';
import { PurposeModel } from '../purposes/purpose.model';
import { TransactionModel } from './transaction.model';
import { OrderBy, TransactionFilterDto } from './dto/transaction-filter.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    private readonly purposeService: PurposesService,
  ) { }

  async findAll(): Promise<TransactionModel[]> {
    return (await this.transactionRepository.createQueryBuilder('transaction')
      .innerJoinAndSelect('transaction.member', 'member')
      .innerJoinAndSelect('transaction.purpose', 'purpose')
      .getMany()).map(TransactionModel.fromEntity);
  }

  async getUserTransactions(userId: number): Promise<TransactionModel[]> {
    return (await this.transactionRepository.find({
      where: { member: { id: userId } },
      order: { date: 'DESC' },
      relations: ['purpose', 'member']
    })).map(TransactionModel.fromEntity);
  }

  async getGroupTransactions(
    memberIds: number[],
    purposeIds: number[],
  ): Promise<TransactionModel[]> {

    const whereCondition: any = {
      member: { id: In(memberIds) },
      purpose: { id: In(purposeIds) },
    };

    const transactions = await this.transactionRepository.find({
      where: whereCondition,
      relations: ['member', 'purpose'],
    });


    return transactions.map(TransactionModel.fromEntity);
  }


  async find(userId: number, queryParams: TransactionFilterDto): Promise<TransactionModel[]> {
    const {
      startdate,
      enddate,
      purposes,
      orderBy,
      sortOrder = 'ASC',
    } = queryParams;
  
    const qb = this.transactionRepository
      .createQueryBuilder('transaction')
      .innerJoinAndSelect('transaction.purpose', 'purpose')
      .innerJoinAndSelect('purpose.user', 'user')
      .innerJoinAndSelect('transaction.member', 'member')
      .where('member.id = :userId', { userId });
  
    if (startdate) {
      qb.andWhere('transaction.t_date >= :startdate', { startdate });
    }
  
    if (enddate) {
      qb.andWhere('transaction.t_date <= :enddate', { enddate });
    }
  
    if (purposes?.length) {
      qb.andWhere('purpose.id IN (:...purposes)', { purposes });
    }
  
  
    const orderMap: Record<OrderBy, string> = {
      [OrderBy.DATE]: 'transaction.t_date',
      [OrderBy.SUM]: 'transaction.sum',
      [OrderBy.PURPOSE_ID]: 'purpose.category',
    };
  
    if (orderBy) {
      qb.orderBy(orderMap[orderBy], sortOrder);
    }
  
    const transactions = await qb.getMany();
    return transactions.map(TransactionModel.fromEntity);
  }

  async create(
    userId: number,
    createTransactionDto: CreateTransactionDto
  ): Promise<TransactionModel> {
    try {
      const newTransaction = this.transactionRepository.create(createTransactionDto);
      const { purposeId } = createTransactionDto;
      const member = { id: userId } as any;
      const purpose = PurposeModel.toEntity(await this.purposeService.findOne(purposeId));
      newTransaction.member = member;
      newTransaction.purpose = purpose;

      return TransactionModel.fromEntity(await this.transactionRepository.save(newTransaction));
    } catch (error) {
      if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
        throw new ConflictException('Transaction with these values already exists.');
      } else if (error instanceof Error) {
        console.error(error.message);
        throw new InternalServerErrorException();
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

  async findOne(id: number): Promise<TransactionModel> {
    const transaction = 
    await this.transactionRepository.findOne({ where: { id }, relations: ['member', 'purpose'] });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return TransactionModel.fromEntity(transaction);
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto): Promise<TransactionModel> {
    const transaction = TransactionModel.toEntity(await this.findOne(id));
    Object.assign(transaction, updateTransactionDto);
    if (updateTransactionDto.purposeId) {
      const purpose = await this.purposeService.findOne(updateTransactionDto.purposeId);
      transaction.purpose = PurposeModel.toEntity(purpose);
    }
    return TransactionModel.fromEntity(await this.transactionRepository.save(transaction));
  }

  async remove(id: number): Promise<void> {
    await this.transactionRepository.delete(id);
  }
}
