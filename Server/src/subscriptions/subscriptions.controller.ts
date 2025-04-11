import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionsService } from './subscriptions.service';
import { IAuthorizedRequest } from '../abstracts/authorized-request.interface';
import { SubscriptionModel } from './subscription.model';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly subscriptionService: SubscriptionsService,
  ) {}
  
  @Post()
  @UseGuards(AuthGuard)
  async create(@Req() req: IAuthorizedRequest, @Body() dto: CreateSubscriptionDto): Promise<SubscriptionModel> {
    return await this.subscriptionService.createsubscription(req.userId, dto);
  }

}
