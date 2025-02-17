import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Reply {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  commentId: number;

  @Field(() => Int)
  authorId: number;

  @Field(() => Int)
  channelId: number;

  @Field()
  content: string;

  @Field()
  createdAt: Date;
}
