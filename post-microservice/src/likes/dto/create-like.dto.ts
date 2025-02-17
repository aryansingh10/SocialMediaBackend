import { IsEnum, IsInt, Min } from 'class-validator';
import { LikeType } from '../utils/like-type.enum';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateLikeDto {
  @Field(() => Int)
  @IsInt()
  @Min(1, { message: 'Entity ID must be a positive integer.' })
  entityId: number;

  @Field()
  @IsEnum(LikeType, { message: 'Invalid like type.' })
  type: LikeType;

  @Field(() => Int)
  @IsInt()
  @Min(1, { message: 'Channel ID must be a positive integer.' })
  channelId: number;
}
