import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { CommentsService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './model/comment.model';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CurrentUser } from 'src/auth/current-user';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentService: CommentsService) {}

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  async createComment(
    @Args('input') input: CreateCommentDto,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    await this.commentService.createComment(input, reqUser);

    return `Comment Created Succcesfully `;
  }

  // @Query(() => [Comment])
  // @UseGuards(AuthGuard, RolesGuard)
  // async getCommentsByPosts(
  //   @Args('postId') postId: number,
  //   @CurrentUser() reqUser: { id: number; role: string },
  // ) {
  //   return await this.commentService.getCommentsbyPost(postId, reqUser);
  // }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteComment(
    @Args('commentId') commentId: number,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    await this.commentService.deleteComment(commentId, reqUser);

    return `Comment Deleted with id ${commentId}`;
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  async updateComment(
    @Args('input') input: UpdateCommentDto,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    await this.commentService.updateComment(input, reqUser);

    return `Comment updated with id ${input.id}`;
  }
}
