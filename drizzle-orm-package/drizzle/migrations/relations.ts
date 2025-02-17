import { relations } from "drizzle-orm/relations";
import { users, activity, posts, comments, likes, monitoring, channels, replies } from "./schema";

export const activityRelations = relations(activity, ({one, many}) => ({
	user: one(users, {
		fields: [activity.userId],
		references: [users.id]
	}),
	monitorings: many(monitoring),
}));

export const usersRelations = relations(users, ({many}) => ({
	activities: many(activity),
	comments: many(comments),
	likes: many(likes),
	monitorings: many(monitoring),
	posts: many(posts),
	replies: many(replies),
}));

export const commentsRelations = relations(comments, ({one, many}) => ({
	post: one(posts, {
		fields: [comments.postId],
		references: [posts.id]
	}),
	user: one(users, {
		fields: [comments.userId],
		references: [users.id]
	}),
	replies: many(replies),
}));

export const postsRelations = relations(posts, ({one, many}) => ({
	comments: many(comments),
	likes: many(likes),
	user: one(users, {
		fields: [posts.authorId],
		references: [users.id]
	}),
	channel: one(channels, {
		fields: [posts.channelId],
		references: [channels.id]
	}),
}));

export const likesRelations = relations(likes, ({one}) => ({
	post: one(posts, {
		fields: [likes.postId],
		references: [posts.id]
	}),
	user: one(users, {
		fields: [likes.userId],
		references: [users.id]
	}),
}));

export const monitoringRelations = relations(monitoring, ({one}) => ({
	activity: one(activity, {
		fields: [monitoring.activityId],
		references: [activity.id]
	}),
	user: one(users, {
		fields: [monitoring.userId],
		references: [users.id]
	}),
}));

export const channelsRelations = relations(channels, ({many}) => ({
	posts: many(posts),
}));

export const repliesRelations = relations(replies, ({one}) => ({
	user: one(users, {
		fields: [replies.authorId],
		references: [users.id]
	}),
	comment: one(comments, {
		fields: [replies.commentId],
		references: [comments.id]
	}),
}));