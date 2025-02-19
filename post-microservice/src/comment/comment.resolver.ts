import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { CommentsService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './model/comment.model';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CurrentUser } from 'src/auth/current-user';
import { UseGuards, InternalServerErrorException } from '@nestjs/common';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentService: CommentsService) {}

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  async createComment(
    @Args('input') input: CreateCommentDto,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      await this.commentService.createComment(input, reqUser);
      return `Comment Created Successfully`;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw new InternalServerErrorException('Failed to create comment.');
    }
  }

  @Query(() => [Comment])
  @UseGuards(AuthGuard, RolesGuard)
  async getCommentsByPosts(
    @Args('postId') postId: number,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      return await this.commentService.getCommentsFromPosts(postId, reqUser);
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw new InternalServerErrorException('Failed to fetch comments.');
    }
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteComment(
    @Args('commentId') commentId: number,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      await this.commentService.deleteComment(commentId, reqUser);
      return `Comment Deleted with id ${commentId}`;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw new InternalServerErrorException('Failed to delete comment.');
    }
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  async updateComment(
    @Args('input') input: UpdateCommentDto,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      await this.commentService.updateComment(input, reqUser);
      return `Comment updated with id ${input.id}`;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw new InternalServerErrorException('Failed to update comment.');
    }
  }
}
