import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Activity {
  @Field()
  id: number;

  @Field()
  userId: number;

  @Field()
  entity: string;

  @Field()
  action: string;

  @Field()
  entityId: number;

  @Field()
  channelId: number;

  @Field()
  createdAt: Date;
}
