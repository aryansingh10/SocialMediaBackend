import { registerEnumType } from '@nestjs/graphql';

export enum ActivityType {
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

registerEnumType(ActivityType, { name: 'ActivityType' });
registerEnumType(ActionType, { name: 'ActionType' });
