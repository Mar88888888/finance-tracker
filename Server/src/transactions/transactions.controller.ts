import { Controller, Get, Post, Patch, Delete, Body,
   Param, NotFoundException, Query, UseGuards, Req,
    UseInterceptors, SerializeOptions, ClassSerializerInterceptor,
     Res, HttpStatus } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from '../guards/auth.guard';
import { SerializeTransactionDto } from './dto/serialize.transaction.dto';
import { Response } from 'express';
import { UserSerializeDto } from 'src/users/dto/serialize.user.dto';
import { TransactionModel } from './transaction.model';
import { UserModel } from 'src/users/user.model';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: SerializeTransactionDto })
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
  ) {}

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
    return this.transactionsService.find(req.userId, { startdate, enddate, type, purposes: purposesArray, orderBy, sortOrder });
  }



  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req,
    @Res({passthrough: true}) res: Response,
  ): Promise<void> {
    const transaction = await this.transactionsService.create(req.userId, createTransactionDto);
    const locationUrl = `/transactions/${transaction.getId()}`; 

    res
      .status(HttpStatus.CREATED)
      .header('Location', locationUrl) 
      .json(transaction);
  }

  @SerializeOptions({ type: UserSerializeDto})
  @Get('/:id/member')
  async getUser(@Param('id') id: number): Promise<UserModel> {
    try {
      return (await this.transactionsService.findOne(id)).getMember();
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<TransactionModel> {
    try {
      return await this.transactionsService.findOne(id);
    } catch (error) {
      throw new NotFoundException('Transaction not found');
    }
  }

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() updateTransactionDto: UpdateTransactionDto): Promise<TransactionModel> {
    return await this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number): Promise<TransactionModel> {
    try {
      return await this.transactionsService.remove(id);
    } catch (error) {
      throw new NotFoundException('Transaction not found');
    }
  }
}
