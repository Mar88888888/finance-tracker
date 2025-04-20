import { Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { SubscriptionsService } from './subscriptions.service';
import { IAuthorizedRequest } from '../abstracts/authorized-request.interface';
import { SubscriptionModel } from './subscription.model';
import { SubscriptionOwnerGuard } from '../guards/subscription-owner.guard';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly subscriptionService: SubscriptionsService,
  ) {}
  
  @Get()
  @UseGuards(AuthGuard)
  async getUserSubscriptions(@Req() req: IAuthorizedRequest): Promise<SubscriptionModel[]> {
    return await this.subscriptionService.getUserSubscriptions(req.userId);
  }

  @Delete('/:subscriptionId')
  @UseGuards(AuthGuard, SubscriptionOwnerGuard)
  async deleteSubscription(
    @Param('subscriptionId', ParseIntPipe) subscriptionId: number): Promise<void> {
    return await this.subscriptionService.deleteSubscription(subscriptionId);
  }
}
