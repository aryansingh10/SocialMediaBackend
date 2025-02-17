import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelResolver } from './channel.resolver';
import { ChannelRepository } from './channel.repository';

@Module({
  providers: [ChannelService, ChannelResolver, ChannelRepository],
  exports: [ChannelService, ChannelRepository],
})
export class ChannelModule {}
