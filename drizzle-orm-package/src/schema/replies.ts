import { mysqlTable, bigint, text, timestamp } from "drizzle-orm/mysql-core";
import { users } from "./users";
import { comments } from "./comments";
import { channels } from "./channels";


export const replies = mysqlTable("replies", {
  id: bigint("id", { mode: "number" ,unsigned:true}).autoincrement().primaryKey(),
  commentId: bigint("comment_id", { mode: "number" ,unsigned:true}).notNull().references(() => comments.id, { onDelete: "cascade" }),
  authorId: bigint("author_id", { mode: "number",unsigned:true }).notNull().references(() => users.id, { onDelete: "cascade" }),

    channelId: bigint("channel_id", { mode: "number", unsigned: true }) // 
        .notNull()
        .references(() => channels.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
