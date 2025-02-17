import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsInt } from 'class-validator';

enum EntityType {
  POST = 'POST',
  COMMENT = 'COMMENT',
  REPLY = 'REPLY',
  LIKE = 'LIKE',
}

export enum ActionType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  ADDED = 'ADDED',
  REMOVED = 'REMOVED',
}

@InputType()
export class CreateActivityDto {
  @Field()
  @IsInt()
  userId: number;

  @Field()
  @IsEnum(EntityType)
  entity: EntityType;

  @Field()
  @IsEnum(ActionType)
  action: ActionType;

  @Field()
  @IsInt()
  entityId: number;

  @Field()
  @IsInt()
  channelId: number;
}
