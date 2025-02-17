import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloDriver,
  ApolloDriverConfig,
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { UserModule } from './users/users.module'; // Import your module
import { ChannelModule } from './channels/channel.module';
import { UserChannelModule } from './user-channel-mapping/user-channel.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
        path: join(process.cwd(), 'src/graphql/schema.graphql'),
      },
    }),
    UserModule,
    ChannelModule,
    UserChannelModule,
    AuthModule,
  ],
})
export class AppModule {}
