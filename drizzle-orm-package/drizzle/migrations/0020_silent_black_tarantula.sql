ALTER TABLE `activity` MODIFY COLUMN `action` enum('CREATED','UPDATED','DELETED','ADDED','REMOVED') NOT NULL;--> statement-breakpoint
ALTER TABLE `activity` ADD `entity` enum('POST','COMMENT','REPLY','LIKE') NOT NULL;--> statement-breakpoint
ALTER TABLE `activity` ADD `entity_id` bigint unsigned NOT NULL;