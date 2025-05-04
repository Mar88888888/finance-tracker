import {
  Body, ClassSerializerInterceptor, Controller,
  Delete, Get, HttpStatus,
  Param, Patch, Post, Req, Res,
  SerializeOptions, UseGuards, UseInterceptors,
  ParseIntPipe,
  Query
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create.group.dto';
import { UpdateGroupDto } from './dto/update.group.dto';
import { AuthGuard } from '../guards/auth.guard';
import { JoinGroupDto } from './dto/join-group.dto';
import { GroupModel } from './group.model';
import { Response } from 'express';
import { SerializeTransactionDto } from '../transactions/dto/serialize.transaction.dto';
import { AddPurposeDto } from './dto/add-purpose.dto';
import { GroupOwnerGuard } from '../guards/group-owner.guard';
import { MemberGuard } from '../guards/group-member.guard';
import { TransactionModel } from '../transactions/transaction.model';
import { IAuthorizedRequest } from '../abstracts/authorized-request.interface';
import { TransactionFilterDto } from '../transactions/dto/transaction-filter.dto';
import { TransactionsService } from '../transactions/transactions.service';

@Controller('groups')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: GroupModel })
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly transactionsService: TransactionsService,
  ) { }

  @UseGuards(AuthGuard, MemberGuard)
  @Get('/:groupId/code')
  async getJoinCode(@Param('groupId', ParseIntPipe) id: number): Promise<string> {
    return await this.groupsService.getGroupCode(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: SerializeTransactionDto })
  @UseGuards(AuthGuard, MemberGuard)
  @Get('/:groupId/transactions')
  async getTransactions(
    @Param('groupId', ParseIntPipe) id: number,
    @Query() filterDto: TransactionFilterDto,
    ): Promise<TransactionModel[]> {
    return await this.groupsService.getTransactions(id, filterDto);
  }

  @UseGuards(AuthGuard, MemberGuard)
  @Get('/:groupId/transactions/export')
  async exportGroupTransactions(
    @Query() filterDto: TransactionFilterDto,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Res() res: Response,
  ) {
    const transactions = await this.groupsService.getTransactions(groupId, filterDto);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=group_transactions.csv');

    await this.transactionsService.exportToCsv(transactions, res);
  }


  @UseGuards(AuthGuard, MemberGuard)
  @Get('/:groupId')
  async getById(@Param('groupId', ParseIntPipe) id: number): Promise<GroupModel> {
    return await this.groupsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getUserGroups(
    @Req() request: IAuthorizedRequest
  ): Promise<GroupModel[]> {
    return await this.groupsService.getUserGroups(request.userId);
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createGroupDto: CreateGroupDto, 
    @Req() request: IAuthorizedRequest
  ): Promise<GroupModel> {
    return this.groupsService.create(request.userId, createGroupDto);
  }

  @UseGuards(AuthGuard, MemberGuard)
  @Post('/:groupId/purposes')
  async addPurposes(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() purposes: AddPurposeDto
  ): Promise<GroupModel> {
    return this.groupsService.addPurposes(groupId, purposes);
  }

  @UseGuards(AuthGuard, GroupOwnerGuard)
  @Patch('/:groupId')
  async update(
    @Param('groupId', ParseIntPipe) id: number,
    @Body() updateGroupDto: UpdateGroupDto
  ): Promise<GroupModel> {
    return this.groupsService.update(id, updateGroupDto);
  }

  @UseGuards(AuthGuard)
  @Post('/members')
  async joinGroup(
    @Body() joinGroupDto: JoinGroupDto,
    @Req() request: IAuthorizedRequest
  ): Promise<GroupModel> {
    return this.groupsService.joinGroup(joinGroupDto.joinCode, request.userId);
  }

  @UseGuards(AuthGuard, GroupOwnerGuard)
  @Delete('/:groupId')
  async remove(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    await this.groupsService.remove(groupId);
    res.status(HttpStatus.NO_CONTENT);
  }

  @UseGuards(AuthGuard, GroupOwnerGuard)
  @Delete('/:groupId/members/:memberId')
  async removeUserFromGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    await this.groupsService.removeUserFromGroup(groupId, memberId);
    res.status(HttpStatus.NO_CONTENT);
  }

  @UseGuards(AuthGuard, GroupOwnerGuard)
  @Delete('/:groupId/purposes/:purposeId')
  async removePurposesFromGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('purposeId', ParseIntPipe) purposeId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.groupsService.removePurposeFromGroup(groupId, purposeId);
    res.status(HttpStatus.NO_CONTENT);
  }
}
