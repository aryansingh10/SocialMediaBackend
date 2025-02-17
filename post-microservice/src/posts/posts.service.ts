import { Injectable } from '@nestjs/common';
import { PostRepository } from './posts.repository';
import { CreatePostDto, UpdatePostDto } from './dto/post.input';
import { ActivityService } from 'src/activity/activity.service';
import { EntityType } from 'src/activity/enum/entity-type';
import { ActionType } from 'src/activity/dto/create-activity.dto';
import { log } from 'console';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly activityService: ActivityService,
  ) {}

  async getAllPosts() {
    return await this.postRepository.getAllPosts();
  }

  async createPost(
    createPostDto: CreatePostDto,
    reqUser: { id: number; role: string },
  ) {
    const post = await this.postRepository.createPost(createPostDto, reqUser);
    log(post);
    await this.activityService.recordActivity({
      userId: reqUser.id,
      entity: EntityType.POST,
      action: ActionType.CREATED,
      entityId: post.id ?? 0,
      channelId: post.channelId ?? 0,
    });

    return `Post Successfully Created with id ${post.id}`;
  }

  async getPostByID(id: number) {
    return await this.postRepository.getPostByID(id);
  }

  async getPostsByUserId(
    reqUser: { id: number; role: string },
    userId: number,
  ) {
    return await this.postRepository.getPostsByUserId(reqUser, userId);
  }

  async getPostsByChannelId(
    channelId: number,
    reqUser: { id: number; role: string },
  ) {
    return await this.postRepository.getAllPostsFromChannel(channelId, reqUser);
  }

  async updatePost(
    input: UpdatePostDto,
    reqUser: { id: number; role: string },
  ) {
    const updatedPost = await this.postRepository.updatePost(input, reqUser);
    const { channelId } = updatedPost[0];
    await this.activityService.recordActivity({
      userId: reqUser.id,
      entity: EntityType.POST,
      action: ActionType.UPDATED,
      entityId: input.id,
      channelId: channelId,
    });

    return `Post Successfully Updated with id ${input.id}`;
  }

  async deletePost(id: number, reqUser: { id: number; role: string }) {
    const deletedPost = await this.postRepository.deletePost(id, reqUser);

    await this.activityService.recordActivity({
      userId: reqUser.id,
      entity: EntityType.POST,
      action: ActionType.DELETED,
      entityId: id,
      channelId: deletedPost.channelId,
    });

    return `Post Successfully Deleted with id ${id}`;
  }

  async softDeletePost(id: number, reqUser: { id: number; role: string }) {
    const softDeletedPost = await this.postRepository.softDeletePost(
      id,
      reqUser,
    );

    return `Post Successfully Soft Deleted with id ${id}`;
  }

  async getRecentPosts(limit: number) {
    return await this.postRepository.getRecentPosts(limit);
  }
}
