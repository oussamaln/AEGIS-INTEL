ALTER TABLE `contact_messages` MODIFY COLUMN `status` enum('NEW','READ','REPLIED','ARCHIVED') NOT NULL DEFAULT 'NEW';--> statement-breakpoint
ALTER TABLE `contact_messages` ADD `repliedAt` timestamp;