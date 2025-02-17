import { db } from 'drizzle-orm-package'; 
import { likes } from 'drizzle-orm-package'; 
import { eq, and } from 'drizzle-orm';
import { LikeType } from '../utils/like-type.enum';

export async function insertLikeHelper(
  entityId: number,
  userId: number,
  type: LikeType,
  channelId: number,
): Promise<string> {
  const existingLike = await db
    .select()
    .from(likes)
    .where(
      and(
        eq(likes.entityId, entityId),
        eq(likes.userId, userId),
        eq(likes.type, type),
      ),
    );

  if (existingLike.length > 0) {
    return `You have already liked this ${type}.`;
  }

  await db.insert(likes).values({ entityId, userId, type, channelId });

  return `${type.charAt(0).toUpperCase() + type.slice(1)} liked successfully.`;
}
