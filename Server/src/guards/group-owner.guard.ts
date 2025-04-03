import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { GroupsService } from '../groups/groups.service';

@Injectable()
export class GroupOwnerGuard implements CanActivate {
  constructor(
    private readonly groupsService: GroupsService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.userId;
    const groupId = request.params.groupId;

    if (!groupId) {
      throw new NotFoundException('Group ID is required');
    }

    const group = await this.groupsService.findOne(parseInt(groupId));

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.getOwner().getId() !== userId) {
      throw new ForbiddenException('You are not the owner of this group');
    }

    return true;
  }
}
