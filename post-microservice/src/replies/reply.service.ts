import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RepliesRepository } from './reply.repository';
import { CreateReplyDto } from './dto/create-reply.dto';
import { ActivityService } from 'src/activity/activity.service';
import { EntityType } from 'src/activity/enum/entity-type';
import { ActionType } from 'src/activity/dto/create-activity.dto';

@Injectable()
export class RepliesService {
  constructor(
    private readonly repliesRepository: RepliesRepository,
    private readonly activityService: ActivityService,
  ) {}

  async createReply(
    input: CreateReplyDto,
    reqUser: { id: number; role: string },
  ) {
    try {
      const replyId = await this.repliesRepository.createReply(input, reqUser);

      await this.activityService.recordActivity({
        userId: reqUser.id,
        entity: EntityType.REPLY,
        action: ActionType.CREATED,
        entityId: replyId,
        channelId: input.channelId,
      });

      return `Reply Successfully Added with id ${replyId}`;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create reply`);
    }
  }

  async deleteReply(replyId: number, reqUser: { id: number; role: string }) {
    try {
      const deletedReply = await this.repliesRepository.deleteReply(
        replyId,
        reqUser,
      );

      await this.activityService.recordActivity({
        userId: reqUser.id,
        entity: EntityType.REPLY,
        action: ActionType.DELETED,
        entityId: replyId,
        channelId: deletedReply.channelId,
      });

      return `Reply Successfully Deleted with id ${replyId}`;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to delete reply`);
    }
  }

  async updateReply(
    replyId: number,
    content: string,
    reqUser: { id: number; role: string },
  ) {
    try {
      const updatedReply = await this.repliesRepository.updateReply(
        replyId,
        content,
        reqUser,
      );

      await this.activityService.recordActivity({
        userId: reqUser.id,
        entity: EntityType.REPLY,
        action: ActionType.UPDATED,
        entityId: replyId,
        channelId: updatedReply.channelId,
      });

      return `Reply Successfully Updated with id ${replyId}`;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update reply`);
    }
  }

  async findReplyById(replyId: number, reqUser: { id: number; role: string }) {
    try {
      return await this.repliesRepository.findReplyById(replyId, reqUser);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch reply`);
    }
  }

  async getRepliesByComment(
    commentId: number,
    reqUser: { id: number; role: string },
  ) {
    try {
      return await this.repliesRepository.getRepliesByComment(
        commentId,
        reqUser,
      );
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch replies`);
    }
  }
}
