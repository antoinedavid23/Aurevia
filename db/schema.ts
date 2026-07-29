import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const managedProperties = sqliteTable("managed_properties", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  location: text("location").notNull(),
  bedrooms: integer("bedrooms").notNull().default(1),
  guests: integer("guests").notNull().default(2),
  baths: integer("baths").notNull().default(1),
  image: text("image").notNull().default("/images/home/hero-concierge.webp"),
  status: text("status").notNull().default("draft"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});
