import { mysqlTable, bigint, timestamp } from "drizzle-orm/mysql-core";
import { users } from "./users";
import { activity } from "./activities";

export const monitoring = mysqlTable("monitoring", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  userId: bigint("user_id", { mode: "number" ,unsigned:true}).notNull().references(() => users.id, { onDelete: "cascade" }),
  activityId: bigint("activity_id", { mode: "number" ,unsigned:true}).notNull().references(() => activity.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
});
