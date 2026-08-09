CREATE TABLE `adminNotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestId` int NOT NULL,
	`adminUserId` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `adminNotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestId` int NOT NULL,
	`filename` varchar(255) NOT NULL,
	`storageKey` varchar(512) NOT NULL,
	`mimeType` varchar(128) NOT NULL,
	`size` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminUserId` int,
	`action` varchar(128) NOT NULL,
	`requestId` int,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `investigation_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referenceCode` varchar(32) NOT NULL,
	`contactMethod` varchar(32) NOT NULL,
	`contactValue` varchar(255) NOT NULL,
	`targetPlatform` varchar(64),
	`targetUsername` varchar(128),
	`targetUrl` text,
	`targetEmail` varchar(320),
	`targetPhone` varchar(64),
	`targetDomain` varchar(255),
	`targetWallet` varchar(255),
	`goal` text NOT NULL,
	`additionalInfo` text,
	`status` enum('NEW','REVIEWING','WAITING_FOR_CLIENT','PAYMENT_REQUIRED','PAID','INVESTIGATING','COMPLETED','REFUNDED','CANCELLED') NOT NULL DEFAULT 'NEW',
	`price` varchar(64),
	`refundReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `investigation_requests_id` PRIMARY KEY(`id`),
	CONSTRAINT `investigation_requests_referenceCode_unique` UNIQUE(`referenceCode`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestId` int NOT NULL,
	`currency` varchar(32) NOT NULL,
	`amount` varchar(64) NOT NULL,
	`status` varchar(32) NOT NULL DEFAULT 'PENDING',
	`transactionId` varchar(255),
	`paidAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestId` int NOT NULL,
	`filename` varchar(255) NOT NULL,
	`storageKey` varchar(512) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
