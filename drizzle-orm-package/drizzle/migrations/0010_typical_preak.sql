ALTER TABLE `likes` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `likes` ADD CONSTRAINT `unique_user_post` UNIQUE(`user_id`,`post_id`);--> statement-breakpoint
ALTER TABLE `likes` ADD CONSTRAINT `idx_post` UNIQUE(`post_id`);--> statement-breakpoint
ALTER TABLE `likes` ADD CONSTRAINT `idx_user` UNIQUE(`user_id`);