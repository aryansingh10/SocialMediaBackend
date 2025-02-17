import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PostModule } from './posts/posts.module';
import {
  ApolloDriver,
  ApolloDriverConfig,
  ApolloFederationDriverConfig,
  ApolloFederationDriver,
} from '@nestjs/apollo';
import { LikeModule } from './likes/likes.module';

import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comment/comment.module';
import { RepliesModule } from './replies/reply.module';
import { ActivityModule } from './activity/activity.module';
import { MonitoringModule } from './monitoring/monitoring.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),

    PostModule,
    LikeModule,
    AuthModule,
    CommentsModule,
    RepliesModule,
    ActivityModule,
    MonitoringModule,
  ],
})
export class AppModule {}
