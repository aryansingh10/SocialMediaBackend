import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ActivityDetailDto {
  @Field(() => Number)
  id: number;

  @Field(() => Number)
  userId: number;

  @Field(() => String)
  entity: 'POST' | 'COMMENT' | 'REPLY' | 'LIKE';

  @Field(() => String)
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'ADDED' | 'REMOVED';

  @Field(() => Number)
  entityId: number;

  @Field(() => Number)
  channelId: number;

  @Field(() => Date, { nullable: true })
  createdAt: Date | null;
}
