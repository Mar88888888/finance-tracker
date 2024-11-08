import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { User } from 'src/users/user.entity';
import { PurposesService } from 'src/purposes/purposes.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly purposeService: PurposesService,
  ) {}

  async findAll(): Promise<Transaction[]> {
    return await this.transactionRepository.createQueryBuilder('transaction')
    .innerJoinAndSelect('transaction.member', 'member')
    .innerJoinAndSelect('transaction.purpose', 'purpose')
    .getMany();
  }


  async find(queryParams: {
    startdate?: string,
    enddate?: string,
    type?: boolean,
    purposes?: string[],
    orderBy?: string,
    sortOrder?: "ASC" | "DESC",
  }): Promise<Transaction[]> {
    let { startdate, enddate, type, purposes, orderBy, sortOrder } = queryParams;

    const queryBuilder = this.transactionRepository.createQueryBuilder('transaction');

    if (startdate) {
      queryBuilder.andWhere('transaction.t_date >= :startdate', { startdate });
    }

    if (enddate) {
      queryBuilder.andWhere('transaction.t_date <= :enddate', { enddate });
    }

    if (purposes && purposes.length > 0 || orderBy == 'purpose' || type) {
      queryBuilder.innerJoinAndSelect('transaction.purpose', 'purpose');
    }
    if (purposes && purposes.length > 0) {
      queryBuilder.andWhere('purpose.id IN (:...purposes)', { purposes });
    }

    if(type){
      queryBuilder.andWhere('purpose.type = :type', { type });
    }

    switch(orderBy){
      case 'member':
        queryBuilder.orderBy('member.name', sortOrder || 'ASC');
        break;
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

    return queryBuilder.getMany();
  }

  async create(userId: number, createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    try {
      const newTransaction = this.transactionRepository.create(createTransactionDto);
      const { purposeId } = createTransactionDto;
      const member = await this.usersRepository.findOne({where: {id: userId}});
      const purpose = await this.purposeService.findOne(purposeId);
      newTransaction.member = member;
      newTransaction.purpose = purpose;

      return await this.transactionRepository.save(newTransaction);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Transaction with these values already exists.');
      }
      throw error; 
    }
  }

  async findOne(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({where: {id}, relations: ['member', 'purpose']});

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.findOne(id);
    Object.assign(transaction, updateTransactionDto);
    if(updateTransactionDto.purposeId){
      const purpose = await this.purposeService.findOne(updateTransactionDto.purposeId);
      transaction.purpose = purpose;
    }
    return await this.transactionRepository.save(transaction);
  }

  async remove(id: number): Promise<Transaction> {
    const transactionToRemove = await this.findOne(id);

    await this.transactionRepository
      .createQueryBuilder()
      .delete()
      .from(Transaction)
      .where('id = :id', { id })
      .execute();

    return transactionToRemove;
  }
}
