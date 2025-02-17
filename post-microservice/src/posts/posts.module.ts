import { Module } from '@nestjs/common';
import { PostResolver } from './posts.resolver';
import { PostService } from './posts.service';
import { PostRepository } from './posts.repository';
import { AuthModule } from 'src/auth/auth.module';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
  imports: [AuthModule, ActivityModule],
  providers: [PostResolver, PostService, PostRepository],
})
export class PostModule {}
