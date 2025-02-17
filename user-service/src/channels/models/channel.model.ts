import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Channel {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String) // Not nullable, MySQL auto-generates this
  createdAt: string;

  @Field(() => String) // Not nullable, auto-updated on row update
  updatedAt: string;

  @Field(() => String, { nullable: true }) // Nullable for soft delete
  deletedAt?: string;
}
