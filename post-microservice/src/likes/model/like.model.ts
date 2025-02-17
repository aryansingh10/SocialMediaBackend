import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Like {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  entityId: number;

  @Field()
  type: 'post' | 'comment' | 'reply';

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  channelId: number;

  @Field(() => Date)
  createdAt: Date;
}
