import { db, users, userChannel } from 'drizzle-orm-package';
import { eq, and, sql } from 'drizzle-orm';
import { log } from 'console';

export class UserChannelRepository {
  async addUserToChannel(
    channelId: number,
    userId: number,
    reqUser: { id: number; role: string },
  ): Promise<string> {
    if (!['ADMIN', 'SUPERADMIN'].includes(reqUser.role)) {
      throw new Error(
        'Unauthorized: Only Admins and Superadmins can add users.',
      );
    }

    // Check if user exists
    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (userRecord.length === 0) {
      throw new Error('User not found.');
    }

    const userToAddRole = userRecord[0].role;

    // Check if user is already in the specific channel
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

    // For ADMIN users
    if (userToAddRole === 'ADMIN') {
      // Only SUPERADMIN can add ADMIN users
      if (reqUser.role !== 'SUPERADMIN') {
        throw new Error('Unauthorized: Only Superadmins can add Admin users.');
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

      // Only check single channel restriction for regular users
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
  }

  async removeUser(
    userId: number,
    channelId: number,
    reqUser: { id: number; role: string },
  ): Promise<boolean> {
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
  }

  async getUserChannels(userId: number) {
    return await db
      .select()
      .from(userChannel)
      .where(eq(userChannel.userId, userId));
  }

  async getUsersInChannel(
    channelId: number,
    reqUser: { id: number; role: string },
  ) {
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
  }

  async countUsersInChannel(channelId: number): Promise<number> {
    const result = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(userChannel)
      .where(eq(userChannel.channelId, channelId));
    return result[0].count;
  }
}
