import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChannelRepository } from './channel.repository';
import { createChannelInput } from './dto/create-channel.input';

@Injectable()
export class ChannelService {
  constructor(private readonly channelRepository: ChannelRepository) {}

  async createChannel(input: createChannelInput): Promise<string> {
    try {
      return await this.channelRepository.createChannel(input);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating channel: ${error.message}`,
      );
    }
  }

  async getChannelById(id: number) {
    try {
      return await this.channelRepository.getChannelById(id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching channel by ID: ${error.message}`,
      );
    }
  }

  async getAllChannels() {
    try {
      return await this.channelRepository.getAllChannels();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching all channels: ${error.message}`,
      );
    }
  }

  async deleteChannel(id: number): Promise<string> {
    try {
      return await this.channelRepository.deleteChannel(id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting channel: ${error.message}`,
      );
    }
  }

  async updateChannel(id: number, name: string): Promise<string> {
    try {
      return await this.channelRepository.updateChannel(id, name);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating channel: ${error.message}`,
      );
    }
  }

  async allActiveChannels() {
    try {
      return await this.channelRepository.allActiveChannels();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching active channels: ${error.message}`,
      );
    }
  }

  async existByName(name: string) {
    try {
      return await this.channelRepository.findByName(name);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error checking channel existence: ${error.message}`,
      );
    }
  }

  async deleteChannelFromDatabase(channelId: number) {
    try {
      return await this.channelRepository.deleteChannelFromDB(channelId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting channel from database: ${error.message}`,
      );
    }
  }
}
