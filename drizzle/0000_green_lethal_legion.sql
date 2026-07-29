CREATE TABLE `managed_properties` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`location` text NOT NULL,
	`bedrooms` integer DEFAULT 1 NOT NULL,
	`guests` integer DEFAULT 2 NOT NULL,
	`baths` integer DEFAULT 1 NOT NULL,
	`image` text DEFAULT '/images/home/hero-concierge.webp' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `managed_properties_slug_unique` ON `managed_properties` (`slug`);