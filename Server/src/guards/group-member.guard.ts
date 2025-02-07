import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { GroupsService } from '../groups/groups.service';

@Injectable()
export class MemberGuard implements CanActivate {
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

    const group = await this.groupsService.findById(parseInt(groupId));

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (!group.getMembers().some(member => member.getId() === userId)) {
      throw new ForbiddenException('You are not a member of this group');
    }

    return true;
  }
}
