import { Injectable } from '@nestjs/common';
import { ActivityRepository } from './activity.repository';
import { CreateActivityDto } from './dto/create-activity.dto';
import { EntityType } from './enum/entity-type';

@Injectable()
export class ActivityService {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async recordActivity(input: CreateActivityDto) {
    return await this.activityRepository.createActivity(input);
  }

  async getUserActivities(
    userId: number,
    reqUser: { id: number; role: string },
  ) {
    return await this.activityRepository.getActivitiesByUser(userId, reqUser);
  }
}
