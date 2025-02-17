import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class createChannelInput {
  @Field()
  name: string;
}
