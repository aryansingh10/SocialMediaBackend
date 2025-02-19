import { Injectable } from '@nestjs/common';
import { db } from 'drizzle-orm-package';
import { activity } from 'drizzle-orm-package';
import { StatsUserInput } from './dto/stats-user.input';
import { UserActivityStatsDto } from './dto/user-activity-stats.dto.ts';
import { and, count, eq, gte, lte, SQL } from 'drizzle-orm';

@Injectable()
export class MonitoringService {
  async getUserActivityStats(
    input: StatsUserInput,
  ): Promise<UserActivityStatsDto[]> {
    const { startDate, endDate, userId } = input;
    const conditions: SQL[] = [];

    if (startDate) conditions.push(gte(activity.createdAt, startDate));
    if (endDate) conditions.push(lte(activity.createdAt, endDate));

    const userIds = userId
      ? [userId]
      : await db
          .select({ id: activity.userId })
          .from(activity)
          .where(and(...conditions))
          .then((response) => [...new Set(response.map((a) => a.id))]); // Get unique users

    const result = await Promise.all(
      userIds.map(async (uid) => {
        const userConditions = and(eq(activity.userId, uid), ...conditions);

        const [{ totalActivityCount }] = await db
          .select({ totalActivityCount: count() })
          .from(activity)
          .where(userConditions);

        const [{ postCount }] = await db
          .select({ postCount: count() })
          .from(activity)
          .where(
            and(
              eq(activity.userId, uid),
              eq(activity.entity, 'POST'),
              ...conditions,
            ),
          );

        const [{ commentCount }] = await db
          .select({ commentCount: count() })
          .from(activity)
          .where(
            and(
              eq(activity.userId, uid),
              eq(activity.entity, 'COMMENT'),
              ...conditions,
            ),
          );

        const [{ replyCount }] = await db
          .select({ replyCount: count() })
          .from(activity)
          .where(
            and(
              eq(activity.userId, uid),
              eq(activity.entity, 'REPLY'),
              ...conditions,
            ),
          );

        const [{ likeCount }] = await db
          .select({ likeCount: count() })
          .from(activity)
          .where(
            and(
              eq(activity.userId, uid),
              eq(activity.entity, 'LIKE'),
              ...conditions,
            ),
          );

        return {
          id: uid,
          totalActivityCount: totalActivityCount || 0,
          postCount: postCount || 0,
          commentCount: commentCount || 0,
          replyCount: replyCount || 0,
          likeCount: likeCount || 0,
        };
      }),
    );

    return result;
  }
}
