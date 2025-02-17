import { mysqlTable, bigint, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";
import { users } from "./users";
import { channels } from "./channels";
export const activity = mysqlTable("activity", {
  id: bigint("id", { mode: "number", unsigned: true })
    .autoincrement()
    .primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  entity: mysqlEnum("entity", ["POST", "COMMENT", "REPLY", "LIKE"]).notNull(),
  action: mysqlEnum("action", ["CREATED", "UPDATED", "DELETED", "ADDED", "REMOVED"]).notNull(),
  entityId: bigint("entity_id", { mode: "number", unsigned: true }) 
    .notNull(),
  channelId: bigint("channel_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => channels.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});
