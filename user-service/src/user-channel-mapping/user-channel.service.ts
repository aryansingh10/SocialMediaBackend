import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserChannelRepository } from './user-channel.repository';

@Injectable()
export class UserChannelService {
  constructor(private readonly userChannelRepository: UserChannelRepository) {}

  async addUserToChannel(
    channelId: number,
    userId: number,
    reqUser: { id: number; role: string },
  ) {
    try {
      return await this.userChannelRepository.addUserToChannel(
        channelId,
        userId,
        reqUser,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUserChannels(userId: number) {
    try {
      return await this.userChannelRepository.getUserChannels(userId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeUserFromChannel(
    userId: number,
    channelId: number,
    reqUser: { id: number; role: string },
  ) {
    try {
      return await this.userChannelRepository.removeUser(
        userId,
        channelId,
        reqUser,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUsersFromChannel(
    channelId: number,
    reqUser: { id: number; role: string },
  ) {
    try {
      return await this.userChannelRepository.getUsersInChannel(
        channelId,
        reqUser,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getNoOfUsersfromAChannel(channelId: number) {
    try {
      return await this.userChannelRepository.countUsersInChannel(channelId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
