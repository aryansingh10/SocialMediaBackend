ALTER TABLE `likes` DROP INDEX `idx_post`;--> statement-breakpoint
ALTER TABLE `likes` DROP INDEX `idx_user`;--> statement-breakpoint
CREATE INDEX `idx_post` ON `likes` (`post_id`);--> statement-breakpoint
CREATE INDEX `idx_user` ON `likes` (`user_id`);