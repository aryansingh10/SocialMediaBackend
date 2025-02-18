import { db, channels } from 'drizzle-orm-package';
import { eq, isNull } from 'drizzle-orm';
import { createChannelInput } from './dto/create-channel.input';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

export class ChannelRepository {
  async createChannel(input: createChannelInput): Promise<string> {
    try {
      const [result] = await db
        .insert(channels)
        .values({ name: input.name })
        .execute();

      return `Channel Successfully Added with Id ${result.insertId}`;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating channel: ${error.message}`,
      );
    }
  }

  async getChannelById(id: number) {
    try {
      const [channel] = await db
        .select()
        .from(channels)
        .where(eq(channels.id, id))
        .limit(1);

      return channel;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching channel: ${error.message}`,
      );
    }
  }

  async getAllChannels() {
    try {
      return await db.select().from(channels);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching all channels: ${error.message}`,
      );
    }
  }

  async deleteChannel(id: number): Promise<string> {
    try {
      const channel = await db
        .select()
        .from(channels)
        .where(eq(channels.id, id));

      if (channel.length === 0) {
        throw new NotFoundException(`Channel not found with id ${id}`);
      }

      if (channel[0].deletedAt !== null) {
        return `Channel Already Deleted`;
      }

      await db
        .update(channels)
        .set({
          deletedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(channels.id, id))
        .execute();

      return 'Channel deleted successfully';
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting channel: ${error.message}`,
      );
    }
  }

  async updateChannel(id: number, name: string): Promise<string> {
    try {
      await db
        .update(channels)
        .set({
          name: name,
          updatedAt: new Date(),
        })
        .where(eq(channels.id, id))
        .execute();

      return `Channel name Updated Successfully`;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating channel: ${error.message}`,
      );
    }
  }

  async allActiveChannels() {
    try {
      return await db.select().from(channels).where(isNull(channels.deletedAt));
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching active channels: ${error.message}`,
      );
    }
  }

  async findByName(name: string): Promise<boolean> {
    try {
      const result = await db
        .select()
        .from(channels)
        .where(eq(channels.name, name));
      return result.length > 0;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error finding channel by name: ${error.message}`,
      );
    }
  }

  async deleteChannelFromDB(chanelID: number): Promise<string> {
    try {
      const channel = await db
        .select()
        .from(channels)
        .where(eq(channels.id, chanelID));

      if (channel.length === 0) {
        throw new NotFoundException(
          `Channel with id ${chanelID} does not exist`,
        );
      }

      await db.delete(channels).where(eq(channels.id, chanelID));

      return 'Channel Deleted From the database';
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting channel from DB: ${error.message}`,
      );
    }
  }
}
