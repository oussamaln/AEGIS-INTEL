CREATE TABLE `client_updates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestId` int NOT NULL,
	`adminUserId` int,
	`status` varchar(32),
	`message` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `client_updates_id` PRIMARY KEY(`id`)
);
