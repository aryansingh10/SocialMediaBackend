import { Module } from '@nestjs/common';
import { ActivityRepository } from './activity.repository';
import { ActivityResolver } from './activity.resolver';
import { ActivityService } from './activity.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ActivityRepository, ActivityResolver, ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
