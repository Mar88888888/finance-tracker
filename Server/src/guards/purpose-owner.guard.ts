import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PurposesService } from 'src/purposes/purposes.service';

@Injectable()
export class PurposeOwnerGuard implements CanActivate {
  constructor(
    private readonly purposesService: PurposesService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.userId;
    const purposeId = request.params.purposeId;

    if (!purposeId) {
      throw new NotFoundException('Purpose ID is required');
    }

    const purpose = await this.purposesService.findOne(parseInt(purposeId));

    if (!purpose) {
      throw new NotFoundException('Purpose not found');
    }

    if (purpose.getUserId() !== userId) {
      throw new ForbiddenException('You are not the owner of this purpose');
    }

    return true;
  }
}
