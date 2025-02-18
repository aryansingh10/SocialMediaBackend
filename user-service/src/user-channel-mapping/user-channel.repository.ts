import { db, users, userChannel } from 'drizzle-orm-package';
import { eq, and, sql } from 'drizzle-orm';
import { NotFoundException } from '@nestjs/common';

export class UserChannelRepository {
  async addUserToChannel(
    channelId: number,
    userId: number,
    reqUser: { id: number; role: string },
  ): Promise<string> {
    try {
      if (!['ADMIN', 'SUPERADMIN'].includes(reqUser.role)) {
        throw new Error(
          'Unauthorized: Only Admins and Superadmins can add users.',
        );
      }

      const userRecord = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

      if (userRecord.length === 0) {
        throw new Error('User not found.');
      }

      const userToAddRole = userRecord[0].role;

      const existingChannelEntry = await db
        .select()
        .from(userChannel)
        .where(
          and(
            eq(userChannel.userId, userId),
            eq(userChannel.channelId, channelId),
          ),
        );

      if (existingChannelEntry.length > 0) {
        throw new Error('User is already in this channel.');
      }

      if (userToAddRole === 'ADMIN') {
        if (reqUser.role !== 'SUPERADMIN') {
          throw new Error(
            'Unauthorized: Only Superadmins can add Admin users.',
          );
        }

        await db.insert(userChannel).values({
          userId,
          channelId,
          role: 'ADMIN',
        });

        return `Admin added successfully to the channel.`;
      }

      if (userToAddRole === 'USER') {
        if (reqUser.role === 'ADMIN') {
          const isAdminInChannel = await db
            .select()
            .from(userChannel)
            .where(
              and(
                eq(userChannel.userId, reqUser.id),
                eq(userChannel.channelId, channelId),
              ),
            );

          if (isAdminInChannel.length === 0) {
            throw new Error(
              'Unauthorized: Admin must be in the channel to add users.',
            );
          }
        }

        const existingUserChannels = await db
          .select()
          .from(userChannel)
          .where(eq(userChannel.userId, userId));

        if (existingUserChannels.length > 0) {
          throw new Error('A regular user can only be part of one channel.');
        }

        await db.insert(userChannel).values({
          userId,
          channelId,
          role: 'USER',
        });

        return `User added successfully to the channel.`;
      }

      throw new Error('Invalid user role or operation.');
    } catch (error) {
      throw new Error(`Error adding user to channel: ${error.message}`);
    }
  }

  async removeUser(
    userId: number,
    channelId: number,
    reqUser: { id: number; role: string },
  ): Promise<boolean> {
    try {
      const userInChannel = await db
        .select()
        .from(userChannel)
        .where(eq(userChannel.userId, userId));
      if (userInChannel.length === 0) {
        throw new NotFoundException('User is not a part of channel');
      }

      if (reqUser.role === 'SUPERADMIN') {
        await db
          .delete(userChannel)
          .where(
            and(
              eq(userChannel.userId, userId),
              eq(userChannel.channelId, channelId),
            ),
          );
        return true;
      }

      if (reqUser.role === 'ADMIN') {
        const isAdminInChannel = await db
          .select()
          .from(userChannel)
          .where(
            and(
              eq(userChannel.userId, reqUser.id),
              eq(userChannel.channelId, channelId),
            ),
          );

        if (!isAdminInChannel.length) {
          throw new Error('Unauthorized: Admin is not part of this channel.');
        }

        const userToRemove = await db
          .select({ role: users.role })
          .from(users)
          .where(eq(users.id, userId));

        if (!userToRemove.length || userToRemove[0].role !== 'USER') {
          throw new Error('Unauthorized: Admins can only remove normal users.');
        }

        await db
          .delete(userChannel)
          .where(
            and(
              eq(userChannel.userId, userId),
              eq(userChannel.channelId, channelId),
            ),
          );
        return true;
      }

      throw new Error(
        'Unauthorized: Only Admins and Superadmins can remove users.',
      );
    } catch (error) {
      throw new Error(`Error removing user from channel: ${error.message}`);
    }
  }

  async getUserChannels(userId: number) {
    try {
      return await db
        .select()
        .from(userChannel)
        .where(eq(userChannel.userId, userId));
    } catch (error) {
      throw new Error(`Error fetching user channels: ${error.message}`);
    }
  }

  async getUsersInChannel(
    channelId: number,
    reqUser: { id: number; role: string },
  ) {
    try {
      const { id: userId, role: userRole } = reqUser;

      if (userRole === 'SUPERADMIN') {
        return await db
          .select({
            id: users.id,
            username: users.username,
            email: users.email,
            role: users.role,
            joinedAt: userChannel.joinedAt,
            channelId: userChannel.channelId,
          })
          .from(userChannel)
          .leftJoin(users, eq(userChannel.userId, users.id));
      }

      if (userRole === 'ADMIN') {
        const adminChannels = await db
          .select({ channelId: userChannel.channelId })
          .from(userChannel)
          .where(eq(userChannel.userId, userId));

        const allowedChannelIds = adminChannels.map((entry) => entry.channelId);

        if (allowedChannelIds.length === 0) {
          throw new Error('Unauthorized: Admin is not part of any channel.');
        }

        if (channelId && !allowedChannelIds.includes(channelId)) {
          throw new Error('Unauthorized: Admin cannot access this channel.');
        }

        return await db
          .select({
            id: users.id,
            username: users.username,
            email: users.email,
            role: users.role,
            joinedAt: userChannel.joinedAt,
            channelId: userChannel.channelId,
          })
          .from(userChannel)
          .leftJoin(users, eq(userChannel.userId, users.id))
          .where(eq(userChannel.channelId, channelId || allowedChannelIds[0]));
      }

      throw new Error(
        'Unauthorized: Only Admins and Superadmins can access this data.',
      );
    } catch (error) {
      throw new Error(`Error fetching users in channel: ${error.message}`);
    }
  }

  async countUsersInChannel(channelId: number): Promise<number> {
    try {
      const result = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(userChannel)
        .where(eq(userChannel.channelId, channelId));
      return result[0].count;
    } catch (error) {
      throw new Error(`Error counting users in channel: ${error.message}`);
    }
  }
}
