import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Post {
  @Field()
  id: number;

  @Field()
  content: string;

  @Field()
  authorId: number;

  @Field()
  channelId: number;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date;
}
