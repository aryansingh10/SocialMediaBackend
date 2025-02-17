import { Module } from '@nestjs/common';
import { UserChannelService } from './user-channel.service';
import { UserChannelResolver } from './user-channel.resolver';
import { UserChannelRepository } from './user-channel.repository';

@Module({
  providers: [UserChannelResolver, UserChannelService, UserChannelRepository],
  exports: [UserChannelService],
})
export class UserChannelModule {}
