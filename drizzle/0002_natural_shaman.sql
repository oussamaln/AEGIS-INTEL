CREATE TABLE `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminUserId` int,
	`action` varchar(128) NOT NULL,
	`requestId` int,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `adminNotes`;--> statement-breakpoint
RENAME TABLE `auditLogs` TO `admin_notes`;--> statement-breakpoint
ALTER TABLE `admin_notes` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `admin_notes` MODIFY COLUMN `adminUserId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `admin_notes` MODIFY COLUMN `requestId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `admin_notes` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `admin_notes` ADD `content` text NOT NULL;--> statement-breakpoint
ALTER TABLE `admin_notes` DROP COLUMN `action`;--> statement-breakpoint
ALTER TABLE `admin_notes` DROP COLUMN `metadata`;