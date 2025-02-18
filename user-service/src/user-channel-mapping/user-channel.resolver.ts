import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserChannelService } from './user-channel.service';
import { UserChannel } from './model/user-channel.model';
import { User } from 'src/users/models/user.model';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { handleError } from 'src/users/helper/error-handler';
@Resolver(() => UserChannel)
export class UserChannelResolver {
  constructor(private readonly userChannelService: UserChannelService) {}

  @Query(() => [UserChannel])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  async getUserChannel(@Args('userId') userId: number) {
    try {
      return await this.userChannelService.getUserChannels(userId);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch user channels.');
    }
  }

  @Query(() => [User])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  async getUsersFromAChannel(
    @Args('channelId') channelId: number,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      return await this.userChannelService.getUsersFromChannel(
        channelId,
        reqUser,
      );
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch users from the channel.');
    }
  }

  @Query(() => Number)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async getCntofUsersinChannel(@Args('channelId') channelId: number) {
    try {
      return await this.userChannelService.getNoOfUsersfromAChannel(channelId);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to count users in the channel.');
    }
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  async addUserToChannel(
    @Args('channelId') channelId: number,
    @Args('userId') userId: number,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      return await this.userChannelService.addUserToChannel(
        channelId,
        userId,
        reqUser,
      );
    } catch (error) {
      console.error(error);
      handleError(error, 'Failed To add User in Channel');
    }
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  async removeUserFromChannel(
    @Args('userId') userId: number,
    @Args('channelId') channelId: number,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      await this.userChannelService.removeUserFromChannel(
        userId,
        channelId,
        reqUser,
      );
    } catch (error) {
      console.error(error);
      throw new Error('Failed to remove user from channel');
    }
  }
}
