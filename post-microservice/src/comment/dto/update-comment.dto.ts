import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, Min, IsString, Length } from 'class-validator';

@InputType()
export class UpdateCommentDto {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  id: number;

  @Field()
  @IsString()
  @Length(1, 500, { message: 'Comment must be between 1 and 500 characters' })
  content: string;
}
