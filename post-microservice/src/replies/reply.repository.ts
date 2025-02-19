import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { comments, db, replies, userChannel } from 'drizzle-orm-package';
import { eq, and } from 'drizzle-orm';
import { CreateReplyDto } from './dto/create-reply.dto';

@Injectable()
export class RepliesRepository {
  async createReply(
    input: CreateReplyDto,
    reqUser: { id: number; role: string },
  ): Promise<number> {
    try {
      const replyData = { ...input, authorId: reqUser.id };

      if (reqUser.role === 'SUPERADMIN') {
        const result = await db.insert(replies).values(replyData);
        return result[0].insertId;
      }

      const comment = await db
        .select()
        .from(comments)
        .where(
          and(
            eq(comments.id, input.commentId),
            eq(comments.channelId, input.channelId),
          ),
        );

      if (!comment.length) {
        throw new NotFoundException(
          `Comment with ID ${input.commentId} not found`,
        );
      }

      const userChannelMapping = await db
        .select()
        .from(userChannel)
        .where(
          and(
            eq(userChannel.userId, reqUser.id),
            eq(userChannel.channelId, input.channelId),
          ),
        );

      if (!userChannelMapping.length) {
        throw new UnauthorizedException(
          `You are not a member of Channel ${input.channelId}, so you cannot reply.`,
        );
      }

      const result = await db.insert(replies).values(replyData);
      return result[0].insertId;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findReplyById(replyId: number, reqUser: { id: number; role: string }) {
    try {
      const reply = await db
        .select()
        .from(replies)
        .where(eq(replies.id, replyId));

      if (!reply.length) {
        throw new NotFoundException(`Reply with ID ${replyId} not found`);
      }

      if (reqUser.role === 'SUPERADMIN') {
        return reply[0];
      }

      const replyChannelId = reply[0].channelId;

      const userChannelMapping = await db
        .select()
        .from(userChannel)
        .where(
          and(
            eq(userChannel.userId, reqUser.id),
            eq(userChannel.channelId, replyChannelId),
          ),
        );

      if (!userChannelMapping.length) {
        throw new UnauthorizedException(
          `You are not a member of Channel ${replyChannelId}, so you cannot access this reply.`,
        );
      }

      return reply[0];
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getRepliesByComment(
    commentId: number,
    reqUser: { id: number; role: string },
  ) {
    try {
      const comment = await db
        .select()
        .from(comments)
        .where(eq(comments.id, commentId));

      if (!comment.length) {
        throw new NotFoundException(`Comment with ID ${commentId} not found`);
      }

      if (reqUser.role === 'SUPERADMIN') {
        return await db
          .select()
          .from(replies)
          .where(eq(replies.commentId, commentId));
      }

      const commentChannelId = comment[0].channelId;

      const userChannelMapping = await db
        .select()
        .from(userChannel)
        .where(
          and(
            eq(userChannel.userId, reqUser.id),
            eq(userChannel.channelId, commentChannelId),
          ),
        );

      if (!userChannelMapping.length) {
        throw new UnauthorizedException(
          `You are not a member of Channel ${commentChannelId}, so you cannot access replies.`,
        );
      }

      return await db
        .select()
        .from(replies)
        .where(
          and(
            eq(replies.commentId, commentId),
            eq(replies.channelId, commentChannelId),
          ),
        );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteReply(replyId: number, reqUser: { id: number; role: string }) {
    try {
      const reply = await db
        .select()
        .from(replies)
        .where(eq(replies.id, replyId));

      if (reply.length === 0) {
        throw new NotFoundException(`Reply not found with ID ${replyId}`);
      }

      const { authorId, channelId } = reply[0];

      if (reqUser.role === 'SUPERADMIN') {
        await db.delete(replies).where(eq(replies.id, replyId));
        return { replyId, channelId };
      }

      if (reqUser.role === 'USER') {
        if (authorId !== reqUser.id) {
          throw new UnauthorizedException(`You cannot delete this reply`);
        }
        await db.delete(replies).where(eq(replies.id, replyId));
        return { replyId, channelId };
      }

      if (reqUser.role === 'ADMIN') {
        const adminChannels = await db
          .select({ channelId: userChannel.channelId })
          .from(userChannel)
          .where(eq(userChannel.userId, reqUser.id));

        const adminChannelIds = adminChannels.map((c) => c.channelId);

        if (!adminChannelIds.includes(channelId)) {
          throw new UnauthorizedException(
            `You cannot delete this reply as it's not in your channel`,
          );
        }

        await db.delete(replies).where(eq(replies.id, replyId));
        return { replyId, channelId };
      }

      throw new UnauthorizedException(
        `You do not have permission to delete this reply`,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateReply(
    replyId: number,
    content: string,
    reqUser: { id: number; role: string },
  ) {
    try {
      const reply = await db
        .select()
        .from(replies)
        .where(eq(replies.id, replyId));

      if (reply.length === 0) {
        throw new NotFoundException(`Reply not found with ID ${replyId}`);
      }

      const { authorId, channelId } = reply[0];

      if (authorId !== reqUser.id) {
        throw new UnauthorizedException(
          `You are not allowed to update this reply`,
        );
      }

      await db.update(replies).set({ content }).where(eq(replies.id, replyId));

      return { replyId, channelId };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
