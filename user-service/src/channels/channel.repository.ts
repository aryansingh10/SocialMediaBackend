import { db, channels } from 'drizzle-orm-package';
import { eq, isNull } from 'drizzle-orm';
import { createChannelInput } from './dto/create-channel.input';
import { Channel } from './models/channel.model';
import { log } from 'console';

export class ChannelRepository {
  async createChannel(input: createChannelInput): Promise<string> {
    const [result] = await db
      .insert(channels)
      .values({ name: input.name })
      .execute();

    return `Channel Succesfully Added with ${result.insertId}`;
  }

  async getChannelById(id: number) {
    const [channel] = await db
      .select()
      .from(channels)
      .where(eq(channels.id, id))
      .limit(1);

    return channel;
  }

  async getAllChannels() {
    const channelsList = await db.select().from(channels);

    return channelsList;
  }

  async deleteChannel(id: number): Promise<string> {
    await db
      .update(channels)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(channels.id, id))
      .execute();

    return 'Channel deleted successfully';
  }

  async updateChannel(id: number, name: string): Promise<string> {
    await db
      .update(channels)
      .set({
        name: name,
        updatedAt: new Date(),
      })
      .where(eq(channels.id, id))
      .execute();

    return `Channel name Updated Successfully`;
  }

  async allActiveChannels() {
    return await db.select().from(channels).where(isNull(channels.deletedAt));
  }

  async findByName(name: string): Promise<boolean> {
    const result = await db
      .select()
      .from(channels)
      .where(eq(channels.name, name));
    return result.length > 0;
  }
}
