import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, Min, IsString, Length } from 'class-validator';

@InputType()
export class CreateCommentDto {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  postId: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  channelId: number;

  @Field()
  @IsString()
  @Length(1, 500, { message: 'Comment must be between 1 and 500 characters' })
  content: string;
}
