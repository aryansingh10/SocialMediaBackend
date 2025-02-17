import { mysqlTable, bigint, text, timestamp } from "drizzle-orm/mysql-core";
import { users } from "./users";
import { posts } from "./posts";
import { channels } from "./channels";

export const comments = mysqlTable("comments", {
    id: bigint("id", { mode: "number", unsigned: true }) 
      .autoincrement()
      .primaryKey(),
    
    postId: bigint("post_id", { mode: "number", unsigned: true }) 
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    
    userId: bigint("user_id", { mode: "number", unsigned: true }) 
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    channelId: bigint("channel_id", { mode: "number", unsigned: true }) // ✅ NEW: Adds direct reference to channel
      .notNull()
      .references(() => channels.id, { onDelete: "cascade" }),

    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
