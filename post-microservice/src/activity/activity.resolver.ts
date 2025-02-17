import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { Activity } from './model/activity.model';
import { EntityType } from './enum/entity-type';
import { UseGuards } from '@nestjs/common';

import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/current-user';

@Resolver(() => Activity)
export class ActivityResolver {
  constructor(private readonly activityService: ActivityService) {}

  @Mutation(() => String)
  async recordActivity(@Args('input') input: CreateActivityDto) {
    return await this.activityService.recordActivity(input);
  }

  @Query(() => [Activity])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  async getUserActivities(
    @Args('userId') userId: number,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    return await this.activityService.getUserActivities(userId, reqUser);
  }
}
