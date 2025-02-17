import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { LikeService } from './likes.service';
import { Like } from './model/like.model';
import { LikeType } from './utils/like-type.enum';
import { CreateLikeDto } from './dto/create-like.dto';
import { UserhasLikedDTO } from './dto/user-has-liked.dto';
import { CurrentUser } from 'src/auth/current-user';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Resolver()
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @Query(() => [Like])
  @UseGuards(AuthGuard, RolesGuard)
  async getLikesByEntity(
    @Args('entityId', { type: () => Int }) entityId: number,
    @Args('type') type: LikeType,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    return await this.likeService.getLikesByEntity(entityId, type, reqUser);
  }

  @Query(() => Int)
  @UseGuards(AuthGuard, RolesGuard)
  async getLikeCountByEntity(
    @Args('entityId', { type: () => Int }) entityId: number,
    @Args('type') type: LikeType,
  ) {
    return await this.likeService.getLikeCountByEntity(entityId, type);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  async likeEntity(
    @Args('input') input: CreateLikeDto,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    return await this.likeService.likeEntity(input, reqUser);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  async unlikeEntity(
    @Args('input') input: CreateLikeDto,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    return await this.likeService.unlikeEntity(input, reqUser);
  }

  @Query(() => Boolean)
  async HasUserLiked(@Args('input') input: UserhasLikedDTO) {
    return await this.likeService.hasUserLiked(input);
  }
}
