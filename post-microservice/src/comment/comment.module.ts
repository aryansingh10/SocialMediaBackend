import { Module } from '@nestjs/common';
import { CommentsService } from './comment.service';
import { CommentsRepository } from './comment.repository';
import { CommentsResolver } from './comment.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { ActivityService } from 'src/activity/activity.service';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
  imports: [AuthModule, ActivityModule],
  providers: [CommentsResolver, CommentsService, CommentsRepository],
  exports: [CommentsService],
})
export class CommentsModule {}
