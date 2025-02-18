import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LikeRepository } from './likes.repository';
import { LikeType } from './utils/like-type.enum';
import { CreateLikeDto } from './dto/create-like.dto';
import { UserhasLikedDTO } from './dto/user-has-liked.dto';
import { ActivityService } from 'src/activity/activity.service';
import { EntityType } from 'src/activity/enum/entity-type';
import { ActionType } from 'src/activity/dto/create-activity.dto';

@Injectable()
export class LikeService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly activityService: ActivityService,
  ) {}

  async getLikesByEntity(
    entityId: number,
    type: LikeType,
    reqUser: { id: number; role: string },
  ) {
    try {
      return await this.likeRepository.getLikesByEntity(
        entityId,
        type,
        reqUser,
      );
    } catch (error) {
      throw new UnauthorizedException(
        `Error fetching likes for entity ${entityId}: ${error.message}`,
      );
    }
  }

  async getLikeCountByEntity(
    entityId: number,
    type: LikeType,
  ): Promise<number> {
    try {
      return await this.likeRepository.getLikeCountByEntity(entityId, type);
    } catch (error) {
      throw new UnauthorizedException(
        `Error fetching like count for entity ${entityId}: ${error.message}`,
      );
    }
  }

  async likeEntity(
    input: CreateLikeDto,
    reqUser: { id: number; role: string },
  ) {
    try {
      const result = await this.likeRepository.likeEntity(input, reqUser);

      await this.activityService.recordActivity({
        userId: reqUser.id,
        entity: EntityType.LIKE,
        action: ActionType.ADDED,
        entityId: input.entityId,
        channelId: input.channelId,
      });

      return result;
    } catch (error) {
      throw new UnauthorizedException(
        `Error liking entity with ID ${input.entityId}: ${error.message}`,
      );
    }
  }

  async unlikeEntity(
    input: CreateLikeDto,
    reqUser: { id: number; role: string },
  ) {
    try {
      const result = await this.likeRepository.unlikeEntity(input, reqUser);

      await this.activityService.recordActivity({
        userId: reqUser.id,
        entity: EntityType.LIKE,
        action: ActionType.REMOVED,
        entityId: input.entityId,
        channelId: input.channelId,
      });

      return result;
    } catch (error) {
      throw new UnauthorizedException(
        `Error unliking entity with ID ${input.entityId}: ${error.message}`,
      );
    }
  }

  async hasUserLiked(input: UserhasLikedDTO) {
    try {
      return await this.likeRepository.hasUserLikedEntity(input);
    } catch (error) {
      throw new UnauthorizedException(
        `Error checking if user has liked entity: ${error.message}`,
      );
    }
  }
}
