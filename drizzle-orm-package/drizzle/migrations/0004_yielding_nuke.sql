ALTER TABLE `channels` ADD `updated_at` timestamp DEFAULT (now());
ALTER TABLE `channels`
  ADD CONSTRAINT `FK_createdBy` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE;
