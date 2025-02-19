import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostService } from './posts.service';
import { Post } from './model/post.model';
import { CreatePostDto, UpdatePostDto } from './dto/post.input';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CurrentUser } from 'src/auth/current-user';

@Resolver()
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => [Post])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async getAllPosts() {
    try {
      return await this.postService.getAllPosts();
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch all posts: ${error.message}`,
      );
    }
  }

  @Query(() => Post, { nullable: true })
  @UseGuards(AuthGuard, RolesGuard)
  async getPostById(
    @Args('id') id: number,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      return await this.postService.getPostByID(id, reqUser);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch post with ID ${id}`,
      );
    }
  }

  @Query(() => [Post])
  @UseGuards(AuthGuard, RolesGuard)
  async getAllPostsFromUser(
    @CurrentUser() reqUser: { id: number; role: string },
    @Args('UserId') id: number,
  ) {
    try {
      return await this.postService.getPostsByUserId(reqUser, id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch posts for user ${id}`,
      );
    }
  }

  @Query(() => [Post])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  async getAllPostsFromChannel(
    @Args('channelId') id: number,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      return await this.postService.getPostsByChannelId(id, reqUser);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch posts for channel ${id}`,
      );
    }
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard)
  async createPost(
    @Args('input') input: CreatePostDto,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      return await this.postService.createPost(input, reqUser);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create post`);
    }
  }

  @Query(() => [Post])
  @UseGuards(AuthGuard, RolesGuard)
  async getRecentPosts(
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
  ) {
    try {
      return await this.postService.getRecentPosts(limit);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch recent posts`);
    }
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  async updatePost(
    @Args('input') input: UpdatePostDto,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      return await this.postService.updatePost(input, reqUser);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update post: ${error.message}`,
      );
    }
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async deletePost(
    @Args('id') id: number,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      return await this.postService.deletePost(id, reqUser);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete post with ID ${id}`,
      );
    }
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  async softDeletePost(
    @Args('id') id: number,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      return await this.postService.softDeletePost(id, reqUser);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to soft delete post with ID`,
      );
    }
  }
}
