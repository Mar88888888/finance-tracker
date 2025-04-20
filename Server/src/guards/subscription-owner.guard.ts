import { CanActivate, ExecutionContext, ForbiddenException,
   Injectable, NotFoundException } from '@nestjs/common';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class SubscriptionOwnerGuard implements CanActivate {
  constructor(
    private readonly subscriptionService: SubscriptionsService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.userId;
    const subscriptionId = request.params.subscriptionId;

    if (!subscriptionId) {
      throw new NotFoundException('Subscription ID is required');
    }

    const subscription = await this.subscriptionService.findOne(parseInt(subscriptionId));

    if (!subscription) {
      throw new NotFoundException('Transaction not found');
    }

    if (subscription.getUserId() !== userId) {
      throw new ForbiddenException('You are not the owner of this transaction');
    }

    return true;
  }
}
