import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TransactionEntity } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PurposesService } from '../purposes/purposes.service';
import { PurposeModel } from 'src/purposes/purpose.model';
import { TransactionModel } from './transaction.model';

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

  async getGroupTransactions(memberIds: Number[], purposeIds: Number[]): Promise<TransactionModel[]> {
    const transactions = await this.transactionRepository.find({
      where: {
        member: {
          id: In(memberIds),
        },
        purpose: {
          id: In(purposeIds),
        },
      },
      relations: ['member', 'purpose'],
    });

    return transactions.map(TransactionModel.fromEntity);
  }
  async find(userId: number, queryParams: {
    startdate?: string,
    enddate?: string,
    type?: boolean,
    purposes?: string[],
    orderBy?: string,
    sortOrder?: "ASC" | "DESC",
  }): Promise<TransactionModel[]> {
    let { startdate, enddate, type, purposes, orderBy, sortOrder } = queryParams;

    const queryBuilder = this.transactionRepository.createQueryBuilder('transaction');

    queryBuilder.innerJoinAndSelect('transaction.purpose', 'purpose');

    queryBuilder.innerJoinAndSelect('purpose.user', 'user');

    queryBuilder.innerJoinAndSelect('transaction.member', 'member')
      .andWhere('member.id = :userId', { userId });

    if (startdate) {
      queryBuilder.andWhere('transaction.t_date >= :startdate', { startdate });
    }

    if (enddate) {
      queryBuilder.andWhere('transaction.t_date <= :enddate', { enddate });
    }

    if (purposes && purposes.length > 0) {
      queryBuilder.andWhere('purpose.id IN (:...purposes)', { purposes });
    }

    if (type !== undefined) {
      queryBuilder.andWhere('purpose.type = :type', { type });
    }

    switch (orderBy) {
      case 'purpose':
        queryBuilder.orderBy('purpose.category', sortOrder || 'ASC');
        break;
      case 'sum':
        queryBuilder.orderBy('transaction.sum', sortOrder || 'ASC');
        break;
      case 'date':
        queryBuilder.orderBy('transaction.t_date', sortOrder || 'ASC');
        break;
      default:
        break;
    }

    return (await queryBuilder.getMany()).map(TransactionModel.fromEntity);
  }


  async create(userId: number, createTransactionDto: CreateTransactionDto): Promise<TransactionModel> {
    try {
      const newTransaction = this.transactionRepository.create(createTransactionDto);
      const { purposeId } = createTransactionDto;
      const member = { id: userId } as any;
      const purpose = PurposeModel.toEntity(await this.purposeService.findOne(purposeId));
      newTransaction.member = member;
      newTransaction.purpose = purpose;

      return TransactionModel.fromEntity(await this.transactionRepository.save(newTransaction));
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Transaction with these values already exists.');
      }
      throw error;
    }
  }

  async findOne(id: number): Promise<TransactionModel> {
    const transaction = await this.transactionRepository.findOne({ where: { id }, relations: ['member', 'purpose'] });

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

  async remove(id: number): Promise<TransactionModel> {
    const transactionToRemove = await this.findOne(id);

    await this.transactionRepository
      .createQueryBuilder()
      .delete()
      .from(TransactionEntity)
      .where('id = :id', { id })
      .execute();

    return transactionToRemove;
  }
}
