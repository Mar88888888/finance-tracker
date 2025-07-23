import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOperator,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  LessThan,
  MoreThan,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { TransactionEntity } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PurposesService } from '../purposes/purposes.service';
import { PurposeModel } from '../purposes/purpose.model';
import { TransactionModel } from './transaction.model';
import { OrderBy, TransactionFilterDto } from './dto/transaction-filter.dto';
import * as csv from 'fast-csv';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { CurrencyService } from '../currency/currency.service';
import { UserEntity } from '../users/user.entity';
import { GroupModel } from '../groups/group.model';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    private readonly purposeService: PurposesService,
    private readonly userService: UsersService,
    private readonly currencyService: CurrencyService,
  ) {}

  async findAll(): Promise<TransactionModel[]> {
    return (
      await this.transactionRepository.find({
        relations: ['member', 'purpose'],
      })
    ).map(TransactionModel.fromEntity);
  }

  async getUserTransactions(userId: number): Promise<TransactionModel[]> {
    return (
      await this.transactionRepository.find({
        where: { member: { id: userId } },
        order: { date: 'DESC' },
        relations: ['purpose', 'member'],
      })
    ).map(TransactionModel.fromEntity);
  }

  async getGroupTransactions(
    group: GroupModel,
    filterDto: TransactionFilterDto,
  ): Promise<TransactionModel[]> {
    const {
      startDate,
      endDate,
      minAmount,
      maxAmount,
      orderBy,
      sortOrder = 'ASC',
    } = filterDto;

    const memberIds = group.members.map((member) => member.id);
    const purposeIds = group.purposes;
    if (memberIds.length === 0 || purposeIds.length === 0) {
      return [];
    }

    const purposes = filterDto?.purposes?.filter((purpose: number) =>
      purposeIds.includes(purpose),
    );

    let dateCondition: FindOperator<Date>;
    if (startDate && endDate) {
      dateCondition = Between(new Date(startDate), new Date(endDate));
    } else if (startDate) {
      dateCondition = MoreThan(new Date(startDate));
    } else if (endDate) {
      dateCondition = LessThan(new Date(endDate));
    } else {
      dateCondition = undefined;
    }

    let amountCodition: FindOperator<number>;
    if (minAmount && maxAmount) {
      amountCodition = Between(minAmount, maxAmount);
    } else if (minAmount) {
      amountCodition = MoreThan(minAmount);
    } else if (maxAmount) {
      amountCodition = LessThan(maxAmount);
    } else {
      amountCodition = undefined;
    }

    const whereCondition: FindOptionsWhere<TransactionEntity> = {
      sum: amountCodition,
      date: dateCondition,
      member: { id: In(memberIds) },
      purpose: { id: In(purposes?.length ? purposes : purposeIds) },
    };

    const orderCondition: FindOptionsOrder<TransactionEntity> = {};

    if (orderBy) {
      orderCondition[orderBy] = sortOrder.toUpperCase() as 'ASC' | 'DESC';
    }

    const transactions = await this.transactionRepository.find({
      where: whereCondition,
      order: orderCondition,
      relations: ['member', 'purpose'],
    });

    return transactions.map(TransactionModel.fromEntity);
  }

  async exportToCsv(transactions: TransactionModel[], res: Response) {
    const csvStream = csv.format({ headers: true });

    csvStream.pipe(res);

    for (const transaction of transactions) {
      const purpose = await this.purposeService.findOne(
        transaction.getPurposeId(),
      );
      const member = await this.userService.findOne(transaction.getUserId());

      csvStream.write({
        ID: transaction.id,
        Date: new Date(transaction.getDate()).toISOString().split('T')[0],
        Sum: transaction.getSum(),
        Purpose: purpose.getCategory(),
        Member: member.name,
      });
    }

    csvStream.end();
  }

  async find(
    userId: number,
    queryParams: TransactionFilterDto,
  ): Promise<TransactionModel[]> {
    const {
      startDate,
      endDate,
      purposes,
      minAmount,
      maxAmount,
      orderBy,
      sortOrder = 'ASC',
    } = queryParams;

    const qb = this.transactionRepository
      .createQueryBuilder('transaction')
      .innerJoinAndSelect('transaction.purpose', 'purpose')
      .innerJoinAndSelect('purpose.user', 'user')
      .innerJoinAndSelect('transaction.member', 'member')
      .where('member.id = :userId', { userId });

    if (startDate) {
      qb.andWhere('transaction.date >= :startDate', { startDate });
    }

    if (endDate) {
      qb.andWhere('transaction.date <= :endDate', { endDate });
    }

    if (minAmount) {
      qb.andWhere('transaction.sum >= :minAmount', { minAmount });
    }

    if (maxAmount) {
      qb.andWhere('transaction.sum <= :maxAmount', { maxAmount });
    }

    if (purposes?.length) {
      qb.andWhere('purpose.id IN (:...purposes)', { purposes });
    }

    const orderMap: Record<OrderBy, string> = {
      [OrderBy.DATE]: 'transaction.date',
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
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionModel> {
    try {
      const { purposeId, currency, date, sum } = createTransactionDto;

      const purposeModel = await this.purposeService.findOne(purposeId);
      const purpose = PurposeModel.toEntity(purposeModel);
      const currencyEntity =
        await this.currencyService.getCurrencyEntity(currency);

      const newTransactionPartial: Partial<TransactionEntity> = {
        sum,
        date,
        currency: currencyEntity,
        member: { id: userId } as UserEntity,
        purpose,
      };

      const newTransaction = this.transactionRepository.create(
        newTransactionPartial,
      );

      const exchangeRate = await this.currencyService.getExchangeRateToUSD(
        currency,
        date.toISOString().slice(0, 10),
      );
      newTransaction.usdEquivalent = sum * exchangeRate;

      const saved = await this.transactionRepository.save(newTransaction);

      return TransactionModel.fromEntity(saved);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError?.code === '23505'
      ) {
        throw new ConflictException(
          'Transaction with these values already exists.',
        );
      }
      throw new InternalServerErrorException('Failed to create transaction');
    }
  }

  async findOne(id: number): Promise<TransactionModel> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['member', 'purpose'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return TransactionModel.fromEntity(transaction);
  }

  async update(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionModel> {
    const transaction = TransactionModel.toEntity(await this.findOne(id));
    Object.assign(transaction, updateTransactionDto);
    if (updateTransactionDto.purposeId) {
      const purpose = await this.purposeService.findOne(
        updateTransactionDto.purposeId,
      );
      transaction.purpose = PurposeModel.toEntity(purpose);
    }
    return TransactionModel.fromEntity(
      await this.transactionRepository.save(transaction),
    );
  }

  async remove(id: number): Promise<void> {
    await this.transactionRepository.delete(id);
  }
}
