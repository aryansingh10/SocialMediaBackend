import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommentsRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ActivityService } from 'src/activity/activity.service';
import { EntityType } from 'src/activity/enum/entity-type';
import { ActionType } from 'src/activity/dto/create-activity.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentsRepository,
    private readonly activityService: ActivityService,
  ) {}

  async createComment(
    input: CreateCommentDto,
    reqUser: { id: number; role: string },
  ) {
    try {
      const commentId = await this.commentRepository.createComment(
        input,
        reqUser,
      );

      await this.activityService.recordActivity({
        userId: reqUser.id,
        entity: EntityType.COMMENT,
        action: ActionType.CREATED,
        entityId: commentId,
        channelId: input.channelId,
      });

      return `Comment Successfully Added with ID ${commentId}`;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw new InternalServerErrorException('Failed to create comment.');
    }
  }

  async deleteComment(
    commentId: number,
    reqUser: { id: number; role: string },
  ) {
    try {
      const deletedComment = await this.commentRepository.deleteComment(
        commentId,
        reqUser,
      );

      if (deletedComment) {
        await this.activityService.recordActivity({
          userId: reqUser.id,
          entity: EntityType.COMMENT,
          action: ActionType.DELETED,
          entityId: commentId,
          channelId: deletedComment.channelId,
        });
      }

      return deletedComment;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw new InternalServerErrorException('Failed to delete comment.');
    }
  }

  async updateComment(
    input: UpdateCommentDto,
    reqUser: { id: number; role: string },
  ) {
    try {
      const updatedComment = await this.commentRepository.updateComment(
        input,
        reqUser,
      );

      if (updatedComment) {
        await this.activityService.recordActivity({
          userId: reqUser.id,
          entity: EntityType.COMMENT,
          action: ActionType.UPDATED,
          entityId: input.id,
          channelId: updatedComment.channelId,
        });
      }

      return updatedComment;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw new InternalServerErrorException('Failed to update comment.');
    }
  }

  async getCommentsFromPosts(
    postId: number,
    reqUser: { id: number; role: string },
  ) {
    try {
      return await this.commentRepository.getCommentsByPost(postId, reqUser);
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw new InternalServerErrorException('Failed to fetch comments.');
    }
  }
}
