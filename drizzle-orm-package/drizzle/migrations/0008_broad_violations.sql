ALTER TABLE `user_channel` DROP FOREIGN KEY `user_channel_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `user_channel` DROP FOREIGN KEY `user_channel_channel_id_channels_id_fk`;
--> statement-breakpoint
ALTER TABLE `user_channel` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `user_channel` MODIFY COLUMN `channel_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `user_channel` MODIFY COLUMN `role` varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` ADD `deleted_at` timestamp DEFAULT null;--> statement-breakpoint
ALTER TABLE `user_channel` DROP COLUMN `joined_at`;