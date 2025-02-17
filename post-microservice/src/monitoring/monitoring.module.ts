import { Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { ActivityService } from 'src/activity/activity.service';
import { ActivityModule } from 'src/activity/activity.module';
import { MonitoringResolver } from './monitoring.resolver';
import { MonitoringService } from './monitoring.service';
import { MonitoringRepository } from './monitoring.repository';

@Module({
  imports: [AuthModule, ActivityModule],
  providers: [MonitoringResolver, MonitoringService, MonitoringRepository],
  exports: [MonitoringService],
})
export class MonitoringModule {}
