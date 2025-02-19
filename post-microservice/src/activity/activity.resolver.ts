import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { Activity } from './model/activity.model';
import { UseGuards, InternalServerErrorException } from '@nestjs/common';

import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/current-user';

@Resolver(() => Activity)
export class ActivityResolver {
  constructor(private readonly activityService: ActivityService) {}

  @Mutation(() => String)
  async recordActivity(@Args('input') input: CreateActivityDto) {
    try {
      return await this.activityService.recordActivity(input);
    } catch (error) {
      console.error('Error recording activity:', error);
      throw new InternalServerErrorException('Failed to record activity');
    }
  }

  @Query(() => [Activity])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  async getUserActivities(
    @Args('userId') userId: number,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      return await this.activityService.getUserActivities(userId, reqUser);
    } catch (error) {
      console.error('Error fetching user activities:', error);
      throw new InternalServerErrorException('Failed to fetch user activities');
    }
  }
}
