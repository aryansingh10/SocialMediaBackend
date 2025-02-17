import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreatePostDto {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty({ message: 'Channel ID is required' })
  channelId: number;
}

@InputType()
export class UpdatePostDto {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty({ message: 'Post ID is required' })
  id: number;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Content cannot be empty' })
  content: string;
}
