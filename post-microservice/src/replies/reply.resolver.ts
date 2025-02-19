import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { RepliesService } from './reply.service';
import { Reply } from './model/reply.model';
import { CreateReplyDto } from './dto/create-reply.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UseGuards, InternalServerErrorException } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user';

@Resolver()
export class RepliesResolver {
  constructor(private readonly repliesService: RepliesService) {}

  @Query(() => Reply)
  @UseGuards(AuthGuard, RolesGuard)
  async getReplyById(
    @Args('id') replyId: number,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      return await this.repliesService.findReplyById(replyId, reqUser);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch reply: ${error.message}`,
      );
    }
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  async createReply(
    @Args('input') input: CreateReplyDto,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      return await this.repliesService.createReply(input, reqUser);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create reply: ${error.message}`,
      );
    }
  }

  @Query(() => [Reply])
  @UseGuards(AuthGuard, RolesGuard)
  async getRepliesByComment(
    @Args('commentId') commentId: number,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      return await this.repliesService.getRepliesByComment(commentId, reqUser);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch replies`);
    }
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteReply(
    @Args('replyId') replyId: number,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      return await this.repliesService.deleteReply(replyId, reqUser);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to delete reply}`);
    }
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  async updateReply(
    @Args('replyId') replyId: number,
    @Args('content') content: string,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      return await this.repliesService.updateReply(replyId, content, reqUser);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update reply`);
    }
  }
}
