import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
  SerializeOptions,
  ClassSerializerInterceptor,
  Res,
  HttpStatus,
  ParseIntPipe,
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
import { TransactionFilterDto } from './dto/transaction-filter.dto';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: SerializeTransactionDto })
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly userService: UsersService,
    private readonly subscriptionService: SubscriptionsService,
    private readonly subscriptionProcessorService: SubscriptionProcessorService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async find(
    @Req() req: IAuthorizedRequest,
    @Query() filterDto: TransactionFilterDto,
  ): Promise<TransactionModel[]> {
    return this.transactionsService.find(req.userId, filterDto);
  }

  @UseGuards(AuthGuard)
  @Get('export')
  async exportTransactions(
    @Req() req: IAuthorizedRequest,
    @Query() filterDto: TransactionFilterDto,
    @Res() res: Response,
  ) {
    const transactions = await this.transactionsService.find(
      req.userId,
      filterDto,
    );
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=transactions.csv',
    );

    await this.transactionsService.exportToCsv(transactions, res);
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: IAuthorizedRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const transaction = await this.transactionsService.create(
      req.userId,
      createTransactionDto,
    );
    const locationUrl = `/transactions/${transaction.id}`;

    res
      .status(HttpStatus.CREATED)
      .header('Location', locationUrl)
      .json(transaction);
  }

  @SerializeOptions({ type: UserSerializeDto })
  @Get('/:id/member')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<UserModel> {
    const user = await this.transactionsService.findOne(id);
    const userId = user.userId;
    return await this.userService.findOne(userId);
  }

  @UseGuards(AuthGuard, TransactionOwnerGuard)
  @Get('/:transactionId')
  async findOne(
    @Param('transactionId', ParseIntPipe) transactionId: number,
  ): Promise<TransactionModel> {
    return await this.transactionsService.findOne(transactionId);
  }

  @UseGuards(AuthGuard, TransactionOwnerGuard)
  @Patch('/:transactionId')
  async update(
    @Param('transactionId', ParseIntPipe) transactionId: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionModel> {
    return await this.transactionsService.update(
      transactionId,
      updateTransactionDto,
    );
  }

  @UseGuards(AuthGuard, TransactionOwnerGuard)
  @Delete('/:transactionId')
  async remove(
    @Param('transactionId', ParseIntPipe) transactionId: number,
  ): Promise<void> {
    await this.transactionsService.remove(transactionId);
  }

  @Post('/:transactionId/subscriptions')
  @UseGuards(AuthGuard, TransactionOwnerGuard)
  async createSubscription(
    @Req() req: IAuthorizedRequest,
    @Body() dto: CreateSubscriptionDto,
    @Param('transactionId', ParseIntPipe) transactionId: number,
  ): Promise<SubscriptionModel> {
    return await this.subscriptionService.createSubscription(
      req.userId,
      transactionId,
      dto,
    );
  }
}
