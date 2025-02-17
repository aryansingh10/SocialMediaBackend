import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, Min, IsString } from 'class-validator';

@InputType()
export class CreateReplyDto {
  @Field(() => Int)
  @IsInt()
  @Min(1, { message: 'Comment ID must be a positive integer.' })
  commentId: number;

  @Field(() => Int)
  @IsInt()
  @Min(1, { message: 'Channel ID must be a positive integer.' })
  channelId: number;

  @Field()
  @IsString()
  content: string;
}
