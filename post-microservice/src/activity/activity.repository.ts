import { Injectable, UnauthorizedException } from '@nestjs/common';
import { db, userChannel } from 'drizzle-orm-package';
import { activity } from 'drizzle-orm-package';
import { eq, and, sql } from 'drizzle-orm';
import { CreateActivityDto } from './dto/create-activity.dto';
import { EntityType } from './enum/entity-type';
import { log } from 'console';
@Injectable()
export class ActivityRepository {
  async createActivity(input: CreateActivityDto) {
    const [result] = await db.insert(activity).values(input);
    return `Activity recorded with ID ${result.insertId}`;
  }
  async getActivitiesByUser(
    userId: number,
    reqUser: { id: number; role: string },
  ) {
    if (reqUser.role === 'SUPERADMIN') {
      return await db
        .select()
        .from(activity)
        .where(eq(activity.userId, userId));
    }

    if (reqUser.role === 'ADMIN') {
      const adminChannels = await db
        .select({ channelId: userChannel.channelId })
        .from(userChannel)
        .where(eq(userChannel.userId, reqUser.id));

      const channelIds = adminChannels.map((ch) => ch.channelId);

      if (channelIds.length === 0) {
        throw new UnauthorizedException(
          'You are not allowed to track activity of any channel',
        );
      }

      const userChannels = await db
        .select({ channelId: userChannel.channelId })
        .from(userChannel)
        .where(eq(userChannel.userId, userId));

      const userChannelIds = userChannels.map((ch) => ch.channelId);

      const hasAccess = userChannelIds.some((channelId) =>
        channelIds.includes(channelId),
      );

      if (!hasAccess) {
        throw new UnauthorizedException(
          'You are not allowed to track activity of this user in the channels you have access to',
        );
      }

      const activities = await db
        .select()
        .from(activity)
        .where(eq(activity.userId, userId));

      return activities;
    }

    throw new UnauthorizedException(
      'You are not allowed to access this resource',
    );
  }
}
