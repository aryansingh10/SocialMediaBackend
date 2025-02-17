ALTER TABLE `user_channel` MODIFY COLUMN `user_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `user_channel` MODIFY COLUMN `channel_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `user_channel` MODIFY COLUMN `role` enum('USER','ADMIN') NOT NULL;--> statement-breakpoint
ALTER TABLE `user_channel` ADD `joined_at` timestamp DEFAULT (now());