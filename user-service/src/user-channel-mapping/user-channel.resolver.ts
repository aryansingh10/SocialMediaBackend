import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserChannelService } from './user-channel.service';
import { UserChannel } from './model/user-channel.model';
import { User } from 'src/users/models/user.model';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Resolver(() => UserChannel)
export class UserChannelResolver {
  constructor(private readonly userChannelService: UserChannelService) {}

  @Query(() => [UserChannel])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  async getUserChannel(@Args('userId') userId: number) {
    return this.userChannelService.getUserChannels(userId);
  }

  @Query(() => [User])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  async getUsersFromAChannel(
    @Args('channelId') channelId: number,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    return this.userChannelService.getUsersFromChannel(channelId, reqUser);
  }

  @Query(() => Number)
  async getCntofUsersinChannel(@Args('channelId') channelId: number) {
    return this.userChannelService.getNoOfUsersfromAChannel(channelId);
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard, RolesGuard)
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
      console.log(error);
      return error.message;
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
    await this.userChannelService.removeUserFromChannel(
      userId,
      channelId,
      reqUser,
    );
    return 'User removed from channel successfully';
  }
}
