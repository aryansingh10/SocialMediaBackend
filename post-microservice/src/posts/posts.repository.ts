import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { db, posts, userChannel, users, channels } from 'drizzle-orm-package';
import { Post } from './model/post.model';
import { eq, desc, and } from 'drizzle-orm';
import { log } from 'console';
import { CreatePostDto, UpdatePostDto } from './dto/post.input';

@Injectable()
export class PostRepository {
  async getAllPosts() {
    return await db.select().from(posts);
  }
  async createPost(
    createPostDto: CreatePostDto,
    reqUser: { id: number; role: string },
  ) {
    const { content, channelId } = createPostDto;
    const authorId = reqUser.id;

    if (reqUser.role === 'SUPERADMIN') {
      const [post] = await db.insert(posts).values({
        content,
        authorId,
        channelId,
      });

      return { id: post.insertId, channelId }; // ✅ Always return an object
    }

    const authorExists = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, authorId));

    if (!authorExists.length) {
      return { error: `User with ID ${authorId} does not exist.` }; // ✅ Return an object instead of a string
    }

    const channelExists = await db
      .select({ id: channels.id })
      .from(channels)
      .where(eq(channels.id, channelId));

    if (!channelExists.length) {
      return { error: `Channel with ID ${channelId} does not exist.` }; // ✅ Return an object
    }

    const isUserInChannel = await db
      .select({ id: userChannel.userId })
      .from(userChannel)
      .where(
        and(
          eq(userChannel.userId, authorId),
          eq(userChannel.channelId, channelId),
        ),
      );

    if (!isUserInChannel.length) {
      return { error: `You are not a member of Channel ${channelId}.` }; // ✅ Return an object
    }

    const [post] = await db.insert(posts).values({
      content,
      authorId,
      channelId,
    });

    return { id: post.insertId, channelId }; // ✅ Consistent return type
  }

  async getPostByID(id: number) {
    const result = await db.select().from(posts).where(eq(posts.id, id));
    return result.length > 0 ? result[0] : null;
  }

  async getPostsByUserId(
    reqUser: { id: number; role: string },
    userId: number,
  ) {
    if (reqUser.role === 'SUPERADMIN' || reqUser.id === userId) {
      return await db.select().from(posts).where(eq(posts.authorId, userId));
    }

    if (reqUser.role === 'ADMIN') {
      const adminChannel = await db
        .select({ channelId: userChannel.channelId })
        .from(userChannel)
        .where(eq(userChannel.userId, reqUser.id))
        .limit(1);

      if (adminChannel.length === 0) {
        throw new UnauthorizedException('You are not part of any channel');
      }
      const targetUserChannel = await db
        .select({ channelId: userChannel.channelId })
        .from(userChannel)
        .where(eq(userChannel.userId, userId))
        .limit(1);

      if (targetUserChannel.length === 0) {
        throw new UnauthorizedException(
          'Target user is not part of any channel',
        );
      }

      if (adminChannel[0].channelId !== targetUserChannel[0].channelId) {
        throw new UnauthorizedException(
          'You can only fetch posts from users in your channel.',
        );
      }

      return await db.select().from(posts).where(eq(posts.authorId, userId));
    }

    throw new UnauthorizedException(
      'You are not allowed to fetch these posts.',
    );
  }

  async getAllPostsFromChannel(
    channelId: number,
    reqUser: { id: number; role: string },
  ) {
    const channel = await db
      .select()
      .from(channels)
      .where(eq(channels.id, channelId));

    if (channel.length === 0) {
      return new Error('Channel do not exist');
    }

    let userMapping;
    if (reqUser.role === 'ADMIN') {
      userMapping = await db
        .select()
        .from(userChannel)
        .where(
          and(
            eq(userChannel.userId, reqUser.id),
            eq(userChannel.channelId, channelId),
          ),
        );
    }
    if (userMapping.length === 0) {
      throw new Error(`Admin does Not belong to Channel with id ${channelId} `);
    }

    const result = await db
      .select()
      .from(posts)
      .where(eq(posts.channelId, channelId));

    return result;
  }
  async updatePost(
    input: UpdatePostDto,
    reqUser: { id: number; role: string },
  ) {
    const { content, id } = input;

    const user = await db
      .select()
      .from(posts)
      .where(and(eq(posts.id, input.id), eq(posts.authorId, reqUser.id)));

    if (user.length === 0) {
      return 'This post does not belong to this User';
    }

    const existingPost = await db.select().from(posts).where(eq(posts.id, id));

    if (existingPost.length === 0) {
      return `Post with ID ${id} not found.`;
    }

    if (existingPost[0].content === content) {
      return `No changes detected in the post content.`;
    }

    const updatedPost = await db
      .update(posts)
      .set({
        content,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id));

    const { channelId } = existingPost[0];

    return { id, channelId: existingPost[0].channelId };
  }
  async getRecentPosts(limitValue: number) {
    const data = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(limitValue);

    console.log(data);
    return data;
  }

  async deletePost(id: number, reqUser: { id: number; role: string }) {
    const post = await db.select().from(posts).where(eq(posts.id, id));

    if (post.length === 0) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }

    const { authorId, channelId } = post[0];

    if (reqUser.role === 'SUPERADMIN') {
      const [deleted] = await db.delete(posts).where(eq(posts.id, id));
      if (deleted.affectedRows === 0) {
        throw new Error(`Failed to delete post with ID ${id}`);
      }
      return { id, channelId };
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

      if (isAdminInChannel.length === 0) {
        throw new UnauthorizedException(
          `You can only delete posts from your assigned channels.`,
        );
      }

      const [deleted] = await db.delete(posts).where(eq(posts.id, id));
      if (deleted.affectedRows === 0) {
        throw new Error(`Failed to delete post with ID ${id}`);
      }
      return { id, channelId };
    }

    if (reqUser.role === 'USER' && authorId !== reqUser.id) {
      throw new UnauthorizedException(`You can only delete your own posts.`);
    }

    const [deleted] = await db.delete(posts).where(eq(posts.id, id));
    if (deleted.affectedRows === 0) {
      throw new Error(`Failed to delete post with ID ${id}`);
    }

    return { id, channelId };
  }

  async softDeletePost(id: number, reqUser: { id: number; role: string }) {
    const post = await db.select().from(posts).where(eq(posts.id, id));

    if (post.length === 0) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }

    const { authorId, channelId, deletedAt } = post[0];

    if (deletedAt !== null) {
      throw new NotFoundException(
        `Post with ID ${id} has already been deleted.`,
      );
    }

    if (reqUser.role === 'SUPERADMIN') {
      const [deleted] = await db
        .update(posts)
        .set({ deletedAt: new Date(), updatedAt: new Date() })
        .where(eq(posts.id, id));

      if (deleted.affectedRows === 0) {
        throw new Error(`Failed to delete post with ID ${id}`);
      }
      return { message: `Post soft deleted successfully`, id };
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

      if (isAdminInChannel.length === 0) {
        throw new UnauthorizedException(
          `You can only soft delete posts from your channels.`,
        );
      }

      const [deleted] = await db
        .update(posts)
        .set({ deletedAt: new Date(), updatedAt: new Date() })
        .where(eq(posts.id, id));

      if (deleted.affectedRows === 0) {
        throw new Error(`Failed to soft delete post with ID ${id}`);
      }
      return { message: `Post soft deleted successfully`, id };
    }

    if (reqUser.role === 'USER' && authorId !== reqUser.id) {
      throw new UnauthorizedException(
        `You can only soft delete your own posts.`,
      );
    }

    const [deleted] = await db
      .update(posts)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(posts.id, id));

    if (deleted.affectedRows === 0) {
      throw new Error(`Failed to soft delete post with ID ${id}`);
    }
  }
}
