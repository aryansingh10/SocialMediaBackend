import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  db,
  likes,
  posts,
  comments,
  replies,
  users,
  userChannel,
} from 'drizzle-orm-package';
import { eq, count, and, sql } from 'drizzle-orm';
import { LikeType } from './utils/like-type.enum';
import { CreateLikeDto } from './dto/create-like.dto';
import { UserhasLikedDTO } from './dto/user-has-liked.dto';
import { insertLikeHelper } from './helper/like-function';

@Injectable()
export class LikeRepository {
  async getLikesByEntity(
    entityId: number,
    type: LikeType,
    reqUser: { id: number; role: string },
  ) {
    try {
      const like = await db
        .select()
        .from(likes)
        .where(eq(likes.entityId, entityId));
      if (like.length === 0)
        throw new NotFoundException(`${type} do not exist with id ${entityId}`);

      if (reqUser.role === 'SUPERADMIN') {
        return await db
          .select()
          .from(likes)
          .where(and(eq(likes.entityId, entityId), eq(likes.type, type)));
      }

      if (reqUser.role === 'USER') {
        const userChannelMapping = await db
          .select({ channelId: userChannel.channelId })
          .from(userChannel)
          .where(eq(userChannel.userId, reqUser.id));

        if (!userChannelMapping.length) {
          throw new UnauthorizedException('User is not part of any channel');
        }

        return await db
          .select()
          .from(likes)
          .where(
            and(
              eq(likes.entityId, entityId),
              eq(likes.type, type),
              eq(likes.channelId, userChannelMapping[0].channelId),
            ),
          );
      }

      if (reqUser.role === 'ADMIN') {
        const adminChannels = await db
          .select({ channelId: userChannel.channelId })
          .from(userChannel)
          .where(eq(userChannel.userId, reqUser.id));

        if (!adminChannels.length) {
          throw new UnauthorizedException('Admin is not managing any channels');
        }
        const channelIds = adminChannels.map((c) => c.channelId);

        return await db
          .select()
          .from(likes)
          .where(
            and(
              eq(likes.entityId, entityId),
              eq(likes.type, type),
              sql`${likes.channelId} IN (${channelIds})`,
            ),
          );
      }

      throw new UnauthorizedException(
        'You are not allowed to view these likes.',
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getLikeCountByEntity(
    entityId: number,
    type: LikeType,
  ): Promise<number> {
    try {
      const result = await db
        .select({ count: count() })
        .from(likes)
        .where(and(eq(likes.entityId, entityId), eq(likes.type, type)));

      return result[0]?.count || 0;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async likeEntity(
    input: CreateLikeDto,
    reqUser: { id: number; role: string },
  ): Promise<string> {
    try {
      const { entityId, type, channelId } = input;
      const userId = reqUser.id;

      let findEntity;

      if (type === LikeType.POST) {
        findEntity = await db
          .select()
          .from(posts)
          .where(and(eq(posts.id, entityId), eq(posts.channelId, channelId)));
      } else if (type === LikeType.COMMENT) {
        findEntity = await db
          .select()
          .from(comments)
          .where(
            and(eq(comments.id, entityId), eq(comments.channelId, channelId)),
          );
      } else if (type === LikeType.REPLY) {
        findEntity = await db
          .select()
          .from(replies)
          .where(
            and(eq(replies.id, entityId), eq(replies.channelId, channelId)),
          );
      }

      if (!findEntity.length) {
        return `Invalid ${type} ID ${entityId} for channel ${channelId}`;
      }

      if (reqUser.role === 'SUPERADMIN') {
        return await insertLikeHelper(entityId, userId, type, channelId);
      }

      const isUserInChannel = await db
        .select()
        .from(userChannel)
        .where(
          and(
            eq(userChannel.userId, userId),
            eq(userChannel.channelId, channelId),
          ),
        );

      if (!isUserInChannel.length) {
        throw new UnauthorizedException(
          `You are not part of channel ${channelId}.`,
        );
      }

      if (reqUser.role === 'ADMIN') {
        const adminChannels = await db
          .select({ channelId: userChannel.channelId })
          .from(userChannel)
          .where(eq(userChannel.userId, userId));

        const canLike = adminChannels.some(
          (adminChannel) => adminChannel.channelId === channelId,
        );

        if (!canLike) {
          throw new UnauthorizedException(
            `Admins can only like posts from their own channels.`,
          );
        }
      }
      return await insertLikeHelper(entityId, userId, type, channelId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async unlikeEntity(
    input: CreateLikeDto,
    reqUser: { id: number; role: string },
  ): Promise<string> {
    try {
      const { entityId, type, channelId } = input;
      const userId = reqUser.id;
      const existingLike = await db
        .select({ id: likes.id })
        .from(likes)
        .where(
          and(
            eq(likes.entityId, entityId),
            eq(likes.userId, userId),
            eq(likes.type, type),
            eq(likes.channelId, channelId),
          ),
        );

      if (existingLike.length === 0) {
        return `You have not liked this ${type} yet.`;
      }

      await db
        .delete(likes)
        .where(
          and(
            eq(likes.entityId, entityId),
            eq(likes.userId, userId),
            eq(likes.type, type),
            eq(likes.channelId, channelId),
          ),
        );

      return `${type.charAt(0).toUpperCase() + type.slice(1)} unliked successfully.`;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async hasUserLikedEntity(input: UserhasLikedDTO): Promise<boolean> {
    try {
      const { entityId, userId, type } = input;
      const existingLike = await db
        .select()
        .from(likes)
        .where(
          and(
            eq(likes.entityId, entityId),
            eq(likes.userId, userId),
            eq(likes.type, type),
          ),
        );

      return existingLike.length > 0;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
