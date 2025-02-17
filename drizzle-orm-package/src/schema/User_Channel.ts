import { mysqlTable, bigint, varchar, timestamp, mysqlEnum ,} from "drizzle-orm/mysql-core";

export const userChannel = mysqlTable("user_channel", {
	userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
	channelId: bigint("channel_id", { mode: "number", unsigned: true }).notNull(),
	role: mysqlEnum(['USER','ADMIN']).notNull(),
	joinedAt: timestamp("joined_at", { mode: 'string' }).defaultNow(),
});
