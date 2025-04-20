import {
  Controller, Get, Post, Patch, Delete, Body,
  Param, NotFoundException, Query, UseGuards, Req,
  UseInterceptors, SerializeOptions, ClassSerializerInterceptor,
  Res, HttpStatus,
  ParseIntPipe,
  ForbiddenException
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from '../guards/auth.guard';
import { SerializeTransactionDto } from './dto/serialize.transaction.dto';
import { Response } from 'express';
import { UserSerializeDto } from '../users/dto/serialize.user.dto';
import { TransactionModel } from './transaction.model';
import { UserModel } from '../users/user.model';
import { UsersService } from '../users/users.service';
import { TransactionOwnerGuard } from '../guards/transaction-owner.guard';
import { IAuthorizedRequest } from '../abstracts/authorized-request.interface';
import { CreateSubscriptionDto } from '../subscriptions/dto/create-subscription.dto';
import { SubscriptionModel } from '../subscriptions/subscription.model';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { SubscriptionProcessorService } from './subscription-processor.service';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: SerializeTransactionDto })
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly userService: UsersService,
    private readonly subscriptionService: SubscriptionsService,
    private readonly subscriptionProcessorService: SubscriptionProcessorService,
  ) { }

  @UseGuards(AuthGuard)
  @Get()
  async find(
    @Req() req,
    @Query('startdate') startdate?: string,
    @Query('enddate') enddate?: string,
    @Query('type') type?: boolean,
    @Query('purposes') purposes?: string,
    @Query('orderBy') orderBy?: string,
    @Query('sortOrder') sortOrder?: "ASC" | "DESC",
  ): Promise<TransactionModel[]> {
    const purposesArray = purposes ? purposes.split(',') : undefined;
    let res = await this.transactionsService.find(req.userId, { startdate, enddate, type, purposes: purposesArray, orderBy, sortOrder });
    return res;
  }


  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const transaction = await this.transactionsService.create(req.userId, createTransactionDto);
    const locationUrl = `/transactions/${transaction.getId()}`;

    res
      .status(HttpStatus.CREATED)
      .header('Location', locationUrl)
      .json(transaction);
  }

  @SerializeOptions({ type: UserSerializeDto })
  @Get('/:id/member')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<UserModel> {
    try {
      return await this.userService.findOne((await this.transactionsService.findOne(id)).getMemberId());
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @UseGuards(AuthGuard, TransactionOwnerGuard)
  @Get('/:transactionId')
  async findOne(@Param('transactionId', ParseIntPipe) transactionId: number, @Req() request): Promise<TransactionModel> {
    let transaction: TransactionModel;
    try {
      transaction = await this.transactionsService.findOne(transactionId);
    } catch (error) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.getMemberId() !== request.userId) {
      throw new ForbiddenException('You are not allowed to access this transaction');
    }

    return transaction
  }

  @UseGuards(AuthGuard, TransactionOwnerGuard)
  @Patch('/:transactionId')
  async update(@Param('transactionId', ParseIntPipe) transactionId: number, @Body() updateTransactionDto: UpdateTransactionDto): Promise<TransactionModel> {
    return await this.transactionsService.update(transactionId, updateTransactionDto);
  }

  @UseGuards(AuthGuard, TransactionOwnerGuard)
  @Delete('/:transactionId')
  async remove(@Param('transactionId', ParseIntPipe) transactionId: number): Promise<void> {
    try {
      await this.transactionsService.remove(transactionId);
    } catch (error) {
      throw new NotFoundException('Transaction not found');
    }
  }

  @Post('/:transactionId/subscriptions')
  @UseGuards(AuthGuard, TransactionOwnerGuard)
  async createSubscription(
    @Req() req: IAuthorizedRequest,
    @Body() dto: CreateSubscriptionDto,
    @Param('transactionId', ParseIntPipe) transactionId: number): Promise<SubscriptionModel> {
    return await this.subscriptionService.createSubscription(req.userId, transactionId, dto);
  }

  @Post('process-subscriptions')
  async processSubscriptionsNow() {
    return this.subscriptionProcessorService.processRecurringTransactions();
  }

}
