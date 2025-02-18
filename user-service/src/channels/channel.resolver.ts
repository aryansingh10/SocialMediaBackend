import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ChannelService } from './channel.service';
import { Channel } from './models/channel.model';
import { createChannelInput } from './dto/create-channel.input';
import { UseGuards, InternalServerErrorException } from '@nestjs/common';
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
    try {
      return await this.channelService.getChannelById(id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching channel: ${error.message}`,
      );
    }
  }

  @Query(() => [Channel], { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async getAllChannels() {
    try {
      return await this.channelService.getAllChannels();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching all channels: ${error.message}`,
      );
    }
  }

  @Query(() => [Channel], { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async getAllActiveChannels() {
    try {
      return await this.channelService.allActiveChannels();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching active channels: ${error.message}`,
      );
    }
  }

  @Query(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async channelExists(@Args('name') name: string): Promise<boolean> {
    try {
      return await this.channelService.existByName(name);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error checking if channel exists: ${error.message}`,
      );
    }
  }

  @Mutation(() => String, { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async softDeleteChannel(@Args('id') id: number): Promise<string> {
    try {
      return await this.channelService.deleteChannel(id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error soft deleting channel: ${error.message}`,
      );
    }
  }

  @Mutation(() => String, { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async DeleteChannelFromDB(@Args('id') id: number) {
    try {
      return await this.channelService.deleteChannelFromDatabase(id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting channel from database: ${error.message}`,
      );
    }
  }

  @Mutation(() => String, { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async updateChannel(@Args('id') id: number, @Args('name') name: string) {
    try {
      return await this.channelService.updateChannel(id, name);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating channel: ${error.message}`,
      );
    }
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async createChannel(
    @Args('input') input: createChannelInput,
  ): Promise<string> {
    try {
      return await this.channelService.createChannel(input);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating channel: ${error.message}`,
      );
    }
  }
}
