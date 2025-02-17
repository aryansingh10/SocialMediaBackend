import { mysqlTable, bigint, text, timestamp } from "drizzle-orm/mysql-core";
import { users } from "./users";
import { channels } from "./channels";

export const posts = mysqlTable("posts", {
    id: bigint("id", { mode: "number", unsigned: true }) 
      .autoincrement()
      .primaryKey(),
    content: text("content").notNull(),
    authorId: bigint("author_id", { mode: "number", unsigned: true }) 
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    channelId: bigint("channel_id", { mode: "number", unsigned: true }) 
      .notNull()
      .references(() => channels.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
    deletedAt: timestamp("deleted_at").default(null)
  });
  