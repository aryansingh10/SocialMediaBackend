import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,

      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name: 'post-microservice',

              url: 'http://localhost:3001/graphql',
            },
            {
              name: 'user-service',
              url: 'http://localhost:3000/graphql',
            },
          ],
        }),
        buildService: ({ url }) => {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }) {
              if (context.req && context.req.headers) {
                request.http?.headers.set(
                  'Authorization',
                  context.req.headers.authorization,
                );
              }
            },
          });
        },
      },
    }),
  ],
})
export class AppModule {}
