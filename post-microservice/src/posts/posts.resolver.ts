import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostService } from './posts.service';
import { Post } from './model/post.model';
import { CreatePostDto, UpdatePostDto } from './dto/post.input';
import { UseGuards } from '@nestjs/common';
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
    return this.postService.getAllPosts();
  }

  @Query(() => Post, { nullable: true })
  async getPostById(@Args('id') id: number) {
    return await this.postService.getPostByID(id);
  }

  @Query(() => [Post])
  @UseGuards(AuthGuard, RolesGuard)
  async getAllPostsFromUser(
    @CurrentUser() reqUser: { id: number; role: string },
    @Args('UserId') id: number,
  ) {
    return await this.postService.getPostsByUserId(reqUser, id);
  }

  @Query(() => [Post])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  async getAllPostsFromChannel(
    @Args('channelId') id: number,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    return await this.postService.getPostsByChannelId(id, reqUser);
  }
  @Mutation(() => String)
  @UseGuards(AuthGuard)
  async createPost(
    @Args('input') input: CreatePostDto,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    return this.postService.createPost(input, reqUser);
  }

  @Query(() => [Post])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async getRecentPosts(
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
  ) {
    return await this.postService.getRecentPosts(limit);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  async updatePost(
    @Args('input') input: UpdatePostDto,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    return await this.postService.updatePost(input, reqUser);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async deletePost(
    @Args('id') id: number,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    return await this.postService.deletePost(id, reqUser);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async softDeletePost(
    @Args('id') id: number,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    return await this.postService.softDeletePost(id, reqUser);
  }
}
