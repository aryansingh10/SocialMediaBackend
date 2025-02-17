import { Resolver, Query, Args } from '@nestjs/graphql';
import { MonitoringService } from './monitoring.service';
import { Activity } from 'src/activity/model/activity.model';

@Resolver()
export class MonitoringResolver {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Query(() => [Activity])
  async getActivitiesByTimeRange(
    @Args('userId') userId: number,
    @Args('startTime', { nullable: true }) startTime: string,
    @Args('endTime', { nullable: true }) endTime: string,
  ) {
    return await this.monitoringService.getActivitiesByTimeRange(
      userId,
      startTime,
      endTime,
    );
  }
}
