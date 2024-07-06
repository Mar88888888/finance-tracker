import { Controller, Get, Post, Patch, Delete, Body, Param, NotFoundException, BadRequestException, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './transaction.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('/all')
  async findAll(): Promise<Transaction[]> {
    return this.transactionsService.findAll();
  }

 @Get()
  async find(
    @Query('startdate') startdate?: string,
    @Query('enddate') enddate?: string,
    @Query('type') type?: boolean,
    @Query('members') members?: string,
    @Query('purposes') purposes?: string,
    @Query('orderBy') orderBy?: string,
    @Query('sortOrder') sortOrder?: "ASC" | "DESC",
  ): Promise<Transaction[]> {
    const membersArray = members ? members.split(',') : undefined;
    const purposesArray = purposes ? purposes.split(',') : undefined;

    return this.transactionsService.find({ startdate, enddate, type, members: membersArray, purposes: purposesArray, orderBy, sortOrder });
  }

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    try {
      return await this.transactionsService.create(createTransactionDto);
    } catch (error) {
      throw new BadRequestException('Failed to create transaction.');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Transaction> {
    try {
      return await this.transactionsService.findOne(id);
    } catch (error) {
      throw new NotFoundException('Transaction not found');
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    try {
      return await this.transactionsService.update(id, updateTransactionDto);
    } catch (error) {
      throw new BadRequestException('Failed to update transaction.');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<Transaction> {
    try {
      return await this.transactionsService.remove(id);
    } catch (error) {
      throw new NotFoundException('Transaction not found');
    }
  }
}
