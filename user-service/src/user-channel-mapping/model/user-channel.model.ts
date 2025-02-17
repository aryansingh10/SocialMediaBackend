import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class UserChannel {
  @Field(() => ID)
  userId: number;

  @Field(() => ID)
  channelId: number;

  @Field()
  role: 'USER' | 'ADMIN';

  @Field()
  joinedAt: Date;
}
