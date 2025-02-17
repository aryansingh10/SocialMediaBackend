import { Module } from '@nestjs/common';
import { RepliesService } from './reply.service';
import { RepliesRepository } from './reply.repository';
import { RepliesResolver } from './reply.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
  imports: [AuthModule, ActivityModule],
  providers: [RepliesService, RepliesRepository, RepliesResolver],
})
export class RepliesModule {}
