import { Resolver, Query, Args } from '@nestjs/graphql';
import { MonitoringService } from './monitoring.service';
import { StatsUserInput } from './dto/stats-user.input';
import { UserActivityStatsDto } from './dto/user-activity-stats.dto.ts';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
@Resolver()
export class MonitoringResolver {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Query(() => [UserActivityStatsDto])
  // @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async getUserActivityStats(
    @Args('input') input: StatsUserInput,
  ): Promise<UserActivityStatsDto[]> {
    return this.monitoringService.getUserActivityStats(input);
  }
}
