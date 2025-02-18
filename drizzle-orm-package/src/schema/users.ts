import { mysqlTable, bigint, varchar, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .primaryKey(),
    username: varchar("username", { length: 50 }).unique().notNull(),
    email: varchar("email", { length: 100 }).unique().notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    role: mysqlEnum("role", ["USER", "ADMIN", "SUPERADMIN"]).notNull().default("USER"),  // Default to "USER"
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
    deletedAt: timestamp("deleted_at").default(null),
});
