import { CanActivate, ExecutionContext, ForbiddenException,
   Injectable, NotFoundException } from '@nestjs/common';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class TransactionOwnerGuard implements CanActivate {
  constructor(
    private readonly transactionService: TransactionsService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.userId;
    const transactionId = request.params.transactionId;

    if (!transactionId) {
      throw new NotFoundException('Transaction ID is required');
    }

    const transaction = await this.transactionService.findOne(parseInt(transactionId));

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.getMemberId() !== userId) {
      throw new ForbiddenException('You are not the owner of this transaction');
    }

    return true;
  }
}
