import { mysqlTable, bigint, timestamp, uniqueIndex, index, mysqlEnum } from "drizzle-orm/mysql-core";
import { users } from "./users";
import { channels } from "./channels";

export const likes = mysqlTable(
  "likes",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .primaryKey(),

    entityId: bigint("entity_id", { mode: "number", unsigned: true })
      .notNull(),

    type: mysqlEnum("type", ["post", "comment", "reply"])
      .notNull(), 

    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    channelId: bigint("channel_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => channels.id, { onDelete: "cascade" }), 

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("unique_user_entity").on(table.userId, table.entityId, table.type), // Prevents duplicate likes
    index("idx_user").on(table.userId), 
    index("idx_entity").on(table.entityId), 
    index("idx_channel").on(table.channelId),
  ]
);
