import { Injectable } from '@nestjs/common';
import { MonitoringRepository } from './monitoring.repository';

@Injectable()
export class MonitoringService {
  constructor(private readonly monitoringRepository: MonitoringRepository) {}

  async getActivitiesByTimeRange(
    userId: number,
    startTime: string,
    endTime: string,
  ) {
    return await this.monitoringRepository.getActivitiesByTimeRange(
      userId,
      startTime,
      endTime,
    );
  }
}
