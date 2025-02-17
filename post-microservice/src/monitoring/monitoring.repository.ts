import { db } from 'drizzle-orm-package';
import { monitoring } from 'drizzle-orm-package';
import { activity } from 'drizzle-orm-package';
import { eq, sql, and } from 'drizzle-orm';
import log from 'console';

export class MonitoringRepository {
  async getActivitiesByTimeRange(
    userId: number,
    startTime?: string,
    endTime?: string,
  ) {
    const whereConditions = [eq(monitoring.userId, userId)];

    if (startTime) {
      whereConditions.push(sql`${monitoring.startTime} >= ${startTime}`);
    }

    if (endTime) {
      whereConditions.push(sql`${monitoring.endTime} <= ${endTime}`);
    }

    const activities = await db
      .select()
      .from(monitoring)
      .innerJoin(activity, eq(monitoring.activityId, activity.id))
      .where(and(...whereConditions));

    console.log(activities);

    return activities.map((item) => ({
      id: item.activity.id,
      userId: item.activity.userId,
      action: item.activity.action,
      channelId: item.activity.channelId,
      entityId: item.activity.entityId,
      createdAt: item.activity.createdAt,
      entity: item.activity.entity,
    }));
  }
}
