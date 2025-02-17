import { mysqlTable, bigint, varchar, timestamp } from "drizzle-orm/mysql-core";

export const channels = mysqlTable("channels", {
  id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
 
});
