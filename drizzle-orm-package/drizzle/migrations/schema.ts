import { mysqlTable, mysqlSchema, AnyMySqlColumn, foreignKey, primaryKey, bigint, mysqlEnum, timestamp, unique, varchar, text } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const activity = mysqlTable("activity", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	action: mysqlEnum(['POST','COMMENT','REPLY','LIKE']).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
},
(table) => [
	primaryKey({ columns: [table.id], name: "activity_id"}),
]);

export const channels = mysqlTable("channels", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	name: varchar({ length: 100 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`(now())`),
},
(table) => [
	primaryKey({ columns: [table.id], name: "channels_id"}),
	unique("channels_name_unique").on(table.name),
]);

export const comments = mysqlTable("comments", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	postId: bigint("post_id", { mode: "number", unsigned: true }).notNull().references(() => posts.id, { onDelete: "cascade" } ),
	userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
},
(table) => [
	primaryKey({ columns: [table.id], name: "comments_id"}),
]);

export const likes = mysqlTable("likes", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	postId: bigint("post_id", { mode: "number", unsigned: true }).notNull().references(() => posts.id, { onDelete: "cascade" } ),
	userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
},
(table) => [
	primaryKey({ columns: [table.id], name: "likes_id"}),
]);

export const monitoring = mysqlTable("monitoring", {
	id: bigint({ mode: "number" }).autoincrement().notNull(),
	userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	activityId: bigint("activity_id", { mode: "number", unsigned: true }).notNull().references(() => activity.id, { onDelete: "cascade" } ),
	startTime: timestamp("start_time", { mode: 'string' }).notNull(),
	endTime: timestamp("end_time", { mode: 'string' }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "monitoring_id"}),
]);

export const posts = mysqlTable("posts", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	content: text().notNull(),
	authorId: bigint("author_id", { mode: "number", unsigned: true }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	channelId: bigint("channel_id", { mode: "number", unsigned: true }).notNull().references(() => channels.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`(now())`).onUpdateNow(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "posts_id"}),
]);

export const replies = mysqlTable("replies", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	commentId: bigint("comment_id", { mode: "number", unsigned: true }).notNull().references(() => comments.id, { onDelete: "cascade" } ),
	authorId: bigint("author_id", { mode: "number", unsigned: true }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
},
(table) => [
	primaryKey({ columns: [table.id], name: "replies_id"}),
]);

export const userChannel = mysqlTable("user_channel", {
	userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
	channelId: bigint("channel_id", { mode: "number", unsigned: true }).notNull(),
	role: mysqlEnum(['USER','ADMIN']).notNull(),
	joinedAt: timestamp("joined_at", { mode: 'string' }).default(sql`(now())`),
});

export const users = mysqlTable("users", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	username: varchar({ length: 50 }).notNull(),
	email: varchar({ length: 100 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	role: mysqlEnum(['USER','ADMIN','SUPERADMIN']).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`(now())`).onUpdateNow(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "users_id"}),
	unique("users_email_unique").on(table.email),
	unique("users_username_unique").on(table.username),
]);
