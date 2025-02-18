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
import {
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';

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
    try {
      return await this.likeService.getLikesByEntity(entityId, type, reqUser);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error fetching likes for entity ${entityId}: ${error.message}`,
      );
    }
  }

  @Query(() => Int)
  @UseGuards(AuthGuard, RolesGuard)
  async getLikeCountByEntity(
    @Args('entityId', { type: () => Int }) entityId: number,
    @Args('type') type: LikeType,
  ) {
    try {
      return await this.likeService.getLikeCountByEntity(entityId, type);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error fetching like count for entity ${entityId}: ${error.message}`,
      );
    }
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  async likeEntity(
    @Args('input') input: CreateLikeDto,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      return await this.likeService.likeEntity(input, reqUser);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error liking entity: ${error.message}`,
      );
    }
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  async unlikeEntity(
    @Args('input') input: CreateLikeDto,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      return await this.likeService.unlikeEntity(input, reqUser);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error unliking entity: ${error.message}`,
      );
    }
  }

  @Query(() => Boolean)
  async HasUserLiked(@Args('input') input: UserhasLikedDTO) {
    try {
      return await this.likeService.hasUserLiked(input);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error checking if user has liked entity: ${error.message}`,
      );
    }
  }
}
