import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { RepliesService } from './reply.service';
import { Reply } from './model/reply.model';
import { CreateReplyDto } from './dto/create-reply.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UseGuards } from '@nestjs/common';
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
    return await this.repliesService.findReplyById(replyId, reqUser);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  async createReply(
    @Args('input') input: CreateReplyDto,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    return await this.repliesService.createReply(input, reqUser);
  }

  @Query(() => [Reply])
  @UseGuards(AuthGuard, RolesGuard)
  async getRepliesByComment(
    @Args('replyId') commentId: number,
    reqUser: { id: number; role: string },
  ) {
    return this.repliesService.getRepliesByComment(commentId, reqUser);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  async delteReply(
    @Args('replyId') replyId: number,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    return this.repliesService.deleteReply(replyId, reqUser);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  async updateReply(
    @Args('replyId') replyid: number,
    @Args('content') content: string,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    return this.repliesService.updateReply(replyid, content, reqUser);
  }
}
