CREATE TABLE `contact_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`email` varchar(320) NOT NULL,
	`subject` varchar(180) NOT NULL,
	`message` text NOT NULL,
	`status` enum('NEW','READ','ARCHIVED') NOT NULL DEFAULT 'NEW',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`readAt` timestamp,
	CONSTRAINT `contact_messages_id` PRIMARY KEY(`id`)
);
