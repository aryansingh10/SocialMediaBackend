DROP INDEX `idx_user` ON `likes`;--> statement-breakpoint
ALTER TABLE `likes` ADD CONSTRAINT `idx_post` UNIQUE(`post_id`);--> statement-breakpoint
ALTER TABLE `likes` ADD CONSTRAINT `idx_user` UNIQUE(`user_id`);