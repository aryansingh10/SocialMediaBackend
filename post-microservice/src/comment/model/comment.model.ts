import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Comment {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  postId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  channelId: number;

  @Field()
  content: string;

  @Field()
  createdAt: Date;
}
