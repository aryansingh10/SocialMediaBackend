import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ActivityRepository } from './activity.repository';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivityService {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async recordActivity(input: CreateActivityDto) {
    try {
      return await this.activityRepository.createActivity(input);
    } catch (error) {
      console.error('Error recording activity:', error);
      throw new InternalServerErrorException('Failed to record activity');
    }
  }

  async getUserActivities(
    userId: number,
    reqUser: { id: number; role: string },
  ) {
    try {
      return await this.activityRepository.getActivitiesByUser(userId, reqUser);
    } catch (error) {
      console.error('Error fetching user activities:', error);
      throw new InternalServerErrorException('Failed to fetch user activities');
    }
  }
}
