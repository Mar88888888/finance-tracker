import { Controller, Get, Post, Patch, Delete, Body, Param, NotFoundException, BadRequestException, Query, UseGuards, Req, UseInterceptors, SerializeOptions, ClassSerializerInterceptor } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './transaction.entity';
import { AuthGuard } from '../guards/auth.guard';
import { SerializeTransactionDto } from './dto/serialize.transaction.dto';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: SerializeTransactionDto })
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
    @Query('purposes') purposes?: string,
    @Query('orderBy') orderBy?: string,
    @Query('sortOrder') sortOrder?: "ASC" | "DESC",
  ): Promise<Transaction[]> {
    const purposesArray = purposes ? purposes.split(',') : undefined;

    return this.transactionsService.find({ startdate, enddate, type, purposes: purposesArray, orderBy, sortOrder });
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto, @Req() req): Promise<Transaction> {
    return await this.transactionsService.create(req.userId, createTransactionDto);
  }

  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<Transaction> {
    try {
      return await this.transactionsService.findOne(id);
    } catch (error) {
      throw new NotFoundException('Transaction not found');
    }
  }

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    return await this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number): Promise<Transaction> {
    try {
      return await this.transactionsService.remove(id);
    } catch (error) {
      throw new NotFoundException('Transaction not found');
    }
  }
}
