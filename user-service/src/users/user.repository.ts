import { db, userChannel, users } from 'drizzle-orm-package';
import { eq, isNull } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { log } from 'console';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { channel } from 'diagnostics_channel';
import { loadEnvFile } from 'process';

export class UserRepository {
  async findById(id: number) {
    const userss = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return userss.length > 0 ? userss[0] : null;
  }

  async findByEmail(email: string) {
    return await db.select().from(users).where(eq(users.email, email));
  }

  async createUser(
    username: string,
    email: string,
    password: string,
    role: 'USER' | 'ADMIN' | 'SUPERADMIN',
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    if (role === 'SUPERADMIN') {
      const existingSuperadmin = await db
        .select()
        .from(users)
        .where(eq(users.role, 'SUPERADMIN'))
        .limit(1);

      if (existingSuperadmin.length > 0) {
        throw new Error(
          'A SUPERADMIN already exists. Cannot create another one.',
        );
      }
    }
    const userId = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        role,
      })
      .$returningId();
    const user = await db.select().from;
    return { id: userId, role };
  }

  async updateUser(
    id: number,
    username: string,
    email: string,
    reqUser: { id: number; role: string },
  ) {
    const user = await db.select().from(users).where(eq(users.id, id));

    if (user.length === 0) {
      throw new NotFoundException(`User with Id ${id} not exist `);
    }

    if (reqUser.id != user[0].id) {
      throw new UnauthorizedException(`You cannot update this information`);
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
  }

  async softDeleteUser(id: number): Promise<string> {
    const user = await db.select().from(users).where(eq(users.id, id));

    if (user[0].deletedAt != null) {
      throw new Error(`User not Found`);
    }
    if (user[0].role === 'SUPERADMIN') {
      throw new Error(`Superadmin cannot be deleted.`);
    }

    await db
      .update(users)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, id));

    return `User with ID ${id} has been soft deleted successfully.`;
  }

  async findAllUsers(reqUser: { id: number; role: string }) {
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

    console.log('Admin Channel Mapping:', adminChannelMapping); 

    if (adminChannelMapping.length === 0) {
      console.log('No channels found for this admin user.');
    } else {
      console.log('Admin has channels:', adminChannelMapping);
    }

    const usersList = await db
      .select()
      .from(users)
      .where(isNull(users.deletedAt));
    console.log('All active users:', usersList);

    return usersList;
  }

  async deleteUserfromDB(id: number): Promise<string> {
    const user = await db.select().from(users).where(eq(users.id, id));

    if (user.length === 0) {
      throw new Error(`User with id ${id} not found.`);
    }

    if (user[0].role === 'SUPERADMIN') {
      throw new Error(`Superadmin cannot be deleted.`);
    }
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .execute();

    if (deletedUser.affectedRows === 0) {
      throw new Error(`User with id ${id} not found.`);
    }

    return `User permanently deleted from database with id ${id}`;
  }
}
