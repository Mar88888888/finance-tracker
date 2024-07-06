import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { User } from 'src/users/user.entity';
import { Purpose } from 'src/purposes/purpose.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Purpose)
    private readonly purposeRepository: Repository<Purpose>,
  ) {}

  async findAll(): Promise<Transaction[]> {
    return await this.transactionRepository.createQueryBuilder('transaction').innerJoinAndSelect('transaction.member', 'member').innerJoinAndSelect('transaction.purpose', 'purpose').getMany();
  }


  async find(queryParams: {
    startdate?: string,
    enddate?: string,
    type?: boolean,
    members?: string[],
    purposes?: string[],
    orderBy?: string,
    sortOrder?: "ASC" | "DESC",
  }): Promise<Transaction[]> {
    let { startdate, enddate, type, members, purposes, orderBy, sortOrder } = queryParams;

    const queryBuilder = this.transactionRepository.createQueryBuilder('transaction');

    if (startdate) {
      queryBuilder.andWhere('transaction.t_date >= :startdate', { startdate });
    }

    if (enddate) {
      queryBuilder.andWhere('transaction.t_date <= :enddate', { enddate });
    }

    if (members && members.length > 0 || orderBy == 'member') {
      queryBuilder.innerJoinAndSelect('transaction.member', 'member');
    }
    if (members && members.length > 0) {
      queryBuilder.andWhere('member.id IN (:...members)', { members });
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

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    try {
      const newTransaction = this.transactionRepository.create(createTransactionDto);
      const { member_id, purpose_id } = createTransactionDto;
      const member = await this.usersRepository.findOne({where: {id: member_id}});
      const purpose = await this.purposeRepository.findOne({where: {id: purpose_id}});
      newTransaction.member = member;
      newTransaction.purpose = purpose;

      return await this.transactionRepository.save(newTransaction);
    } catch (error) {
      throw new BadRequestException('Failed to create transaction.');
    }
  }

  async findOne(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('id = :id', { id })
      .getOne();

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    try {
      const transaction = await this.findOne(id);
      Object.assign(transaction, updateTransactionDto);
      const member = await this.usersRepository.findOne({where: {id: updateTransactionDto.member_id}});
      const purpose = await this.purposeRepository.findOne({where: {id: updateTransactionDto.purpose_id}});
      transaction.member = member;
      transaction.purpose = purpose;
      return await this.transactionRepository.save(transaction);
    } catch (error) {
      throw new BadRequestException('Failed to update transaction.');
    }
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
