import { Resolver, Mutation, Args, Query, ID } from '@nestjs/graphql';
import { ChannelService } from './channel.service';
import { Channel } from './models/channel.model';
import { createChannelInput } from './dto/create-channel.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Query(() => Channel, { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  async channel(@Args('id') id: number) {
    return this.channelService.getChannelById(id);
  }

  @Query(() => [Channel], { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async getAllChannels() {
    return this.channelService.getAllChannels();
  }

  @Query(() => [Channel], { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async getAllActiveChannels() {
    return this.channelService.allActiveChannels();
  }

  @Query(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async channelExists(@Args('name') name: string): Promise<boolean> {
    return this.channelService.existByName(name);
  }

  @Mutation(() => String, { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async softDeleteChannel(@Args('id') id: number): Promise<string> {
    return this.channelService.deleteChannel(id);
  }

  @Mutation(() => String, { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async updateChannel(@Args('id') id: number, @Args('name') name: string) {
    return this.channelService.updateChannel(id, name);
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async createChannel(
    @Args('input') input: createChannelInput,
  ): Promise<string> {
    return this.channelService.createChannel(input);
  }
}
