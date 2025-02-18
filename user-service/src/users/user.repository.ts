import { db, userChannel, users } from 'drizzle-orm-package';
import { eq, isNull, inArray, and } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { log } from 'console';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

export class UserRepository {
  async findById(id: number) {
    try {
      const userss = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      return userss.length > 0 ? userss[0] : null;
    } catch (error) {
      throw new Error(`Error fetching user by ID: ${error.message}`);
    }
  }

  async findByEmail(email: string) {
    try {
      return await db.select().from(users).where(eq(users.email, email));
    } catch (error) {
      throw new Error(`Error fetching user by email: ${error.message}`);
    }
  }

  async createUser(
    username: string,
    email: string,
    password: string,
    role: 'USER',
  ) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const userId = await db
        .insert(users)
        .values({
          username,
          email,
          password: hashedPassword,
          role,
        })
        .$returningId();
      return { id: userId, role };
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async createAdmin(
    username: string,
    email: string,
    password: string,
    createdBy: { id: number; role: string },
  ) {
    try {
      if (createdBy.role !== 'SUPERADMIN') {
        throw new UnauthorizedException('Only superadmins can create admins.');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userId = await db
        .insert(users)
        .values({
          username,
          email,
          password: hashedPassword,
          role: 'ADMIN',
        })
        .$returningId();
      return { id: userId, role: 'ADMIN' };
    } catch (error) {
      throw new Error(`Error creating admin: ${error.message}`);
    }
  }

  async updateUser(
    id: number,
    username: string,
    email: string,
    reqUser: { id: number; role: string },
  ) {
    try {
      const user = await db.select().from(users).where(eq(users.id, id));

      if (user.length === 0) {
        throw new NotFoundException(`User with Id ${id} not exist`);
      }

      if (reqUser.id != user[0].id) {
        throw new UnauthorizedException('You cannot update this information');
      }

      await db
        .update(users)
        .set({
          username,
          email,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id));

      const updatedUser = await db.select().from(users).where(eq(users.id, id));
      return updatedUser.length > 0 ? updatedUser[0] : null;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async softDeleteUser(id: number): Promise<string> {
    try {
      const user = await db.select().from(users).where(eq(users.id, id));

      if (user[0].deletedAt != null) {
        throw new Error('User not Found');
      }
      if (user[0].role === 'SUPERADMIN') {
        throw new Error('Superadmin cannot be deleted.');
      }

      await db
        .update(users)
        .set({ deletedAt: new Date(), updatedAt: new Date() })
        .where(eq(users.id, id));

      return `User with ID ${id} has been soft deleted successfully.`;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  async deleteUserfromDB(id: number): Promise<string> {
    try {
      const user = await db.select().from(users).where(eq(users.id, id));

      if (user.length === 0) {
        throw new Error(`User with id ${id} not found.`);
      }

      if (user[0].role === 'SUPERADMIN') {
        throw new Error('Superadmin cannot be deleted.');
      }
      const [deletedUser] = await db
        .delete(users)
        .where(eq(users.id, id))
        .execute();

      if (deletedUser.affectedRows === 0) {
        throw new Error(`User with id ${id} not found.`);
      }

      return `User permanently deleted from database with id ${id}`;
    } catch (error) {
      throw new Error(`Error deleting user from DB: ${error.message}`);
    }
  }

  async findAllUsers(reqUser: { id: number; role: string }) {
    try {
      if (reqUser.role === 'SUPERADMIN') {
        const usersList = await db
          .select()
          .from(users)
          .where(isNull(users.deletedAt));
        return usersList;
      }

      const adminChannelMapping = await db
        .select({ channelID: userChannel.channelId })
        .from(userChannel)
        .where(eq(userChannel.userId, reqUser.id));

      if (adminChannelMapping.length === 0) {
        throw new NotFoundException('Admin is not a part of any channel');
      }

      const channelIds = adminChannelMapping.map(
        (mapping) => mapping.channelID,
      );

      if (reqUser.role === 'ADMIN') {
        if (channelIds.length === 0) {
          throw new UnauthorizedException('Admin is not a part of any channel');
        }

        const usersList = await db
          .select()
          .from(users)
          .innerJoin(userChannel, eq(users.id, userChannel.userId))
          .where(
            and(
              inArray(userChannel.channelId, channelIds),
              isNull(users.deletedAt),
            ),
          );

        const mapping = usersList.map((user) => ({
          email: user.users.email,
          id: user.users.id,
          createdAt: user.users.createdAt,
          role: user.users.role,
          username: user.users.username,
          channel: user.user_channel.channelId,
        }));

        return mapping;
      }
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }
}
