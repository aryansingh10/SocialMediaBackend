import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class StatsUserInput {
  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field({ nullable: true })
  userId?: number;
}
