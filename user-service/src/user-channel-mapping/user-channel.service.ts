import { Injectable } from '@nestjs/common';
import { UserChannelRepository } from './user-channel.repository';

@Injectable()
export class UserChannelService {
  constructor(private readonly userChannelRepository: UserChannelRepository) {}

  async addUserToChannel(
    channelId: number,
    userId: number,
    reqUser: { id: number; role: string },
  ) {
    return await this.userChannelRepository.addUserToChannel(
      channelId,
      userId,
      reqUser,
    );
  }

  async getUserChannels(userId: number) {
    return this.userChannelRepository.getUserChannels(userId);
  }

  async removeUserFromChannel(
    userId: number,
    channelId: number,
    reqUser: { id: number; role: string },
  ) {
    return this.userChannelRepository.removeUser(userId, channelId, reqUser);
  }

  async getUsersFromChannel(
    channelId: number,
    reqUser: { id: number; role: string },
  ) {
    return this.userChannelRepository.getUsersInChannel(channelId, reqUser);
  }

  async getNoOfUsersfromAChannel(channelId: number) {
    return this.userChannelRepository.countUsersInChannel(channelId);
  }
}
