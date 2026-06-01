CREATE TABLE `webhook_deliveries` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text NOT NULL,
	`event` text NOT NULL,
	`status` text NOT NULL,
	`http_status` integer,
	`error` text,
	`endpoint_host` text NOT NULL,
	`endpoint_path` text,
	`duration_ms` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `webhook_delivery_profile_idx` ON `webhook_deliveries` (`profile_id`);
--> statement-breakpoint
CREATE INDEX `webhook_delivery_event_idx` ON `webhook_deliveries` (`event`);
--> statement-breakpoint
CREATE INDEX `webhook_delivery_status_idx` ON `webhook_deliveries` (`status`);
--> statement-breakpoint
CREATE INDEX `webhook_delivery_created_at_idx` ON `webhook_deliveries` (`created_at`);
