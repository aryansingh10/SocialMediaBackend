import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { db } from 'drizzle-orm-package';
import { comments, posts, userChannel } from 'drizzle-orm-package';
import { eq, and } from 'drizzle-orm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { error } from 'console';
import { NEVER } from 'rxjs';

@Injectable()
export class CommentsRepository {
  async createComment(
    input: CreateCommentDto,
    reqUser: { id: number; role: string },
  ) {
    try {
      const { postId, channelId, content } = input;

      if (reqUser.role === 'SUPERADMIN') {
        const result = await db
          .insert(comments)
          .values({
            postId,
            userId: reqUser.id,
            channelId,
            content,
          })
          .execute();

        const commentId = result[0].insertId;
        return commentId;
      }

      const post = await db
        .select()
        .from(posts)
        .where(and(eq(posts.id, postId), eq(posts.channelId, channelId)));

      if (!post.length) {
        throw new NotFoundException(
          `Post with ID ${postId} not found in Channel ${channelId}`,
        );
      }

      const userChannelMapping = await db
        .select()
        .from(userChannel)
        .where(
          and(
            eq(userChannel.userId, reqUser.id),
            eq(userChannel.channelId, channelId),
          ),
        );

      if (!userChannelMapping.length) {
        throw new UnauthorizedException(
          `You are not a member of Channel ${channelId}, so you cannot comment.`,
        );
      }

      const result = await db
        .insert(comments)
        .values({
          postId,
          userId: reqUser.id,
          channelId,
          content,
        })
        .execute();

      const commentId = result[0].insertId;
      return commentId;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async getCommentsByPost(
    postId: number,
    reqUser: { id: number; role: string },
  ) {
    try {
      const post = await db
        .select({ id: posts.id, channelId: posts.channelId })
        .from(posts)
        .where(eq(posts.id, postId))
        .limit(1);

      if (!post.length) {
        throw new NotFoundException(`Post with ID ${postId} not found.`);
      }

      const { channelId } = post[0];

      if (reqUser.role === 'SUPERADMIN') {
        return await db
          .select()
          .from(comments)
          .where(eq(comments.postId, postId));
      }

      if (reqUser.role === 'ADMIN') {
        const adminChannels = await db
          .select({ channelId: userChannel.channelId })
          .from(userChannel)
          .where(eq(userChannel.userId, reqUser.id));

        const adminChannelIds = adminChannels.map((ch) => ch.channelId);

        if (!adminChannelIds.includes(channelId)) {
          throw new UnauthorizedException(
            'You are not allowed to access comments from this post.',
          );
        }
      }

      const usersChannel = await db
        .select({ id: userChannel.userId })
        .from(userChannel)
        .where(
          and(
            eq(userChannel.userId, reqUser.id),
            eq(userChannel.channelId, channelId),
          ),
        )
        .limit(1);

      if (!usersChannel.length) {
        throw new UnauthorizedException(
          'You are not allowed to access comments from this post.',
        );
      }

      return await db
        .select()
        .from(comments)
        .where(eq(comments.postId, postId));
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateComment(
    input: UpdateCommentDto,
    reqUser: { id: number; role: string },
  ) {
    try {
      const { id, content } = input;

      const comment = await db
        .select({ userId: comments.userId, channelId: comments.channelId })
        .from(comments)
        .where(eq(comments.id, id));

      if (!comment.length) {
        throw new NotFoundException(`Comment with ID ${id} not found.`);
      }

      const { userId, channelId } = comment[0];

      if (userId !== reqUser.id) {
        throw new Error(`You can only update your own comments.`);
      }

      await db
        .update(comments)
        .set({ content })
        .where(eq(comments.id, id))
        .execute();

      return { id, content, channelId, userId };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteComment(
    commentId: number,
    reqUser: { id: number; role: string },
  ) {
    try {
      if (reqUser.role === 'SUPERADMIN') {
        const comment = await db
          .select()
          .from(comments)
          .where(eq(comments.id, commentId));

        if (!comment.length) {
          throw new NotFoundException(`Comment with ID ${commentId} not found`);
        }

        await db.delete(comments).where(eq(comments.id, commentId)).execute();
        return comment[0];
      }

      const comment = await db
        .select()
        .from(comments)
        .where(eq(comments.id, commentId));

      if (!comment.length) {
        throw new Error(`Comment with ID ${commentId} not found`);
      }

      const { userId, channelId } = comment[0];

      if (reqUser.role === 'USER' && reqUser.id !== userId) {
        throw new Error('You can only delete your own comments.');
      }

      if (reqUser.role === 'ADMIN') {
        const adminChannels = await db
          .select()
          .from(userChannel)
          .where(eq(userChannel.userId, reqUser.id));

        const channelIds = adminChannels.map((c) => c.channelId);

        if (!channelIds.includes(channelId)) {
          throw new Error(
            `You can only delete comments in your assigned channels.`,
          );
        }
      }

      await db.delete(comments).where(eq(comments.id, commentId)).execute();
      return comment[0];
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
