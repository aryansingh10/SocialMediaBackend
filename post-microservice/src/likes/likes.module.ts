import { Module } from '@nestjs/common';
import { LikeResolver } from './likes.resolver';
import { LikeRepository } from './likes.repository';
import { LikeService } from './likes.service';
import { AuthModule } from 'src/auth/auth.module';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
  imports: [AuthModule, ActivityModule],
  providers: [LikeResolver, LikeService, LikeRepository],
})
export class LikeModule {}
