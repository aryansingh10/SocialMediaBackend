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
    try {
      const post = await this.postRepository.createPost(createPostDto, reqUser);
      await this.activityService.recordActivity({
        userId: reqUser.id,
        entity: EntityType.POST,
        action: ActionType.CREATED,
        entityId: post.id,
        channelId: post.channelId,
      });

      return `Post Successfully Created with id ${post.id}`;
    } catch {
      throw new Error('Failed to create post');
    }
  }

  async getPostByID(id: number) {
    try {
      return await this.postRepository.getPostByID(id);
    } catch {
      throw new Error(`Error fetching Posts with id ${id}`);
    }
  }

  async getPostsByUserId(
    reqUser: { id: number; role: string },
    userId: number,
  ) {
    try {
      return await this.postRepository.getPostsByUserId(reqUser, userId);
    } catch {
      throw new Error('Error fetching posts ');
    }
  }

  async getPostsByChannelId(
    channelId: number,
    reqUser: { id: number; role: string },
  ) {
    try {
      return await this.postRepository.getAllPostsFromChannel(
        channelId,
        reqUser,
      );
    } catch {
      throw new Error(
        `Error fetching post of this channel with id ${channelId} `,
      );
    }
  }

  async updatePost(
    input: UpdatePostDto,
    reqUser: { id: number; role: string },
  ) {
    try {
      const updatedPost = await this.postRepository.updatePost(input, reqUser);
      log('59', updatedPost.channelId);

      await this.activityService.recordActivity({
        userId: reqUser.id,
        entity: EntityType.POST,
        action: ActionType.UPDATED,
        entityId: input.id,
        channelId: updatedPost.channelId,
      });

      return `Post with id ${input.id} Successfully Updated `;
    } catch {
      throw new Error(`Error Updating Post with ID ${input.id}`);
    }
  }

  async deletePost(id: number, reqUser: { id: number; role: string }) {
    try {
      const deletedPost = await this.postRepository.deletePost(id, reqUser);

      await this.activityService.recordActivity({
        userId: reqUser.id,
        entity: EntityType.POST,
        action: ActionType.DELETED,
        entityId: id,
        channelId: deletedPost.channelId,
      });

      return `Post Successfully Deleted with id ${id}`;
    } catch {
      throw new Error(`Error Deleting Post with ID ${id}`);
    }
  }

  async softDeletePost(id: number, reqUser: { id: number; role: string }) {
    try {
      const softDeletedPost = await this.postRepository.softDeletePost(
        id,
        reqUser,
      );

      return `Post Successfully Soft Deleted with id ${id}`;
    } catch {
      throw new Error(`Error Deleting Post  with Id ${id}`);
    }
  }

  async getRecentPosts(limit: number) {
    try {
      return await this.postRepository.getRecentPosts(limit);
    } catch {
      throw new Error('Faild to fetch Recent Posts');
    }
  }
}
