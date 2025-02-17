import { Injectable } from '@nestjs/common';
import { ChannelRepository } from './channel.repository';
import { createChannelInput } from './dto/create-channel.input';

@Injectable()
export class ChannelService {
  constructor(private readonly channelRepository: ChannelRepository) {}

  async createChannel(input: createChannelInput): Promise<string> {
    return this.channelRepository.createChannel(input);
  }
  async getChannelById(id: number) {
    return this.channelRepository.getChannelById(id);
  }

  async getAllChannels() {
    return this.channelRepository.getAllChannels();
  }

  async deleteChannel(id: number): Promise<string> {
    return await this.channelRepository.deleteChannel(id);
  }

  async updateChannel(id: number, name: string): Promise<string> {
    return await this.channelRepository.updateChannel(id, name);
  }

  async allActiveChannels() {
    return await this.channelRepository.allActiveChannels();
  }

  async existByName(name: string) {
    return await this.channelRepository.findByName(name);
  }
}
