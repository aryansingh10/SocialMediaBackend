import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLDateTimeISO } from 'graphql-scalars';
import { ActivityType, ActionType } from '../types/activity.types';

@ObjectType()
export class ActivityDto {
  @Field()
  id: number;

  @Field()
  userId: number;

  @Field(() => ActivityType)
  entity: 'POST' | 'COMMENT' | 'REPLY' | 'LIKE';

  @Field(() => ActionType)
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'ADDED' | 'REMOVED';

  @Field()
  entityId: number;

  @Field()
  channelId: number;

  @Field(() => GraphQLDateTimeISO, { nullable: true }) // ✅ Explicit Date type
  createdAt?: Date | null;
}

@ObjectType()
export class UserActivityStatsDto {
  @Field()
  id: number;

  @Field()
  totalActivityCount: number;

  @Field()
  postCount: number;

  @Field()
  commentCount: number;

  @Field()
  replyCount: number;

  @Field()
  likeCount: number;
}
