ALTER TABLE `likes` DROP INDEX `unique_user_post`;--> statement-breakpoint
ALTER TABLE `likes` DROP FOREIGN KEY `likes_post_id_posts_id_fk`;
--> statement-breakpoint
ALTER TABLE `likes` ADD `entity_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `likes` ADD `channel_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `likes` ADD CONSTRAINT `unique_user_entity` UNIQUE(`user_id`,`entity_id`,`type`);--> statement-breakpoint
ALTER TABLE `likes` ADD CONSTRAINT `likes_channel_id_channels_id_fk` FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_entity` ON `likes` (`entity_id`);--> statement-breakpoint
CREATE INDEX `idx_channel` ON `likes` (`channel_id`);--> statement-breakpoint
ALTER TABLE `likes` DROP COLUMN `post_id`;